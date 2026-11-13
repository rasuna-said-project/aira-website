import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ambilProfilDashboard } from "@/lib/dashboardProfile";
import { ambilDataDashboard } from "@/services/dashboardService";

export default async function UserDashboardLayout({ children }) {
  // Pemeriksaan sesi, profil, status akun, dan peran ada di ambilProfilDashboard.
  const profile = await ambilProfilDashboard();
  const { keluarga } = await ambilDataDashboard();

  return (
    <DashboardLayout profile={profile} anggotaKeluarga={keluarga?.anggota ?? null}>
      {children}
    </DashboardLayout>
  );
}
