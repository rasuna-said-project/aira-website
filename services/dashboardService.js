import { cache } from "react";
import {
  catatanMonitoringSimulasi,
  kontribusiSimulasi,
  profilKeluargaSimulasi,
} from "@/data/dashboardSimulasi";

// Sumber data Dashboard User. SAAT INI memakai data simulasi (data/dashboardSimulasi.js).
// Nanti isi fungsi ini diganti pemanggilan Supabase / endpoint Tria; bentuk keluarannya
// dipertahankan agar komponen tidak perlu diubah. `cache` menjaga agar layout dan halaman
// yang meminta data yang sama dalam satu request hanya memanggil sumber data satu kali.
export const ambilDataDashboard = cache(async () => {
  return {
    keluarga: profilKeluargaSimulasi,
    catatan: catatanMonitoringSimulasi,
    kontribusi: kontribusiSimulasi,
  };
});
