import { Info } from "lucide-react";

// Disclaimer langkah yang disarankan: langkah berasal dari informasi/data yang tersedia
// bebas di internet. Ditempatkan di bawah card "Langkah yang Disarankan" dengan lebar yang
// sama. Netral (sand), bukan kuning, agar tidak terbaca sebagai status Waspada.
// `className` mengatur kapan ditampilkan (desktop di kolom kiri, mobile di bagian akhir).
export default function DisclaimerLangkah({ className = "flex" }) {
  return (
    <div
      className={`gap-3 rounded-2xl bg-aira-sand p-4 text-[15px] leading-relaxed text-aira-text/80 ${className}`}
    >
      <Info className="mt-0.5 size-5 shrink-0 text-aira-primary" aria-hidden="true" />
      <p>
        Disclaimer: Langkah yang disarankan di atas disusun dari informasi dan data yang tersedia bebas di internet
        (antara lain panduan umum WHO, UNICEF, dan CDC) yang diadaptasi AIRA. Langkah ini bersifat umum dan bukan
        pengganti arahan otoritas atau tenaga ahli setempat.
      </p>
    </div>
  );
}
