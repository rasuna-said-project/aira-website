import AdminSidebar from "@/components/admin/AdminSidebar";
import KelolaTitikAir from "@/components/admin/titik-air/KelolaTitikAir";
import { createClient } from "@/lib/supabase/server";
import { ambilTitikAirTerverifikasi } from "@/services/adminTitikAirService";

export const metadata = {
  title: "Kelola Titik Air | Panel Admin AIRA",
};

// Kelola Titik Air (C03). Akses admin diperiksa oleh app/admin/layout.js.
export default async function KelolaTitikAirPage() {
  const supabase = await createClient();

  // Nama dan inisial admin diambil dari profil (pola yang sama dengan halaman C02).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("users")
        .select("full_name")
        .eq("user_id", user.id)
        .single()
    : { data: null };

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AA";

  const admin = {
    initials,
    name: profile?.full_name || "Admin AIRA",
    role: "Peninjau & pengelola data",
  };

  const titik = await ambilTitikAirTerverifikasi();

  return (
    <main className="min-h-screen w-full bg-aira-bg">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[186px_minmax(0,1fr)]">
          <AdminSidebar admin={admin} />

          <section className="w-full min-w-0">
            <KelolaTitikAir awal={titik} />
          </section>
        </div>
      </div>
    </main>
  );
}
