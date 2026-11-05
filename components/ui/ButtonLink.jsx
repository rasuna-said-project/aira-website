import Link from "next/link";

const base =
  "inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full px-7 py-4 font-semibold transition-colors sm:w-auto";

const variants = {
  primary: "bg-aira-primary text-white shadow-soft hover:bg-aira-primary-dark",
  outline:
    "border-2 border-aira-primary text-aira-primary hover:bg-aira-primary/10",
};

export default function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}