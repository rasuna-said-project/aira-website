import Link from "next/link";
import { Droplets } from "lucide-react";

// Tampilan bila pengguna belum punya perhitungan tersimpan.
export default function StatusAirKosong() {
  return (
    <section className="rounded-[28px] border border-aira-primary/10 bg-white p-7 text-center shadow-soft sm:p-9">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-aira-sage/35 text-aira-primary">
        <Droplets />
      </span>
      <h2 className="mt-4 text-xl font-semibold text-aira-primary">Belum ada perhitungan tersimpan</h2>
      <p className="mt-2 text-aira-text/70">
        Hitung kondisi air pertama Anda untuk melihat estimasi cadangan, kebutuhan harian, dan langkah yang disarankan.
      </p>
      <Link
        href="/kalkulator-air"
        className="mt-5 inline-flex rounded-full bg-aira-primary px-7 py-3.5 font-semibold text-white transition-colors hover:bg-aira-primary-dark"
      >
        Mulai perhitungan
      </Link>
    </section>
  );
}
