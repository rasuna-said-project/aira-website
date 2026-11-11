import { cache } from "react";
import { TITIK_AIR_SIMULASI } from "@/data/titikAirSimulasi";

// Daftar titik air terverifikasi untuk Kelola Titik Air (Dashboard Admin, C03).
// SIMULASI: memakai data yang sama dengan halaman Navigasi Air (data/titikAirSimulasi.js),
// sehingga daftar admin = titik yang tampil di Navigasi Air.
// TODO (Tria): ganti dengan query tabel water_points (verification_status = Terverifikasi)
// dan sediakan Server Action edit yang mencatat perubahan ke jejak audit
// (water_point_contributions, contribution_reviews, updated_at).
export const ambilTitikAirTerverifikasi = cache(async () =>
  TITIK_AIR_SIMULASI.filter((t) => t.verification === "Terverifikasi")
);
