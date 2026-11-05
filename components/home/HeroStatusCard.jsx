import { Droplets } from "lucide-react";

export default function HeroStatusCard({ title, subtitle }) {
  return (
    <div className="absolute -bottom-5 left-2 flex max-w-[calc(100%-1rem)] items-center gap-3 rounded-2xl bg-white p-3.5 shadow-soft sm:-bottom-6 sm:-left-8 sm:max-w-70 sm:p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-aira-sage/50 text-aira-primary">
        <Droplets />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-aira-text/65">{subtitle}</p>
      </div>
    </div>
  );
}
 