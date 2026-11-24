import Image from "next/image";
import { ABOUT_CONTENT as c } from "@/data/home";

// Latar identik untuk semua foto tim: gradasi sage ke ice, siluet tetes air, gelembung, dan pita gelombang.
function TeamBackdrop() {
  return (
    <svg
      viewBox="0 0 370 450"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
      aria-hidden="true"
      focusable="false"
    >
      <svg x="55" y="70" width="260" height="325" viewBox="0 0 64 80">
        <path d="M32 2C26 18 6 30 6 50a26 26 0 0052 0C58 30 38 18 32 2z" fill="#94d2bd" fillOpacity="0.4" />
      </svg>
      <circle cx="318" cy="52" r="14" fill="#4ea8de" fillOpacity="0.25" />
      <circle cx="286" cy="88" r="8" fill="#4ea8de" fillOpacity="0.25" />
      <circle cx="344" cy="98" r="6" fill="#4ea8de" fillOpacity="0.25" />
      <path d="M0 392C60 372 110 412 185 392S310 372 370 394V450H0z" fill="#94d2bd" fillOpacity="0.4" />
      <path d="M0 414C70 396 120 432 195 414S316 400 370 418V450H0z" fill="#4ea8de" fillOpacity="0.3" />
    </svg>
  );
}

// Bagian "Tentang Kami" + "Tim Pengembang" di Beranda (A01) sesuai Figma Make.
export default function AboutSection() {
  return (
    <section id={c.id} className="scroll-mt-24 bg-aira-bg">
      <div className="mx-auto max-w-310 px-4 py-16 sm:px-5 sm:py-20">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-aira-peach">{c.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-aira-primary sm:text-4xl">{c.title}</h2>
            {c.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mt-4 leading-relaxed text-aira-text/80">
                {p}
              </p>
            ))}
          </div>

          <div className="relative h-64 sm:h-72 lg:col-span-6 lg:h-auto">
            <div className="grid h-full grid-rows-[1fr_auto] gap-2 lg:absolute lg:inset-0">
              <div className="grid min-h-0 grid-cols-2 grid-rows-2 gap-3">
                {c.mosaic.map((m) => (
                  <div key={m.src} className={`relative min-h-0 overflow-hidden bg-aira-sage/40 shadow-soft ${m.cls}`}>
                    <Image
                      src={m.src}
                      alt={m.alt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 300px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="w-full text-center text-xs leading-normal text-aira-text/55">{c.photoCaption}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-aira-primary/10 pt-10 sm:mt-14 sm:pt-12">
          <h3 className="text-2xl font-semibold tracking-normal text-aira-primary sm:text-3xl">{c.teamTitle}</h3>
          <p className="mt-3 leading-normal text-aira-text/80">{c.teamDesc}</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {c.team.map((p) => (
              <article
                key={p.name}
                className="rounded-3xl border border-aira-primary/5 bg-white p-3 shadow-soft transition-transform hover:-translate-y-1 sm:p-4"
              >
                <div className="relative aspect-37/45 w-full overflow-hidden rounded-2xl bg-linear-to-b from-aira-sage/30 to-aira-bg">
                  <TeamBackdrop />
                  <Image
                    src={p.photo}
                    alt={`Foto ${p.name}, ${p.role}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 280px"
                    className="object-contain object-bottom"
                  />
                </div>
                <div className="mt-4 flex min-h-12 items-center justify-center sm:min-h-14">
                  <h4 className="wrap-break-word text-center text-base font-semibold tracking-normal text-aira-primary sm:text-lg">
                    {p.name}
                  </h4>
                </div>
                <p
                  className={`mt-1 text-center text-sm leading-normal ${
                    p.lead ? "font-bold text-aira-coral-dark" : "text-aira-text/65"
                  }`}
                >
                  {p.role}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
