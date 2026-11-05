export default function ValueCard({ icon: Icon, label, title, desc, iconStyle, offset = false }) {
  return (
    <div
      className={`rounded-3xl bg-white p-6 shadow-soft sm:p-7 ${
        offset ? "sm:translate-y-6" : ""
      }`}
    >
      <span className={`grid size-12 place-items-center rounded-2xl ${iconStyle}`}>
        <Icon />
      </span>
      <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-aira-text/55">
        {label}
      </p>
      <h3 className="text-xl font-semibold text-aira-primary">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-aira-text/80">{desc}</p>
    </div>
  );
}
