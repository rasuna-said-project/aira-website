
import Image from "next/image";
import Link from "next/link";

const footerGroups = [
  {
    title: "Jelajahi AIRA",
    links: [
      { label: "Beranda", href: "/" },
      {
        label: "Kalkulator Ketahanan Air",
        href: "/kalkulator-air",
      },
      {
        label: "Navigasi Air",
        href: "/navigasi-air",
      },
      {
        label: "AIRA Assistant",
        href: "/assistant",
      },
    ],
  },
  {
    title: "Untuk pengguna",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      {
        label: "Kondisi Air Rumah Tangga",
        href: "/dashboard/monitoring",
      },
      {
        label: "Kontribusi Titik Air",
        href: "/dashboard/kontribusi",
      },
      {
        label: "Pengaturan Akun",
        href: "/dashboard/pengaturan",
      },
    ],
  },
];

// Wave decoration
function FooterWave() {
  return (
    <div
      className="bg-aira-primary leading-[0]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block h-14 w-full sm:h-20"
      >
        <path
          d="M0 0h1440v30C1260 80 1080 80 900 46S540 0 360 28 90 70 0 56z"
          fill="#F9FBFB"
        />
      </svg>
    </div>
  );
}

// Footer brand
function FooterBrand() {
  return (
    <div className="space-y-5">
      <Image
        src="/images/aira-logo-white.svg"
        alt="AIRA — Access, Intelligence, Resilience, Action"
        width={230}
        height={90}
        className="h-16 sm:h-20 w-auto object-contain"
      />

      <p className="max-w-sm text-sm sm:text-base leading-relaxed text-white/80">
        Smart Water Resilience for Every Woman.
        Platform digital ketahanan air, sanitasi, dan
        respons krisis untuk perempuan dan keluarga
        di wilayah rawan kekeringan.
      </p>
    </div>
  );
}

// Main footer
export default function Footer() {
  return (
    <>
      {/* Wave transition */}
      <FooterWave />

      <footer className="bg-aira-primary text-white">

        {/* Footer main content */}
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-5 py-12 sm:py-14 md:grid-cols-12 md:gap-8">

          {/* Brand section */}
          <div className="md:col-span-6">
            <FooterBrand />
          </div>

          {/* Navigation sections */}
          {footerGroups.map((group) => (
            <div
              key={group.title}
              className="md:col-span-3"
            >
              <h4 className="mb-4 font-semibold text-base">
                {group.title}
              </h4>

              <ul className="space-y-2.5 text-sm sm:text-[15px] text-white/80">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block transition-colors duration-200 hover:text-white hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Copyright section */}
        <div className="border-t border-white/15 px-5 py-5 text-center">
          <p className="text-xs sm:text-sm leading-relaxed text-white/70">
            © 2026 AIRA. Hasil perhitungan bersifat estimasi
            dan bukan jaminan ketersediaan atau keamanan air minum.
          </p>
        </div>

      </footer>
    </>
  );
} 