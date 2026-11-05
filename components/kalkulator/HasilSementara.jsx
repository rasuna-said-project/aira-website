"use client";

// HALAMAN HASIL SEMENTARA, hanya untuk memeriksa hasil perhitungan hari ini (5 November).
// Akan digantikan halaman Hasil lengkap (4 variasi status) pada 6 November.
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { bacaHasilKalkulator, HASIL_KALKULATOR_KEY } from "@/lib/hasilKalkulator";

const subscribe = () => () => {};
const ambil = () => sessionStorage.getItem(HASIL_KALKULATOR_KEY);
const liter = (n) => `${Number(n).toLocaleString("id-ID", { maximumFractionDigits: 2 })} L`;

export default function HasilSementara() {
  const data = bacaHasilKalkulator(useSyncExternalStore(subscribe, ambil, () => null));
  const hasil = data?.hasil;

  if (!hasil) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-16 text-center">
        <p className="text-aira-text/75">Belum ada hasil perhitungan. Isi Kalkulator terlebih dahulu.</p>
        <Link href="/kalkulator-air" className="mt-4 inline-block font-semibold text-aira-primary underline">
          Buka Kalkulator
        </Link>
      </div>
    );
  }

  const baris = hasil.valid
    ? [
        ["Kebutuhan dasar", liter(hasil.kebutuhanDasarLiter)],
        ["Tambahan MHM", liter(hasil.tambahanMhmLiter)],
        ["Total kebutuhan per hari", liter(hasil.kebutuhanHarianLiter)],
        ["Cadangan air", liter(hasil.cadanganAirLiter)],
        ["Estimasi durasi", `${String(hasil.durasiHari).replace(".", ",")} hari`],
        [
          "Potensi panen air hujan (per bulan)",
          hasil.potensiPanenAirHujanLiter == null
            ? "Belum dapat dihitung. Isi lokasi dan luas atap."
            : liter(hasil.potensiPanenAirHujanLiter),
        ],
      ]
    : [];

  return (
    <div className="mx-auto max-w-[720px] px-4 py-10 sm:py-16">
      <p className="mb-3 rounded-xl bg-aira-sand px-4 py-2 text-xs text-aira-text/70">
        Tampilan sementara untuk pemeriksaan hasil. Halaman Hasil lengkap menyusul.
      </p>
      <h1 className="font-heading text-3xl font-bold text-aira-primary">Hasil Perhitungan</h1>
      <p className="mt-6 text-sm text-aira-text/70">Status kondisi air</p>
      <p className="font-heading text-2xl font-bold text-aira-primary">{hasil.status}</p>
      <p className="mt-1 text-aira-text/80">{hasil.alasanStatus}</p>

      {!hasil.valid && (
        <div className="mt-5 rounded-2xl bg-aira-peach/20 p-4 text-sm text-aira-danger-dark" role="alert">
          <p className="font-semibold">Data yang perlu diperbaiki:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {hasil.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {baris.length > 0 && (
        <dl className="mt-6 divide-y divide-aira-primary/10 rounded-2xl bg-white p-2 shadow-soft">
          {baris.map(([nama, nilai]) => (
            <div key={nama} className="flex justify-between gap-4 px-3 py-3 text-sm">
              <dt className="text-aira-text/70">{nama}</dt>
              <dd className="text-right font-semibold">{nilai}</dd>
            </div>
          ))}
        </dl>
      )}

      <Link
        href="/kalkulator-air"
        className="mt-8 inline-flex h-12 items-center rounded-full bg-aira-primary px-8 font-semibold text-white hover:bg-aira-primary-dark"
      >
        {hasil.valid ? "Hitung Ulang" : "Periksa Kembali Data"}
      </Link>
    </div>
  );
}
