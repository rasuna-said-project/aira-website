import Link from "next/link";
import {
  Bookmark,
  MapPinned,
  MessageCircleHeart,
  Pencil,
} from "lucide-react";

const tombolUtama =
  "inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-aira-primary px-6 font-semibold text-white shadow-soft transition-colors hover:bg-aira-primary-dark";

const tombolOutline =
  "inline-flex min-h-13.5 items-center justify-center gap-2 rounded-full border-2 border-aira-primary px-6 py-4 font-semibold text-aira-primary transition-colors hover:bg-aira-primary/10";

// Card "Langkah Berikutnya": tindakan lanjutan setelah melihat hasil.
export default function HasilActions({ statusKey }) {
  return (
    <section
      className="flex flex-col gap-3 rounded-[28px] border border-aira-secondary/30 bg-aira-secondary/8 p-7"
      aria-labelledby="langkah-berikutnya"
    >
      <div>
        <h3
          id="langkah-berikutnya"
          className="font-heading text-xl font-bold text-aira-primary"
        >
          Langkah Berikutnya
        </h3>

        <p className="mt-1 text-sm text-aira-text/65">
          Pilih tindakan lanjutan setelah melihat hasil.
        </p>
      </div>

      {statusKey === "belum" ? (
        <>
          <Link href="/kalkulator-air" className={tombolUtama}>
            <Pencil className="size-5" aria-hidden="true" />
            Periksa Kembali Data
          </Link>

          <Link href="/navigasi-air" className={tombolOutline}>
            <MapPinned className="size-5" aria-hidden="true" />
            Cari Titik Air
          </Link>
        </>
      ) : (
        <Link href="/navigasi-air" className={tombolUtama}>
          <MapPinned className="size-5" aria-hidden="true" />
          Cari Titik Air Alternatif
        </Link>
      )}

      <Link href="/assistant" className={tombolOutline}>
        <MessageCircleHeart className="size-5" aria-hidden="true" />
        Tanya AIRA Assistant
      </Link>

      <Link
        href="/masuk"
        className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-aira-sand px-6 font-semibold text-aira-primary transition-colors hover:bg-aira-sand-border"
      >
        <Bookmark className="size-5" aria-hidden="true" />
        Masuk untuk Menyimpan Hasil
      </Link>

      <p className="text-center text-[13px] leading-relaxed text-aira-text/70">
        Riwayat perhitungan memerlukan akun. Hasil saat ini tersimpan
        sementara di sesi browser.
      </p>

      <Link
        href="/kalkulator-air"
        className="inline-flex min-h-11 items-center justify-center gap-1.5 self-center px-2 text-sm font-medium text-aira-text/70 underline hover:text-aira-primary"
      >
        <Pencil className="size-4" aria-hidden="true" />
        Ubah Data Perhitungan
      </Link>
    </section>
  );
}
