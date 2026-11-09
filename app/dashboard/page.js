import Link from "next/link"; 
import {
  Activity,
  MapPinPlus,
  Settings,
  ArrowUpRight,
  Droplets,
} from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";

const dashboardFeatures = [
  {
    title: "Monitoring Kondisi Air",
    description:
      "Pantau perkembangan cadangan air dan riwayat pembaruan kondisi air rumah tangga.",
    href: "/dashboard/monitoring",
    icon: Activity,
    label: "Lihat Monitoring",
  },
  {
    title: "Kontribusi Titik Air",
    description:
      "Bagikan informasi sumber air yang Anda ketahui untuk membantu masyarakat sekitar.",
    href: "/dashboard/kontribusi",
    icon: MapPinPlus,
    label: "Lihat Kontribusi",
  },
  {
    title: "Pengaturan Akun",
    description:
      "Kelola informasi profil dan preferensi penggunaan akun AIRA Anda.",
    href: "/dashboard/pengaturan",
    icon: Settings,
    label: "Kelola Akun",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Page Header */}
      <DashboardPageHeader
        title="Dashboard AIRA"
        description="Selamat datang di ruang pengelolaan ketahanan air rumah tangga Anda."
      />

      {/* Welcome Card */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-aira-primary to-[#238B91] p-6 text-white shadow-soft sm:p-8">

        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-white/15">
            <Droplets className="size-6" />
          </div>

          <h2 className="text-xl font-bold sm:text-2xl">
            Bersama AIRA, Wujudkan Ketahanan Air
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            Kelola informasi kondisi air rumah tangga,
            pantau perkembangan cadangan air, dan
            berkontribusi dalam menyediakan informasi
            titik air bagi masyarakat.
          </p>
        </div>

        {/* Decorative circle */}
        <div className="pointer-events-none absolute -right-10 -top-14 size-52 rounded-full border-[28px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 right-24 size-48 rounded-full bg-white/5" />

      </section>

      {/* Feature Navigation */}
      <section className="space-y-4">

        <div>
          <h2 className="text-lg font-bold text-aira-primary">
            Kelola Aktivitas Anda
          </h2>

          <p className="mt-1 text-sm text-aira-text/60">
            Pilih layanan AIRA yang ingin Anda akses.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

          {dashboardFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group flex min-h-[210px] flex-col rounded-2xl border border-aira-primary/10 bg-white p-5 shadow-[0_5px_20px_rgba(23,107,120,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-aira-sage hover:shadow-soft"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-aira-sage/25 text-aira-primary">
                    <Icon className="size-5" />
                  </div>

                  <ArrowUpRight className="size-5 text-aira-text/35 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-aira-primary" />
                </div>

                <div className="mt-5">
                  <h3 className="font-semibold text-aira-primary">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-aira-text/65">
                    {feature.description}
                  </p>
                </div>

                <span className="mt-auto pt-4 text-sm font-semibold text-aira-primary">
                  {feature.label}
                </span>
              </Link>
            );
          })}

        </div>
      </section>

    </div>
  );
} 