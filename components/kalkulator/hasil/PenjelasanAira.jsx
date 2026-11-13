"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { mintaPenjelasanAira } from "@/lib/penjelasanAira";

export default function PenjelasanAira({ hasil, masukan, pesanCadangan = "" }) {
  const [state, setState] = useState({
    hasil: null,
    masukan: null,
    tahap: "memuat",
    teks: "",
  });

  const idPerhitungan = hasil?.waktuPerhitunganUtc;
  const hasilValid = Boolean(hasil && idPerhitungan);

  const stateSesuai =
    state.hasil === hasil &&
    state.masukan === masukan;

  const tahapTampilan = !hasilValid
    ? "gagal"
    : stateSesuai
      ? state.tahap
      : "memuat";

  const teksTampilan = stateSesuai ? state.teks : "";

  useEffect(() => {
    let batal = false;

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
      batal = true;
    };
  }, [hasil, masukan, idPerhitungan]);

  return (
    <div aria-live="polite" className="space-y-3">
      {tahapTampilan === "memuat" && (
        <p
          className="text-[15px] leading-relaxed text-aira-text/60"
          role="status"
        >
          Menyiapkan penjelasan hasil perhitungan...
        </p>
      )}

      {tahapTampilan === "siap" && (
        <p className="text-[15px] leading-relaxed text-aira-text/85">
          {teksTampilan}
        </p>
      )}

      {tahapTampilan === "gagal" && (
        <>
          {pesanCadangan && <p>{pesanCadangan}</p>}

          <p
            className="flex items-start gap-2 text-sm leading-relaxed text-aira-text/70"
            role="status"
          >
            <Info
              className="mt-0.5 size-4 shrink-0 text-aira-primary"
              aria-hidden="true"
            />
            <span>
              Penjelasan belum dapat dimuat. Namun, hasil perhitungan dan
              langkah yang disarankan tetap dapat digunakan.
            </span>
          </p>
        </>
      )}
    </div>
  );
}
