// Pengujian skenario TC-K11 s.d. TC-K18 untuk Recommendation System dan penjelasan AI.
// Jalankan: npm test   (node --import ./tests/register-alias.mjs --test tests/rekomendasi.test.mjs)
// Tes tidak memanggil Supabase maupun Gemini: katalog memakai salinan CSV, respons AI disimulasikan.
import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";

import { jalankanKalkulator } from "@/services/calculatorFormService";
import {
  KOEFISIEN_PANEN_AIR_HUJAN,
  STATUS_AMAN,
  STATUS_KRISIS,
  STATUS_TIDAK_DITENTUKAN,
  STATUS_WASPADA,
} from "@/services/calculatorService";
import { WILAYAH_CURAH_HUJAN } from "@/data/curahHujan";
import { KATALOG_FALLBACK } from "@/data/katalogTindakanFallback";
import {
  ID,
  ambilKatalog,
  ambilRekomendasi,
  kosongkanCacheKatalog,
  normalisasiKatalog,
} from "@/services/rekomendasiService";
import { dapatkanPenjelasanAI, izinkanPermintaan, kosongkanCacheAI, validasiKeluaranAI } from "@/services/aiService";

// 4 orang x 15 L = 60 L/hari. Kapasitas 1000 L: 50% = 8,3 hari; 15% = 2,5 hari; 5% = 0,83 hari.
const dasar = {
  lokasi: "",
  anggota: 4,
  sumberAir: "Sumur Gali/Bor",
  kondisi: "Normal",
  kapasitas: "1000",
  persen: 50,
  mhm: false,
  anggotaMhm: 0,
  luasAtap: "",
};

async function jalankan(masukan) {
  const hasil = jalankanKalkulator(masukan);
  const rekomendasi = await ambilRekomendasi(masukan, hasil);
  return { hasil, rekomendasi, ids: rekomendasi.items.map((i) => i.id) };
}

beforeEach(() => {
  kosongkanCacheKatalog();
  kosongkanCacheAI();
});

describe("katalog", () => {
  test("salinan CSV valid, lengkap, dan memuat tindakan acuan aturan", () => {
    const { records, masalah } = normalisasiKatalog(KATALOG_FALLBACK);
    assert.equal(records.length, 77);
    assert.deepEqual(masalah, []);
    const ids = new Set(records.map((r) => r.id));
    for (const id of Object.values(ID)) assert.ok(ids.has(id), `${id} hilang`);
  });

  test("tanpa Supabase, katalog jatuh ke salinan cadangan", async () => {
    const { records, sumber } = await ambilKatalog();
    assert.equal(sumber, "cadangan");
    assert.equal(records.length, 77);
  });

  test("baris rusak dilewati tanpa menghentikan katalog", () => {
    const rusak = [...KATALOG_FALLBACK, { ...KATALOG_FALLBACK[0], action_id: "x", prioritas_aman: "abc" }];
    const { records, masalah } = normalisasiKatalog(rusak);
    assert.equal(records.length, 77);
    assert.equal(masalah.length, 1);
  });
});

describe("status dan rekomendasi berbasis aturan", () => {
  test("TC-K11 Aman: rekomendasi sesuai status, ada tindakan wajib", async () => {
    const { hasil, rekomendasi, ids } = await jalankan({ ...dasar, persen: 50 });
    assert.equal(hasil.status, STATUS_AMAN);
    assert.equal(rekomendasi.status, STATUS_AMAN);
    assert.equal(rekomendasi.aksiUtama, "Tanya AIRA Assistant");
    assert.ok(ids.includes("jangan_samakan_volume_dengan_kualitas"));
    assert.ok(!ids.includes(ID.NAVIGATION_AIR));
    assert.ok(rekomendasi.items.every((i) => i.teks && i.cta));
  });

  test("TC-K12 Waspada: ada penjelasan dan langkah", async () => {
    const { hasil, rekomendasi } = await jalankan({ ...dasar, persen: 15 });
    assert.equal(hasil.status, STATUS_WASPADA);
    assert.equal(rekomendasi.status, STATUS_WASPADA);
    assert.ok(rekomendasi.ringkasan.length > 20);
    assert.ok(rekomendasi.items.length >= 5);
  });

  test("TC-K13 Krisis: Navigation Air dan tindakan wajib krisis selalu masuk, wajib di urutan awal", async () => {
    const { hasil, rekomendasi, ids } = await jalankan({ ...dasar, persen: 5 });
    assert.equal(hasil.status, STATUS_KRISIS);
    assert.equal(rekomendasi.aksiUtama, "Cari Titik Air");
    assert.ok(rekomendasi.tautan.navigationAir);
    for (const id of [ID.NAVIGATION_AIR, "prioritaskan_kebutuhan_esensial", "eskalasi_jika_kebutuhan_tidak_terpenuhi"]) {
      assert.ok(ids.includes(id), `${id} harus ada`);
    }
    const wajib = rekomendasi.items.filter((i) => i.wajib).length;
    assert.ok(rekomendasi.items.slice(0, wajib).every((i) => i.wajib));
  });

  test("TC-K14 Belum Dapat Ditentukan: data tidak valid dan kondisi belum diketahui", async () => {
    for (const masukan of [
      { ...dasar, kapasitas: "0" }, // tidak valid
      { ...dasar, kondisi: "Belum diketahui" }, // valid, tetapi status belum dapat ditentukan
    ]) {
      const { hasil, rekomendasi, ids } = await jalankan(masukan);
      assert.equal(hasil.status, STATUS_TIDAK_DITENTUKAN);
      assert.equal(rekomendasi.aksiUtama, "Periksa Kembali Data");
      assert.ok(ids.includes(ID.PERIKSA_DATA));
      assert.ok(ids.includes("tandai_status_data_tidak_pasti"));
      assert.ok(rekomendasi.items.length > 0);
    }
  });

  test("TC-K15 MHM aktif: tambahan kebutuhan dan tindakan MHM wajib diterapkan", async () => {
    const { hasil, ids } = await jalankan({ ...dasar, mhm: true, anggotaMhm: 2 });
    assert.equal(hasil.tambahanMhmLiter, 10);
    assert.equal(hasil.kebutuhanHarianLiter, 70);
    assert.ok(ids.includes(ID.MHM_UTAMA));
  });

  test("TC-K15 MHM aktif di Mode Krisis: tindakan MHM krisis masuk", async () => {
    const { ids } = await jalankan({ ...dasar, persen: 5, mhm: true, anggotaMhm: 1 });
    assert.ok(ids.includes("jaga_kebutuhan_mhm_dalam_krisis"));
  });

  test("TC-K16 MHM tidak aktif: tidak ada tambahan dan tidak ada tindakan MHM", async () => {
    for (const persen of [50, 15, 5]) {
      const { hasil, rekomendasi } = await jalankan({ ...dasar, persen, mhm: false });
      assert.equal(hasil.tambahanMhmLiter, 0);
      assert.ok(rekomendasi.items.every((i) => i.kategori !== "MHM"));
    }
  });

  test("TC-K17 Panen air hujan: 36 m2 x 75 mm x 0,8 = 2.160 liter", () => {
    assert.equal(Math.round(36 * 75 * KOEFISIEN_PANEN_AIR_HUJAN), 2160);
    // Rumus yang dipakai formulir harus sama untuk wilayah mana pun yang punya data curah hujan.
    const hasil = jalankanKalkulator({ ...dasar, lokasi: WILAYAH_CURAH_HUJAN[0].nama, luasAtap: "36" });
    assert.ok(hasil.curahHujanMmPerBulan != null, "wilayah pertama harus punya data curah hujan");
    assert.equal(hasil.potensiPanenAirHujanLiter, Math.round(36 * hasil.curahHujanMmPerBulan * KOEFISIEN_PANEN_AIR_HUJAN));
  });

  test("ambilRekomendasi tidak pernah melempar error walau masukan rusak", async () => {
    const r = await ambilRekomendasi(undefined, undefined);
    assert.equal(r.status, STATUS_TIDAK_DITENTUKAN);
    assert.ok(r.items.length > 0);
  });
});

describe("TC-K18 layanan AI gagal tidak menghalangi hasil", () => {
  const masukan = { ...dasar, persen: 15 };
  const hasil = jalankanKalkulator(masukan);
  const tindakan = [{ id: "pantau_cadangan", nama: "Pantau sisa cadangan" }];
  const opsi = { apiKey: "uji", models: ["m1", "m2"], jedaRetryMs: 0, totalMs: 2000 };
  const respons = (obj, status = 200) => ({ ok: status === 200, status, json: async () => obj });
  const gemini = (teks) => respons({ candidates: [{ content: { parts: [{ text: teks }] } }] });

  test("API key tidak ada -> ok:false, rekomendasi aturan tetap tampil", async () => {
    const r = await dapatkanPenjelasanAI(hasil, masukan, tindakan, { ...opsi, apiKey: "" });
    // Catatan: env GEMINI_API_KEY juga tidak diset di lingkungan tes.
    assert.equal(r.ok, false);
    const rek = await ambilRekomendasi(masukan, hasil);
    assert.ok(rek.items.length > 0);
    assert.equal(hasil.status, STATUS_WASPADA);
  });

  test("jaringan putus -> ok:false, tidak melempar error", async () => {
    const r = await dapatkanPenjelasanAI(hasil, masukan, tindakan, {
      ...opsi,
      fetchImpl: async () => {
        throw new TypeError("fetch failed");
      },
    });
    assert.equal(r.ok, false);
  });

  test("HTTP 503 di semua model -> ok:false setelah retry dan model cadangan", async () => {
    let panggilan = 0;
    const r = await dapatkanPenjelasanAI(hasil, masukan, tindakan, {
      ...opsi,
      fetchImpl: async () => (panggilan++, respons({}, 503)),
    });
    assert.equal(r.ok, false);
    assert.equal(panggilan, 4); // 2 model x (1 percobaan + 1 retry)
  });

  test("model utama sibuk, model cadangan berhasil", async () => {
    const urls = [];
    const r = await dapatkanPenjelasanAI(hasil, masukan, tindakan, {
      ...opsi,
      fetchImpl: async (url) => {
        urls.push(url);
        return url.includes("/m1:") ? respons({}, 503) : gemini(JSON.stringify({ penjelasan: "Cadangan air Anda diperkirakan cukup sekitar 2,5 hari. Mulailah berhemat dan pantau kondisinya." }));
      },
    });
    assert.equal(r.ok, true);
    assert.equal(r.model, "m2");
  });

  test("API key ditolak (401) -> berhenti tanpa mencoba model lain", async () => {
    let panggilan = 0;
    const r = await dapatkanPenjelasanAI(hasil, masukan, tindakan, { ...opsi, fetchImpl: async () => (panggilan++, respons({}, 401)) });
    assert.equal(r.ok, false);
    assert.equal(panggilan, 1);
  });

  test("keluaran bukan JSON / menyebut status lain / terlalu pendek ditolak", () => {
    assert.throws(() => validasiKeluaranAI("halo", STATUS_WASPADA));
    assert.throws(() => validasiKeluaranAI(JSON.stringify({ penjelasan: "Ini sudah masuk Mode Krisis dan harus segera bertindak." }), STATUS_WASPADA));
    assert.throws(() => validasiKeluaranAI(JSON.stringify({ penjelasan: "Status Aman." }), STATUS_WASPADA));
    assert.throws(() => validasiKeluaranAI(JSON.stringify({ penjelasan: "x".repeat(800) }), STATUS_WASPADA));
    assert.equal(
      validasiKeluaranAI("```json\n" + JSON.stringify({ penjelasan: "Cadangan menipis, mulailah berhemat dan tetap waspada." }) + "\n```", STATUS_WASPADA),
      "Cadangan menipis, mulailah berhemat dan tetap waspada."
    );
  });

  test("hanya data yang diperlukan dikirim ke AI (tanpa lokasi)", async () => {
    let badan = "";
    await dapatkanPenjelasanAI(jalankanKalkulator({ ...masukan, lokasi: "Gunungkidul" }), { ...masukan, lokasi: "Gunungkidul" }, tindakan, {
      ...opsi,
      fetchImpl: async (_u, init) => ((badan = init.body), gemini(JSON.stringify({ penjelasan: "Cadangan air Anda diperkirakan cukup sekitar 2,5 hari ke depan." }))),
    });
    assert.ok(!badan.includes("Gunungkidul"));
    assert.ok(badan.includes("durasi_hari"));
  });

  test("hasil sukses di-cache; kegagalan tidak", async () => {
    let panggilan = 0;
    const ok = async () => (panggilan++, gemini(JSON.stringify({ penjelasan: "Cadangan air Anda diperkirakan cukup sekitar 2,5 hari ke depan." })));
    await dapatkanPenjelasanAI(hasil, masukan, tindakan, { ...opsi, fetchImpl: ok });
    await dapatkanPenjelasanAI(hasil, masukan, tindakan, { ...opsi, fetchImpl: ok });
    assert.equal(panggilan, 1);

    kosongkanCacheAI();
    let gagal = 0;
    const buruk = async () => (gagal++, respons({}, 500));
    await dapatkanPenjelasanAI(hasil, masukan, tindakan, { ...opsi, models: ["m1"], fetchImpl: buruk });
    await dapatkanPenjelasanAI(hasil, masukan, tindakan, { ...opsi, models: ["m1"], fetchImpl: buruk });
    assert.equal(gagal, 4);
  });

  test("pembatas laju: permintaan ke-11 dalam semenit ditolak", () => {
    const t = 1_000_000;
    for (let i = 0; i < 10; i++) assert.equal(izinkanPermintaan("ip-uji", t + i), true);
    assert.equal(izinkanPermintaan("ip-uji", t + 11), false);
    assert.equal(izinkanPermintaan("ip-uji", t + 61_000), true);
  });
});
