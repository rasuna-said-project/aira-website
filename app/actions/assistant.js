"use server";

import { jawabPertanyaanAssistant } from "@/services/assistantService";

const BATAS_PERTANYAAN = 2000;
const MODE_VALID = [
  "rag",
  "llm",
  "no_source",
  "out_of_scope",
];

export async function kirimPesanAssistant({
  question,
  history = [],
}) {
  try {
    // Validasi pertanyaan.
    if (
      typeof question !== "string" ||
      !question.trim()
    ) {
      return {
        ok: false,
        error: "Pertanyaan tidak boleh kosong.",
      };
    }

    const pertanyaan = question.trim();

    if (pertanyaan.length > BATAS_PERTANYAAN) {
      return {
        ok: false,
        error: "Pertanyaan terlalu panjang.",
      };
    }

    // Batasi dan bersihkan riwayat percakapan.
    const riwayatBersih = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              ["user", "assistant"].includes(item.role) &&
              typeof item.content === "string"
          )
          .slice(-6)
          .map((item) => ({
            role: item.role,
            content: item.content.trim().slice(0, 1500),
          }))
          .filter((item) => item.content.length > 0)
      : [];

    const hasil = await jawabPertanyaanAssistant({
      question: pertanyaan,
      history: riwayatBersih,
    });

    if (!hasil?.ok) {
      return {
        ok: false,
        error:
          hasil?.error ||
          "AIRA Assistant sedang mengalami gangguan. Silakan coba kembali.",
      };
    }

    // Pertahankan empat mode agar frontend dapat
    // menampilkan label sesuai kondisi sebenarnya.
    const mode = MODE_VALID.includes(hasil.mode)
      ? hasil.mode
      : "llm";

    // Kirim hanya metadata sumber yang dibutuhkan frontend.
    const sources = Array.isArray(hasil.sources)
      ? hasil.sources.map((source) => ({
          title:
            typeof source.title === "string"
              ? source.title
              : "Dokumen referensi AIRA",

          publisher:
            typeof source.publisher === "string"
              ? source.publisher
              : "",

          page_start:
            Number.isInteger(source.page_start)
              ? source.page_start
              : null,

          page_end:
            Number.isInteger(source.page_end)
              ? source.page_end
              : null,
        }))
      : [];

    return {
      ok: true,
      answer:
        typeof hasil.answer === "string"
          ? hasil.answer
          : "Maaf, AIRA belum dapat memberikan jawaban.",
      mode,
      sources,
    };
  } catch (error) {
    console.error(
      "[AIRA Assistant Action] Kesalahan:",
      error.message
    );

    return {
      ok: false,
      error:
        "AIRA Assistant sedang mengalami gangguan. Silakan coba kembali.",
    };
  }
}
