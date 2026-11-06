// Recommendation System berbasis aturan untuk hasil Kalkulator Air.
// Port dari notebook 01_kalkulator_air_pipeline.ipynb (bagian 5), dengan katalog dari tabel Supabase
// `katalog_tindakan`. Status TIDAK dihitung di sini: status datang dari calculatorService.js.
//
// Urutan sumber katalog: (1) Supabase, (2) cache terakhir yang berhasil, (3) salinan CSV di
// data/katalogTindakanFallback.js. Karena itu rekomendasi tetap tampil walau Supabase bermasalah.
import {
  STATUS_AMAN,
  STATUS_KRISIS,
  STATUS_TIDAK_DITENTUKAN,
  STATUS_WASPADA,
} from "@/services/calculatorService";
import { KATALOG_FALLBACK } from "@/data/katalogTindakanFallback";

export const TABEL_KATALOG = process.env.SUPABASE_TABLE_KATALOG || "katalog_tindakan";
export const BATAS_REKOMENDASI = 5;
// Aturan wajib "Jika Mode Krisis dan fitur tersedia": ubah ke false jika Navigation Air belum rilis.
export const FITUR_NAVIGATION_AIR_TERSEDIA = true;

const TTL_CACHE_MS = 5 * 60 * 1000;
const TIMEOUT_SUPABASE_MS = 3000;

// ID yang dirujuk langsung oleh aturan. Katalog yang tidak memuatnya dianggap tidak layak dipakai.
export const ID = {
  NAVIGATION_AIR: "buka_navigation_air",
  PERIKSA_DATA: "periksa_data_kalkulator",
  MHM_UTAMA: "kebersihan_mhm",
};

const KOLOM_PRIORITAS = {
  [STATUS_AMAN]: "prioritas_aman",
  [STATUS_WASPADA]: "prioritas_waspada",
  [STATUS_KRISIS]: "prioritas_krisis",
  [STATUS_TIDAK_DITENTUKAN]: "prioritas_belum_ditentukan",
};
const KONDISI_DIKENAL = ["semua kondisi", "normal", "terbatas", "tidak berfungsi", "belum diketahui"];

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
// Sesuai PRD bagian 6.4 / 9.6.
export const AKSI_UTAMA_PER_STATUS = {
  [STATUS_AMAN]: "Tanya AIRA Assistant",
  [STATUS_WASPADA]: "Tanya AIRA Assistant",
  [STATUS_KRISIS]: "Cari Titik Air",
  [STATUS_TIDAK_DITENTUKAN]: "Periksa Kembali Data",
};

// ---------- Pembersih nilai (tahan terhadap null, angka, boolean, dan array dari Supabase) ----------
const kosong = (v) =>
  v == null || (typeof v === "string" && v.trim() === "") || (Array.isArray(v) && v.length === 0);
const teks = (v) => (kosong(v) ? "" : Array.isArray(v) ? v.map((x) => String(x).trim()).join("; ") : String(v).trim());
const kunci = (v) => teks(v).replace(/\s+/g, " ").toLowerCase();
const daftar = (v) =>
  (Array.isArray(v) ? v.map(String) : teks(v).split(";")).map((x) => x.trim()).filter(Boolean);
const yaTidak = (v) => {
  const k = kunci(v);
  if (["ya", "yes", "true", "1", "aktif"].includes(k)) return "ya";
  if (["tidak", "no", "false", "0", "nonaktif", ""].includes(k)) return "tidak";
  return k;
};
// null jika kosong; NaN jika terisi tetapi bukan angka.
const angka = (v) => (kosong(v) ? null : Number(String(v).trim().replace(",", ".")));

const ATURAN_WAJIB_DIKENAL = new Set([
  "ya",
  "tidak",
  "jika mhm aktif",
  "jika mode krisis dan fitur tersedia",
  "ya jika data tidak terverifikasi",
  "jika ada dugaan kontaminasi",
]);

// ---------- Validasi dan normalisasi katalog ----------
// Baris yang rusak dilewati dan dicatat di `masalah`; satu baris buruk tidak boleh menghentikan hasil.
export function normalisasiKatalog(baris) {
  const statusDikenal = new Map(Object.keys(KOLOM_PRIORITAS).map((s) => [kunci(s), s]));
  const records = [];
  const masalah = [];
  const terlihat = new Set();

  for (const [i, row] of (Array.isArray(baris) ? baris : []).entries()) {
    const aid = teks(row?.action_id);
    const galat = [];
    if (!aid) galat.push(`baris ${i + 1}: action_id kosong`);
    else if (terlihat.has(aid)) galat.push(`${aid}: action_id duplikat`);
    if (aid) terlihat.add(aid);
    if (!teks(row?.teks_tindakan)) galat.push(`${aid || `baris ${i + 1}`}: teks_tindakan kosong`);

    const status = new Set();
    for (const s of daftar(row?.status_berlaku)) {
      if (statusDikenal.has(kunci(s))) status.add(statusDikenal.get(kunci(s)));
      else galat.push(`${aid}: status tidak dikenal '${s}'`);
    }

    const kondisi = new Set(daftar(row?.kondisi_sumber_berlaku).map(kunci));
    if (kondisi.size === 0) galat.push(`${aid}: kondisi_sumber_berlaku kosong`);
    for (const k of kondisi) if (!KONDISI_DIKENAL.includes(k)) galat.push(`${aid}: kondisi tidak dikenal '${k}'`);

    const wajib = yaTidak(row?.wajib);
    const prioritas = {};
    for (const [s, kolom] of Object.entries(KOLOM_PRIORITAS)) {
      const nilai = angka(row?.[kolom]);
      if (Number.isNaN(nilai)) {
        galat.push(`${aid}: ${kolom} bukan angka ('${row?.[kolom]}')`);
        prioritas[s] = null;
      } else prioritas[s] = nilai;
    }

    if (galat.length) {
      masalah.push(...galat);
      continue;
    }
    if (!ATURAN_WAJIB_DIKENAL.has(wajib)) masalah.push(`${aid}: aturan wajib tidak dikenal '${teks(row.wajib)}' (dianggap tidak wajib)`);

    records.push({
      id: aid,
      kategori: teks(row.kategori),
      nama: teks(row.nama_tindakan),
      tindakan: teks(row.teks_tindakan),
      konteks: teks(row.konteks_pemicu),
      status,
      kondisi,
      syaratMhm: yaTidak(row.syarat_mhm) === "ya",
      wajib,
      prioritas,
      cta: teks(row.cta),
      catatanKeamanan: teks(row.catatan_keamanan),
      dasarRujukan: teks(row.dasar_rujukan),
      aktif: yaTidak(row.aktif) === "ya",
    });
  }
  return { records, masalah };
}

// Katalog layak dipakai jika tidak kosong dan memuat tindakan yang dirujuk aturan.
function katalogLayak(records) {
  const ids = new Set(records.filter((r) => r.aktif).map((r) => r.id));
  return records.length > 0 && Object.values(ID).every((id) => ids.has(id));
}

// ---------- Pengambilan katalog ----------
let cache = { records: null, waktu: 0 };

async function bacaDariSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const kunciPublik =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !kunciPublik) throw new Error("variabel lingkungan Supabase belum diatur");

  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(url, kunciPublik, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client
    .from(TABEL_KATALOG)
    .select("*")
    .order("action_id")
    .limit(1000)
    .abortSignal(AbortSignal.timeout(TIMEOUT_SUPABASE_MS));
  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error(`tabel '${TABEL_KATALOG}' kosong atau tidak terbaca (periksa kebijakan RLS)`);
  return data;
}

export function kosongkanCacheKatalog() {
  cache = { records: null, waktu: 0 };
}

/** Mengembalikan { records, sumber } dengan sumber "supabase" | "cache" | "cadangan". Tidak pernah melempar error. */
export async function ambilKatalog({ paksaCadangan = false } = {}) {
  if (!paksaCadangan) {
    if (cache.records && Date.now() - cache.waktu < TTL_CACHE_MS) {
      return { records: cache.records, sumber: "supabase" };
    }
    try {
      const { records, masalah } = normalisasiKatalog(await bacaDariSupabase());
      if (!katalogLayak(records)) throw new Error("katalog tidak layak (kosong atau tindakan acuan aturan hilang)");
      if (masalah.length) console.warn(`[rekomendasi] ${masalah.length} masalah data katalog:`, masalah.slice(0, 5));
      cache = { records, waktu: Date.now() };
      return { records, sumber: "supabase" };
    } catch (err) {
      console.warn("[rekomendasi] katalog Supabase tidak dipakai:", err.message);
      if (cache.records) return { records: cache.records, sumber: "cache" };
    }
  }
  return { records: normalisasiKatalog(KATALOG_FALLBACK).records, sumber: "cadangan" };
}

// ---------- Aturan pemilihan ----------
/** Konteks aturan dari input formulir (masukan) dan hasil kalkulator (hasil). */
export function bangunKonteks(masukan, hasil) {
  const valid = hasil?.valid === true;
  const status = valid && hasil.status in KOLOM_PRIORITAS ? hasil.status : STATUS_TIDAK_DITENTUKAN;
  const jumlahMhm = Number(masukan?.anggotaMhm);
  const mhmAktif = masukan?.mhm === true && Number.isInteger(jumlahMhm) && jumlahMhm > 0;
  const kondisi = kunci(masukan?.kondisi);
  return {
    valid,
    status,
    kondisi,
    mhmAktif,
    jumlahMhm: mhmAktif ? jumlahMhm : 0,
    sumberAir: teks(masukan?.sumberAir),
    dugaanKontaminasi: masukan?.dugaanKontaminasi === true, // kalkulator belum punya input ini
    dataTidakTerverifikasi: !valid || status === STATUS_TIDAK_DITENTUKAN || kondisi === "belum diketahui",
  };
}

function wajibBerlaku(rec, ctx) {
  switch (rec.wajib) {
    case "ya":
      return true;
    case "jika mhm aktif":
      return ctx.mhmAktif;
    case "jika mode krisis dan fitur tersedia":
      return ctx.status === STATUS_KRISIS && FITUR_NAVIGATION_AIR_TERSEDIA;
    case "ya jika data tidak terverifikasi":
      return ctx.dataTidakTerverifikasi;
    case "jika ada dugaan kontaminasi":
      return ctx.dugaanKontaminasi;
    default:
      return false;
  }
}

/** Filter katalog: aktif, status berlaku, kondisi sumber cocok, syarat MHM terpenuhi, punya prioritas atau wajib. */
export function susunKatalog(records, ctx) {
  const hasil = [];
  for (const rec of records) {
    if (!rec.aktif || !rec.status.has(ctx.status)) continue;
    if (!rec.kondisi.has("semua kondisi") && !rec.kondisi.has(ctx.kondisi)) continue;
    if (rec.syaratMhm && !ctx.mhmAktif) continue;
    const wajib = wajibBerlaku(rec, ctx);
    const prioritas = rec.prioritas[ctx.status];
    if (prioritas == null && !wajib) continue;
    hasil.push({
      id: rec.id,
      kategori: rec.kategori,
      nama: rec.nama,
      teks: rec.tindakan
        .replaceAll("{jumlah_mhm}", String(ctx.jumlahMhm))
        .replaceAll("{sumber}", ctx.sumberAir || "sumber air utama"),
      konteks: rec.konteks,
      prioritas,
      wajib,
      cta: rec.cta,
      catatanKeamanan: rec.catatanKeamanan,
      dasarRujukan: rec.dasarRujukan,
    });
  }
  // Wajib dahulu, lalu prioritas terkecil, lalu id (urutan kode karakter, sama seperti Python).
  return hasil.sort(
    (a, b) =>
      Number(!a.wajib) - Number(!b.wajib) ||
      (a.prioritas ?? Infinity) - (b.prioritas ?? Infinity) ||
      (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
  );
}

export function pilihRekomendasi(records, ctx, batas = BATAS_REKOMENDASI) {
  const kandidat = susunKatalog(records, ctx);
  const wajib = kandidat.filter((x) => x.wajib);
  const dipilih = kandidat.slice(0, batas);
  // Semua tindakan wajib tetap masuk walau jumlahnya melebihi batas.
  for (const item of wajib) if (!dipilih.includes(item)) dipilih.push(item);
  return {
    status: ctx.status,
    ringkasan: RINGKASAN_PER_STATUS[ctx.status],
    aksiUtama: AKSI_UTAMA_PER_STATUS[ctx.status],
    items: dipilih.map((x, i) => ({ urutan: i + 1, ...x })),
    tautan: {
      navigationAir: ctx.status === STATUS_KRISIS,
      airaAssistant: ctx.status !== STATUS_TIDAK_DITENTUKAN,
    },
  };
}

/**
 * Titik masuk untuk Server Action. TIDAK PERNAH melempar error: kegagalan katalog tidak boleh
 * menghentikan hasil kalkulator.
 *
 * Bentuk keluaran:
 * { status, ringkasan, aksiUtama, items: [{ urutan, id, kategori, nama, teks, cta, wajib,
 *   catatanKeamanan, dasarRujukan, prioritas }], tautan: { navigationAir, airaAssistant },
 *   sumberKatalog: "supabase" | "cache" | "cadangan" | "tidak-tersedia" }
 */
export async function ambilRekomendasi(masukan, hasil) {
  const ctx = bangunKonteks(masukan, hasil);
  try {
    const { records, sumber } = await ambilKatalog();
    return { ...pilihRekomendasi(records, ctx), sumberKatalog: sumber };
  } catch (err) {
    console.error("[rekomendasi] gagal menyusun rekomendasi:", err);
    return {
      status: ctx.status,
      ringkasan: RINGKASAN_PER_STATUS[ctx.status],
      aksiUtama: AKSI_UTAMA_PER_STATUS[ctx.status],
      items: [],
      tautan: { navigationAir: ctx.status === STATUS_KRISIS, airaAssistant: ctx.status !== STATUS_TIDAK_DITENTUKAN },
      sumberKatalog: "tidak-tersedia",
    };
  }
}