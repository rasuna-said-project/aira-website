"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const tombol =
  "grid size-12 place-items-center rounded-full border border-aira-primary/25 bg-white text-aira-primary transition-colors hover:bg-aira-primary/10 disabled:opacity-35 disabled:hover:bg-white";

// Penghitung dengan tombol kurang/tambah (jumlah anggota, jumlah anggota MHM).
// Jika editable, angkanya juga bisa diketik langsung.
export default function Stepper({ value, min, max, onChange, label, editable = false }) {
  const [draft, setDraft] = useState(null);
  const batasi = (n) => Math.max(min, max != null ? Math.min(max, n) : n);

  return (
    <div className="inline-flex items-center gap-4" role="group" aria-label={label}>
      <button
        type="button"
        className={tombol}
        aria-label="Kurangi"
        disabled={value <= min}
        onClick={() => {
          setDraft(null);
          onChange(value - 1);
        }}
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
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            // Hanya angka, tanpa nol di depan. Kosong sementara dianggap 0.
            const angka = e.target.value.replace(/\D/g, "").slice(0, 3).replace(/^0+(?=\d)/, "");
            setDraft(angka);
            onChange(Number(angka || 0));
          }}
          onBlur={() => {
            setDraft(null);
            const n = batasi(value);
            if (n !== value) onChange(n);
          }}
          className="min-h-12 w-14 rounded-lg border-0 bg-transparent p-0 text-center font-heading text-3xl font-bold text-aira-primary focus:outline-none focus:ring-2 focus:ring-aira-primary/30"
        />
      ) : (
        <output className="min-w-10 text-center font-heading text-3xl font-bold text-aira-primary" aria-live="polite">
          {value}
        </output>
      )}

      <button
        type="button"
        className={tombol}
        aria-label="Tambah"
        disabled={max != null && value >= max}
        onClick={() => {
          setDraft(null);
          onChange(value + 1);
        }}
      >
        <Plus className="size-5" />
      </button>
    </div>
  );
}
