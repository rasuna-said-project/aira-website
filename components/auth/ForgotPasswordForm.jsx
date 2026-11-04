"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import FormField from "@/components/auth/FormField";
import FormMessage from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/services/authService";
import { validateEmail } from "@/lib/validation";

export default function ForgotPasswordForm({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");

    setSent(false);
    const message = validateEmail(email);
    setError(message);
    if (message) return;

    setLoading(true);
    await requestPasswordReset({ email });
    setLoading(false);
    setSent(true);
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
          error={error}
          onChange={() => {
            setError("");
            setSent(false);
          }}
        />

        {sent && (
          <FormMessage type="success">
            Jika email terdaftar, tautan untuk mengatur ulang kata sandi telah dikirim.
          </FormMessage>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-14 w-full rounded-full bg-aira-primary px-8 text-lg font-semibold text-white shadow-soft hover:bg-aira-primary-dark"
        >
          {loading ? "Mengirim…" : "Kirim tautan reset"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[15px]">
        <button type="button" onClick={onBack} className="min-h-[44px] font-semibold text-aira-primary underline">
          Kembali ke Masuk
        </button>
      </p>
    </>
  );
}
