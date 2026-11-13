"use client";

import { persentaseBar } from "@/lib/skalaBar";

// Bagian atas card status: badge, judul, angka hari, dan batang estimasi.
// Ringkasan kebutuhan, penjelasan, dan catatan perhitungan berada di komponen terpisah.
export default function StatusCard({ hasil, status }) {
  const IconStatus = status.ikon;
  const valid = hasil?.valid === true;
  const durasi = valid ? Number(hasil.durasiHari) : null;

  // Skala bertahap: 0, 1, 3, dan 10+ hari.
  const isiBar = persentaseBar(durasi);

  return (
    <div aria-live="polite">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`grid size-12 place-items-center rounded-2xl ${status.ikonBg}`}
        >
          <IconStatus className="size-6 text-aira-primary" />
        </span>

        <span
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${status.chip}`}
        >
          {status.label}
        </span>
      </div>

      <h2 className="mt-6 font-heading text-2xl font-semibold leading-snug text-aira-primary sm:text-[1.75rem]">
        {status.judul}
      </h2>

      <div className="mt-6 flex flex-wrap items-end gap-2 sm:gap-3">
        <span className="font-heading text-6xl font-extrabold leading-none text-aira-primary">
          {durasi == null
            ? "—"
            : durasi.toLocaleString("id-ID", {
                maximumFractionDigits: 2,
              })}
        </span>

        <span className="pb-2 text-lg text-aira-text/75">
          hari estimasi ketahanan
        </span>
      </div>

      <div
        className="mt-5 h-3.5 overflow-hidden rounded-full bg-white/80"
        role="img"
        aria-label={
          durasi == null
            ? "Durasi ketahanan air belum tersedia"
            : `Estimasi ketahanan air ${durasi} hari`
        }
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ${status.bar}`}
          style={{ width: `${isiBar}%` }}
        />
      </div>

      <div
        className="relative mt-1 h-8 text-xs text-aira-text/70"
        aria-hidden="true"
      >
        <span className="absolute left-[33.333%] top-0 h-1.5 w-px bg-aira-text/30" />
        <span className="absolute left-[66.667%] top-0 h-1.5 w-px bg-aira-text/30" />
        <span className="absolute left-0 top-2">0 hari</span>
        <span className="absolute left-[33.333%] top-2 -translate-x-1/2">
          1 hari
        </span>
        <span className="absolute left-[66.667%] top-2 -translate-x-1/2">
          3 hari
        </span>
        <span className="absolute right-0 top-2">10+ hari</span>
      </div>
    </div>
  );
}
