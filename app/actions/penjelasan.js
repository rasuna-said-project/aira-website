"use server";

import { headers } from "next/headers";
import { jalankanKalkulator } from "@/services/calculatorFormService";
import {
  dapatkanPenjelasanAI,
  izinkanPermintaan,
} from "@/services/aiService";

// Server Action untuk kartu Penjelasan AIRA.
// Hasil kalkulator dihitung ulang di server.
// AI hanya menjelaskan hasil yang sudah ditentukan kalkulator.
export async function jelaskanHasilAI(masukan) {
  try {
    if (
      !masukan ||
      typeof masukan !== "object" ||
      Array.isArray(masukan)
    ) {
      return {
        ok: false,
        alasan: "data-tidak-valid",
      };
    }

    const hasil = jalankanKalkulator(masukan);

    if (!hasil?.valid || hasil.statusKey === "belum") {
      return {
        ok: false,
        alasan: "data-belum-valid",
      };
    }

    const requestHeaders = await headers();

    const klien =
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip") ||
      "anonim";

    if (!izinkanPermintaan(klien)) {
      return {
        ok: false,
        alasan: "terlalu-banyak-permintaan",
      };
    }

    // Penjelasan AI tidak memerlukan daftar rekomendasi.
    // Rekomendasi ditangani secara terpisah oleh rekomendasiService.
    const respons = await dapatkanPenjelasanAI(hasil, masukan);

    if (!respons?.ok) {
      return {
        ok: false,
        alasan: respons?.alasan || "ai-tidak-tersedia",
      };
    }

    return {
      ok: true,
      penjelasan: respons.penjelasan,
    };
  } catch (err) {
    console.error("[penjelasan] gagal:", err);

    return {
      ok: false,
      alasan: "kesalahan-server",
    };
  }
}