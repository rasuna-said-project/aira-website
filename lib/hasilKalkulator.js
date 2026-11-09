// Menyimpan hasil perhitungan terakhir di sessionStorage.
export const HASIL_KALKULATOR_KEY = "aira_hasil_kalkulator";

// Menyimpan draft input kalkulator agar tidak hilang saat kembali dari halaman hasil.
export const DRAFT_KALKULATOR_KEY = "aira_draft_kalkulator";

// ==========================================
// PENYIMPANAN HASIL KALKULATOR
// ==========================================

// Menyimpan input dan hasil perhitungan terakhir.
export function simpanHasilKalkulator(masukan, hasil) {
  try {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(
      HASIL_KALKULATOR_KEY,
      JSON.stringify({ masukan, hasil })
    );
  } catch (error) {
    console.error("Gagal menyimpan hasil kalkulator:", error);
  }
}

// Membaca hasil perhitungan dari data JSON.
export function bacaHasilKalkulator(raw) {
  if (!raw || typeof raw !== "string") return null;

  try {
    const data = JSON.parse(raw);

    if (
      !data ||
      typeof data !== "object" ||
      !data.masukan ||
      !data.hasil
    ) {
      return null;
    }

    return data;
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
    if (typeof window === "undefined") return;

    sessionStorage.setItem(
      DRAFT_KALKULATOR_KEY,
      JSON.stringify(masukan)
    );
  } catch (error) {
    console.error("Gagal menyimpan draft kalkulator:", error);
  }
}

// Membaca draft input yang sebelumnya disimpan.
export function bacaDraftKalkulator() {
  try {
    if (typeof window === "undefined") return null;

    const raw = sessionStorage.getItem(DRAFT_KALKULATOR_KEY);

    if (!raw) return null;

    const data = JSON.parse(raw);

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

// Menghapus draft setelah proses yang memang membutuhkan penghapusan.
export function hapusDraftKalkulator() {
  try {
    if (typeof window === "undefined") return;

    sessionStorage.removeItem(DRAFT_KALKULATOR_KEY);
  } catch (error) {
    console.error("Gagal menghapus draft kalkulator:", error);
  }
}