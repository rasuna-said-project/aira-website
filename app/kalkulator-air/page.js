import KalkulatorForm from "@/components/kalkulator/KalkulatorForm";
import { ambilInputKalkulatorTerakhir } from "@/services/dashboardService";

export const metadata = {
  title: "Kalkulator Ketahanan Air - AIRA",
};

export default async function KalkulatorPage() {
  // Pengguna login yang pernah mengisi: formulir terisi kondisi terakhir dan dapat
  // disesuaikan dengan kondisi sekarang. Tamu atau pengguna baru: formulir kosong.
  const awal = await ambilInputKalkulatorTerakhir();

  return <KalkulatorForm awal={awal} />;
}