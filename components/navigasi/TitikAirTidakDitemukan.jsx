import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Ditampilkan bila id pada alamat /navigasi-air/[id] tidak ada di data.
// Tidak pernah menampilkan titik lain sebagai pengganti (tidak boleh ada informasi palsu).
export default function TitikAirTidakDitemukan() {
  return (
    <div className="grid min-h-[calc(100vh-72px)] place-items-center bg-aira-bg px-4 py-14">
      <div className="max-w-md rounded-[28px] border border-aira-primary/5 bg-white p-8 text-center shadow-soft">
        <h1 className="text-2xl font-bold text-aira-primary">Titik air tidak ditemukan</h1>
        <p className="mt-3 text-aira-text/75">
          Titik air yang Anda cari tidak ada dalam daftar. Kembali ke daftar untuk memilih titik air lain.
        </p>
        <Link
          href="/navigasi-air"
          className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-aira-primary px-6 py-3.5 font-semibold text-white transition-colors hover:bg-aira-primary-dark"
        >
          <ArrowLeft className="size-5" /> Kembali ke daftar
        </Link>
      </div>
    </div>
  );
}
