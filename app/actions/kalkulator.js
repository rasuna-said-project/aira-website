"use server";

import { jalankanKalkulator } from "@/services/calculatorFormService";

// Server Action: perhitungan dijalankan di server, bukan di browser.
export async function hitungKalkulator(input) {
  return jalankanKalkulator(input ?? {});
}
