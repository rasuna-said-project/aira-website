"use server";

import { jalankanKalkulator } from "@/services/calculatorFormService";
import { ambilRekomendasi } from "@/services/rekomendasiService";

// Kalkulator merupakan proses utama.
// Kegagalan layanan rekomendasi tidak boleh menggagalkan hasil perhitungan.
export async function hitungKalkulator(input) {
  const masukan = input ?? {};

  // 1. Jalankan perhitungan dan validasi input.
  const hasil = jalankanKalkulator(masukan);

  // 2. Nilai awal rekomendasi jika layanan tidak tersedia.
  let rekomendasi = {
    items: [],
    ringkasan: "",
    sumber: "tidak-tersedia",
  };

  // 3. Jangan meminta rekomendasi jika input kalkulator tidak valid.
  if (!hasil.valid) {
    return {
      ...hasil,
      rekomendasi,
    };
  }

  // 4. Ambil rekomendasi setelah hasil perhitungan valid.
  try {
    const hasilRekomendasi = await ambilRekomendasi(
      masukan,
      hasil,
      { pakaiAI: true }
    );

    if (hasilRekomendasi) {
      rekomendasi = hasilRekomendasi;
    }
  } catch (err) {
    console.error(
      "[hitungKalkulator] Gagal mengambil rekomendasi:",
      err
    );
  }

  // 5. Kembalikan hasil kalkulator dan rekomendasi.
  return {
    ...hasil,
    rekomendasi,
  };
}