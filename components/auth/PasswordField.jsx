"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import FormField from "@/components/auth/FormField";

// Kolom kata sandi dengan tombol tampilkan/sembunyikan.
export default function PasswordField({ label = "Kata sandi", name = "password", ...props }) {
  const [show, setShow] = useState(false);
  return (
    <FormField
      icon={Lock}
      label={label}
      name={name}
      type={show ? "text" : "password"}
      placeholder="Minimal 8 karakter"
      {...props}
    >
      <button
        type="button"
        onClick={() => setShow(!show)}
        aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-aira-text/70 hover:bg-aira-sand"
      >
        {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
      </button>
    </FormField>
  );
}
