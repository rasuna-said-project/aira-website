import DashboardPageHead from "@/components/dashboard/DashboardPageHead";
import ProfilKeluargaForm from "@/components/dashboard/kondisi-air/ProfilKeluargaForm";
import RingkasanKondisi, { RingkasanKosong } from "@/components/dashboard/kondisi-air/RingkasanKondisi";
import RiwayatPerhitungan from "@/components/dashboard/kondisi-air/RiwayatPerhitungan";
import { ambilProfilDashboard } from "@/lib/dashboardProfile";
import { hitungStatusDashboard } from "@/lib/statusDashboard";
import { formatTanggalIso } from "@/lib/waktuDashboard";
import { ambilDataDashboard } from "@/services/dashboardService";

export const metadata = {
  title: "Kondisi Air Rumah Tangga - AIRA",
};

// B02 - Kondisi Air Rumah Tangga: ringkasan, riwayat perhitungan, dan profil keluarga.
// Data sementara dari services/dashboardService.js (simulasi).
export default async function KondisiAirRumahTanggaPage() {
  const profile = await ambilProfilDashboard();
  const { keluarga, catatan, riwayat } = await ambilDataDashboard();

  // Ringkasan memakai catatan terbaru (sumber yang sama dengan B01).
  const terbaru = catatan[0] ?? null;
  const status = terbaru
    ? hitungStatusDashboard({
        liter: terbaru.liter,
        anggota: keluarga.anggota,
        anggotaMhm: keluarga.anggotaMhm,
        kondisiSumberAir: keluarga.kondisiSumberAir,
      })
    : null;
  const tanggal = terbaru ? formatTanggalIso(terbaru.tanggal) : null;

  // Status tiap perhitungan dihitung dari data yang tersimpan pada riwayat tersebut.
  const baris = riwayat.map((r) => ({
    ...r,
    tanggalPenuh: formatTanggalIso(r.tanggal).tanggalPenuh,
    status: hitungStatusDashboard({
      liter: r.liter,
      anggota: r.anggota,
      anggotaMhm: r.anggotaMhm,
      kondisiSumberAir: r.kondisiSumberAir,
    }),
  }));

  const awalProfil = {
    ...keluarga,
    namaRumahTangga: keluarga.namaRumahTangga ?? `Keluarga ${profile.full_name || "AIRA"}`,
  };

  return (
    <div className="space-y-6">
      <DashboardPageHead
        title="Kondisi Air Rumah Tangga"
        desc="Ringkasan kondisi terkini, riwayat perhitungan, dan profil keluarga yang dipakai AIRA untuk menghitung."
      />

      {terbaru && status ? (
        <RingkasanKondisi
          status={status}
          catatan={terbaru}
          keluarga={keluarga}
          tanggalPenuh={tanggal.tanggalPenuh}
          tanggalPanjang={tanggal.tanggalPanjang}
        />
      ) : (
        <RingkasanKosong />
      )}

      <RiwayatPerhitungan riwayat={baris} />

      <ProfilKeluargaForm awal={awalProfil} />
    </div>
  );
}
