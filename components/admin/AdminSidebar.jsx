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
    href: "/admin/kelola-titik-air",
    icon: Droplets,
  },
];

export default function AdminSidebar({ admin }) {
  const pathname = usePathname();

  return (
    <aside className="w-full min-w-0 space-y-3 min-[700px]:w-[124px]">

      {/* Profil Admin */}
      <div className="
        flex items-center gap-2
        rounded-[16px] bg-white
        px-2.5 py-2.5
        shadow-soft
      ">
        <div className="
          flex size-8 shrink-0 items-center
          justify-center rounded-full
          bg-aira-primary text-[10px]
          font-bold text-white
        ">
          {admin.initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[9px] font-semibold text-aira-text">
            Admin AIRA
          </p>

          <p className="text-[7px] leading-tight text-aira-text/50">
            Peninjau & pengelola data
          </p>
        </div>
      </div>

      {/* Navigasi Admin */}
      <nav
        aria-label="Navigasi admin"
        className="
          flex flex-col gap-0.5
          rounded-[16px] bg-white
          p-1.5 shadow-soft
        "
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
                flex items-center gap-1.5
                rounded-[10px] px-2 py-2
                text-[8px] font-semibold
                leading-tight transition-colors
                ${
                  isActive
                    ? "bg-aira-primary text-white"
                    : "text-aira-primary hover:bg-aira-sage/20"
                }
              `}
            >
              <Icon className="size-3 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 