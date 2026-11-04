import { CheckCircle2 } from "lucide-react";

// Pesan hasil kirim form. type: "error" | "success".
export default function FormMessage({ type, children }) {
  const success = type === "success";
  return (
    <p
      role={success ? "status" : "alert"}
      className={`rounded-2xl px-4 py-3 text-sm font-medium ${
        success ? "bg-aira-sage/35 text-aira-primary" : "bg-aira-peach/20 text-aira-danger-dark"
      }`}
    >
      {success && <CheckCircle2 className="mr-2 inline size-4" aria-hidden="true" />}
      {children}
    </p>
  );
}
