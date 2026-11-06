// Curah hujan rata-rata per wilayah (mm/bulan). DATA SIMULASI untuk prototipe, bukan data resmi.
// Nama wilayah disamakan dengan pilihan pada kolom Lokasi di Kalkulator.
// lat/lng = titik pusat kabupaten (perkiraan), hanya dipakai untuk fitur "Gunakan lokasi saya".
export const WILAYAH_CURAH_HUJAN = [
  { nama: "Gunungkidul, DI Yogyakarta", curahHujanMm: 95, lat: -7.96, lng: 110.6 },
  { nama: "Kupang, NTT", curahHujanMm: 60, lat: -10.05, lng: 123.85 },
  { nama: "Timor Tengah Selatan, NTT", curahHujanMm: 70, lat: -9.86, lng: 124.28 },
  { nama: "Sumba Timur, NTT", curahHujanMm: 50, lat: -9.85, lng: 120.25 },
  { nama: "Malaka, NTT", curahHujanMm: 65, lat: -9.6, lng: 124.9 },
  { nama: "Wonogiri, Jawa Tengah", curahHujanMm: 120, lat: -7.82, lng: 110.92 },
  { nama: "Pacitan, Jawa Timur", curahHujanMm: 130, lat: -8.2, lng: 111.1 },
  { nama: "Bima, NTB", curahHujanMm: 55, lat: -8.5, lng: 118.6 },
  { nama: "Lombok Timur, NTB", curahHujanMm: 85, lat: -8.65, lng: 116.53 },
  { nama: "Jeneponto, Sulawesi Selatan", curahHujanMm: 75, lat: -5.67, lng: 119.73 },
  { nama: "Indramayu, Jawa Barat", curahHujanMm: 110, lat: -6.33, lng: 108.32 },
];

// Mengembalikan curah hujan (mm/bulan) atau null jika wilayah kosong/tidak dikenal.
export function cariCurahHujan(namaWilayah) {
  const wilayah = WILAYAH_CURAH_HUJAN.find((item) => item.nama === namaWilayah);
  return wilayah ? wilayah.curahHujanMm : null;
}
