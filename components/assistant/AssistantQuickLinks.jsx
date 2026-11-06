import Link from "next/link";
import { Calculator, MapPinned } from "lucide-react";

import { ASSISTANT_LINKS } from "./assistant.constants";

const icons = {
  calculator: Calculator,
  map: MapPinned,
};

export default function AssistantQuickLinks() {
  return (
    <nav
      className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
      aria-label="Fitur AIRA lainnya"
    >
      {ASSISTANT_LINKS.map((item) => {
        const Icon = icons[item.icon];

        return (
          <Link
            key={item.href}
            href={item.href}
            className="
              inline-flex items-center gap-1.5
              text-xs font-semibold text-aira-primary
              transition-colors hover:text-aira-secondary
              sm:text-sm
            "
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
} 
