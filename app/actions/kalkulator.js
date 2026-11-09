
"use server";

import { jalankanKalkulator } from "@/services/calculatorFormService";
import { ambilRekomendasi } from "@/services/rekomendasiService";

// Kalkulator merupakan proses utama.
// Kegagalan layanan rekomendasi tidak boleh menggagalkan hasil perhitungan.
export async function hitungKalkulator(input) {
  const masukan = input ?? {};
  const hasil = jalankanKalkulator(masukan);

  let rekomendasi = {
    items: [],
    ringkasan: "",
    sumber: "tidak-tersedia",
  };

  try {
    rekomendasi = await ambilRekomendasi(
      masukan,
      hasil,
      { pakaiAI: true }
    );
  } catch (err) {
    console.error(
      "[hitungKalkulator] Gagal mengambil rekomendasi:",
      err
    );
  }

  return {
    ...hasil,
    rekomendasi,
  };
}
