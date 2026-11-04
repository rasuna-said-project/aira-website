
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

export default function DaftarPage() {
  // ==========================================
  // 1. STATE FORM
  // ==========================================

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    whatsapp: "",
    password: "",
    konfirmasiPassword: "",
    persetujuan: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("");

  // ==========================================
  // 2. HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Hapus error pada field yang sedang diperbaiki
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setNotice("");
  };

  // ==========================================
  // 3. VALIDASI FORM
  // ==========================================

  const validateForm = () => {
    const newErrors = {};

    // Validasi nama
    if (!formData.nama.trim()) {
      newErrors.nama = "Nama lengkap wajib diisi.";
    } else if (formData.nama.trim().length < 3) {
      newErrors.nama = "Nama minimal 3 karakter.";
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Format email tidak valid.";
    }

    // Validasi WhatsApp
    const phone = formData.whatsapp.replace(/[\s-]/g, "");
    const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/;

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "Nomor WhatsApp wajib diisi.";
    } else if (!phoneRegex.test(phone)) {
      newErrors.whatsapp = "Masukkan nomor WhatsApp yang valid.";
    }

    // Validasi password
    if (!formData.password) {
      newErrors.password = "Kata sandi wajib diisi.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Kata sandi minimal 8 karakter.";
    }

    // Validasi konfirmasi password
    if (!formData.konfirmasiPassword) {
      newErrors.konfirmasiPassword =
        "Konfirmasi kata sandi wajib diisi.";
    } else if (
      formData.password !== formData.konfirmasiPassword
    ) {
      newErrors.konfirmasiPassword =
        "Konfirmasi kata sandi tidak sama.";
    }

    // Validasi persetujuan
    if (!formData.persetujuan) {
      newErrors.persetujuan =
        "Kamu harus menyetujui ketentuan layanan.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // 4. HANDLE SUBMIT
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setNotice("");

    const isValid = validateForm();

    if (!isValid) {
      setNoticeType("error");
      setNotice("Periksa kembali data yang kamu masukkan.");
      return;
    }

    // Backend belum diintegrasikan.
    // Belum ada data yang dikirim atau disimpan.

    setNoticeType("success");
    setNotice(
      "Validasi berhasil! Layanan pendaftaran akun belum terhubung dengan server."
    );
  };

  // ==========================================
  // 5. STYLE INPUT
  // ==========================================

  const inputClass = (field) =>
    `w-full min-w-0 rounded-xl border bg-white py-3 pl-11 pr-4
    text-sm text-aira-text placeholder:text-gray-400
    outline-none transition-all duration-200
    focus:border-aira-secondary focus:ring-2 focus:ring-aira-secondary/20
    ${
      errors[field]
        ? "border-red-400"
        : "border-[#D5E3E5]"
    }`;

  // ==========================================
  // 6. STYLE ICON
  // ==========================================

  const iconClass =
    "pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-aira-primary";

  // ==========================================
  // 7. RENDER HALAMAN
  // ==========================================

  return (
    <section className="relative isolate flex min-h-[calc(100svh-72px)] items-center justify-center overflow-hidden bg-aira-bg px-4 py-8 sm:px-6 sm:py-10 lg:py-12">

      {/* ================================== */}
      {/* BACKGROUND DECORATION */}
      {/* ================================== */}

      {/* Soft Sage - kiri atas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 -top-36 -z-10
        h-[320px] w-[320px] rounded-full bg-[#94D2BD]/45 blur-[90px]
        sm:h-[440px] sm:w-[440px] sm:blur-[120px]"
      />

      {/* Coral Peach - kanan bawah */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 -right-36 -z-10
        h-[320px] w-[320px] rounded-full bg-[#E99A83]/30 blur-[90px]
        sm:h-[440px] sm:w-[440px] sm:blur-[120px]"
      />

      {/* ================================== */}
      {/* REGISTRATION CARD */}
      {/* ================================== */}

      <div className="relative z-10 mx-auto w-full max-w-[380px]">

        <div className="w-full rounded-[24px] border border-white/70 bg-white p-6 shadow-[0_8px_28px_-10px_rgba(23,107,120,0.22)] sm:p-7 lg:p-8">

          {/* LOGO & HEADER */}

          <div className="mb-7 flex flex-col items-center text-center">

            <Image
              src="/images/aira-logo.svg"
              alt="Logo AIRA"
              width={200}
              height={85}
              priority
              className="mb-3 h-[68px] w-auto object-contain sm:h-[76px]"
            />

            <h1 className="text-[23px] font-bold leading-tight text-aira-primary sm:text-2xl">
              Buat akun AIRA
            </h1>

            <p className="mt-2 max-w-[300px] text-[12px] leading-relaxed text-aira-text/70 sm:text-[13px]">
              Simpan hasil perhitungan dan ikut menambah
              titik air untuk komunitas.
            </p>

          </div>

          {/* ================================== */}
          {/* FORM */}
          {/* ================================== */}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* NAMA LENGKAP */}

            <div>
              <label
                htmlFor="nama"
                className="mb-2 block text-[12px] font-semibold text-aira-text"
              >
                Nama lengkap
              </label>

              <div className="relative">
                <UserRound className={iconClass} />

                <input
                  id="nama"
                  name="nama"
                  type="text"
                  autoComplete="name"
                  placeholder="Contoh: Siti Rahma"
                  value={formData.nama}
                  onChange={handleChange}
                  aria-invalid={!!errors.nama}
                  aria-describedby={errors.nama ? "nama-error" : undefined}
                  className={inputClass("nama")}
                />
              </div>

              {errors.nama && (
                <p id="nama-error" className="mt-1 text-xs text-red-600">
                  {errors.nama}
                </p>
              )}
            </div>

            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[12px] font-semibold text-aira-text"
              >
                Email
              </label>

              <div className="relative">
                <Mail className={iconClass} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={inputClass("email")}
                />
              </div>

              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* NOMOR WHATSAPP */}

            <div>
              <label
                htmlFor="whatsapp"
                className="mb-2 block text-[12px] font-semibold text-aira-text"
              >
                Nomor WhatsApp
              </label>

              <div className="relative">
                <Phone className={iconClass} />

                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0812-3456-7890"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  aria-invalid={!!errors.whatsapp}
                  aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
                  className={inputClass("whatsapp")}
                />
              </div>

              {errors.whatsapp && (
                <p id="whatsapp-error" className="mt-1 text-xs text-red-600">
                  {errors.whatsapp}
                </p>
              )}
            </div>

            {/* PASSWORD */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[12px] font-semibold text-aira-text"
              >
                Kata sandi
              </label>

              <div className="relative">
                <LockKeyhole className={iconClass} />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Minimal 8 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`${inputClass("password")} pr-11`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-aira-primary"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p id="password-error" className="mt-1 text-xs text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* KONFIRMASI PASSWORD */}

            <div>
              <label
                htmlFor="konfirmasiPassword"
                className="mb-2 block text-[12px] font-semibold text-aira-text"
              >
                Konfirmasi kata sandi
              </label>

              <div className="relative">
                <LockKeyhole className={iconClass} />

                <input
                  id="konfirmasiPassword"
                  name="konfirmasiPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Minimal 8 karakter"
                  value={formData.konfirmasiPassword}
                  onChange={handleChange}
                  aria-invalid={!!errors.konfirmasiPassword}
                  aria-describedby={
                    errors.konfirmasiPassword
                      ? "konfirmasi-error"
                      : undefined
                  }
                  className={`${inputClass("konfirmasiPassword")} pr-11`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Sembunyikan konfirmasi kata sandi"
                      : "Tampilkan konfirmasi kata sandi"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-aira-primary"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>

              {errors.konfirmasiPassword && (
                <p id="konfirmasi-error" className="mt-1 text-xs text-red-600">
                  {errors.konfirmasiPassword}
                </p>
              )}
            </div>

            {/* PERSETUJUAN */}

            <div>
              <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-relaxed text-aira-text/75 sm:text-xs">

                <input
                  type="checkbox"
                  name="persetujuan"
                  checked={formData.persetujuan}
                  onChange={handleChange}
                  className="mt-0.5 size-[13px] shrink-0 cursor-pointer accent-aira-primary"
                  aria-invalid={!!errors.persetujuan}
                />

                <span>
                  Saya setuju dengan Ketentuan Layanan dan
                Kebijakan Privasi AIRA.
              </span>

              </label>

              {errors.persetujuan && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.persetujuan}
                </p>
              )}
            </div>

            {/* NOTIFICATION */}

            {notice && (
              <div
                role="status"
                aria-live="polite"
                className={`rounded-xl border p-3 text-xs leading-relaxed sm:text-[13px] ${
                  noticeType === "success"
                    ? "border-[#94D2BD] bg-[#EFF8F4] text-[#176B78]"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {notice}
              </div>
            )}

            {/* BUTTON DAFTAR */}

            <button
              type="submit"
              className="w-full rounded-full bg-aira-primary px-5 py-3.5 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:bg-aira-primary-dark hover:shadow-lg active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aira-secondary"
            >
              Daftar Sekarang
            </button>

          </form>

          {/* ================================== */}
          {/* LINK LOGIN */}
          {/* ================================== */}

          <div className="mt-5 text-center text-xs text-aira-text sm:text-[13px]">
            Sudah punya akun?{" "}
            <Link
              href="/masuk"
              className="font-semibold text-aira-primary underline underline-offset-2 hover:text-aira-primary-dark"
            >
              Masuk
            </Link>
          </div>

          {/* FOOTNOTE */}

          <p className="mx-auto mt-4 max-w-[290px] text-center text-[10px] leading-relaxed text-gray-400">
            Kalkulator, Navigasi Air, dan AIRA Assistant
            tetap dapat dipakai tanpa akun.
          </p>

        </div>
      </div>
    </section>
  );
} 