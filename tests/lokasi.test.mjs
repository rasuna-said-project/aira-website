// Pengujian deteksi wilayah dari koordinat. Jalankan: npm test
import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { WILAYAH_CURAH_HUJAN, cariCurahHujan } from "@/data/curahHujan";
import { deteksiWilayah, wilayahTerdekat } from "@/lib/lokasi";

describe("data wilayah", () => {
  test("setiap wilayah punya koordinat valid di Indonesia dan nama unik", () => {
    const nama = new Set();
    for (const w of WILAYAH_CURAH_HUJAN) {
      assert.ok(w.lat >= -11.5 && w.lat <= 6, `${w.nama}: lat di luar Indonesia`);
      assert.ok(w.lng >= 94 && w.lng <= 142, `${w.nama}: lng di luar Indonesia`);
      assert.notEqual(cariCurahHujan(w.nama), null);
      nama.add(w.nama);
    }
    assert.equal(nama.size, WILAYAH_CURAH_HUJAN.length);
  });
});

describe("wilayahTerdekat", () => {
  test("titik di Wonosari -> Gunungkidul", () => {
    assert.equal(wilayahTerdekat(-7.96, 110.6)?.nama, "Gunungkidul, DI Yogyakarta");
  });
  test("titik dekat Pacitan -> Pacitan (bukan Wonogiri)", () => {
    assert.equal(wilayahTerdekat(-8.19, 111.1)?.nama, "Pacitan, Jawa Timur");
  });
  test("pusat Kota Yogyakarta masih terjangkau Gunungkidul", () => {
    assert.equal(wilayahTerdekat(-7.8, 110.36)?.nama, "Gunungkidul, DI Yogyakarta");
  });
  test("Surabaya di luar jangkauan 60 km -> null", () => {
    assert.equal(wilayahTerdekat(-7.25, 112.75), null);
  });
  test("koordinat tidak valid atau daftar tanpa koordinat -> null", () => {
    assert.equal(wilayahTerdekat(NaN, 110), null);
    assert.equal(wilayahTerdekat(undefined, undefined), null);
    assert.equal(wilayahTerdekat(-7.96, 110.6, [{ nama: "X", curahHujanMm: 1 }]), null);
  });
});

describe("deteksiWilayah", () => {
  const geoOk = (lat, lng) => ({ getCurrentPosition: (ok) => ok({ coords: { latitude: lat, longitude: lng } }) });
  const geoGalat = (code) => ({ getCurrentPosition: (_ok, galat) => galat({ code }) });

  test("berhasil", async () => {
    assert.deepEqual(await deteksiWilayah({ geolocation: geoOk(-7.96, 110.6) }), { status: "ok", nama: "Gunungkidul, DI Yogyakarta" });
  });
  test("di luar jangkauan", async () => {
    assert.deepEqual(await deteksiWilayah({ geolocation: geoOk(-7.25, 112.75) }), { status: "di-luar-jangkauan" });
  });
  test("izin ditolak", async () => {
    assert.deepEqual(await deteksiWilayah({ geolocation: geoGalat(1) }), { status: "ditolak" });
  });
  test("timeout atau posisi tidak tersedia -> gagal", async () => {
    assert.deepEqual(await deteksiWilayah({ geolocation: geoGalat(3) }), { status: "gagal" });
    assert.deepEqual(await deteksiWilayah({ geolocation: geoGalat(2) }), { status: "gagal" });
  });
  test("browser tanpa geolocation", async () => {
    assert.deepEqual(await deteksiWilayah({ geolocation: undefined }), { status: "tidak-didukung" });
  });
  test("API melempar error -> gagal, tidak melempar", async () => {
    const geo = { getCurrentPosition: () => { throw new Error("boom"); } };
    assert.deepEqual(await deteksiWilayah({ geolocation: geo }), { status: "gagal" });
  });
});
