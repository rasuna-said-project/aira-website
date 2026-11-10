import { logout } from "@/app/actions/auth";

export default function LogoutSection() {
  return (
    <section className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(30,80,90,0.07)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-semibold text-[#35464C]">
          Keluar dari akun
        </h2>

        <p className="mt-1 text-xs text-[#89969A]">
          Akhiri sesi penggunaan AIRA pada perangkat ini.
        </p>
      </div>

      <form action={logout}>
        <button
          type="submit"
          className="rounded-full border border-[#E4B4A8] px-5 py-2.5 text-xs font-semibold text-[#C87565] transition hover:bg-[#FFF4F0]"
        >
          Logout
        </button>
      </form>
    </section>
  );
} 