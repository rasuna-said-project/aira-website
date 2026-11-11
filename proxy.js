import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          // Perbarui cookies pada request.
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // Buat ulang response dengan request terbaru.
          response = NextResponse.next({ request });

          // Simpan cookies pada response.
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Periksa session dan perbarui token jika diperlukan.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isDashboardPath = pathname.startsWith("/dashboard");
  const isAdminPath = pathname.startsWith("/admin");

  const isAuthPath =
    pathname === "/masuk" || pathname === "/daftar";

  function redirectWithCookies(path) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = path;

    const redirectResponse = NextResponse.redirect(redirectUrl);

    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  // Pengunjung belum login tidak boleh membuka dashboard.
  if ((isDashboardPath || isAdminPath) && !user) {
    return redirectWithCookies("/masuk");
  }

  // Pengunjung tanpa session dapat melanjutkan
  // ke halaman publik dan halaman autentikasi.
  if (!user) {
    return response;
  }

  // Ambil role dan status akun dari tabel users.
  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("users")
    .select("role, account_status")
    .eq("user_id", user.id)
    .maybeSingle();

  // Jika profil tidak ditemukan.
  if (profileError || !profile) {
    if (isDashboardPath || isAdminPath) {
      return redirectWithCookies("/masuk?error=profile");
    }

    return response;
  }

  // Akun yang tidak aktif tidak boleh membuka dashboard.
  if (profile.account_status !== "active") {
    if (isDashboardPath || isAdminPath) {
      return redirectWithCookies("/masuk?error=inactive");
    }

    return response;
  }

  // Admin yang membuka halaman login atau daftar.
  if (isAuthPath) {
    return redirectWithCookies(
      profile.role === "admin" ? "/admin" : "/dashboard"
    );
  }

  // User biasa tidak boleh membuka dashboard admin.
  if (isAdminPath && profile.role !== "admin") {
    return redirectWithCookies("/dashboard");
  }

  // Admin tidak perlu membuka dashboard user.
  if (isDashboardPath && profile.role === "admin") {
    return redirectWithCookies("/admin");
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/masuk/:path*",
    "/daftar",
  ],
};