import Link from "next/link";
import {
  Bookmark,
  MapPinned,
  MessageCircleHeart,
  Pencil,
} from "lucide-react";

export default function HasilActions({ statusKey }) {
  return (
    <section className="flex flex-col gap-3 rounded-[28px] border border-aira-primary/5 bg-white p-6 shadow-soft sm:p-7">
      {statusKey === "belum" ? (
        <>
          <Link
            href="/kalkulator-air"
            className="inline-flex min-h-13.5 items-center justify-center gap-2 rounded-full bg-aira-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-aira-primary-dark"
          >
            <Pencil className="size-5" />
            Periksa Kembali Data
          </Link>

          <Link
            href="/navigasi-air"
            className="inline-flex min-h-13.5 items-center justify-center gap-2 rounded-full border-2 border-aira-primary px-5 py-3 font-semibold text-aira-primary transition-colors hover:bg-aira-primary/10"
          >
            <MapPinned className="size-5" />
            Cari Titik Air
          </Link>
        </>
      ) : (
        <Link
          href="/navigasi-air"
          className="inline-flex min-h-13.5 items-center justify-center gap-2 rounded-full bg-aira-primary px-5 py-3 font-semibold text-white shadow-soft transition-colors hover:bg-aira-primary-dark"
        >
          <MapPinned className="size-5" />
          Cari Titik Air Alternatif
        </Link>
      )}

      <Link
        href="/assistant"
        className="inline-flex min-h-13.5 items-center justify-center gap-2 rounded-full border-2 border-aira-primary px-5 py-3 font-semibold text-aira-primary transition-colors hover:bg-aira-primary/10"
      >
        <MessageCircleHeart className="size-5" />
        Tanya AIRA Assistant
      </Link>

      <Link
        href="/masuk"
        className="inline-flex min-h-13.5 items-center justify-center gap-2 rounded-full bg-aira-sand px-5 py-3 font-semibold text-aira-primary transition-colors hover:bg-aira-sand/70"
      >
        <Bookmark className="size-5" />
        Masuk untuk Menyimpan Hasil
      </Link>

      <p className="text-center text-xs leading-relaxed text-aira-text/60">
        Riwayat perhitungan memerlukan akun. Hasil saat ini tersimpan
        sementara di sesi browser.
      </p>

      <Link
        href="/kalkulator-air"
        className="mt-1 inline-flex items-center justify-center gap-2 text-sm font-medium text-aira-text/70 underline underline-offset-4 hover:text-aira-primary"
      >
        <Pencil className="size-4" />
        Ubah Data Perhitungan
      </Link>
    </section>
  );
} 