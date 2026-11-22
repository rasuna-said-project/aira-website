"use server";

import { createClient } from "@/lib/supabase/server";

function tanggalIndonesia(value) {
  const tanggal = new Date(value);

  return {
    tanggalPenuh: tanggal.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    waktu: tanggal.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export async function ambilRiwayatKalkulator() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      data: [],
      error: "Silakan login untuk melihat riwayat kalkulator.",
    };
  }

  const { data, error } = await supabase
    .from("water_assessments")
    .select(`
      assessment_id,
      available_water_liters,
      daily_need_liters,
      estimated_duration_days,
      water_condition,
      crisis_mode,
      assessment_notes,
      assessed_at,
      input_snapshot,
      assessment_recommendations (
        recommendation_id,
        recommendation_title,
        recommendation_detail,
        priority,
        action_status
      )
    `)
    .eq("assessed_by_user_id", user.id)
    .order("assessed_at", { ascending: false });

  if (error) {
    console.error(
      "[Riwayat Kalkulator] Gagal mengambil data:",
      error
    );

    return {
      ok: false,
      data: [],
      error: "Riwayat kalkulator gagal dimuat.",
    };
  }

  return {
    ok: true,
    data: data || [],
  };
}

export async function ambilRiwayatAssistant() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      data: [],
      error: "Silakan login untuk melihat riwayat percakapan.",
    };
  }

  const { data, error } = await supabase
    .from("assistant_interactions")
    .select(`
      interaction_id,
      user_question,
      assistant_response,
      sources,
      response_mode,
      created_at
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error(
      "[Riwayat Assistant] Gagal mengambil data:",
      error
    );

    return {
      ok: false,
      data: [],
      error: "Riwayat percakapan gagal dimuat.",
    };
  }

  return {
    ok: true,
    data: (data || []).reverse(),
  };
}
