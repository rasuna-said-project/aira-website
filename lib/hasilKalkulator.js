// Menyimpan hasil perhitungan terakhir di sessionStorage agar halaman Hasil dapat membacanya.
// Tidak disimpan ke akun (penyimpanan ke database dikerjakan terpisah untuk pengguna login).
export const HASIL_KALKULATOR_KEY = "aira_hasil_kalkulator";

export function simpanHasilKalkulator(masukan, hasil) {
  try {
    sessionStorage.setItem(HASIL_KALKULATOR_KEY, JSON.stringify({ masukan, hasil }));
  } catch {
    // Penyimpanan browser tidak tersedia; halaman Hasil akan meminta pengguna menghitung ulang.
  }
}

// Mengubah teks dari sessionStorage menjadi { masukan, hasil } atau null.
export function bacaHasilKalkulator(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
