"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData) {
  const supabase = await createClient();

  // Memeriksa sesi pengguna
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: "Sesi login tidak ditemukan. Silakan login kembali.",
    };
  }

  // Mengambil data formulir
  const fullName = formData.get("full_name")?.trim();
  const password = formData.get("password") || "";
  const confirmPassword = formData.get("confirm_password") || "";

  // Validasi nama
  if (!fullName) {
    return {
      success: false,
      message: "Nama lengkap wajib diisi.",
    };
  }

  // Validasi kata sandi jika ingin diganti
  if (password || confirmPassword) {
    if (password.length < 8) {
      return {
        success: false,
        message: "Kata sandi minimal 8 karakter.",
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Konfirmasi kata sandi tidak sesuai.",
      };
    }
  }

  // Memperbarui nama lengkap pada tabel users
  const { error: profileError } = await supabase
    .from("users")
    .update({
      full_name: fullName,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (profileError) {
    console.error("Gagal memperbarui profil:", profileError.message);

    return {
      success: false,
      message: "Gagal memperbarui nama akun. Silakan coba kembali.",
    };
  }

  // Memperbarui kata sandi melalui Supabase Auth jika diisi
  if (password) {
    const { error: passwordError } = await supabase.auth.updateUser({
      password,
    });

    if (passwordError) {
      console.error("Gagal memperbarui kata sandi:", passwordError.message);

      return {
        success: false,
        message:
          "Nama berhasil diperbarui, tetapi kata sandi gagal diubah: " +
          passwordError.message,
      };
    }
  }

  // Memperbarui cache halaman
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pengaturan");

  return {
    success: true,
    message: "Perubahan akun berhasil disimpan.",
  };
} 