import Link from "next/link";
import { Activity, ArrowRight, Home, MapPinPlus, Settings } from "lucide-react";

export default function MenuCepat({ adaHasil, jumlahCatatan, kontribusiMenunggu }) {
  const menu = [
    {
      href: "/dashboard/kondisi-air",
      icon: Home,
      judul: "Kondisi Air Rumah Tangga",
      meta: adaHasil ? "Lihat ringkasan dan riwayat" : "Belum ada hasil tersimpan",
    },
    {
      href: "/dashboard/monitoring",
      icon: Activity,
      judul: "Monitoring Kondisi Air",
      meta: `${jumlahCatatan} catatan manual`,
    },
    {
      href: "/dashboard/kontribusi",
      icon: MapPinPlus,
      judul: "Kontribusi Titik Air",
      meta: `${kontribusiMenunggu} menunggu verifikasi`,
    },
    {
      href: "/dashboard/pengaturan",
      icon: Settings,
      judul: "Pengaturan Akun",
      meta: "Informasi akun dan preferensi",
    },
  ];

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-aira-primary">Menu cepat</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-[96px] w-full min-w-0 items-start gap-3 rounded-3xl border border-aira-primary/10 bg-aira-bg p-5 text-left shadow-soft transition-all hover:-translate-y-1 hover:border-aira-primary/20 sm:gap-4 sm:p-6"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-aira-primary text-white">
                <Icon className="size-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-lg font-semibold leading-snug text-aira-primary">
                  {item.judul}
                </span>
                <span className="mt-1 block text-sm text-aira-text/70">{item.meta}</span>
              </span>
              <ArrowRight className="mt-1 size-5 shrink-0 text-aira-primary" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
