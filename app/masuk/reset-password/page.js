import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import AuthCard from "@/components/auth/AuthCard";
import ResetPassword from "@/components/auth/ResetPassword";

export const metadata = {
  title: "Atur Ulang Password | AIRA",
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();

  // Periksa session pengguna.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Jika session tidak tersedia,
  // pengguna harus meminta tautan reset baru.
  if (error || !user) {
    redirect("/masuk?error=recovery-session");
  }

  return (
    <AuthCard
      title="Buat password baru"
      subtitle="Masukkan password baru untuk melanjutkan menggunakan akun AIRA."
    >
      <ResetPassword />
    </AuthCard>
  );
}
