import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/services/profileService";

import AccountForm from "@/components/dashboard/pengaturan/AccountForm";
import NotificationPreferences from "@/components/dashboard/pengaturan/NotificationPreferences";
import LogoutSection from "@/components/dashboard/pengaturan/LogoutSection";

export default async function PengaturanPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <main className="w-full">
      {/* Header halaman */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#176B78] sm:text-[28px]">
          Pengaturan Akun
        </h1>

        <p className="mt-2 text-sm text-[#7D8B90]">
          Kelola data akun dan cara AIRA menghubungi Anda.
        </p>
      </div>

      {/* Data akun */}
      <div className="space-y-5">
        <AccountForm profile={profile} />

        {/* Preferensi notifikasi */}
        <NotificationPreferences />

        {/* Logout */}
        <LogoutSection />
      </div>
    </main>
  );
} 