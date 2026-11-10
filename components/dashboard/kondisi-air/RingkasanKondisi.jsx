import Link from "next/link";
import { Calculator, Droplets } from "lucide-react";

import { formatDesimal } from "@/lib/statusDashboard";

const formatLiter = (angka) => Number(angka).toLocaleString("id-ID");

// Ringkasan kondisi terakhir. `status` = hasil hitungStatusDashboard.
export default function RingkasanKondisi({ status, catatan, keluarga, tanggalPenuh, tanggalPanjang }) {
  const { tampilan, hari, kebutuhanHarian, catatanStatus } = status;

  const tiles = [
    { label: "Ketahanan", nilai: `${formatDesimal(hari)} hari` },
    { label: "Volume saat ini", nilai: `${formatLiter(catatan.liter)} L` },
    { label: "Kebutuhan harian", nilai: `${kebutuhanHarian} L/hari` },
    { label: "Anggota keluarga", nilai: `${keluarga.anggota} orang` },
  ];

  return (
    <section className={`rounded-[28px] border-2 p-6 shadow-soft sm:p-8 ${tampilan.panel}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tampilan.chip}`}>{tampilan.label}</span>
          <span className="text-sm text-aira-text/70">Berdasarkan catatan {tanggalPenuh}</span>
        </div>
        <Link
          href="/kalkulator-air"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border-2 border-aira-primary px-5 py-2.5 font-semibold text-aira-primary transition-colors hover:bg-aira-primary/10"
        >
          <Calculator className="size-4" /> Perbarui Kondisi Air
        </Link>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-2xl bg-white/80 px-2 py-4">
            <dd className="font-heading text-xl font-bold text-aira-primary">{tile.nilai}</dd>
            <dt className="mt-1 text-xs text-aira-text/70">{tile.label}</dt>
          </div>
        ))}
      </dl>

      {catatanStatus && <p className="mt-4 text-sm text-aira-text/70">{catatanStatus}</p>}

      <p className="mt-4 text-sm text-aira-text/70">
        Perhitungan terakhir: {tanggalPanjang}, pukul {catatan.waktu}. Data berasal dari hasil yang disimpan, bukan
        pemantauan real-time.
      </p>
    </section>
  );
}

// Tampilan bila belum ada hasil kalkulator tersimpan.
export function RingkasanKosong() {
  return (
    <section className="rounded-[28px] bg-white p-7 text-center shadow-soft">
      <Droplets className="mx-auto size-10 text-aira-primary" />
      <h2 className="mt-3 text-xl font-semibold text-aira-primary">Kondisi air belum tersedia</h2>
      <p className="mt-2 text-aira-text/70">Belum ada hasil kalkulator yang tersimpan di akun ini.</p>
      <Link
        href="/kalkulator-air"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-aira-primary px-6 py-3.5 font-semibold text-white transition-colors hover:bg-aira-primary-dark"
      >
        <Calculator className="size-4" /> Hitung kondisi air
      </Link>
    </section>
  );
}
