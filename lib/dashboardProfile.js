import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Pemeriksaan sesi + profil untuk seluruh halaman /dashboard (pengguna biasa).
// Dibungkus `cache` agar layout dan halaman dalam satu request hanya bertanya ke Supabase sekali.
export const ambilProfilDashboard = cache(async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) redirect("/masuk");

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("user_id, full_name, email, role, account_status")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) redirect("/masuk");
  if (profile.account_status !== "active") redirect("/masuk");

  // Admin memakai dashboard sendiri.
  if (profile.role === "admin") redirect("/admin");

  return profile;
});
