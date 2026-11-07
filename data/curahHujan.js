// Curah hujan rata-rata per wilayah (mm/bulan).
 // DATA SIMULASI untuk prototipe, bukan data resmi.
 // Nama wilayah menggunakan nama kabupaten/kota sebagai acuan.
 // lat/lng merupakan perkiraan titik pusat kabupaten/kota.

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

// Menyamakan penulisan nama kabupaten/kota dari API.
function normalisasiNamaWilayah(nama) {
  return nama
    .trim()
    .toLowerCase()
    .replace(/^(kabupaten administrasi|kabupaten|kota administrasi|kota)\s+/i, "")
    .replace(/\s+/g, " ");
}

// Mengembalikan curah hujan (mm/bulan).
// Mendukung format lama dan format lokasi baru:
// Kecamatan, Kabupaten/Kota, Provinsi.
export function cariCurahHujan(namaWilayah) {
  if (!namaWilayah || typeof namaWilayah !== "string") {
    return null;
  }

  const bagian = namaWilayah
    .split(",")
    .map((item) => item.trim());

  let namaKabupaten;

  if (bagian.length === 3) {
    // Format baru dari RegionSelect.
    namaKabupaten = bagian[1];
  } else if (bagian.length === 2) {
    // Format lama tetap didukung.
    namaKabupaten = bagian[0];
  } else {
    return null;
  }

  const namaNormal = normalisasiNamaWilayah(namaKabupaten);

  const wilayah = WILAYAH_CURAH_HUJAN.find((item) => {
    const namaData = item.nama.split(",")[0];

    return normalisasiNamaWilayah(namaData) === namaNormal;
  });

  return wilayah ? wilayah.curahHujanMm : null;
}
