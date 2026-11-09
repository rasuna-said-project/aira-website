import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import { logout } from "@/app/actions/auth";
import DashboardProfile from "@/components/dashboard/DashboardProfile";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const publicLinks = [
  { label: "Beranda", href: "/" },
  { label: "Kalkulator", href: "/kalkulator-air" },
  { label: "Navigasi Air", href: "/navigasi-air" },
  { label: "AIRA Assistant", href: "/assistant" },
];

export default function DashboardLayout({ profile, children }) {
  const initials = (profile?.full_name || "AIRA")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-full bg-aira-bg">

      {/* ================================== */}
      {/* HEADER DASHBOARD */}
      {/* ================================== */}

      <header className="sticky top-0 z-40 border-b border-aira-primary/10 bg-aira-bg/95 backdrop-blur">
        <div className="mx-auto flex min-h-[62px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            href="/"
            aria-label="AIRA - Beranda"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/images/aira-logo.svg"
              alt="AIRA"
              width={140}
              height={50}
              priority
              className="h-9 w-auto object-contain sm:h-10"
            />
          </Link>

          {/* Navigasi publik desktop */}
          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-1 xl:flex"
          >
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  rounded-full px-3 py-2 text-sm font-medium
                  transition-colors
                  ${
                    link.href === "/kalkulator-air"
                      ? "bg-gradient-to-r from-aira-primary to-aira-secondary text-white shadow-sm"
                      : "text-aira-text/75 hover:bg-aira-sand"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Identitas dan logout */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            {/* Dashboard button */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-aira-primary py-1.5 pl-1.5 pr-3 text-xs font-semibold text-white transition-colors hover:bg-aira-primary-dark sm:gap-2.5 sm:pr-5 sm:text-sm"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-white text-[10px] font-bold text-aira-primary sm:size-8">
                {initials || "AR"}
              </span>

              <LayoutDashboard className="hidden size-4 sm:block" />

              Dashboard
            </Link>

            {/* Logout */}
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-aira-primary/25 px-3 py-2 text-xs font-medium text-aira-primary transition-colors hover:bg-aira-sand sm:px-4 sm:text-sm"
              >
                <LogOut className="size-3.5 sm:size-4" />

                <span>Logout</span>
              </button>
            </form>

          </div>
        </div>
      </header>

      {/* ================================== */}
      {/* DASHBOARD CONTENT */}
      {/* ================================== */}

      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-start gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-7 lg:px-8">

        {/* Sidebar */}
        <aside className="flex flex-col gap-3 lg:sticky lg:top-[86px]">
          <DashboardProfile profile={profile} />

          <DashboardSidebar />
        </aside>

        {/* Main content */}
        <section className="min-w-0">
          {children}
        </section>

      </div>
    </div>
  );
} 