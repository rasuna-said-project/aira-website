import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function UserDashboardLayout({ children }) {
  const supabase = await createClient();

  // 1. Periksa sesi pengguna
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/masuk");
  }

  // 2. Ambil profil pengguna
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("user_id, full_name, email, role, account_status")
    .eq("user_id", user.id)
    .single();

  // 3. Pastikan profil tersedia
  if (profileError || !profile) {
    redirect("/masuk");
  }

  // 4. Pastikan akun aktif
  if (profile.account_status !== "active") {
    redirect("/masuk");
  }

  // 5. Pisahkan akses admin dan pengguna
  if (profile.role === "admin") {
    redirect("/admin");
  }

  // 6. Render dashboard
  return (
    <DashboardLayout profile={profile}>
      {children}
    </DashboardLayout>
  );
} 