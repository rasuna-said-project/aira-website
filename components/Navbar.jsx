"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Menu, X } from "lucide-react";

const links = [
  { label: "Beranda", href: "/" },
  { label: "Kalkulator", href: "/kalkulator-air", primary: true },
  { label: "Navigasi Air", href: "/navigasi-air" },
  { label: "AIRA Assistant", href: "/assistant" },
];

const primaryClass =
  "bg-gradient-to-r from-aira-primary to-aira-secondary text-white shadow-sm hover:from-aira-primary-dark hover:to-aira-primary";

// Link aktif jika rute sama, atau berada di bawah rute tersebut (kecuali Beranda).
function isActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-aira-primary/10 bg-aira-bg/90 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5">
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

        {/* Menu desktop */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-medium transition-all ${
                  link.primary
                    ? `${primaryClass} ${active ? "ring-2 ring-aira-secondary ring-offset-2 ring-offset-aira-bg" : ""}`
                    : active
                      ? "bg-aira-primary/10 text-aira-primary"
                      : "text-aira-text/80 hover:bg-aira-sand"
                }`}
              >
                {link.primary && <Calculator className="size-4" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
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
        </div>

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
      </div>

      {/* Menu mobile */}
      {open && (
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
                    : `border-b border-aira-primary/5 py-3.5 ${active ? "text-aira-primary" : ""}`
                }`}
              >
                {link.primary && <Calculator className="size-4" />}
                {link.label}
              </Link>
            );
          })}
          <div className="flex gap-3 pt-4">
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
          </div>
        </div>
      )}
    </header>
  );
}
