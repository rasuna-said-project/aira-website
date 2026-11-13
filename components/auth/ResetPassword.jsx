"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/app/actions/auth";

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sesuai.");
      return;
    }

    const formData = new FormData();

    formData.set("password", password);
    formData.set("confirm_password", confirmPassword);

    startTransition(async () => {
      const result = await updatePassword(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.success) {
        router.replace("/masuk?password_updated=1");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="new-password"
          className="block text-sm font-medium"
        >
          Password baru
        </label>

        <input
          id="new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Masukkan password baru"
          className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-aira-primary focus:ring-2 focus:ring-aira-primary/20"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirm-new-password"
          className="block text-sm font-medium"
        >
          Konfirmasi password baru
        </label>

        <input
          id="confirm-new-password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Ulangi password baru"
          className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-aira-primary focus:ring-2 focus:ring-aira-primary/20"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-full bg-aira-primary px-6 font-semibold text-white shadow-soft hover:bg-aira-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Memperbarui..." : "Simpan password baru"}
      </button>
    </form>
  );
}