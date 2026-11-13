"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, LogOut, Menu, X } from "lucide-react";

import LogoutDialog from "@/components/LogoutDialog";

const links = [
  { label: "Beranda", href: "/" },
  { label: "Kalkulator", href: "/kalkulator-air", primary: true },
  { label: "Navigasi Air", href: "/navigasi-air" },
  { label: "AIRA Assistant", href: "/assistant" },
];

const primaryClass =
  "bg-gradient-to-r from-aira-primary to-aira-secondary text-white shadow-sm hover:from-aira-primary-dark hover:to-aira-primary";

function isActive(pathname, href) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

// `sesi` berasal dari app/layout.js:
// null bila belum login, atau { inisial, href } bila sudah login.

export default function Navbar({ sesi = null }) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState(false);

  const tutupKonfirmasi = useCallback(
    () => setKonfirmasi(false),
    []
  );

  const handleLogoClick = () => {
    setOpen(false);

    if (pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Dashboard pengguna memiliki header khusus.
  // Mencegah Navbar global muncul dua kali.
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  // Kondisi halaman admin.
  const isAdminPage = pathname.startsWith("/admin");

  // Inisial untuk tombol Panel Admin.
  const adminInitials = "AA";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-aira-primary/10 bg-aira-bg/90 backdrop-blur">

        <div className="mx-auto flex h-18 max-w-310 items-center justify-between px-5">

          {/* ================================== */}
          {/* LOGO AIRA */}
          {/* ================================== */}

          <Link
            href="/"
            onClick={handleLogoClick}
            aria-label="AIRA — Beranda"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/images/aira-logo.svg"
              alt=""
              width={140}
              height={50}
              priority
              className="h-10 w-auto object-contain sm:h-11"
            />
          </Link>

          {/* ================================== */}
          {/* NAVIGASI DESKTOP */}
          {/* ================================== */}

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Navigasi utama"
          >
            {links.map((link) => {
              const active = isActive(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-medium transition-all ${
                    link.primary
                      ? `${primaryClass} ${
                          active
                            ? "ring-2 ring-aira-secondary ring-offset-2 ring-offset-aira-bg"
                            : ""
                        }`
                      : active
                        ? "bg-aira-primary/10 text-aira-primary"
                        : "text-aira-text/80 hover:bg-aira-sand"
                  }`}
                >
                  {link.primary && (
                    <Calculator className="size-4" />
                  )}

                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ================================== */}
          {/* AKSI AKUN DESKTOP */}
          {/* ================================== */}

          <div className="hidden items-center gap-2 lg:flex">

            {isAdminPage ? (

              // TAMPILAN KHUSUS ADMIN
              <>
                {/* Panel Admin */}
                <div
                  className="flex items-center gap-2.5 rounded-full bg-aira-primary py-1.5 pl-1.5 pr-5 font-semibold text-white"
                  aria-label="Panel Admin"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-white text-sm font-bold text-aira-primary">
                    {adminInitials}
                  </span>

                  <span className="text-sm">
                    Panel Admin
                  </span>
                </div>

                {/* Logout Admin */}
                <button
                  type="button"
                  onClick={() => setKonfirmasi(true)}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-aira-primary/25 px-4 py-2 text-sm font-semibold text-aira-primary transition-colors hover:bg-aira-primary/10"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </>

            ) : sesi ? (

              // TAMPILAN PENGGUNA YANG SUDAH LOGIN
              <>
                <Link
                  href={sesi.href}
                  className="flex items-center gap-2.5 rounded-full bg-aira-primary/10 py-1.5 pl-1.5 pr-5 font-semibold text-aira-primary transition-colors hover:bg-aira-primary/15"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-aira-primary text-sm font-bold text-white">
                    {sesi.inisial}
                  </span>

                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={() => setKonfirmasi(true)}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-aira-primary/25 px-4 py-2 text-sm font-semibold text-aira-primary transition-colors hover:bg-aira-primary/10"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </>
              
            ) : (

              // TAMPILAN PENGGUNA BELUM LOGIN
              <>
                <Link
                  href="/masuk"
                  className="rounded-full px-5 py-2.5 text-[15px] font-semibold text-aira-primary transition-colors hover:bg-aira-primary/10"
                >
                  Masuk
                </Link>

                <Link
                  href="/daftar"
                  className="rounded-full bg-aira-primary px-5 py-2.5 text-[15px] font-semibold text-white shadow-soft transition-colors hover:bg-aira-primary-dark"
                >
                  Daftar
                </Link>
              </>
            )}

          </div>

          {/* ================================== */}
          {/* TOMBOL MENU MOBILE */}
          {/* ================================== */}

          {isAdminPage ? (

            // Logout khusus admin pada layar mobile.
            <button
              type="button"
              onClick={() => setKonfirmasi(true)}
              className="inline-flex items-center gap-2 rounded-full border border-aira-primary/25 px-3 py-2 text-xs font-semibold text-aira-primary transition-colors hover:bg-aira-primary/10 lg:hidden"
            >
              <LogOut className="size-4" />
              Logout
            </button>

          ) : (

            <button
              type="button"
              className="grid size-11 place-items-center rounded-full hover:bg-aira-sand lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X /> : <Menu />}
            </button>

          )}

        </div>

        {/* ================================== */}
        {/* NAVIGASI MOBILE */}
        {/* ================================== */}

        {open && !isAdminPage && (
          <div
            id="mobile-navigation"
            className="flex max-h-[calc(100dvh-72px)] flex-col overflow-y-auto border-t border-aira-primary/10 bg-aira-bg px-4 pb-5 pt-2 lg:hidden"
          >

            {links.map((link) => {
              const active = isActive(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 text-[17px] font-medium ${
                    link.primary
                      ? `my-2 rounded-full px-4 py-3 ${primaryClass}`
                      : `border-b border-aira-primary/5 py-3.5 ${
                          active ? "text-aira-primary" : ""
                        }`
                  }`}
                >
                  {link.primary && (
                    <Calculator className="size-4" />
                  )}

                  {link.label}
                </Link>
              );
            })}

            {/* Aksi akun mobile */}
            <div className="flex gap-3 pt-4">

              {sesi ? (
                <>
                  <Link
                    href={sesi.href}
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-full bg-aira-primary py-3 text-center font-semibold text-white"
                  >
                    Dashboard saya
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setKonfirmasi(true);
                    }}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-aira-primary py-3 font-semibold text-aira-primary"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/masuk"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-full border-2 border-aira-primary py-3 text-center font-semibold text-aira-primary"
                  >
                    Masuk
                  </Link>

                  <Link
                    href="/daftar"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-full bg-aira-primary py-3 text-center font-semibold text-white"
                  >
                    Daftar
                  </Link>
                </>
              )}

            </div>
          </div>
        )}

      </header>

      {/* ================================== */}
      {/* DIALOG KONFIRMASI LOGOUT */}
      {/* ================================== */}

      <LogoutDialog
        open={konfirmasi}
        onClose={tutupKonfirmasi}
      />

    </>
  );
} 