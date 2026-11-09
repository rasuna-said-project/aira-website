// Pencarian, filter, dan pengurutan daftar titik air (dipakai halaman Navigasi Air).
// Murni fungsi tanpa efek samping, mudah diuji dan nanti mudah dipindah ke query server (Tria).

export const JENIS_SEMUA = "Semua jenis";
export const JENIS_TITIK_AIR = [
  JENIS_SEMUA,
  "Sumur bor",
  "Mata air",
  "Tandon umum",
  "Tangki BPBD",
  "Hidran umum",
  "Embung",
];

export const LABEL_KECOCOKAN = {
  kecamatan: "Cocok kecamatan",
  kabupaten: "Cocok kabupaten/kota",
  provinsi: "Cocok provinsi",
};

const URUTAN_TINGKAT = { kecamatan: 0, kabupaten: 1, provinsi: 2 };
const urutanTingkat = (tingkat) => (tingkat in URUTAN_TINGKAT ? URUTAN_TINGKAT[tingkat] : 3);
const urutanKetersediaan = (k) => (k === "Tersedia" || k === "Terbatas" ? 0 : 1);

/** Tingkat wilayah yang cocok dengan teks pencarian: "kecamatan" | "kabupaten" | "provinsi" | null. */
export function tingkatKecocokan(titik, kataKunci) {
  if (!kataKunci) return null;
  if (titik.kecamatan.toLowerCase().includes(kataKunci)) return "kecamatan";
  if (titik.kabupaten.toLowerCase().includes(kataKunci)) return "kabupaten";
  if (titik.provinsi.toLowerCase().includes(kataKunci)) return "provinsi";
  return null;
}

/**
 * Menyaring lalu mengurutkan titik air.
 * Filter wilayah (provinsi, kabupaten, kecamatan) menyaring ketat. Teks pencarian memengaruhi urutan:
 * kecocokan kecamatan, lalu kabupaten/kota, lalu provinsi. Selanjutnya yang "Tersedia" atau "Terbatas"
 * lebih dulu, lalu pembaruan terbaru.
 * Mengembalikan [{ titik, tingkat }].
 */
export function cariTitikAir(
  daftar,
  { kataKunci = "", jenis = JENIS_SEMUA, adaAirSaja = false, provinsi = "", kabupaten = "", kecamatan = "" } = {}
) {
  const q = kataKunci.trim().toLowerCase();

  const hasil = daftar
    .filter(
      (t) =>
        (jenis === JENIS_SEMUA || t.type === jenis) &&
        (!adaAirSaja || t.availability === "Tersedia" || t.availability === "Terbatas") &&
        (!provinsi || t.provinsi === provinsi) &&
        (!kabupaten || t.kabupaten === kabupaten) &&
        (!kecamatan || t.kecamatan === kecamatan) &&
        (!q ||
          `${t.name} ${t.address} ${t.area} ${t.kecamatan} ${t.kabupaten} ${t.provinsi}`
            .toLowerCase()
            .includes(q))
    )
    .map((titik) => ({ titik, tingkat: tingkatKecocokan(titik, q) }));

  hasil.sort(
    (a, b) =>
      urutanTingkat(a.tingkat) - urutanTingkat(b.tingkat) ||
      urutanKetersediaan(a.titik.availability) - urutanKetersediaan(b.titik.availability) ||
      a.titik.updatedHoursAgo - b.titik.updatedHoursAgo
  );

  return hasil;
}
