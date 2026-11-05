"use client";

import Link from "next/link";
import { Droplets } from "lucide-react";

import { useHasilKalkulator } from "@/hooks/useHasilKalkulator";

import HasilHeader from "@/components/kalkulator/hasil/HasilHeader";
import StatusCard from "@/components/kalkulator/hasil/StatusCard";
import RingkasanKebutuhan from "@/components/kalkulator/hasil/RingkasanKebutuhan";
import EstimasiPanenHujan from "@/components/kalkulator/hasil/EstimasiPanenHujan";
import RekomendasiCard from "@/components/kalkulator/hasil/RekomendasiCard";
import HasilActions from "@/components/kalkulator/hasil/HasilActions";

import { ambilStatusTampilan } from "@/components/kalkulator/hasil/StatusConfig";

export default function HasilSementara() {
  const data = useHasilKalkulator();

  const hasil = data?.hasil;
  const masukan = data?.masukan;

  // Tampilan ketika belum ada hasil kalkulasi.
  if (!hasil) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-aira-bg px-4 py-16">
        <div className="mx-auto max-w-[600px] rounded-[28px] bg-white p-8 text-center shadow-soft sm:p-10">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-aira-sage/30">
            <Droplets className="size-8 text-aira-primary" />
          </span>

          <h1 className="mt-5 font-heading text-2xl font-bold text-aira-primary">
            Belum Ada Hasil Perhitungan
          </h1>

          <p className="mt-3 text-aira-text/75">
            Silakan isi data rumah tangga terlebih dahulu untuk mengetahui
            estimasi ketahanan air keluarga Anda.
          </p>

          <Link
            href="/kalkulator-air"
            className="mt-7 inline-flex min-h-[52px] items-center justify-center rounded-full bg-aira-primary px-7 font-semibold text-white transition-colors hover:bg-aira-primary-dark"
          >
            Buka Kalkulator
          </Link>
        </div>
      </main>
    );
  }

  const statusKey = hasil.statusKey || "belum";
  const status = ambilStatusTampilan(statusKey);

  return (
    <main className="min-h-[calc(100vh-72px)] bg-aira-bg">
      <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-5 sm:py-14">
        <HasilHeader />

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Kolom kiri */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <StatusCard
              hasil={hasil}
              masukan={masukan}
              status={status}
            />

            <RingkasanKebutuhan hasil={hasil} />
          </div>

          {/* Kolom kanan */}
          <aside className="flex flex-col gap-6 lg:col-span-5">
            <EstimasiPanenHujan
              hasil={hasil}
              masukan={masukan}
            />

            <RekomendasiCard
              masukan={masukan}
              hasil={hasil}
              status={status}
            />

            <HasilActions statusKey={statusKey} />
          </aside>
        </div>
      </div>
    </main>
  );
} 