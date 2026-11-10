import { createClient } from "@/lib/supabase/server";

export async function getCurrentProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("user_id, full_name, email, role, account_status")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Gagal mengambil profil:", error.message);
    return null;
  }

  return {
    ...profile,
    email: profile.email || user.email || "",
    phone_number: "",
    language: "id",
  };
} 