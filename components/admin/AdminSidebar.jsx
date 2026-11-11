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
    <aside className="w-full shrink-0 space-y-3 md:w-[186px]"> 
      {/* Profil Admin */}
      <div className="flex items-center gap-2.5 rounded-[20px] bg-white px-3 py-3 shadow-[0_8px_28px_-10px_rgba(23,107,120,0.22)]">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-aira-primary text-xs font-bold text-white">
          {admin.initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-aira-text">
            {admin.name}
          </p>

          <p className="mt-0.5 text-[9px] leading-tight text-aira-text/55">
            {admin.role}
          </p>
        </div>
      </div>

      {/* Navigasi Admin */}
      <nav
        aria-label="Navigasi admin"
        className="flex flex-col rounded-[20px] bg-white p-2 shadow-[0_8px_28px_-10px_rgba(23,107,120,0.22)]"
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
                flex items-center gap-2 rounded-[14px]
                px-2.5 py-3 text-[11px] font-semibold
                transition-colors duration-200
                ${
                  isActive
                    ? "bg-aira-primary text-white"
                    : "text-aira-primary hover:bg-aira-sage/20"
                }
              `}
            >
              <Icon className="size-[14px] shrink-0" />
              <span className="leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 