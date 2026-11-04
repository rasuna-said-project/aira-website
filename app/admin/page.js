import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Periksa sesi pengguna saat ini
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/masuk");
  }

  // Ambil profil pengguna berdasarkan user_id
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("user_id, full_name, email, role, account_status")
    .eq("user_id", user.id)
    .single();

  // Penanganan jika profil tidak ditemukan atau error
  if (profileError || !profile) {
    redirect("/masuk");
  }

  // Cek status aktif akun
  if (profile.account_status !== "active") {
    redirect("/masuk");
  }

  // Hanya admin yang dapat mengakses halaman ini
  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#F5F5EF] p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-[#526B50]">
          Dashboard Admin AIRA
        </h1>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Selamat datang, {profile.full_name}
          </h2>

          <p className="mt-2 text-gray-600">
            Email: {profile.email}
          </p>

          <p className="mt-1 text-gray-600">
            Role: {profile.role}
          </p>
        </div>

        <form action={logout} className="mt-6">
          <button
            type="submit"
            className="rounded-lg bg-red-600 px-5 py-3 text-white hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </form>
      </div>
    </main>
  );
}