import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Clock,
  Droplets,
  MapPinned,
  MessageCircleHeart,
} from "lucide-react";

import { formatDesimal } from "@/lib/statusDashboard";

const formatLiter = (angka) => Number(angka).toLocaleString("id-ID");

// Kartu "Status air rumah tangga". `status` = hasil hitungStatusDashboard, `catatan` = catatan terbaru.
export default function StatusAirCard({ status, catatan, keluarga, tanggalSingkat, tanggalPenuh }) {
  const { tampilan, hari, kebutuhanHarian, catatanStatus, statusKey } = status;
  const kapasitas = keluarga.kapasitasTandonLiter;
  const persenTandon = kapasitas > 0 ? Math.min(100, Math.max(0, (catatan.liter / kapasitas) * 100)) : 0;
  const krisis = statusKey === "krisis";

  return (
    <section className={`rounded-[28px] border-2 p-7 shadow-soft sm:p-8 ${tampilan.panel}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-aira-primary">
          <Droplets className="size-5" /> Status air rumah tangga
        </h2>
        <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tampilan.chip}`}>{tampilan.label}</span>
      </div>

      <div className="mt-5 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
        <div className="flex items-end gap-2">
          <span className="font-heading text-6xl font-extrabold leading-none text-aira-primary">
            {formatDesimal(hari)}
          </span>
          <span className="pb-1.5 text-aira-text/75">hari tersisa</span>
        </div>

        <div>
          <div
            className="h-3.5 overflow-hidden rounded-full bg-white/80"
            role="img"
            aria-label={`Tandon terisi ${Math.round(persenTandon)} persen`}
          >
            <div className={`h-full rounded-full ${tampilan.bar}`} style={{ width: `${persenTandon}%` }} />
          </div>
          <p className="mt-2 text-sm text-aira-text/75">
            {formatLiter(catatan.liter)} dari {formatLiter(kapasitas)} liter, kebutuhan {kebutuhanHarian} liter per hari
          </p>
        </div>
      </div>

      {catatanStatus && <p className="mt-3 text-sm text-aira-text/70">{catatanStatus}</p>}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-sm text-aira-text/70">
          <Clock className="size-4" /> Catatan terakhir {tanggalPenuh}, {catatan.waktu} (input manual Anda)
        </span>
        <Link
          href="/kalkulator-air"
          className="inline-flex items-center gap-2 font-semibold text-aira-primary transition-all hover:gap-3"
        >
          <Calculator className="size-4" /> Perbarui Kondisi Air <ArrowRight className="size-4" />
        </Link>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Volume cadangan", nilai: `${formatLiter(catatan.liter)} L` },
          { label: "Kebutuhan harian", nilai: `${kebutuhanHarian} L/hari` },
          { label: "Anggota keluarga", nilai: `${keluarga.anggota} orang` },
          { label: "Waktu perhitungan", nilai: `${tanggalSingkat}, ${catatan.waktu}` },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-white/75 p-4">
            <dt className="text-xs text-aira-text/60">{item.label}</dt>
            <dd className="mt-1 font-semibold text-aira-primary">{item.nilai}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 rounded-2xl bg-white/70 p-5">
        <p className="font-semibold text-aira-primary">Langkah berikutnya</p>
        <p className="mt-1 text-sm text-aira-text/75">
          {krisis
            ? "Prioritaskan kebutuhan dasar dan periksa sumber air alternatif beserta panduan krisis."
            : "Pelajari langkah penghematan dan pengelolaan cadangan bersama AIRA Assistant."}
        </p>
        <Link
          href={krisis ? "/navigasi-air" : "/assistant"}
          className="mt-3 inline-flex items-center gap-2 font-semibold text-aira-primary"
        >
          {krisis ? <MapPinned className="size-4" /> : <MessageCircleHeart className="size-4" />}
          {krisis ? "Cari Titik Air" : "Tanya AIRA Assistant"} <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
