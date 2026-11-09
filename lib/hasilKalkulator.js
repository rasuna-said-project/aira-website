
// Menyimpan hasil perhitungan terakhir di sessionStorage.
export const HASIL_KALKULATOR_KEY = "aira_hasil_kalkulator";

// Menyimpan draft input kalkulator agar tidak hilang saat kembali dari halaman hasil.
export const DRAFT_KALKULATOR_KEY = "aira_draft_kalkulator";

// ==========================================
// PENYIMPANAN HASIL KALKULATOR
// ==========================================

export function simpanHasilKalkulator(masukan, hasil) {
  try {
    sessionStorage.setItem(
      HASIL_KALKULATOR_KEY,
      JSON.stringify({ masukan, hasil })
    );
  } catch {
    // Penyimpanan browser tidak tersedia.
  }
}

export function bacaHasilKalkulator(raw) {
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ==========================================
// PENYIMPANAN DRAFT INPUT KALKULATOR
// ==========================================

// Menyimpan input terakhir pengguna.
export function simpanDraftKalkulator(masukan) {
  try {
    sessionStorage.setItem(
      DRAFT_KALKULATOR_KEY,
      JSON.stringify(masukan)
    );
  } catch {
    // Penyimpanan browser tidak tersedia.
  }
}

// Membaca draft input yang sebelumnya disimpan.
export function bacaDraftKalkulator() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KALKULATOR_KEY);

    if (!raw) return null;

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Menghapus draft setelah proses yang memang membutuhkan penghapusan.
export function hapusDraftKalkulator() {
  try {
    sessionStorage.removeItem(DRAFT_KALKULATOR_KEY);
  } catch {
    // Penyimpanan browser tidak tersedia.
  }
} 