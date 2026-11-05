import { Minus, Plus } from "lucide-react";

const tombol =
  "grid size-12 place-items-center rounded-full border border-aira-primary/25 bg-white text-aira-primary transition-colors hover:bg-aira-primary/10 disabled:opacity-35 disabled:hover:bg-white";

// Penghitung dengan tombol kurang/tambah (jumlah anggota, jumlah anggota MHM).
export default function Stepper({ value, min, max, onChange, label }) {
  return (
    <div className="inline-flex items-center gap-4" role="group" aria-label={label}>
      <button
        type="button"
        className={tombol}
        aria-label="Kurangi"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="size-5" />
      </button>
      <output className="min-w-10 text-center font-heading text-3xl font-bold text-aira-primary" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={tombol}
        aria-label="Tambah"
        disabled={max != null && value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-5" />
      </button>
    </div>
  );
}
