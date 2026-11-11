"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Memvalidasi nomor WhatsApp dengan format internasional E.164.
function isValidPhoneNumber(phoneNumber) {
  return /^\+[1-9]\d{7,14}$/.test(phoneNumber);
}

export async function updateProfile(formData) {
  const supabase = await createClient();

  // 1. Memeriksa sesi pengguna.
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

  // 2. Mengambil data dari formulir.
  const fullName = String(
    formData.get("full_name") || ""
  ).trim();

  const phoneNumber = String(
    formData.get("phone_number") || ""
  ).trim();

  const password = String(
    formData.get("password") || ""
  );

  const confirmPassword = String(
    formData.get("confirm_password") || ""
  );

  // 3. Validasi nama lengkap.
  if (!fullName) {
    return {
      success: false,
      message: "Nama lengkap wajib diisi.",
    };
  }

  if (fullName.length > 150) {
    return {
      success: false,
      message: "Nama lengkap maksimal 150 karakter.",
    };
  }

  // 4. Validasi nomor WhatsApp.
  // Nomor boleh dikosongkan.
  // Jika diisi, harus menggunakan format internasional.
  if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
    return {
      success: false,
      message:
        "Format nomor WhatsApp tidak valid. Gunakan format internasional, misalnya +6281234567890.",
    };
  }

  // 5. Validasi kata sandi jika pengguna ingin menggantinya.
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

  // 6. Memperbarui nama dan nomor WhatsApp
  // hanya pada profil pengguna yang sedang login.
  const { data: updatedProfile, error: profileError } =
    await supabase
      .from("users")
      .update({
        full_name: fullName,
        phone_number: phoneNumber || null,
      })
      .eq("user_id", user.id)
      .select("user_id, full_name, phone_number")
      .maybeSingle();

  if (profileError) {
    console.error(
      "Gagal memperbarui profil:",
      profileError.message
    );

    return {
      success: false,
      message:
        "Gagal memperbarui data akun. Silakan coba kembali.",
    };
  }

  // Memastikan ada baris profil yang berhasil diperbarui.
  if (!updatedProfile) {
    return {
      success: false,
      message:
        "Data akun tidak ditemukan atau tidak memiliki izin untuk diperbarui.",
    };
  }

  // 7. Memperbarui kata sandi melalui Supabase Auth
  // hanya jika pengguna mengisi kolom kata sandi.
  if (password) {
    const { error: passwordError } =
      await supabase.auth.updateUser({
        password,
      });

    if (passwordError) {
      console.error(
        "Gagal memperbarui kata sandi:",
        passwordError.message
      );

      return {
        success: false,
        message:
          "Nama dan nomor WhatsApp berhasil diperbarui, tetapi kata sandi gagal diubah. " +
          passwordError.message,
      };
    }
  }

  // 8. Memperbarui cache halaman.
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pengaturan");

  return {
    success: true,
    message: "Perubahan akun berhasil disimpan.",
  };
}