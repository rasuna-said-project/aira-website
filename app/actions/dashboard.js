"use server";

import { revalidatePath } from "next/cache";
import { simpanProfilKeluargaUser } from "@/services/dashboardService";
import { simpanCatatanMonitoring } from "@/services/monitoringService";

function segarkan() {
  revalidatePath("/dashboard", "layout");
}

// Halaman Kondisi Air Rumah Tangga: simpan profil keluarga
export async function simpanProfilKeluarga(input) {
  const hasil = await simpanProfilKeluargaUser(input);
  if (hasil.ok) segarkan();
  return hasil;
}

// Halaman Monitoring: catat kondisi air saat ini
export async function catatKondisiAir(input) {
  const hasil = await simpanCatatanMonitoring(input ?? {});
  if (hasil.ok) segarkan();
  return hasil;
}