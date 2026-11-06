"use server";

import { jalankanKalkulator } from "@/services/calculatorFormService";
import { ambilRekomendasi } from "@/services/rekomendasiService";

// Server Action: perhitungan dan rekomendasi berbasis aturan dijalankan di server, bukan di browser.
// `hasil.rekomendasi` ikut disimpan bersama hasil (sessionStorage, lalu water_assessments /
// assessment_recommendations oleh bagian Amanda). Rekomendasi TIDAK bergantung pada layanan AI,
// dan ambilRekomendasi() tidak pernah melempar error, sehingga hasil tidak bisa terhenti olehnya.
export async function hitungKalkulator(input) {
  const masukan = input ?? {};
  const hasil = jalankanKalkulator(masukan);
  const rekomendasi = await ambilRekomendasi(masukan, hasil);
  return { ...hasil, rekomendasi };
}
