"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const tombol =
  "grid size-12 place-items-center rounded-full border border-aira-primary/25 bg-white text-aira-primary transition-colors hover:bg-aira-primary/10 disabled:opacity-35 disabled:hover:bg-white";

// Penghitung dengan tombol kurang/tambah.
// Jika editable, angka juga bisa diketik langsung.
export default function Stepper({
  value,
  min = 0,
  max,
  onChange,
  label,
  editable = false,
}) {
  const [draft, setDraft] = useState(null);

  const nilaiAman = Number.isFinite(Number(value))
    ? Number(value)
    : min;

  const batasi = (angka) => {
    let hasil = Math.max(min, angka);

    if (max != null) {
      hasil = Math.min(max, hasil);
    }

    return hasil;
  };

  function kurangi() {
    setDraft(null);
    onChange(batasi(nilaiAman - 1));
  }

  function tambah() {
    setDraft(null);
    onChange(batasi(nilaiAman + 1));
  }

  function ubahAngka(teks) {
    // Hanya menerima angka, tanpa nol di depan.
    const angka = teks
      .replace(/\D/g, "")
      .slice(0, 3)
      .replace(/^0+(?=\d)/, "");

    setDraft(angka);

    // Nilai sementara dapat 0 ketika input dikosongkan.
    // Nilai akhir akan dibatasi kembali ketika input kehilangan fokus.
    onChange(angka === "" ? 0 : Number(angka));
  }

  function selesaikanInput() {
    setDraft(null);

    const hasil = batasi(nilaiAman);

    if (hasil !== nilaiAman) {
      onChange(hasil);
    }
  }

  return (
    <div
      className="inline-flex items-center gap-4"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={tombol}
        aria-label="Kurangi"
        disabled={nilaiAman <= min}
        onClick={kurangi}
      >
        <Minus className="size-5" />
      </button>

      {editable ? (
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-label={label}
          value={draft ?? String(value)}
          onFocus={(event) => event.target.select()}
          onChange={(event) => ubahAngka(event.target.value)}
          onBlur={selesaikanInput}
          className="min-h-12 w-14 rounded-lg border-0 bg-transparent p-0 text-center font-heading text-3xl font-bold text-aira-primary focus:outline-none focus:ring-2 focus:ring-aira-primary/30"
        />
      ) : (
        <output
          className="min-w-10 text-center font-heading text-3xl font-bold text-aira-primary"
          aria-live="polite"
        >
          {nilaiAman}
        </output>
      )}

      <button
        type="button"
        className={tombol}
        aria-label="Tambah"
        disabled={max != null && nilaiAman >= max}
        onClick={tambah}
      >
        <Plus className="size-5" />
      </button>
    </div>
  );
}