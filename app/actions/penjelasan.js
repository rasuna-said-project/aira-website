"use server";

import { headers } from "next/headers";
import { jalankanKalkulator } from "@/services/calculatorFormService";
import { ambilRekomendasi } from "@/services/rekomendasiService";
import { dapatkanPenjelasanAI, izinkanPermintaan } from "@/services/aiService";

// Server Action untuk kartu "Penjelasan AIRA".
// Hasil dihitung ULANG di server dari `masukan`; hasil kiriman klien tidak dipercaya, jadi klien
// tidak bisa menyuntikkan angka atau teks ke prompt AI. Mengembalikan { ok, penjelasan } atau
// { ok: false, alasan }. Tidak pernah melempar error.
export async function jelaskanHasilAI(masukan) {
  try {
    const hasil = jalankanKalkulator(masukan ?? {});
    if (!hasil.valid || hasil.statusKey === "belum") return { ok: false, alasan: "data-belum-valid" };

    const h = await headers();
    const klien = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "anonim";
    if (!izinkanPermintaan(klien)) return { ok: false, alasan: "terlalu-banyak-permintaan" };

    const { items } = await ambilRekomendasi(masukan, hasil);
    const { ok, penjelasan, alasan } = await dapatkanPenjelasanAI(hasil, masukan, items);
    return ok ? { ok: true, penjelasan } : { ok: false, alasan };
  } catch (err) {
    console.error("[penjelasan] gagal:", err);
    return { ok: false, alasan: "kesalahan-server" };
  }
}
