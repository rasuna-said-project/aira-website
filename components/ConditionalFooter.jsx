"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

   const hideFooter =
    pathname === "/daftar" ||
    pathname === "/masuk";

if (hideFooter) {
  return null;
}

return (
  <Footer waveFill={pathname === "/" ? "#F6F1E9" : undefined} />
);
}