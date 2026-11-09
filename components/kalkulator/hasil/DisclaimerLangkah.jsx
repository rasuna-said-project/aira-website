import { Info } from "lucide-react";

// Disclaimer di atas "Langkah yang Disarankan" (masukan mentor): langkah berasal dari
// informasi/data yang tersedia bebas di internet. Netral (sand), bukan kuning, agar tidak
// terbaca sebagai status Waspada. Ditampilkan untuk semua status.
export default function DisclaimerLangkah() {
  return (
    <div className="flex gap-3 rounded-2xl bg-aira-sand p-4 text-sm leading-relaxed text-aira-text/80">
      <Info className="mt-0.5 size-5 shrink-0 text-aira-primary" aria-hidden="true" />
      <p>
        Disclaimer: Langkah yang disarankan di bawah ini disusun dari informasi dan data yang tersedia bebas di internet
        (antara lain panduan umum WHO, UNICEF, dan CDC) yang diadaptasi AIRA. Langkah ini bersifat umum dan bukan
        pengganti arahan otoritas atau tenaga ahli setempat.
      </p>
    </div>
  );
}
