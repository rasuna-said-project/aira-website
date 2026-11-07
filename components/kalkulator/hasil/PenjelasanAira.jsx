"use client";

import { useEffect, useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import { mintaPenjelasanAira } from "@/lib/penjelasanAira";

export default function PenjelasanAira({ hasil, masukan }) {
  const [state, setState] = useState({ tahap: "memuat", teks: "" });
  
  // Mencegah eksekusi ganda dalam satu render
  const dipanggilRef = useRef(false);

  useEffect(() => {
    let batal = false;

    // Ambil identifier unik dari hasil perhitungan
    const idPerhitungan = hasil?.waktuPerhitunganUtc;

    if (!hasil || !idPerhitungan) return;

    // Panggil AI hanya jika belum pernah dipanggil untuk data perhitungan ini
    mintaPenjelasanAira(hasil, masukan)
      .then((teks) => {
        if (!batal) {
          if (teks && teks.trim().length > 0) {
            setState({ tahap: "siap", teks });
          } else {
            setState({ tahap: "gagal", teks: "" });
          }
        }
      })
      .catch((err) => {
        console.error("[PenjelasanAira] Error AI:", err);
        if (!batal) setState({ tahap: "gagal", teks: "" });
      });

    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasil?.waktuPerhitunganUtc]);
  
  return (
    <section className="rounded-[28px] border border-aira-primary/5 bg-white p-6 shadow-soft sm:p-7">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-aira-secondary" />
        <h3 className="font-heading text-xl font-bold text-aira-primary">
          Penjelasan AIRA
        </h3>
      </div>

      {state.tahap === "memuat" && (
        <p className="mt-4 text-sm text-aira-text/60" role="status">
          Menyiapkan penjelasan...
        </p>
      )}

      {state.tahap === "siap" && (
        <>
          <p className="mt-4 text-[15px] leading-relaxed text-aira-text/85">
            {state.teks}
          </p>
          <p className="mt-3 text-xs text-aira-text/60">
            Penjelasan ini hanya membantu memahami hasil; status ditentukan
            oleh perhitungan.
          </p>
        </>
      )}

      {state.tahap === "gagal" && (
        <p
          className="mt-4 text-[15px] leading-relaxed text-aira-text/80"
          role="status"
        >
          Penjelasan AI sedang tidak tersedia. Hasil perhitungan dan langkah
          yang disarankan di atas tetap berlaku.
        </p>
      )}
    </section>
  );
}