"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ==========================================
// HELPER
// ==========================================

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
}

function createCallbackUrl(nextPath) {
  const callbackUrl = new URL(
    "/auth/callback",
    getSiteUrl()
  );

  callbackUrl.searchParams.set("next", nextPath);

  return callbackUrl.toString();
}

// ==========================================
// REGISTER
// ==========================================

export async function register(formData) {
  const fullName = String(
    formData.get("full_name") || ""
  ).trim();

  const email = String(
    formData.get("email") || ""
  ).trim().toLowerCase();

  const password = String(
    formData.get("password") || ""
  );

  const confirmPassword = String(
    formData.get("confirm_password") || ""
  );

  const agreement = formData.get("agreement");

  if (!fullName) {
    return {
      error: "Nama lengkap wajib diisi.",
    };
  }

  if (fullName.length > 150) {
    return {
      error: "Nama lengkap maksimal 150 karakter.",
    };
  }

  if (!email || !isValidEmail(email)) {
    return {
      error: "Format email tidak valid.",
    };
  }

  if (password.length < 8) {
    return {
      error: "Password minimal 8 karakter.",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Konfirmasi password tidak sesuai.",
    };
  }

  if (agreement !== "on" && agreement !== true) {
    return {
      error: "Persetujuan wajib dicentang.",
    };
  }

  const supabase = await createClient();

  const emailRedirectTo = createCallbackUrl(
    "/masuk?verified=1"
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo,
    },
  });

  if (error) {
    console.error("REGISTER ERROR:", {
      message: error.message,
      code: error.code,
      status: error.status,
    });

    return {
      error:
        "Pendaftaran gagal. Periksa kembali data atau email kamu.",
    };
  }

  if (
    data.user &&
    data.user.identities &&
    data.user.identities.length === 0
  ) {
    return {
      error: "Email sudah terdaftar. Silakan masuk.",
    };
  }

  // Jika konfirmasi email aktif, session belum tersedia.
  if (!data.session) {
    return {
      success:
        "Pendaftaran berhasil. Silakan periksa email untuk mengonfirmasi akun AIRA.",
    };
  }

  // Jika konfirmasi email tidak diwajibkan.
  redirect("/dashboard");
}

// ==========================================
// LOGIN
// ==========================================

export async function login(formData) {
  const email = String(
    formData.get("email") || ""
  ).trim().toLowerCase();

  const password = String(
    formData.get("password") || ""
  );

  if (!email || !password) {
    return {
      error: "Email dan password wajib diisi.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      error: "Format email tidak valid.",
    };
  }

  const supabase = await createClient();

  const {
    data: authData,
    error: authError,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // ------------------------------------------
  // PEMERIKSAAN AUTENTIKASI SUPABASE
  // ------------------------------------------

  if (authError || !authData?.user) {
    console.error("LOGIN AUTH ERROR:", {
      message: authError?.message,
      code: authError?.code,
      status: authError?.status,
    });

    if (
      authError?.code === "email_not_confirmed"
    ) {
      return {
        error:
          "Email belum dikonfirmasi. Silakan periksa email kamu dan lakukan konfirmasi terlebih dahulu.",
      };
    }

    if (
      authError?.status === 429 ||
      authError?.code === "over_request_rate_limit"
    ) {
      return {
        error:
          "Terlalu banyak percobaan login. Silakan tunggu beberapa saat sebelum mencoba kembali.",
      };
    }

    if (
      authError?.code === "invalid_credentials"
    ) {
      return {
        error:
          "Email atau password yang kamu masukkan salah. Periksa kembali data login kamu.",
      };
    }

    return {
      error:
        "Login gagal karena terjadi masalah autentikasi. Silakan coba kembali.",
    };
  }

  // ------------------------------------------
  // PEMERIKSAAN PROFIL PENGGUNA
  // ------------------------------------------

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("users")
    .select(
      "user_id, full_name, email, role, account_status"
    )
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (profileError) {
    console.error("LOGIN PROFILE ERROR:", {
      message: profileError.message,
      code: profileError.code,
    });

    await supabase.auth.signOut();

    return {
      error:
        "Gagal mengambil data profil akun. Silakan coba kembali atau hubungi administrator AIRA.",
    };
  }

  if (!profile) {
    console.error(
      "LOGIN PROFILE NOT FOUND:",
      authData.user.id
    );

    await supabase.auth.signOut();

    return {
      error:
        "Profil pengguna tidak ditemukan. Silakan hubungi administrator AIRA.",
    };
  }

  // ------------------------------------------
  // PEMERIKSAAN STATUS AKUN
  // ------------------------------------------

  if (profile.account_status !== "active") {
    await supabase.auth.signOut();

    return {
      error:
        "Akun Anda tidak aktif. Silakan hubungi administrator AIRA.",
    };
  }

  // ------------------------------------------
  // PENGALIHAN BERDASARKAN ROLE
  // ------------------------------------------

  if (profile.role === "admin") {
    redirect("/admin");
  }

  if (profile.role === "user") {
    redirect("/dashboard");
  }

  await supabase.auth.signOut();

  return {
    error:
      "Role akun tidak dikenali. Silakan hubungi administrator AIRA.",
  };
}

// ==========================================
// LOGOUT
// ==========================================

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("LOGOUT ERROR:", error.message);
  }

  redirect("/masuk");
}

// ==========================================
// RESET / LUPA PASSWORD
// ==========================================

export async function resetPassword(formData) {
  const email = String(
    formData.get("email") || ""
  ).trim().toLowerCase();

  if (!email) {
    return {
      error: "Email wajib diisi.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      error: "Format email tidak valid.",
    };
  }

  const supabase = await createClient();

  const redirectTo = createCallbackUrl(
    "/masuk/reset-password"
  );

  const { error } =
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

  if (error) {
    console.error("RESET PASSWORD ERROR:", {
      message: error.message,
      code: error.code,
      status: error.status,
    });

    return {
      error:
        "Permintaan reset password gagal. Silakan coba kembali.",
    };
  }

  return {
    success:
      "Jika email terdaftar, tautan reset password akan dikirim. Silakan periksa kotak masuk email kamu.",
  };
}

// ==========================================
// UPDATE PASSWORD
// ==========================================

export async function updatePassword(formData) {
  const password = String(
    formData.get("password") || ""
  );

  const confirmPassword = String(
    formData.get("confirm_password") || ""
  );

  if (password.length < 8) {
    return {
      error: "Password baru minimal 8 karakter.",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Konfirmasi password tidak sesuai.",
    };
  }

  const supabase = await createClient();

  // Pastikan pengguna memiliki session pemulihan.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error:
        "Sesi pemulihan tidak ditemukan atau sudah kedaluwarsa. Silakan minta tautan reset baru.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error("UPDATE PASSWORD ERROR:", {
      message: error.message,
      code: error.code,
      status: error.status,
    });

    return {
      error:
        "Password gagal diperbarui. Silakan coba kembali.",
    };
  }

  // Setelah password diperbarui,
  // pengguna diminta login kembali.
  await supabase.auth.signOut();

  return {
    success:
      "Password berhasil diperbarui. Silakan masuk kembali.",
  };
}
