import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeatureCard({ icon: Icon, title, desc, cta, href, tint }) {
  return (
    <article
      className={`${tint} flex flex-col rounded-3xl border border-aira-primary/5 p-6 shadow-soft transition-transform hover:-translate-y-1 sm:p-8`}
    >
      <span className="grid size-14 place-items-center rounded-2xl bg-aira-primary text-white">
        <Icon className="size-7" />
      </span>
      <h3 className="mt-6 text-[1.4rem] font-semibold text-aira-primary">{title}</h3>
      <p className="mt-3 flex-1 leading-relaxed text-aira-text/80">{desc}</p>
      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 self-start font-semibold text-aira-primary transition-all hover:gap-3"
      >
        {cta} <ArrowRight className="size-4" />
      </Link>
    </article>
  );
} 