import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();

  // 1. Periksa sesi pengguna
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/masuk");
  }

  // 2. Ambil profil pengguna
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("user_id, full_name, email, role, account_status")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/masuk");
  }

  // 3. Periksa status akun
  if (profile.account_status !== "active") {
    redirect("/masuk");
  }

  // 4. Pastikan pengguna adalah admin
  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  return children;
} 