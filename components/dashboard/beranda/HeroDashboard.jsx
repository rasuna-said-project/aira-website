import Link from "next/link";

export default function HeroDashboard({ tanggal, salam, nama }) {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-aira-primary p-6 text-white shadow-soft sm:p-10">
      <div
        className="absolute -right-10 -top-16 size-64 rounded-[55%_45%_40%_60%] bg-aira-sage/25"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 right-32 size-48 rounded-[40%_60%_50%_50%] bg-aira-peach/25"
        aria-hidden="true"
      />

      <div className="relative">
        <p className="text-sm text-white/75">{tanggal}</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
          {salam}, {nama}
        </h1>
        <p className="mt-3 max-w-xl leading-relaxed text-white/85">
          Cadangan air keluarga Anda perlu diperhatikan hari ini. Perbarui catatan agar AIRA bisa memberi saran yang
          tepat.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/kalkulator-air"
            className="inline-flex min-h-[48px] items-center rounded-full bg-aira-peach px-6 py-3.5 font-bold text-aira-danger-ink transition hover:brightness-105"
          >
            Perbarui Kondisi Air
          </Link>
          <Link
            href="/navigasi-air"
            className="inline-flex min-h-[48px] items-center rounded-full border-2 border-white/60 px-6 py-3.5 font-semibold transition-colors hover:bg-white/10"
          >
            Cari Titik Air
          </Link>
        </div>
      </div>
    </section>
  );
}
