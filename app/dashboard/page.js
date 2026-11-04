import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/masuk");
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("user_id, full_name, email, role, account_status")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/masuk");
  }

  if (profile.account_status !== "active") {
    redirect("/masuk");
  }

  // Jika admin tidak sengaja masuk ke /dashboard biasa, redirect ke /admin
  if (profile.role === "admin") {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[#F5F5EF] p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-[#526B50]">
          Dashboard User AIRA
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