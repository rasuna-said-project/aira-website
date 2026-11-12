"use client";

import Link from "next/link";
import { Droplets } from "lucide-react";

import { useHasilKalkulator } from "@/hooks/useHasilKalkulator";

import HasilHeader from "@/components/kalkulator/hasil/HasilHeader";
import StatusCard from "@/components/kalkulator/hasil/StatusCard";
import RingkasanKebutuhan from "@/components/kalkulator/hasil/RingkasanKebutuhan";
import PenjelasanHasil from "@/components/kalkulator/hasil/PenjelasanHasil";
import CatatanPerhitungan from "@/components/kalkulator/hasil/CatatanPerhitungan";
import EstimasiPanenHujan from "@/components/kalkulator/hasil/EstimasiPanenHujan";
import DisclaimerLangkah from "@/components/kalkulator/hasil/DisclaimerLangkah";
import RekomendasiCard from "@/components/kalkulator/hasil/RekomendasiCard";
import RingkasanDataInput from "@/components/kalkulator/hasil/RingkasanDataInput";
import HasilActions from "@/components/kalkulator/hasil/HasilActions";

import { ambilStatusTampilan } from "@/components/kalkulator/hasil/StatusConfig";

export default function HasilKalkulator() {
  const data = useHasilKalkulator();

  const hasil = data?.hasil;
  const masukan = data?.masukan;

  if (!hasil) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-aira-bg px-4 py-16">
        <div className="mx-auto max-w-150 rounded-[28px] bg-white p-8 text-center shadow-soft sm:p-10">
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
            className="mt-7 inline-flex min-h-13 items-center justify-center rounded-full bg-aira-primary px-7 font-semibold text-white transition-colors hover:bg-aira-primary-dark"
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
      <div className="fade-up mx-auto max-w-310 px-4 py-10 sm:px-5 sm:py-16">
        <HasilHeader />

        <div className="mt-8 flex flex-col gap-6">
          {/* 1. Status ketahanan, ringkasan kebutuhan, penjelasan AIRA. */}
          <section
            className={`rounded-[28px] border-2 p-6 shadow-soft sm:p-8 ${status.panel}`}
            aria-label="Ringkasan hasil perhitungan ketahanan air"
          >
            <StatusCard hasil={hasil} masukan={masukan} status={status} />
            <RingkasanKebutuhan hasil={hasil} />
            <PenjelasanHasil hasil={hasil} masukan={masukan} status={status} />
            <CatatanPerhitungan hasil={hasil} />
          </section>

          {/* 2. Estimasi panen air hujan, selebar halaman. */}
          <EstimasiPanenHujan hasil={hasil} masukan={masukan} />

          {/* 3. Kiri: langkah + disclaimer. Kanan: ringkasan input + aksi. */}
          <div className="grid items-start gap-6 lg:grid-cols-[3fr_2fr]">
            <div className="flex min-w-0 flex-col gap-6">
              <RekomendasiCard
                masukan={masukan}
                hasil={hasil}
                status={status}
                statusKey={statusKey}
              />

              <DisclaimerLangkah className="hidden lg:flex" />
            </div>

            <div className="flex min-w-0 flex-col gap-6">
              <RingkasanDataInput masukan={masukan} />
              <HasilActions statusKey={statusKey} />
            </div>
          </div>

          {/* Mobile: disclaimer di bagian akhir halaman. */}
          <DisclaimerLangkah className="flex lg:hidden" />
        </div>
      </div>
    </main>
  );
}
