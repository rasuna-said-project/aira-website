import DetailTitikAir from "@/components/navigasi/DetailTitikAir";
import TitikAirTidakDitemukan from "@/components/navigasi/TitikAirTidakDitemukan";
import { getDetailTitikAirAction } from "@/app/actions/navigasi-air";

async function cariTitik(params) {
  const { id } = await params;
  const result = await getDetailTitikAirAction(id);

  return result.success ? result.data : null;
}

export async function generateMetadata({ params }) {
  const titik = await cariTitik(params);

  return {
    title: titik
      ? `${titik.name} - AIRA`
      : "Titik Air Tidak Ditemukan - AIRA",
  };
}

export default async function DetailTitikAirPage({ params }) {
  const titik = await cariTitik(params);

  if (!titik) {
    return <TitikAirTidakDitemukan />;
  }

  return <DetailTitikAir titik={titik} />;
}