import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import AdminSidebar from "@/components/admin/AdminSidebar";
import VerificationWorkspace from "@/components/admin/verifikasi-titik-air/VerificationWorkspace";

export default async function VerifikasiPage() {
  const supabase = await createClient();

  // 1. Periksa sesi login.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/masuk");
  }

  // 2. Ambil profil pengguna.
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("user_id, full_name, email, role, account_status")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/masuk");
  }

  // 3. Periksa status akun.
  if (profile.account_status !== "active") {
    redirect("/masuk");
  }

  // 4. Batasi akses hanya untuk admin.
  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  // 5. Inisial admin.
  const initials =
    profile.full_name
      ?.split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AA";

  const admin = {
    initials,
    name: profile.full_name || "Admin AIRA",
    role: "Peninjau & pengelola data",
  };

  return (
    <main className="min-h-screen w-full bg-aira-bg">

      {/* Container halaman */}
      <div className="
        mx-auto w-full max-w-[720px]
        px-4 py-5
      ">

        {/* Layout sidebar dan konten */}
        <div className="
          grid grid-cols-1
          items-start gap-5
          min-[700px]:grid-cols-[124px_minmax(0,454px)]
          min-[700px]:gap-5
        ">

          {/* Sidebar Admin */}
          <AdminSidebar admin={admin} />

          {/* Konten Utama */}
          <section className="w-full min-w-0">

            {/* Heading */}
            <div className="mb-4">
              <h1 className="
                text-[21px] font-bold
                leading-tight tracking-tight
                text-aira-primary
              ">
                Verifikasi Kontribusi
              </h1>

              <p className="
                mt-1.5 text-[9px]
                leading-relaxed
                text-aira-text/55
              ">
                Tinjau titik air kiriman warga.
                Hanya data terverifikasi yang
                masuk ke direktori publik.
              </p>
            </div>

            {/* Workspace */}
            <VerificationWorkspace />

          </section>
        </div>
      </div>
    </main>
  );
} 