import DetailTitikAir from "@/components/navigasi/DetailTitikAir";
import TitikAirTidakDitemukan from "@/components/navigasi/TitikAirTidakDitemukan";
import { TITIK_AIR_SIMULASI } from "@/data/titikAirSimulasi";

// Di Next.js 16, params berupa Promise.
const cariTitik = async (params) => {
  const { id } = await params;
  return TITIK_AIR_SIMULASI.find((t) => t.id === id);
};

export async function generateMetadata({ params }) {
  const titik = await cariTitik(params);
  return { title: titik ? `${titik.name} - AIRA` : "Titik Air Tidak Ditemukan - AIRA" };
}

export default async function DetailTitikAirPage({ params }) {
  const titik = await cariTitik(params);
  if (!titik) return <TitikAirTidakDitemukan />;
  return <DetailTitikAir titik={titik} />;
}
