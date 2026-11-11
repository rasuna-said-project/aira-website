import AdminSidebar from "@/components/admin/AdminSidebar";
import KelolaTitikAir from "@/components/admin/titik-air/KelolaTitikAir";
import { MOCK_ADMIN } from "@/data/admin/mockAdmin";
import { ambilTitikAirTerverifikasi } from "@/services/adminTitikAirService";

export const metadata = {
  title: "Kelola Titik Air | Panel Admin AIRA",
};

// Kelola Titik Air (C03). Akses admin diperiksa oleh app/admin/layout.js.
export default async function KelolaTitikAirPage() {
  const titik = await ambilTitikAirTerverifikasi();

  return (
    <div className="min-h-[calc(100dvh-72px)] bg-aira-bg">
      <div className="mx-auto grid w-full max-w-[1280px] items-start gap-6 px-5 py-6 md:grid-cols-[186px_minmax(0,1fr)]">
        <AdminSidebar admin={MOCK_ADMIN} />

        <div className="min-w-0">
          <KelolaTitikAir awal={titik} />
        </div>
      </div>
    </div>
  );
}
