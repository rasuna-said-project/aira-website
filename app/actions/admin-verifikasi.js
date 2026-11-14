"use server";

import {
  getAdminWaterPointContributions,
  reviewWaterPointContribution,
} from "@/services/contributionService";

const UI_TO_DATABASE_STATUS = {
  Terverifikasi: "approved",
  "Perlu Perbaikan": "needs_revision",
  Ditolak: "rejected",
};

export async function getAdminContributionsAction() {
  try {
    const data = await getAdminWaterPointContributions();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      "Gagal mengambil kontribusi admin:",
      error
    );

    return {
      success: false,
      message:
        error.message ||
        "Gagal mengambil data kontribusi.",
      data: [],
    };
  }
}

export async function reviewContributionAction({
  contributionId,
  status,
  notes,
}) {
  try {
    const reviewStatus = UI_TO_DATABASE_STATUS[status];

    if (!reviewStatus) {
      throw new Error("Keputusan verifikasi tidak valid.");
    }

    const data = await reviewWaterPointContribution({
      contributionId,
      reviewStatus,
      reviewNotes: notes || null,
    });

    return {
      success: true,
      data,
      message: "Keputusan verifikasi berhasil disimpan.",
    };
  } catch (error) {
    console.error(
      "Gagal menyimpan keputusan verifikasi:",
      error
    );

    return {
      success: false,
      message:
        error.message ||
        "Gagal menyimpan keputusan verifikasi.",
    };
  }
}