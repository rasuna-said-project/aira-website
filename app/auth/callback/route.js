import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const requestedNext = url.searchParams.get("next");

  const safeNext =
    requestedNext &&
    requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//")
      ? requestedNext
      : "/masuk?verified=1";

  console.log("[AUTH CALLBACK] Callback diakses");
  console.log("[AUTH CALLBACK] Code tersedia:", Boolean(code));
  console.log("[AUTH CALLBACK] Tujuan:", safeNext);

  if (!code) {
    console.error("[AUTH CALLBACK] Kode tidak ditemukan");

    return NextResponse.redirect(
      new URL("/masuk?error=invalid-link", url.origin)
    );
  }

  const supabase = await createClient();

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error(
      "[AUTH CALLBACK] Exchange gagal:",
      exchangeError.message
    );

    return NextResponse.redirect(
      new URL("/masuk?error=verification-failed", url.origin)
    );
  }

  console.log("[AUTH CALLBACK] Exchange berhasil");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log(
    "[AUTH CALLBACK] User ditemukan:",
    Boolean(user)
  );

  if (userError) {
    console.error(
      "[AUTH CALLBACK] Get user gagal:",
      userError.message
    );
  }

  return NextResponse.redirect(
    new URL(safeNext, url.origin)
  );
}
