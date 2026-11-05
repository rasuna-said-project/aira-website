import { hitungKetahananAir } from '@/services/calculatorService';

export default function KalkulatorPage() {
  const handleSubmit = (formData) => {
    // 1. Panggil kalkulator buatan Tria
    const hasil = hitungKetahananAir({
      jumlahAnggota: Number(formData.jumlahAnggota),
      sumberAirUtama: formData.sumberAir,
      kondisiSumberAir: formData.kondisiSumber,
      volumeCadanganLiter: Number(formData.volumeCadangan),
      luasAtapM2: Number(formData.luasAtap),
      kebutuhanMhm: formData.kebutuhanMhm,
      jumlahAnggotaMhm: Number(formData.jumlahMhm),
    });

    // 2. Gunakan hasilnya di UI
    console.log("Status Ketahanan:", hasil.status);
    console.log("Durasi (Hari):", hasil.durasiHari);
  };

  return (
    // Form UI sederhana
    <div>...</div>
  );
}