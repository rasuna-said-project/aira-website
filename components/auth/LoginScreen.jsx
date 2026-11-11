"use client";

import { useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginScreen() {
  const [forgot, setForgot] = useState(false);

  return forgot ? (
    <AuthCard
      title="Lupa kata sandi"
      subtitle="Masukkan email akun Anda untuk menerima tautan pengaturan ulang kata sandi."
    >
      <ForgotPasswordForm onBack={() => setForgot(false)} />
    </AuthCard>
  ) : (
    <AuthCard
      title="Selamat datang kembali"
      subtitle="Masuk untuk melihat riwayat dan memantau stok air keluarga."
    >
      <LoginForm onForgot={() => setForgot(true)} />
    </AuthCard>
  );
}
