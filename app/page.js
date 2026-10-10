export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <span className="px-4 py-1.5 bg-aira-sage/20 text-aira-primary font-semibold text-sm rounded-full mb-4">
        Platform Ketahanan Air & Sanitasi
      </span>
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-aira-primary mb-4 leading-tight">
        AIRA — Smart Water Resilience <br /> for Every Woman
      </h1>
      <p className="text-lg text-aira-text max-w-2xl mb-8 font-body">
        Membantu perempuan dan keluarga mengelola kebutuhan air rumah tangga, memantau cadangan air, serta menemukan lokasi titik air alternatif.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <a
          href="/kalkulator-air"
          className="px-6 py-3 bg-aira-primary text-white font-medium rounded-aira hover:bg-aira-primary/90 transition"
        >
          Cek Ketahanan Air
        </a>
        <a
          href="/navigasi-air"
          className="px-6 py-3 bg-aira-sand text-aira-text font-medium rounded-aira border border-aira-sage hover:bg-aira-sand/80 transition"
        >
          Cari Titik Air
        </a>
      </div>
    </div>
  );
}