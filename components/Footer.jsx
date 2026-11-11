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
        href: "/dashboard/kondisi-air",
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
function FooterWave({ fill }) {
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
          fill={fill}
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
        className="h-16 w-auto object-contain sm:h-20"
      />

      <p className="max-w-sm text-sm leading-relaxed text-white/80 sm:text-base">
        Smart Water Resilience for Every Woman.
        Platform digital ketahanan air, sanitasi, dan
        respons krisis untuk perempuan dan keluarga
        di wilayah rawan kekeringan.
      </p>
    </div>
  );
}

// Main footer
export default function Footer({ waveFill = "#F9FBFB" }) {
  return (
    <>
      {/* Wave transition */}
      <FooterWave fill={waveFill} />

      <footer className="bg-aira-primary text-white">

        {/* Footer main content */}
        <div
          className="
            mx-auto grid w-full max-w-[1240px]
            grid-cols-1 gap-8
            px-5 py-10
            sm:grid-cols-2 sm:gap-8 sm:py-12
            lg:grid-cols-4 lg:gap-8 lg:py-14
          "
        >

          {/* Brand section */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-2">
            <FooterBrand />
          </div>

          {/* Navigation sections */}
          {footerGroups.map((group) => (
            <div
              key={group.title}
              className="min-w-0"
            >
              <h4 className="mb-4 text-base font-semibold">
                {group.title}
              </h4>

              <ul className="space-y-2.5 text-sm text-white/80 sm:text-[15px]">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="
                        inline-block max-w-full break-words
                        underline-offset-4
                        transition-colors duration-200
                        hover:text-white hover:underline
                        focus-visible:outline-2
                        focus-visible:outline-offset-4
                        focus-visible:outline-white
                      "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
        {/* Penutup Footer main content */}

        {/* Copyright section */}
        <div className="border-t border-white/15 px-5 py-5 text-center">
          <p className="text-xs leading-relaxed text-white/70 sm:text-sm">
            © 2026 AIRA. Hasil perhitungan bersifat estimasi
            dan bukan jaminan ketersediaan atau keamanan air minum.
          </p>
        </div>

      </footer>
    </>
  );
}
