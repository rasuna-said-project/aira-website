"use client";

import { useEffect, useRef } from "react";
import { LogOut } from "lucide-react";

import { logout } from "@/app/actions/auth";

// Dialog konfirmasi Logout, dipakai Navbar publik dan header Dashboard User.
export default function LogoutDialog({ open, onClose }) {
  const tombolBatal = useRef(null);

  useEffect(() => {
    if (!open) return;
    tombolBatal.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-aira-primary-dark/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
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
            onClick={onClose}
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
  );
}
