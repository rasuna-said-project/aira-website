// Recommendation System berbasis aturan untuk hasil Kalkulator Air.
// Katalog diambil dari Supabase (katalog_tindakan).
//
// Urutan sumber katalog:
// 1. Supabase
// 2. Cache terakhir yang berhasil
// 3. KATALOG_FALLBACK
//
// Status tetap ditentukan oleh calculatorService.js.
// AI tidak menentukan status dan tidak menulis ulang teks tindakan. AI hanya memilih
// dan mengurutkan tindakan TAMBAHAN dari katalog serta menulis alasan singkat;
// tindakan wajib selalu dipasang kode di urutan teratas. Jika AI gagal, urutan aturan dipakai.

import {
  STATUS_AMAN,
  STATUS_KRISIS,
  STATUS_TIDAK_DITENTUKAN,
  STATUS_WASPADA,
} from "@/services/calculatorService";

import { KATALOG_FALLBACK } from "@/data/katalogTindakanFallback";
import {
  BATAS_KANDIDAT_AI,
  pilihTindakanDenganAI,
} from "@/services/aiService";

export const TABEL_KATALOG =
  process.env.SUPABASE_TABLE_KATALOG || "katalog_tindakan";

export const BATAS_REKOMENDASI = 5;

// Ubah menjadi false jika Navigation Air belum tersedia.
export const FITUR_NAVIGATION_AIR_TERSEDIA = true;

const TTL_CACHE_MS = 5 * 60 * 1000;
const TIMEOUT_SUPABASE_MS = 3000;

// ID tindakan yang wajib tersedia dalam katalog.
export const ID = {
  NAVIGATION_AIR: "buka_navigation_air",
  PERIKSA_DATA: "periksa_data_kalkulator",
  MHM_UTAMA: "kebersihan_mhm",
  KONFIRMASI_KONDISI: "konfirmasi_kondisi_sumber",
  SUMBER_ALTERNATIF: "cari_sumber_alternatif",
};

const KOLOM_PRIORITAS = {
  [STATUS_AMAN]: "prioritas_aman",
  [STATUS_WASPADA]: "prioritas_waspada",
  [STATUS_KRISIS]: "prioritas_krisis",
  [STATUS_TIDAK_DITENTUKAN]: "prioritas_belum_ditentukan",
};

const KONDISI_DIKENAL = [
  "semua kondisi",
  "normal",
  "terbatas",
  "tidak berfungsi",
  "belum diketahui",
];

export const RINGKASAN_PER_STATUS = {
  [STATUS_AMAN]:
    "Cadangan diperkirakan mencukupi berdasarkan input dan asumsi AIRA. Tetap pantau kondisi dan rencanakan pengisian ulang.",

  [STATUS_WASPADA]:
    "Cadangan atau kondisi sumber menunjukkan perlunya pemantauan, penghematan yang aman, dan persiapan alternatif.",

  [STATUS_KRISIS]:
    "Sistem mendeteksi kondisi yang membutuhkan tindakan segera. Konfirmasi sumber alternatif sebelum mengandalkannya.",

  [STATUS_TIDAK_DITENTUKAN]:
    "Status belum dapat ditentukan karena data belum cukup atau valid, atau kondisi sumber belum diketahui.",
};

export const AKSI_UTAMA_PER_STATUS = {
  [STATUS_AMAN]: "Tanya AIRA Assistant",
  [STATUS_WASPADA]: "Tanya AIRA Assistant",
  [STATUS_KRISIS]: "Cari Titik Air",
  [STATUS_TIDAK_DITENTUKAN]: "Periksa Kembali Data",
};

// 1. PEMBERSIH NILAI

const kosong = (v) =>
  v == null ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) && v.length === 0);

const teks = (v) =>
  kosong(v)
    ? ""
    : Array.isArray(v)
      ? v.map((x) => String(x).trim()).join("; ")
      : String(v).trim();

const kunci = (v) =>
  teks(v).replace(/\s+/g, " ").toLowerCase();

const daftar = (v) =>
  (Array.isArray(v) ? v.map(String) : teks(v).split(";"))
    .map((x) => x.trim())
    .filter(Boolean);

const yaTidak = (v) => {
  const k = kunci(v);

  if (["ya", "yes", "true", "1", "aktif"].includes(k)) {
    return "ya";
  }

  if (["tidak", "no", "false", "0", "nonaktif", ""].includes(k)) {
    return "tidak";
  }

  return k;
};

// null jika kosong; NaN jika terisi tetapi bukan angka.
const angka = (v) => {
  if (kosong(v)) return null;

  const hasil = Number(String(v).trim().replace(",", "."));

  return Number.isFinite(hasil) ? hasil : NaN;
};

const ATURAN_WAJIB_DIKENAL = new Set([
  "ya",
  "tidak",
  "jika mhm aktif",
  "jika mode krisis dan fitur tersedia",
  "ya jika data tidak terverifikasi",
  "jika ada dugaan kontaminasi",
]);


// 2. VALIDASI DAN NORMALISASI KATALOG
export function normalisasiKatalog(baris) {
  const statusDikenal = new Map(
    Object.keys(KOLOM_PRIORITAS).map((s) => [kunci(s), s])
  );

  const records = [];
  const masalah = [];
  const terlihat = new Set();

  for (const [i, row] of (Array.isArray(baris) ? baris : []).entries()) {
    const aid = teks(row?.action_id);
    const galat = [];

    if (!aid) {
      galat.push(`baris ${i + 1}: action_id kosong`);
    } else if (terlihat.has(aid)) {
      galat.push(`${aid}: action_id duplikat`);
    }

    if (aid) terlihat.add(aid);

    if (!teks(row?.teks_tindakan)) {
      galat.push(`${aid || `baris ${i + 1}`}: teks_tindakan kosong`);
    }

    const status = new Set();

    for (const s of daftar(row?.status_berlaku)) {
      if (statusDikenal.has(kunci(s))) {
        status.add(statusDikenal.get(kunci(s)));
      } else {
        galat.push(`${aid}: status tidak dikenal '${s}'`);
      }
    }

    const kondisi = new Set(
      daftar(row?.kondisi_sumber_berlaku).map(kunci)
    );

    if (kondisi.size === 0) {
      galat.push(`${aid}: kondisi_sumber_berlaku kosong`);
    }

    for (const k of kondisi) {
      if (!KONDISI_DIKENAL.includes(k)) {
        galat.push(`${aid}: kondisi tidak dikenal '${k}'`);
      }
    }

    const wajib = yaTidak(row?.wajib);
    const prioritas = {};

    for (const [s, kolom] of Object.entries(KOLOM_PRIORITAS)) {
      const nilai = angka(row?.[kolom]);

      if (Number.isNaN(nilai)) {
        galat.push(
          `${aid}: ${kolom} bukan angka ('${row?.[kolom]}')`
        );
        prioritas[s] = null;
      } else {
        prioritas[s] = nilai;
      }
    }

    if (galat.length) {
      masalah.push(...galat);
      continue;
    }

    if (!ATURAN_WAJIB_DIKENAL.has(wajib)) {
      masalah.push(
        `${aid}: aturan wajib tidak dikenal '${teks(row?.wajib)}' (dianggap tidak wajib)`
      );
    }

    records.push({
      id: aid,
      kategori: teks(row?.kategori),
      nama: teks(row?.nama_tindakan),
      tindakan: teks(row?.teks_tindakan),
      konteks: teks(row?.konteks_pemicu),
      status,
      kondisi,
      syaratMhm: yaTidak(row?.syarat_mhm) === "ya",
      wajib,
      prioritas,
      cta: teks(row?.cta),
      pesanPengguna: teks(row?.pesan_pengguna),
      catatanKeamanan: teks(row?.catatan_keamanan),
      dasarRujukan: teks(row?.dasar_rujukan),
      aktif: yaTidak(row?.aktif) === "ya",
    });
  }

  return { records, masalah };
}


// 3. VALIDASI KELAYAKAN KATALOG

function katalogLayak(records) {
  const ids = new Set(
    records.filter((r) => r.aktif).map((r) => r.id)
  );

  return (
    records.length > 0 &&
    Object.values(ID).every((id) => ids.has(id))
  );
}


// 4. PENGAMBILAN KATALOG DARI SUPABASE

let cache = {
  records: null,
  waktu: 0,
};

async function bacaDariSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const kunciPublik =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !kunciPublik) {
    throw new Error("Variabel lingkungan Supabase belum diatur");
  }

  const { createClient } = await import("@supabase/supabase-js");

  const client = createClient(url, kunciPublik, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await client
    .from(TABEL_KATALOG)
    .select("*")
    .order("action_id")
    .limit(1000)
    .abortSignal(AbortSignal.timeout(TIMEOUT_SUPABASE_MS));

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.length) {
    throw new Error(
      `Tabel '${TABEL_KATALOG}' kosong atau tidak terbaca. Periksa kebijakan RLS.`
    );
  }

  return data;
}

export function kosongkanCacheKatalog() {
  cache = {
    records: null,
    waktu: 0,
  };
}

export async function ambilKatalog({
  paksaCadangan = false,
} = {}) {
  if (!paksaCadangan) {
    if (
      cache.records &&
      Date.now() - cache.waktu < TTL_CACHE_MS
    ) {
      return {
        records: cache.records,
        sumber: "supabase",
      };
    }

    try {
      const { records, masalah } = normalisasiKatalog(
        await bacaDariSupabase()
      );

      if (!katalogLayak(records)) {
        throw new Error(
          "Katalog tidak layak: kosong atau tindakan acuan aturan hilang"
        );
      }

      if (masalah.length) {
        console.warn(
          `[rekomendasi] ${masalah.length} masalah data katalog:`,
          masalah.slice(0, 5)
        );
      }

      cache = {
        records,
        waktu: Date.now(),
      };

      return {
        records,
        sumber: "supabase",
      };
    } catch (err) {
      console.warn(
        "[rekomendasi] katalog Supabase tidak dipakai:",
        err.message
      );

      if (cache.records) {
        return {
          records: cache.records,
          sumber: "cache",
        };
      }
    }
  }

  return {
    records: normalisasiKatalog(KATALOG_FALLBACK).records,
    sumber: "cadangan",
  };
}

// 5. MEMBANGUN KONTEKS PENGGUNA

export function bangunKonteks(masukan, hasil) {
  const valid = hasil?.valid === true;

  const status =
    valid && hasil.status in KOLOM_PRIORITAS
      ? hasil.status
      : STATUS_TIDAK_DITENTUKAN;

  const jumlahMhm = Number(masukan?.anggotaMhm);

  const mhmAktif =
    masukan?.mhm === true &&
    Number.isInteger(jumlahMhm) &&
    jumlahMhm > 0;

  const kondisi = kunci(masukan?.kondisi);

  return {
    valid,
    status,
    kondisi,
    mhmAktif,
    jumlahMhm: mhmAktif ? jumlahMhm : 0,
    sumberAir: teks(masukan?.sumberAir),
    dugaanKontaminasi: masukan?.dugaanKontaminasi === true,
    dataTidakTerverifikasi:
      !valid ||
      status === STATUS_TIDAK_DITENTUKAN ||
      kondisi === "belum diketahui",
  };
}


// 6. ATURAN WAJIB

function wajibBerlaku(rec, ctx) {
  switch (rec.wajib) {
    case "ya":
      return true;

    case "jika mhm aktif":
      return ctx.mhmAktif;

    case "jika mode krisis dan fitur tersedia":
      return (
        ctx.status === STATUS_KRISIS &&
        FITUR_NAVIGATION_AIR_TERSEDIA
      );

    case "ya jika data tidak terverifikasi":
      return ctx.dataTidakTerverifikasi;

    case "jika ada dugaan kontaminasi":
      return ctx.dugaanKontaminasi;

    default:
      return false;
  }
}


// 7. PENYUSUNAN KANDIDAT REKOMENDASI

// Urutan akhir (sama dengan notebook Bagian 5): tindakan WAJIB dahulu,
// lalu prioritas terkecil, lalu id agar hasilnya stabil.
const bandingkanRekomendasi = (a, b) =>
  Number(!a.wajib) - Number(!b.wajib) ||
  (a.prioritas ?? Infinity) - (b.prioritas ?? Infinity) ||
  (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

export function susunKatalog(records, ctx) {
  const hasil = [];

  for (const rec of records) {
    if (!rec.aktif || !rec.status.has(ctx.status)) {
      continue;
    }

    if (
      !rec.kondisi.has("semua kondisi") &&
      !rec.kondisi.has(ctx.kondisi)
    ) {
      continue;
    }

    if (rec.syaratMhm && !ctx.mhmAktif) {
      continue;
    }

    const wajib = wajibBerlaku(rec, ctx);
    const prioritas = rec.prioritas[ctx.status];

    if (prioritas == null && !wajib) {
      continue;
    }

    hasil.push({
      id: rec.id,
      kategori: rec.kategori,
      nama: rec.nama,
      teks: rec.tindakan
        .replaceAll(
          "{jumlah_mhm}",
          String(ctx.jumlahMhm)
        )
        .replaceAll(
          "{sumber}",
          ctx.sumberAir || "sumber air utama"
        ),
      konteks: rec.konteks,
      prioritas,
      wajib,
      cta: rec.cta,
      pesanPengguna: rec.pesanPengguna,
      catatanKeamanan: rec.catatanKeamanan,
      dasarRujukan: rec.dasarRujukan,
    });
  }

  return hasil.sort(bandingkanRekomendasi);
}


// 8. PEMILIHAN REKOMENDASI

export function pilihRekomendasi(
  records,
  ctx,
  batas = BATAS_REKOMENDASI
) {
  // Kandidat sudah terurut: wajib dahulu, lalu prioritas terkecil.
  const kandidat = susunKatalog(records, ctx);
  const dipilih = kandidat.slice(0, batas);

  // Pengaman keselamatan: tindakan wajib tidak pernah dibuang. Normalnya jumlah
  // wajib <= batas, sehingga daftar tetap 5. Jika lebih, daftar memanjang.
  for (const item of kandidat) {
    if (item.wajib && !dipilih.includes(item)) {
      dipilih.push(item);
    }
  }

  if (dipilih.length > batas) {
    console.warn(
      `[rekomendasi] tindakan wajib (${dipilih.length}) melebihi batas ${batas}; periksa katalog`
    );
  }

  return {
    status: ctx.status,
    ringkasan: RINGKASAN_PER_STATUS[ctx.status],
    aksiUtama: AKSI_UTAMA_PER_STATUS[ctx.status],
    items: dipilih.map((x, i) => ({
      urutan: i + 1,
      ...x,
    })),
    tautan: {
      navigationAir: ctx.status === STATUS_KRISIS,
      airaAssistant: ctx.status !== STATUS_TIDAK_DITENTUKAN,
    },
  };
}

// ======================================================
// 9. TITIK MASUK SERVER ACTION
// ======================================================

/**
 * Gabungkan pilihan AI dengan tindakan wajib.
 * - Tindakan wajib selalu di atas (urutan aturan).
 * - Tindakan tambahan: urutan dari AI; kekurangan diisi dari urutan aturan.
 * - Teks tindakan tidak pernah diubah; AI hanya menambahkan `alasan`.
 */
export function susunDenganAI({ wajib, nonWajib, jumlah, hasilAI }) {
  const peta = new Map(nonWajib.map((x) => [x.id, x]));
  const tambahan = [];

  for (const id of hasilAI.ids) {
    const item = peta.get(id);
    if (item && !tambahan.includes(item)) tambahan.push(item);
    if (tambahan.length >= jumlah) break;
  }
  for (const item of nonWajib) {
    if (tambahan.length >= jumlah) break;
    if (!tambahan.includes(item)) tambahan.push(item);
  }

  return [...wajib, ...tambahan].map((x, i) => ({
    urutan: i + 1,
    ...x,
    alasan: hasilAI.alasan?.[x.id],
  }));
}


export async function ambilRekomendasi(
  masukan,
  hasil,
  { pakaiAI = true } = {}
) {
  const ctx = bangunKonteks(masukan, hasil);

  try {
    // 1. Ambil katalog dari Supabase, cache, atau fallback.
    const { records, sumber } = await ambilKatalog();

    // 2. Susun rekomendasi menggunakan aturan deterministik.
    // Hasil ini menjadi fallback utama jika AI gagal.
    const aturan = pilihRekomendasi(records, ctx);

    let akhir = {
      ...aturan,
      sumberKatalog: sumber,
      pemilih: "aturan",
    };

    // 3. Jangan panggil AI jika tidak diizinkan.
    // Misalnya, kalkulator meminta hasil langsung tanpa menunggu Gemini.
    if (!pakaiAI) {
      return akhir;
    }

    // 4. AI hanya boleh membantu memilih tindakan tambahan.
    // AI tidak menentukan status dan tidak mengubah tindakan wajib.
    if (
      !ctx.valid ||
      ctx.status === STATUS_TIDAK_DITENTUKAN ||
      aturan.items.length === 0
    ) {
      return akhir;
    }

    // 5. Pisahkan tindakan wajib dan tindakan tambahan.
    const kandidat = susunKatalog(records, ctx);

    const wajib = kandidat.filter((item) => item.wajib);
    const nonWajib = kandidat.filter((item) => !item.wajib);

    const jumlah = Math.max(
      0,
      BATAS_REKOMENDASI - wajib.length
    );

    // 6. Tidak perlu memanggil AI jika:
    // - Tidak ada slot tambahan.
    // - Jumlah kandidat tidak melebihi kebutuhan.
    if (jumlah === 0 || nonWajib.length <= jumlah) {
      return akhir;
    }

    // 7. Pemanggilan AI memiliki try-catch tersendiri.
    // Jika gagal, rekomendasi aturan tetap digunakan.
    try {
      const hasilAI = await pilihTindakanDenganAI(
        hasil,
        masukan,
        {
          wajib,
          kandidat: nonWajib.slice(0, BATAS_KANDIDAT_AI),
          jumlah,
        }
      );

      // 8. Pastikan respons AI memiliki struktur yang diharapkan.
      const responsValid =
        hasilAI?.ok === true &&
        Array.isArray(hasilAI.ids);

      if (!responsValid) {
        console.warn(
          "[rekomendasi] Respons AI tidak valid. Menggunakan urutan aturan."
        );

        return akhir;
      }

      // 9. Susun ulang tindakan tambahan berdasarkan hasil AI.
      // Tindakan wajib tetap berada di urutan teratas.
      const itemsAI = susunDenganAI({
        wajib,
        nonWajib,
        jumlah,
        hasilAI,
      });

      akhir = {
        ...aturan,
        items: itemsAI,
        sumberKatalog: sumber,
        pemilih: `ai:${hasilAI.model || "model-tidak-diketahui"}`,
      };

      return akhir;
    } catch (err) {
      // Error AI tidak boleh menghilangkan hasil rekomendasi aturan.
      console.warn(
        "[rekomendasi] Pemilihan AI gagal. Menggunakan urutan aturan:",
        err?.message || err
      );

      return akhir;
    }
  } catch (err) {
    // 10. Penanganan jika proses pengambilan katalog atau penyusunan aturan gagal.
    console.error(
      "[rekomendasi] Gagal menyusun rekomendasi:",
      err
    );

    return {
      status: ctx.status,
      ringkasan: RINGKASAN_PER_STATUS[ctx.status],
      aksiUtama: AKSI_UTAMA_PER_STATUS[ctx.status],
      items: [],
      tautan: {
        navigationAir: ctx.status === STATUS_KRISIS,
        airaAssistant: ctx.status !== STATUS_TIDAK_DITENTUKAN,
      },
      sumberKatalog: "tidak-tersedia",
      pemilih: "aturan",
    };
  }
}
