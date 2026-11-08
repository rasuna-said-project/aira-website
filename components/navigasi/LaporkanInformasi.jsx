"use client";

import { useState } from "react";
import { Flag } from "lucide-react";

// Tombol "Laporkan Informasi" (PRD). Masih simulasi: belum mengirim ke backend.
export default function LaporkanInformasi() {
  const [terkirim, setTerkirim] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setTerkirim(true)}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-aira-primary/30 px-6 py-3 font-semibold text-aira-primary transition-colors hover:bg-aira-primary/10"
      >
        <Flag className="size-4" /> Laporkan Informasi
      </button>
      {terkirim && (
        <p role="status" className="mt-3 rounded-2xl bg-aira-sage/35 px-4 py-3 text-sm text-aira-primary-dark">
          Terima kasih. Fitur pelaporan ini masih simulasi.
        </p>
      )}
    </div>
  );
}
