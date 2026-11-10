"use client"; 

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/actions/profile";

export default function AccountForm({ profile }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setMessage(null);

    startTransition(async () => {
      const result = await updateProfile(formData);

      setMessage(result);

      if (result.success) {
        form.reset();
        router.refresh();
      }
    });
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(30,80,90,0.07)] sm:p-7">
      <h2 className="mb-5 text-base font-semibold text-[#176B78]">
        Data akun
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">

          {/* Nama lengkap */}
          <div>
            <label
              htmlFor="full_name"
              className="mb-2 block text-xs font-medium text-[#35464C]"
            >
              Nama lengkap
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              defaultValue={profile?.full_name || ""}
              required
              className="h-10 w-full rounded-xl border border-[#C9DDE2] px-3 text-sm text-[#526168] outline-none transition focus:border-[#176B78] focus:ring-2 focus:ring-[#176B78]/10"
            />
          </div>

          {/* Email - sementara tidak dapat diedit */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-medium text-[#35464C]"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={profile?.email || ""}
              readOnly
              className="h-10 w-full cursor-not-allowed rounded-xl border border-[#C9DDE2] bg-[#F5F8F8] px-3 text-sm text-[#8A999E] outline-none"
            />

            <p className="mt-1.5 text-[10px] text-[#98A3A7]">
              Perubahan email belum tersedia.
            </p>
          </div>

          {/* Nomor WhatsApp - belum terhubung database */}
          <div>
            <label
              htmlFor="phone_number"
              className="mb-2 block text-xs font-medium text-[#35464C]"
            >
              Nomor WhatsApp
            </label>

            <input
              id="phone_number"
              type="tel"
              value={profile?.phone_number || ""}
              disabled
              placeholder="Fitur belum tersedia"
              className="h-10 w-full cursor-not-allowed rounded-xl border border-[#C9DDE2] bg-[#F5F8F8] px-3 text-sm text-[#A1ADB1] outline-none"
            />

            <p className="mt-1.5 text-[10px] text-[#98A3A7]">
              Penyimpanan nomor WhatsApp akan tersedia pada pengembangan berikutnya.
            </p>
          </div>

          {/* Bahasa - segera hadir */}
          <div>
            <label
              htmlFor="language"
              className="mb-2 flex items-center gap-2 text-xs font-medium text-[#35464C]"
            >
              Bahasa

              <span className="rounded-full bg-[#F4EBDD] px-2 py-0.5 text-[9px] font-medium text-[#176B78]">
                Segera hadir
              </span>
            </label>

            <select
              id="language"
              disabled
              value="id"
              className="h-10 w-full cursor-not-allowed appearance-none rounded-xl border border-[#C9DDE2] bg-[#F5F8F8] px-3 text-sm text-[#A1ADB1] outline-none"
            >
              <option value="id">Bahasa Indonesia</option>
            </select>

            <p className="mt-1.5 text-[10px] text-[#98A3A7]">
              Pengaturan bahasa akan tersedia pada pengembangan berikutnya.
            </p>
          </div>

          {/* Kata sandi baru */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-medium text-[#35464C]"
            >
              Kata sandi baru
            </label>

            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              className="h-10 w-full rounded-xl border border-[#C9DDE2] px-3 text-sm outline-none transition focus:border-[#176B78] focus:ring-2 focus:ring-[#176B78]/10"
            />

            <p className="mt-1 text-[10px] text-[#98A3A7]">
              Minimal 8 karakter. Kosongkan jika tidak ingin mengganti.
            </p>
          </div>

          {/* Konfirmasi kata sandi */}
          <div>
            <label
              htmlFor="confirm_password"
              className="mb-2 block text-xs font-medium text-[#35464C]"
            >
              Konfirmasi kata sandi baru
            </label>

            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              className="h-10 w-full rounded-xl border border-[#C9DDE2] px-3 text-sm outline-none transition focus:border-[#176B78] focus:ring-2 focus:ring-[#176B78]/10"
            />
          </div>
        </div>

        {/* Pesan berhasil atau gagal */}
        {message && (
          <div
            role="status"
            className={`rounded-xl px-4 py-3 text-xs ${
              message.success
                ? "bg-[#E7F4EF] text-[#176B78]"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message.message}
          </div>
        )}

        {/* Tombol simpan */}
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[#176B78] px-6 py-3 text-xs font-semibold text-white shadow-[0_5px_15px_rgba(23,107,120,0.15)] transition hover:bg-[#125966] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </section>
  );
} 