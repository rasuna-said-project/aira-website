"use client";

// Elemen formulir Dashboard User sesuai Figma Make: kolom input, label + petunjuk, dan sakelar.
export const inputCls =
  "w-full rounded-2xl border border-aira-primary/20 bg-white px-4 py-3.5 min-h-[52px] focus:border-aira-primary focus:outline-none transition-colors";

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-aira-text/60">{hint}</span>}
    </label>
  );
}

export function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${on ? "bg-aira-primary" : "bg-aira-text/25"}`}
    >
      <span
        className={`absolute top-1 size-6 rounded-full bg-white shadow transition-all ${on ? "left-7" : "left-1"}`}
      />
    </button>
  );
}
