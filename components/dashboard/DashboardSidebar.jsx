"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Home,
  LayoutDashboard,
  MapPinPlus,
  Settings,
} from "lucide-react";

// `short` dipakai pada tampilan mobile (menu geser horizontal).
const sidebarLinks = [
  { label: "Dashboard", short: "Ringkasan", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Kondisi Air Rumah Tangga", short: "Rumah Tangga", href: "/dashboard/kondisi-air", icon: Home },
  { label: "Monitoring Kondisi Air", short: "Monitoring", href: "/dashboard/monitoring", icon: Activity },
  { label: "Kontribusi Titik Air", short: "Kontribusi", href: "/dashboard/kontribusi", icon: MapPinPlus },
  { label: "Pengaturan Akun", short: "Akun", href: "/dashboard/pengaturan", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Menu dashboard"
      className="-mx-4 flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:-mx-5 sm:px-5 lg:mx-0 lg:flex-col lg:rounded-3xl lg:border lg:border-aira-primary/5 lg:bg-white lg:p-3 lg:px-3 lg:pb-3 lg:shadow-soft"
    >
      {sidebarLinks.map((item) => {
        const Icon = item.icon;
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-[48px] shrink-0 items-center gap-3 rounded-full px-4 py-3 text-[15px] font-semibold transition-colors lg:rounded-2xl ${
              active
                ? "bg-aira-primary text-white"
                : "bg-white text-aira-primary hover:bg-aira-primary/10 lg:bg-transparent"
            }`}
          >
            <Icon className="size-5" />
            <span className="lg:hidden">{item.short}</span>
            <span className="hidden text-left leading-snug lg:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
