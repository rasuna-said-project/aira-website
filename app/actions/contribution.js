"use server";

import { revalidatePath } from "next/cache";

import {
  getPublicWaterPoints,
  submitWaterPointContribution,
  getMyWaterPointContributions,
  getAdminWaterPointContributions,
  reviewWaterPointContribution,
} from "@/services/contributionService";

// ======================================================
// PUBLIC
// ======================================================

export async function getPublicWaterPointsAction() {
  try {
    const data = await getPublicWaterPoints();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Gagal mengambil data titik air.",
      data: [],
    };
  }
}

// ======================================================
// USER
// ======================================================

export async function submitContributionAction(input) {
  try {
    const data = await submitWaterPointContribution(input);

    revalidatePath("/navigasi-air");
    revalidatePath("/dashboard/kontribusi");

    return {
      success: true,
      message: "Kontribusi berhasil dikirim dan menunggu pemeriksaan admin.",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Kontribusi gagal dikirim.",
      data: null,
    };
  }
}

export async function getMyContributionsAction() {
  try {
    const data = await getMyWaterPointContributions();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Gagal mengambil riwayat kontribusi.",
      data: [],
    };
  }
}

// ======================================================
// ADMIN
// ======================================================

export async function getAdminContributionsAction() {
  try {
    const data = await getAdminWaterPointContributions();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Gagal mengambil antrean kontribusi.",
      data: [],
    };
  }
}

export async function reviewContributionAction({
  contributionId,
  reviewStatus,
  reviewNotes,
}) {
  try {
    const data = await reviewWaterPointContribution({
      contributionId,
      reviewStatus,
      reviewNotes,
    });

    revalidatePath("/navigasi-air");
    revalidatePath("/admin/verifikasi");
    revalidatePath("/dashboard/kontribusi");

    return {
      success: true,
      message:
        reviewStatus === "approved"
          ? "Kontribusi berhasil disetujui."
          : reviewStatus === "rejected"
            ? "Kontribusi berhasil ditolak."
            : "Kontribusi berhasil dikembalikan untuk revisi.",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Proses review gagal.",
      data: null,
    };
  }
}