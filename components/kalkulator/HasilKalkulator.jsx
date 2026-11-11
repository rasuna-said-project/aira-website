"use client";

import Link from "next/link";
import { Droplets } from "lucide-react";

import { useHasilKalkulator } from "@/hooks/useHasilKalkulator";

import HasilHeader from "@/components/kalkulator/hasil/HasilHeader";
import StatusCard from "@/components/kalkulator/hasil/StatusCard";
import RingkasanKebutuhan from "@/components/kalkulator/hasil/RingkasanKebutuhan";
import EstimasiPanenHujan from "@/components/kalkulator/hasil/EstimasiPanenHujan";
import DisclaimerLangkah from "@/components/kalkulator/hasil/DisclaimerLangkah";
import RekomendasiCard from "@/components/kalkulator/hasil/RekomendasiCard";
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
      <div className="mx-auto max-w-275 px-4 py-10 sm:px-5 sm:py-14">
        <HasilHeader />

        {/* CARD UTAMA: Status, ringkasan kebutuhan, dan penjelasan hasil. */}
        <section
          className={`mt-8 w-full rounded-[28px] border-2 p-6 shadow-soft sm:p-8 ${status.panel}`}
          aria-label="Ringkasan hasil perhitungan ketahanan air"
        >
          <StatusCard
            hasil={hasil}
            masukan={masukan}
            status={status}
          />

          <div className="mt-7 border-t border-aira-primary/10 pt-6">
            <RingkasanKebutuhan
              hasil={hasil}
              masukan={masukan}
            />
          </div>
        </section>

        {/* Disclaimer untuk rekomendasi dan langkah yang disarankan. */}
        <div className="mt-6 w-full">
          <DisclaimerLangkah />
        </div>

        {/* Rekomendasi di kiri dan aksi lanjutan di kanan. */}
        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="order-2 min-w-0 lg:order-1 lg:col-span-7">
            <RekomendasiCard
              masukan={masukan}
              hasil={hasil}
              status={status}
              statusKey={statusKey}
            />
          </div>

          <aside className="order-1 flex min-w-0 flex-col gap-6 lg:order-2 lg:col-span-5">
            <HasilActions statusKey={statusKey} />
          </aside>
        </div>

        {/* Estimasi panen air hujan memenuhi seluruh lebar halaman. */}
        <div className="mt-6 w-full *:w-full *:max-w-none!">
          <EstimasiPanenHujan
            hasil={hasil}
            masukan={masukan}
          />
        </div>
      </div>
    </main>
  );
}