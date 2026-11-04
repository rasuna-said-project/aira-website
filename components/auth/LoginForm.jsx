"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import FormField from "@/components/auth/FormField";
import FormMessage from "@/components/auth/FormMessage";
import PasswordField from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/services/authService";
import { validateEmail, validatePassword } from "@/lib/validation";

export default function LoginForm({ onForgot }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  // Hapus pesan error kolom yang sedang diubah pengguna.
  const clear = (field) => () => {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFeedback((current) => (current?.type === "error" ? null : current));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    const next = { email: validateEmail(email), password: validatePassword(password) };
    setErrors(next);
    setFeedback(null);
    if (next.email || next.password) return;

    setLoading(true);
    const result = await loginUser({ email, password });
    setLoading(false);

    if (!result.ok) {
      setFeedback({ type: "error", text: result.error });
      return;
    }
    setFeedback({ type: "success", text: "Login berhasil. Membuka dashboard…" });
    setTimeout(() => router.push("/dashboard"), 500);
  }

  return (
    <>
      <form noValidate onSubmit={handleSubmit} className="mt-7 space-y-5">
        <FormField
          icon={Mail}
          label="Email"
          name="email"
          type="email"
          placeholder="nama@email.com"
          autoComplete="email"
          error={errors.email}
          onChange={clear("email")}
        />
        <PasswordField autoComplete="current-password" error={errors.password} onChange={clear("password")} />

        <div className="flex items-center justify-between text-sm">
          <label className="flex min-h-[44px] items-center gap-2">
            <input type="checkbox" name="remember" className="size-4 accent-aira-primary" /> Ingat saya
          </label>
          <button
            type="button"
            onClick={onForgot}
            className="min-h-[44px] font-semibold text-aira-primary underline"
          >
            Lupa kata sandi?
          </button>
        </div>

        {feedback && <FormMessage type={feedback.type}>{feedback.text}</FormMessage>}

        <Button
          type="submit"
          disabled={loading}
          className="h-14 w-full rounded-full bg-aira-primary px-8 text-lg font-semibold text-white shadow-soft hover:bg-aira-primary-dark"
        >
          {loading ? "Sedang masuk…" : "Masuk"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[15px]">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-semibold text-aira-primary underline">
          Daftar
        </Link>
      </p>
    </>
  );
}
