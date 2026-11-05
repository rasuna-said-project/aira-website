// Label kolom dengan ikon dan penanda Wajib/Opsional.
export default function FieldLabel({ icon: Icon, badge, children }) {
  return (
    <span className="mb-2 flex items-center gap-2 text-[15px] font-semibold">
      <Icon className="size-4 text-aira-primary" aria-hidden="true" /> {children}
      {badge && (
        <span
          className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            badge === "Wajib" ? "bg-aira-primary/10 text-aira-primary-dark" : "bg-aira-sand text-aira-text/70"
          }`}
        >
          {badge}
        </span>
      )}
    </span>
  );
}
