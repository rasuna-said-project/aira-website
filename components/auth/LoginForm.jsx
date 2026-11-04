"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import FormField from "@/components/auth/FormField";
import FormMessage from "@/components/auth/FormMessage";
import PasswordField from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/button";
import { login } from "@/app/actions/auth";
import { validateEmail, validatePassword } from "@/lib/validation";

export default function LoginForm({ onForgot }) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  // Hapus pesan error kolom yang sedang diubah pengguna.
  const clear = (field) => () => {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFeedback((current) => (current?.type === "error" ? null : current));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    // Validasi lokal sebelum mengirim data ke server
    const next = { 
      email: validateEmail(email), 
      password: validatePassword(password) 
    };
    
    setErrors(next);
    if (next.email || next.password) return;

    // Jalankan Server Action `login` dari Tria
    startTransition(async () => {
      const result = await login(formData);
      
      // Jika Server Action mengembalikan error tanpa melakukan redirect
      if (result?.error) {
        setFeedback({ type: "error", text: result.error });
      }
    });
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

        <PasswordField
          name="password"
          autoComplete="current-password"
          error={errors.password}
          onChange={clear("password")}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex min-h-11 items-center gap-2">
            <input type="checkbox" name="remember" className="size-4 accent-aira-primary" /> Ingat saya
          </label>
          <button
            type="button"
            onClick={onForgot}
            className="min-h-11 font-semibold text-aira-primary underline"
          >
            Lupa kata sandi?
          </button>
        </div>

        {feedback && <FormMessage type={feedback.type}>{feedback.text}</FormMessage>}

        <Button
          type="submit"
          disabled={isPending}
          className="h-14 w-full rounded-full bg-aira-primary px-8 text-lg font-semibold text-white shadow-soft hover:bg-aira-primary-dark disabled:opacity-50"
        >
          {isPending ? "Sedang masuk…" : "Masuk"}
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