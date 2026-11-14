import { createClient } from "@/lib/supabase/server";

const REVIEW_STATUS_LABELS = {
  pending: "Menunggu Verifikasi",
  approved: "Terverifikasi",
  needs_revision: "Perlu Perbaikan",
  rejected: "Ditolak",
};

function throwIfError(error) {
  if (error) {
    throw new Error(
      error.message || "Terjadi kesalahan pada database."
    );
  }
}

async function getAuthenticatedClient() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  throwIfError(error);

  if (!user) {
    throw new Error("Silakan masuk terlebih dahulu.");
  }

  return { supabase, user };
}

async function getAdminClient() {
  const { supabase, user } = await getAuthenticatedClient();

  // Pemeriksaan role dilakukan di server.
  // Fungsi database ini juga digunakan oleh kebijakan RLS AIRA.
  const { data: isAdmin, error } = await supabase.rpc(
    "is_aira_admin"
  );

  throwIfError(error);

  if (isAdmin !== true) {
    throw new Error("Kamu tidak memiliki akses sebagai admin.");
  }

  return { supabase, user };
}

function formatSubmittedAt(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

function formatCoordinates(latitude, longitude) {
  if (latitude == null || longitude == null) {
    return "-";
  }

  return `${latitude}, ${longitude}`;
}

function formatAddress(contribution) {
  return [
    contribution.proposed_address_detail,
    contribution.proposed_village,
  ]
    .filter(Boolean)
    .join(", ") || "-";
}

function mapContributionToUI(contribution, latestReview) {
  const status =
    latestReview?.review_status || "pending";

  return {
    id: contribution.contribution_id,

    name:
      contribution.proposed_point_name ||
      "Nama titik air belum tersedia",

    verificationStatus:
      REVIEW_STATUS_LABELS[status] ||
      "Menunggu Verifikasi",

    availability:
      contribution.proposed_availability_status ||
      "unknown",

    contributor: contribution.contributor_user_id,

    submittedAt: formatSubmittedAt(
      contribution.submitted_at
    ),

    category:
      contribution.proposed_water_source_type || "-",

    contact: "-",

    address: formatAddress(contribution),

    coordinates: formatCoordinates(
      contribution.proposed_latitude,
      contribution.proposed_longitude
    ),

    description:
      contribution.proposed_description ||
      contribution.proposed_access_information ||
      "-",

    notes:
      latestReview?.review_notes ||
      contribution.notes ||
      "",

    evidenceUrl: contribution.evidence_url || null,

    contributionType: contribution.contribution_type,

    waterPointId: contribution.water_point_id,

    reviewStatus: status,
  };
}

// ======================================================
// PUBLIC: Mengambil daftar titik air terverifikasi
// ======================================================

export async function getPublicWaterPoints() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("water_points")
    .select(`
      water_point_id,
      point_name,
      water_source_type,
      description,
      province_id,
      city_regency_id,
      district_id,
      village,
      address_detail,
      latitude,
      longitude,
      availability_status,
      access_information,
      opening_hours,
      verification_status,
      is_active,
      is_simulation,
      created_at,
      updated_at
    `)
    .eq("is_active", true)
    .eq("verification_status", "verified")
    .eq("is_simulation", false)
    .order("point_name", { ascending: true });

  throwIfError(error);

  return data || [];
}

// ======================================================
// USER: Mengirim kontribusi titik air
// ======================================================

export async function submitWaterPointContribution(input) {
  const { supabase, user } = await getAuthenticatedClient();

  if (!input || typeof input !== "object") {
    throw new Error("Data kontribusi tidak valid.");
  }

  const contributionType = input.contribution_type;

  if (!["new_point", "update_point"].includes(contributionType)) {
    throw new Error("Jenis kontribusi tidak valid.");
  }

  const pointName = input.proposed_point_name?.trim();
  const sourceType = input.proposed_water_source_type;

  if (contributionType === "new_point") {
    if (!pointName) {
      throw new Error("Nama titik air wajib diisi.");
    }

    if (!sourceType) {
      throw new Error("Jenis sumber air wajib diisi.");
    }

    if (
      !input.proposed_province_id ||
      !input.proposed_city_regency_id
    ) {
      throw new Error("Provinsi dan kabupaten/kota wajib diisi.");
    }
  }

  if (
    contributionType === "update_point" &&
    !input.water_point_id
  ) {
    throw new Error("Titik air yang akan diperbarui wajib dipilih.");
  }

  const latitude = input.proposed_latitude;
  const longitude = input.proposed_longitude;

  const hasLatitude =
    latitude !== null &&
    latitude !== undefined &&
    latitude !== "";

  const hasLongitude =
    longitude !== null &&
    longitude !== undefined &&
    longitude !== "";

  if (hasLatitude !== hasLongitude) {
    throw new Error("Latitude dan longitude harus diisi berpasangan.");
  }

  const parsedLatitude = hasLatitude ? Number(latitude) : null;
  const parsedLongitude = hasLongitude ? Number(longitude) : null;

  if (
    hasLatitude &&
    (
      !Number.isFinite(parsedLatitude) ||
      !Number.isFinite(parsedLongitude) ||
      parsedLatitude < -90 ||
      parsedLatitude > 90 ||
      parsedLongitude < -180 ||
      parsedLongitude > 180
    )
  ) {
    throw new Error("Koordinat tidak valid.");
  }

  const payload = {
    contributor_user_id: user.id,

    water_point_id:
      contributionType === "update_point"
        ? Number(input.water_point_id)
        : null,

    contribution_type: contributionType,

    proposed_point_name: pointName || null,
    proposed_water_source_type: sourceType || null,
    proposed_description: input.proposed_description || null,

    proposed_province_id: input.proposed_province_id
      ? Number(input.proposed_province_id)
      : null,

    proposed_city_regency_id: input.proposed_city_regency_id
      ? Number(input.proposed_city_regency_id)
      : null,

    proposed_district_id: input.proposed_district_id
      ? Number(input.proposed_district_id)
      : null,

    proposed_village: input.proposed_village || null,
    proposed_address_detail: input.proposed_address_detail || null,

    proposed_latitude: parsedLatitude,
    proposed_longitude: parsedLongitude,

    proposed_availability_status:
      input.proposed_availability_status || null,

    proposed_access_information:
      input.proposed_access_information || null,

    proposed_opening_hours:
      input.proposed_opening_hours || null,

    evidence_url: input.evidence_url || null,
    notes: input.notes || null,
  };

  if (
    contributionType === "update_point" &&
    (
      !Number.isSafeInteger(payload.water_point_id) ||
      payload.water_point_id <= 0
    )
  ) {
    throw new Error("ID titik air tidak valid.");
  }

  const { data, error } = await supabase
    .from("water_point_contributions")
    .insert(payload)
    .select("*")
    .single();

  throwIfError(error);

  return data;
}

// ======================================================
// USER: Melihat kontribusi milik sendiri
// ======================================================

export async function getMyWaterPointContributions() {
  const { supabase, user } = await getAuthenticatedClient();

  const { data: contributions, error } = await supabase
    .from("water_point_contributions")
    .select("*")
    .eq("contributor_user_id", user.id)
    .order("submitted_at", { ascending: false });

  throwIfError(error);

  if (!contributions?.length) {
    return [];
  }

  const contributionIds = contributions.map(
    (item) => item.contribution_id
  );

  const { data: reviews, error: reviewError } = await supabase
    .from("contribution_reviews")
    .select("*")
    .in("contribution_id", contributionIds)
    .order("reviewed_at", { ascending: false })
    .order("review_id", { ascending: false });

  throwIfError(reviewError);

  const latestReviewByContribution = new Map();

  for (const review of reviews || []) {
    if (!latestReviewByContribution.has(review.contribution_id)) {
      latestReviewByContribution.set(
        review.contribution_id,
        review
      );
    }
  }

  return contributions.map((contribution) => {
    const latestReview = latestReviewByContribution.get(
      contribution.contribution_id
    );

    return {
      ...contribution,
      review: latestReview || null,
      status: latestReview?.review_status || "pending",
    };
  });
}

// ======================================================
// ADMIN: Melihat seluruh kontribusi
// ======================================================

export async function getAdminWaterPointContributions() {
  const { supabase } = await getAdminClient();

  const { data: contributions, error } = await supabase
    .from("water_point_contributions")
    .select("*")
    .order("submitted_at", { ascending: false });

  throwIfError(error);

  if (!contributions?.length) {
    return [];
  }

  const contributionIds = contributions.map(
    (item) => item.contribution_id
  );

  const { data: reviews, error: reviewError } = await supabase
    .from("contribution_reviews")
    .select("*")
    .in("contribution_id", contributionIds)
    .order("reviewed_at", { ascending: false })
    .order("review_id", { ascending: false });

  throwIfError(reviewError);

  const latestReviewByContribution = new Map();

  for (const review of reviews || []) {
    if (!latestReviewByContribution.has(review.contribution_id)) {
      latestReviewByContribution.set(
        review.contribution_id,
        review
      );
    }
  }

  return contributions.map((contribution) => {
    const latestReview = latestReviewByContribution.get(
      contribution.contribution_id
    );

    return mapContributionToUI(
      contribution,
      latestReview
    );
  });
}

// ======================================================
// ADMIN: Menyetujui, menolak, atau meminta revisi
// ======================================================

export async function reviewWaterPointContribution({
  contributionId,
  reviewStatus,
  reviewNotes = null,
}) {
  const { supabase } = await getAdminClient();

  const id = Number(contributionId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("ID kontribusi tidak valid.");
  }

  if (
    !["approved", "rejected", "needs_revision"].includes(
      reviewStatus
    )
  ) {
    throw new Error("Status review tidak valid.");
  }

  const { data, error } = await supabase.rpc(
    "review_water_point_contribution",
    {
      p_contribution_id: id,
      p_review_status: reviewStatus,
      p_review_notes: reviewNotes?.trim() || null,
    }
  );

  throwIfError(error);

  return data;
}