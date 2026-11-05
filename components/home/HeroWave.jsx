// Gelombang pemisah antara hero dan section fitur.
export default function HeroWave() {
  return (
    <div className="relative h-16 bg-aira-bg leading-0 sm:h-24" aria-hidden="true">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        focusable="false"
      >
        <path
          d="M0 12c210 54 390 58 580 19 214-44 385-38 546 3 119 31 218 35 314 15v71H0z"
          className="fill-aira-secondary/35"
        />
        <path
          d="M0 52c220 35 410 31 594-3 209-38 379-31 540 8 112 27 211 29 306 8v55H0z"
          className="fill-aira-sage/40"
        />
      </svg>
    </div>
  );
} 