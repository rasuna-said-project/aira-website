"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  MapPinPlus,
  Settings,
} from "lucide-react";

const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Monitoring Kondisi Air",
    href: "/dashboard/monitoring",
    icon: Activity,
  },
  {
    label: "Kontribusi Titik Air",
    href: "/dashboard/kontribusi",
    icon: MapPinPlus,
  },
  {
    label: "Pengaturan Akun",
    href: "/dashboard/pengaturan",
    icon: Settings,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi dashboard"
      className="rounded-2xl bg-white p-2 shadow-[0_5px_20px_rgba(23,107,120,0.08)]"
    >
      <ul className="space-y-1">
        {sidebarLinks.map((item) => {
          const Icon = item.icon;

          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`
                  flex min-h-11 items-center gap-3
                  rounded-xl px-3 py-3
                  text-sm font-medium
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-aira-primary text-white shadow-sm"
                      : "text-aira-primary hover:bg-aira-sage/20"
                  }
                `}
              >
                <Icon className="size-[17px] shrink-0" />

                <span className="leading-snug">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
} 