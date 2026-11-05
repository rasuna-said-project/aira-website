// Curah hujan rata-rata per wilayah (mm/bulan). DATA SIMULASI untuk prototipe, bukan data resmi.
// Nama wilayah disamakan dengan pilihan pada kolom Lokasi di Kalkulator.
export const WILAYAH_CURAH_HUJAN = [
  { nama: "Gunungkidul, DI Yogyakarta", curahHujanMm: 95 },
  { nama: "Kupang, NTT", curahHujanMm: 60 },
  { nama: "Timor Tengah Selatan, NTT", curahHujanMm: 70 },
  { nama: "Sumba Timur, NTT", curahHujanMm: 50 },
  { nama: "Malaka, NTT", curahHujanMm: 65 },
  { nama: "Wonogiri, Jawa Tengah", curahHujanMm: 120 },
  { nama: "Pacitan, Jawa Timur", curahHujanMm: 130 },
  { nama: "Bima, NTB", curahHujanMm: 55 },
  { nama: "Lombok Timur, NTB", curahHujanMm: 85 },
  { nama: "Jeneponto, Sulawesi Selatan", curahHujanMm: 75 },
  { nama: "Indramayu, Jawa Barat", curahHujanMm: 110 },
];

// Mengembalikan curah hujan (mm/bulan) atau null jika wilayah kosong/tidak dikenal.
export function cariCurahHujan(namaWilayah) {
  const wilayah = WILAYAH_CURAH_HUJAN.find((item) => item.nama === namaWilayah);
  return wilayah ? wilayah.curahHujanMm : null;
}
