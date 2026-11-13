"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardCheck, Droplets } from "lucide-react";

const menuItems = [
  { label: "Ringkasan & Riwayat", href: "/admin", icon: LayoutDashboard },
  { label: "Verifikasi Kontribusi", href: "/admin/verifikasi", icon: ClipboardCheck },
  { label: "Kelola Titik Air", href: "/admin/kelola-titik-air", icon: Droplets },
];

export default function AdminSidebar({ admin }) {
  const pathname = usePathname();

  return (
    <aside className="w-full min-w-0 space-y-4">
      {/* Profil Admin */}
      <div className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-4 shadow-soft">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-aira-primary text-sm font-bold text-white">
          {admin.initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-aira-text">
            {admin.name || "Admin AIRA"}
          </p>
          <p className="mt-0.5 text-[11px] leading-tight text-aira-text/50">
            Peninjau & pengelola data
          </p>
        </div>
      </div>

      {/* Navigasi Admin */}
      <nav
        aria-label="Navigasi admin"
        className="flex flex-row gap-1 overflow-x-auto rounded-[20px] bg-white p-2.5 shadow-soft lg:flex-col lg:overflow-visible"
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold leading-snug transition-colors lg:shrink ${
                isActive
                  ? "bg-aira-primary text-white"
                  : "text-aira-primary hover:bg-aira-sage/20"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}