
"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { mintaPenjelasanAira } from "@/lib/penjelasanAira";

export default function PenjelasanAira({ hasil, masukan }) {
  const [state, setState] = useState({
    hasil: null,
    masukan: null,
    tahap: "memuat",
    teks: "",
  });

  const idPerhitungan = hasil?.waktuPerhitunganUtc;

  // Periksa apakah hasil perhitungan tersedia.
  const hasilValid = Boolean(hasil && idPerhitungan);

  // Status hanya ditampilkan jika sesuai dengan perhitungan saat ini.
  const stateSesuai =
    state.hasil === hasil &&
    state.masukan === masukan;

  // Tentukan tampilan tanpa memanggil setState saat render.
  const tahapTampilan = !hasilValid
    ? "gagal"
    : stateSesuai
      ? state.tahap
      : "memuat";

  const teksTampilan = stateSesuai ? state.teks : "";

  useEffect(() => {
    let batal = false;

    // Tidak meminta penjelasan jika hasil belum tersedia.
    if (!hasil || !idPerhitungan) {
      return () => {
        batal = true;
      };
    }

    async function ambilPenjelasan() {
      try {
        const teksAI = await mintaPenjelasanAira(
          hasil,
          masukan
        );

        // Abaikan respons dari perhitungan yang sudah berubah.
        if (batal) return;

        if (
          typeof teksAI === "string" &&
          teksAI.trim().length > 0
        ) {
          setState({
            hasil,
            masukan,
            tahap: "siap",
            teks: teksAI.trim(),
          });
        } else {
          setState({
            hasil,
            masukan,
            tahap: "gagal",
            teks: "",
          });
        }
      } catch (err) {
        console.error(
          "[PenjelasanAira] Gagal mengambil penjelasan AI:",
          err
        );

        if (!batal) {
          setState({
            hasil,
            masukan,
            tahap: "gagal",
            teks: "",
          });
        }
      }
    }

    ambilPenjelasan();

    return () => {
      // Mencegah respons lama mengubah tampilan terbaru.
      batal = true;
    };
  }, [hasil, masukan, idPerhitungan]);

  return (
    <section className="rounded-[28px] border border-aira-primary/5 bg-white p-6 shadow-soft sm:p-7">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-aira-secondary" />

        <h3 className="font-heading text-xl font-bold text-aira-primary">
          Penjelasan AIRA
        </h3>
      </div>

      {tahapTampilan === "memuat" && (
        <p
          className="mt-4 text-sm text-aira-text/60"
          role="status"
        >
          Menyiapkan penjelasan...
        </p>
      )}

      {tahapTampilan === "siap" && (
        <>
          <p className="mt-4 text-[15px] leading-relaxed text-aira-text/85">
            {teksTampilan}
          </p>

          <p className="mt-3 text-xs text-aira-text/60">
            Penjelasan ini hanya membantu memahami hasil.
            Status kondisi air tetap ditentukan oleh sistem
            perhitungan AIRA.
          </p>
        </>
      )}

      {tahapTampilan === "gagal" && (
        <p
          className="mt-4 text-[15px] leading-relaxed text-aira-text/80"
          role="status"
        >
          Penjelasan AI sedang tidak tersedia. Hasil
          perhitungan dan langkah yang disarankan tetap
          dapat digunakan.
        </p>
      )}
    </section>
  );
}
