import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { AvailabilityBadge, VerificationBadge } from "@/components/StatusBadge";
import { LABEL_KECOCOKAN } from "@/lib/titikAir";

export default function KartuTitikAir({ titik, tingkat }) {
  return (
    <article className="flex flex-col rounded-3xl border border-aira-primary/5 bg-white p-5 shadow-soft transition-transform hover:-translate-y-1 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-aira-text/55">
              {titik.type}
            </span>

            {titik.isSimulation && (
              <span className="rounded-full bg-aira-secondary/15 px-2.5 py-0.5 text-xs font-semibold text-aira-primary">
                Data simulasi
              </span>
            )}
          </div>

          <h2 className="mt-1 text-xl font-semibold leading-snug text-aira-primary">
            {titik.name}
          </h2>
        </div>

        {tingkat && (
          <span className="shrink-0 rounded-full bg-aira-sand px-3 py-1 text-sm font-semibold text-aira-primary">
            {LABEL_KECOCOKAN[tingkat]}
          </span>
        )}
      </div>

      <p className="mt-3 flex gap-2 text-[15px] text-aira-text/80">
        <MapPin className="mt-1 size-4 shrink-0 text-aira-peach" /> {titik.address || "Informasi alamat belum tersedia"}
      </p>

      <dl className="mt-5 grid grid-cols-1 gap-4 rounded-2xl bg-aira-bg p-4 min-[430px]:grid-cols-2">
        <div>
          <dt className="mb-1.5 text-xs text-aira-text/60">Ketersediaan</dt>
          <dd>
            <AvailabilityBadge v={titik.availability} />
          </dd>
        </div>
        <div>
          <dt className="mb-1.5 text-xs text-aira-text/60">Verifikasi data</dt>
          <dd>
            <VerificationBadge v={titik.verification} />
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-sm text-aira-text/70">
          <Clock className="size-4" /> {titik.updated}
        </span>
        <Link
          href={`/navigasi-air/${titik.id}`}
          className="group inline-flex min-h-[48px] items-center gap-2 rounded-full bg-aira-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-aira-primary-dark"
        >
          Lihat Detail <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
