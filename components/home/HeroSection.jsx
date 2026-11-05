import Image from "next/image";
import { ArrowRight, MapPinned } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import HeroStatusCard from "@/components/home/HeroStatusCard";
import { HERO_CONTENT as c } from "@/data/home";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-aira-bg">
      {/* Dekorasi latar */}
      <div
        className="absolute -left-24 -top-24 size-105 rounded-[48%_52%_60%_40%] bg-aira-sage/40 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-30 top-40 size-95 rounded-[60%_40%_50%_50%] bg-aira-peach/25 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-310 items-center gap-10 px-4 pb-16 pt-10 sm:px-5 sm:pb-20 sm:pt-14 lg:grid-cols-12 lg:gap-12 lg:pt-20">
        {/* Teks */}
        <div className="fade-up lg:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-aira-primary shadow-soft">
            <span className="size-2 rounded-full bg-aira-sage" />
            {c.badge}
          </span>

          <h1 className="mt-5 text-[2.25rem] font-bold leading-[1.1] text-aira-primary min-[390px]:text-[2.5rem] sm:mt-6 sm:text-5xl lg:text-[3.5rem]">
            {c.title}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-aira-text/80 sm:mt-6 sm:text-lg">
            {c.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3 sm:mt-9">
            <ButtonLink href={c.primaryCta.href} className="group">
              {c.primaryCta.label}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href={c.secondaryCta.href} variant="outline">
              <MapPinned className="size-5" />
              {c.secondaryCta.label}
            </ButtonLink>
          </div>

          <p className="mt-5 text-sm text-aira-text/65 sm:mt-6">{c.note}</p>
        </div>

        {/* Gambar */}
        <div className="fade-up relative lg:col-span-6" style={{ animationDelay: "0.12s" }}>
          <div className="relative aspect-[5/4.4] overflow-hidden rounded-[2rem_4rem_2rem_4rem] bg-aira-sage/40 shadow-soft sm:rounded-[2.5rem_6rem_2.5rem_6rem]">
            <Image
              src={c.image.src}
              alt={c.image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            {c.image.credit && (
  <p className="absolute right-3 top-3 rounded-full bg-black/45 px-3 py-1 text-[11px] text-white backdrop-blur-sm">
    Foto:{" "}
    <a
      href={c.image.credit.photographerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2"
    >
      {c.image.credit.photographer}
    </a>{" "}
    di{" "}
    <a
      href={c.image.credit.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2"
    >
      {c.image.credit.source}
    </a>
  </p>
)}
          </div>
        </div>
      </div>
    </section>
  );
} 