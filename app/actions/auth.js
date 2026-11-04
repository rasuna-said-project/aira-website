"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// REGISTER
export async function register(formData) {
  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");
  const agreement = formData.get("agreement");

  if (!fullName) {
    return { error: "Nama lengkap wajib diisi." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { error: "Format email tidak valid." };
  }

  if (!password) {
    return { error: "Password wajib diisi." };
  }

  if (password.length < 8) {
    return { error: "Password minimal 8 karakter." };
  }

  if (password !== confirmPassword) {
    return { error: "Konfirmasi password tidak sesuai." };
  }

  if (agreement !== "on" && agreement !== true) {
    return { error: "Persetujuan wajib dicentang." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    return { success: "Silakan periksa email untuk konfirmasi akun." };
  }

  redirect("/dashboard");
}

// LOGIN
export async function login(formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !authData.user) {
    return { error: "Email atau password salah." };
  }

  // Ambil profil berdasarkan user_id
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("user_id, full_name, email, role, account_status")
    .eq("user_id", authData.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return { error: "Profil pengguna tidak ditemukan." };
  }

  if (profile.account_status !== "active") {
    await supabase.auth.signOut();
    return { error: "Akun Anda tidak aktif." };
  }

  // Arahkan berdasarkan role ke rute proyek AIRA
  if (profile.role === "admin") {
    redirect("/admin");
  }

  redirect("/dashboard");
}

// LOGOUT
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/masuk");
}

// RESET / LUPA PASSWORD
export async function resetPassword(formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!email) {
    return { error: "Email wajib diisi." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Format email tidak valid." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/masuk/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Tautan reset kata sandi telah dikirim ke email kamu." };
}