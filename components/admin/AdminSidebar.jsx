"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Droplets,
} from "lucide-react";

const menuItems = [
  {
    label: "Ringkasan & Riwayat",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Verifikasi Kontribusi",
    href: "/admin/verifikasi",
    icon: ClipboardCheck,
  },
  {
    label: "Kelola Titik Air",
    href: "/admin/titik-air",
    icon: Droplets,
  },
];

export default function AdminSidebar({ admin }) {
  const pathname = usePathname();

  return (
    <aside className="w-full space-y-3 lg:w-[240px] lg:shrink-0">

      {/* Profil Admin */}
      <div className="flex items-center gap-3 rounded-[22px] bg-white p-4 shadow-[0_8px_28px_-10px_rgba(23,107,120,0.22)]">

        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-aira-primary text-sm font-bold text-white">
          {admin.initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-aira-text">
            {admin.name}
          </p>

          <p className="text-[11px] text-aira-text/55">
            {admin.role}
          </p>
        </div>

      </div>

      {/* Navigasi Admin */}
      <nav
        aria-label="Navigasi admin"
        className="flex flex-col rounded-[22px] bg-white p-2 shadow-[0_8px_28px_-10px_rgba(23,107,120,0.22)]"
      >

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`
                flex items-center gap-3 rounded-[15px]
                px-3 py-3 text-[13px] font-semibold
                transition-all duration-200
                ${
                  isActive
                    ? "bg-aira-primary text-white shadow-sm"
                    : "text-aira-primary hover:bg-aira-sage/20"
                }
              `}
            >
              <Icon className="size-[17px] shrink-0" />

              <span>{item.label}</span>
            </Link>
          );
        })}

      </nav>

    </aside>
  );
} 