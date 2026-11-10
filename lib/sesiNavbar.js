import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { inisialDari } from "@/lib/inisial";

// Status login untuk Navbar di semua halaman (tanpa redirect).
// Mengembalikan null bila belum login, supaya Navbar menampilkan Masuk dan Daftar.
// Mengembalikan { inisial, href } bila sudah login: tombol Dashboard (admin -> /admin) dan Logout.
export const ambilSesiNavbar = cache(async () => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("full_name, role, account_status")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) return null;
    if (profile.account_status !== "active") return null;

    return {
      inisial: inisialDari(profile.full_name),
      href: profile.role === "admin" ? "/admin" : "/dashboard",
    };
  } catch {
    return null;
  }
});
