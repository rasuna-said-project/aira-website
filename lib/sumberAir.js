// Dua formulir memakai penulisan sumber air yang berbeda:
//  - Kalkulator    : "PDAM / Air Perpipaan", "Sumur Gali/Bor", "Air Hujan", "Mata Air / Posko"
//  - Profil keluarga: "PDAM / Air perpipaan", "Sumur gali / bor", "Mata air", "Air hujan",
//                     "Tangki / air bersih truk"
// Database menyimpan teks apa adanya; fungsi di sini menerjemahkan keduanya
// agar nilai dari satu formulir selalu cocok dengan pilihan formulir lainnya.

export const SUMBER_AIR_KALKULATOR = [
  "PDAM / Air Perpipaan",
  "Sumur Gali/Bor",
  "Air Hujan",
  "Mata Air / Posko",
];

export const SUMBER_AIR_PROFIL = [
  "PDAM / Air perpipaan",
  "Sumur gali / bor",
  "Mata air",
  "Air hujan",
  "Tangki / air bersih truk",
];

const kunci = (s) => String(s ?? "").toLowerCase().replace(/[^a-z]/g, "");

const KE_PROFIL = {
  pdamairperpipaan: "PDAM / Air perpipaan",
  sumurgalibor: "Sumur gali / bor",
  mataair: "Mata air",
  mataairposko: "Mata air",
  airhujan: "Air hujan",
  tangkiairbersihtruk: "Tangki / air bersih truk",
};

const KE_KALKULATOR = {
  pdamairperpipaan: "PDAM / Air Perpipaan",
  sumurgalibor: "Sumur Gali/Bor",
  airhujan: "Air Hujan",
  mataair: "Mata Air / Posko",
  mataairposko: "Mata Air / Posko",
  tangkiairbersihtruk: "Mata Air / Posko",
};

export const sumberKeProfil = (s) => KE_PROFIL[kunci(s)] ?? SUMBER_AIR_PROFIL[0];

export const sumberKeKalkulator = (s) => KE_KALKULATOR[kunci(s)] ?? SUMBER_AIR_KALKULATOR[0];