"use server";

import { createClient } from "@/lib/supabase/server";
import { jawabPertanyaanAssistant } from "@/services/assistantService";

const BATAS_PERTANYAAN = 2000;

const MODE_VALID = [
  "rag",
  "hybrid",
  "llm",
  "no_source",
  "out_of_scope",
];

export async function kirimPesanAssistant({
  question,
  history = [],
}) {
  try {
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

    const mode = MODE_VALID.includes(hasil.mode)
      ? hasil.mode
      : "llm";

    const answer =
      typeof hasil.answer === "string"
        ? hasil.answer
        : "Maaf, AIRA belum dapat memberikan jawaban.";

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
          url:
            typeof source.url === "string" && /^https?:\/\//i.test(source.url)
              ? source.url
              : null,
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

    let historySaved = false;

    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!authError && user) {
        const { error: saveError } = await supabase
          .from("assistant_interactions")
          .insert({
            user_id: user.id,
            household_id: null,
            assessment_id: null,
            guide_id: null,
            user_question: pertanyaan,
            assistant_response: answer,
            sources,
            response_mode: mode,
          });

        if (saveError) {
          console.error(
            "[AIRA Assistant] Gagal menyimpan percakapan:",
            saveError
          );
        } else {
          historySaved = true;
        }
      }
    } catch (saveError) {
      console.error(
        "[AIRA Assistant] Penyimpanan riwayat gagal:",
        saveError
      );
    }

    return {
      ok: true,
      answer,
      mode,
      sources,
      historySaved,
    };
  } catch (error) {
    console.error(
      "[AIRA Assistant Action] Kesalahan:",
      error
    );

    return {
      ok: false,
      error:
        "AIRA Assistant sedang mengalami gangguan. Silakan coba kembali.",
    };
  }
}
