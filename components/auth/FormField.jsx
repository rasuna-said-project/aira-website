import { Input } from "@/components/ui/input";

// Kolom isian dengan ikon, label, dan pesan error di bawahnya.
export default function FormField({ icon: Icon, label, name, error, onChange, children, ...inputProps }) {
  return (
    <div>
      <label className="block">
        <span className="mb-2 block text-[15px] font-semibold">{label}</span>
        <span className="relative block">
          <Icon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-aira-primary" aria-hidden="true" />
          <Input
            id={name}
            name={name}
            onChange={onChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className="h-13 rounded-2xl border-aira-primary/20 bg-white pl-12 pr-4 text-base focus-visible:border-aira-primary focus-visible:ring-aira-secondary/30 aria-invalid:border-aira-danger aria-invalid:ring-aira-danger/20 md:text-base"
            {...inputProps}
          />
          {children}
        </span>
      </label>
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm font-medium text-aira-danger-dark">
          {error}
        </p>
      )}
    </div>
  );
}
