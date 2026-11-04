"use client";

import { useState, useTransition } from "react";
import { Mail } from "lucide-react";
import FormField from "@/components/auth/FormField";
import FormMessage from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/app/actions/auth";

export default function ForgotPasswordForm({ onBack }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const res = await resetPassword(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setMessage(res.success);
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
          error={error}
          onChange={() => {
            setError("");
            setMessage("");
          }}
        />

        {message && <FormMessage type="success">{message}</FormMessage>}

        <Button
          type="submit"
          disabled={isPending}
          className="h-14 w-full rounded-full bg-aira-primary px-8 text-lg font-semibold text-white shadow-soft hover:bg-aira-primary-dark disabled:opacity-50"
        >
          {isPending ? "Mengirim…" : "Kirim tautan reset"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[15px]">
        <button
          type="button"
          onClick={onBack}
          className="min-h-11 font-semibold text-aira-primary underline"
        >
          Kembali ke Masuk
        </button>
      </p>
    </>
  );
}