"use client";

import { Sparkles } from "lucide-react";

import PenjelasanAira from "@/components/kalkulator/hasil/PenjelasanAira";

// Bagian "Penjelasan AIRA" di dalam card status.
// Urutan: pesan status berbasis aturan -> penjelasan AI -> catatan.
// Untuk status "belum" (data valid), penjelasan AI sudah menjelaskan alasannya,
// jadi pesan aturan hanya dipakai sebagai cadangan bila penjelasan AI gagal dimuat.
export default function PenjelasanHasil({ hasil, masukan, status }) {
  const valid = hasil?.valid === true;
  const belum = (hasil?.statusKey || "belum") === "belum";

  let pesanStatus = status?.pesan || "";

  if (valid && masukan?.kondisi === "Tidak Berfungsi") {
    pesanStatus =
      "Sumber air utama tidak berfungsi, sehingga status tetap Mode Krisis meskipun cadangan masih tersedia.";
  } else if (
    valid &&
    masukan?.kondisi === "Terbatas" &&
    hasil.statusDurasi === "Aman / Relatif Mencukupi"
  ) {
    pesanStatus =
      "Durasi cadangan lebih dari 3 hari, tetapi kondisi sumber air terbatas sehingga status akhir dibatasi pada Waspada.";
  } else if (valid && masukan?.kondisi === "Belum diketahui") {
    pesanStatus =
      "Kondisi sumber air utama belum diketahui, sehingga status akhir belum dapat ditentukan. Pilih kondisinya pada kalkulator lalu hitung ulang.";
  }

  return (
    <div className="mt-6 border-t border-aira-primary/10 pt-6">
      <h3 className="inline-flex items-center gap-2 font-heading text-xl font-bold text-aira-primary">
        <Sparkles className="size-5 text-aira-secondary" aria-hidden="true" />
        Penjelasan AIRA
      </h3>

      {!valid ? (
        <div
          className="mt-3 text-[15px] leading-relaxed text-aira-text/85"
          role="alert"
        >
          <p className="font-semibold text-aira-primary">
            Data yang perlu diperbaiki
          </p>

          <ul className="mt-2 list-disc space-y-1 pl-5">
            {(hasil?.errors || []).map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-aira-text/85">
          {!belum && <p>{pesanStatus}</p>}

          <PenjelasanAira
            key={hasil?.waktuPerhitunganUtc}
            hasil={hasil}
            masukan={masukan}
            pesanCadangan={belum ? pesanStatus : ""}
          />

          <p className="text-[13px] text-aira-text/70">
            Penjelasan ini hanya membantu memahami hasil; status ditentukan
            oleh perhitungan.
          </p>
        </div>
      )}
    </div>
  );
}
