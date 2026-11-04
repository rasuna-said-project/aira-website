import Image from "next/image";

// Kartu bergaya sama untuk halaman Masuk dan Daftar.
export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="relative grid min-h-[calc(100vh-72px)] place-items-center overflow-hidden bg-aira-bg px-4 py-10 sm:px-5 sm:py-12">
      <div
        className="absolute -left-20 -top-20 size-[340px] rounded-[50%_50%_40%_60%] bg-aira-sage/40 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -right-20 size-[340px] rounded-[40%_60%_55%_45%] bg-aira-peach/25 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[480px] rounded-[28px] border border-aira-primary/5 bg-white p-5 shadow-soft sm:p-10">
        <Image
          src="/images/aira-logo.svg"
          alt="AIRA — Access, Intelligence, Resilience, Action"
          width={240}
          height={86}
          priority
          className="mx-auto h-20 w-auto object-contain sm:h-24"
        />
        <h1 className="mt-4 text-center font-heading text-2xl font-bold text-aira-primary sm:text-3xl">{title}</h1>
        <p className="mt-2 text-center text-[15px] text-aira-text/75">{subtitle}</p>

        {children}

        <p className="mt-4 text-center text-xs text-aira-text/60">
          Kalkulator, Navigasi Air, dan AIRA Assistant tetap dapat dipakai tanpa akun.
        </p>
      </div>
    </div>
  );
}
