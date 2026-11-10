"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calculator, LogOut, Menu, X } from "lucide-react";

import { logout } from "@/app/actions/auth";

const links = [
  { label: "Beranda", href: "/" },
  { label: "Kalkulator", href: "/kalkulator-air", primary: true },
  { label: "Navigasi Air", href: "/navigasi-air" },
  { label: "AIRA Assistant", href: "/assistant" },
];

const primaryClass =
  "bg-gradient-to-r from-aira-primary to-aira-secondary text-white shadow-sm hover:from-aira-primary-dark hover:to-aira-primary";

// Header Dashboard User (versi login dari Navbar): tombol Dashboard + Logout dengan konfirmasi.
export default function DashboardHeader({ inisial }) {
  const [open, setOpen] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const tombolBatal = useRef(null);

  useEffect(() => {
    if (!konfirmasi) return;
    tombolBatal.current?.focus();
    const onKey = (e) => e.key === "Escape" && setKonfirmasi(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [konfirmasi]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-aira-primary/10 bg-aira-bg/90 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-[1240px] items-center justify-between px-5">
          <Link href="/" aria-label="AIRA — Beranda" className="flex items-center">
            <Image
              src="/images/aira-logo.svg"
              alt=""
              width={140}
              height={50}
              priority
              className="h-10 w-auto object-contain sm:h-11"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-medium transition-all ${
                  link.primary ? primaryClass : "text-aira-text/80 hover:bg-aira-sand"
                }`}
              >
                {link.primary && <Calculator className="size-4" />}
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 rounded-full bg-aira-primary py-1.5 pl-1.5 pr-5 font-semibold text-white transition-colors"
            >
              <span className="grid size-9 place-items-center rounded-full bg-white text-sm font-bold text-aira-primary">
                {inisial}
              </span>
              Dashboard
            </Link>

            <button
              type="button"
              onClick={() => setKonfirmasi(true)}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-aira-primary/25 px-4 py-2 text-sm font-semibold text-aira-primary transition-colors hover:bg-aira-primary/10"
            >
              <LogOut className="size-4" /> Logout
            </button>
          </div>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-full hover:bg-aira-sand lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-navigation-dashboard"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div
            id="mobile-navigation-dashboard"
            className="flex max-h-[calc(100dvh-72px)] flex-col overflow-y-auto border-t border-aira-primary/10 bg-aira-bg px-4 pb-5 pt-2 lg:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 text-left text-[17px] font-medium ${
                  link.primary
                    ? `my-2 rounded-full px-4 py-3 ${primaryClass}`
                    : "border-b border-aira-primary/5 py-3.5"
                }`}
              >
                {link.primary && <Calculator className="size-4" />}
                {link.label}
              </Link>
            ))}

            <div className="flex gap-3 pt-4">
              <Link
                href="/dashboard"
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
                <LogOut className="size-4" /> Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {konfirmasi && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-aira-primary-dark/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && setKonfirmasi(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="judul-logout"
            className="fade-up w-full max-w-sm rounded-[28px] bg-white p-6 shadow-soft sm:p-7"
          >
            <h2 id="judul-logout" className="text-xl font-semibold text-aira-primary">
              Keluar dari akun AIRA?
            </h2>
            <p className="mt-2 text-sm text-aira-text/75">
              Fitur publik seperti kalkulator dan navigasi air tetap bisa dipakai.
            </p>

            <form action={logout} className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                ref={tombolBatal}
                type="button"
                onClick={() => setKonfirmasi(false)}
                className="min-h-[48px] w-full rounded-full px-5 py-3 font-semibold text-aira-primary hover:bg-aira-primary/10 sm:w-auto"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-aira-coral-dark px-6 py-3 font-semibold text-white hover:brightness-110 sm:w-auto"
              >
                <LogOut className="size-5" /> Ya, Keluar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
