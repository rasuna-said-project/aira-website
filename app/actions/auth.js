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
    redirect("/daftar?error=" + encodeURIComponent("Nama lengkap wajib diisi"));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    redirect("/daftar?error=" + encodeURIComponent("Format email tidak valid"));
  }

  if (!password) {
    redirect("/daftar?error=" + encodeURIComponent("Password wajib diisi"));
  }

  if (password.length < 8) {
    redirect("/daftar?error=" + encodeURIComponent("Password minimal 8 karakter"));
  }

  if (password !== confirmPassword) {
    redirect("/daftar?error=" + encodeURIComponent("Konfirmasi password tidak sesuai"));
  }

  if (agreement !== "on") {
    redirect("/daftar?error=" + encodeURIComponent("Persetujuan wajib dicentang"));
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
    redirect("/daftar?error=" + encodeURIComponent(error.message));
  }

  if (!data.session) {
    redirect("/masuk?message=" + encodeURIComponent("Silakan periksa email untuk konfirmasi akun"));
  }

  redirect("/dashboard");
}

// LOGIN
export async function login(formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/masuk?error=" + encodeURIComponent("Email dan password wajib diisi"));
  }

  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !authData.user) {
    redirect("/masuk?error=" + encodeURIComponent("Email atau password salah"));
  }

  // Ambil profil berdasarkan user_id
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("user_id, full_name, email, role, account_status")
    .eq("user_id", authData.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    redirect("/masuk?error=" + encodeURIComponent("Profil pengguna tidak ditemukan"));
  }

  if (profile.account_status !== "active") {
    await supabase.auth.signOut();
    redirect("/masuk?error=" + encodeURIComponent("Akun Anda tidak aktif"));
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