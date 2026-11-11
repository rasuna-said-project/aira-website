/*
 * MOCK DATA ADMIN AIRA
 *
 * Data ini hanya digunakan untuk kebutuhan
 * pengembangan frontend.
 *
 * Nanti ketika Supabase sudah siap,
 * sumber data dapat diganti tanpa perlu
 * mengubah keseluruhan komponen UI.
 */

// ============================================
// 1. PROFIL ADMIN
// ============================================

export const MOCK_ADMIN = {
  name: "Admin AIRA",
  initials: "AA",
  role: "Peninjau & pengelola data",
  email: "admin@aira.id",
};

// ============================================
// 2. STATISTIK DASHBOARD
// ============================================

export const MOCK_ADMIN_STATS = [
  {
    id: "verified",
    title: "Total Titik Air Terverifikasi",
    value: 24,
    description: "Aktif di direktori publik",
    icon: "droplet",
    color: "teal",
    href: "/admin/titik-air",
  },
  {
    id: "pending",
    title: "Antrean Verifikasi",
    value: 4,
    description: "Menunggu tinjauan admin",
    icon: "clipboard-list",
    color: "peach",
    href: "/admin/verifikasi",
  },
  {
    id: "activity",
    title: "Aktivitas Admin Hari Ini",
    value: 6,
    description: "6 aktivitas tercatat",
    icon: "activity",
    color: "sage",
    href: "/admin",
  },
];

// ============================================
// 3. STATUS SELURUH KONTRIBUSI
// ============================================

export const MOCK_CONTRIBUTION_STATUS = [
  {
    id: "verified",
    label: "Terverifikasi",
    value: 1,
    color: "#176B78",
  },
  {
    id: "pending",
    label: "Menunggu",
    value: 4,
    color: "#4EA8DE",
  },
  {
    id: "revision",
    label: "Perlu Perbaikan",
    value: 1,
    color: "#E5A01B",
  },
  {
    id: "rejected",
    label: "Ditolak",
    value: 1,
    color: "#D4573A",
  },
];

// ============================================
// 4. DATA JEJAK AUDIT SISTEM
// ============================================

export const MOCK_AUDIT_LOGS = [
  {
    id: 1,
    date: "11 Okt 2026",
    time: "11.20",
    actor: "Siti Rahma",
    action: "Kontribusi baru",
    actionType: "contribution",
    object: "Posko Bantuan Tangki Air BPBD Rongkop",
    description: "Masuk antrean verifikasi",
  },
  {
    id: 2,
    date: "11 Okt 2026",
    time: "10.45",
    actor: "Admin AIRA",
    action: "Verifikasi",
    actionType: "verification",
    object: "Sumur Bor Komunal Padukuhan Bohol",
    description: "Kontribusi berhasil diverifikasi",
  },
  {
    id: 3,
    date: "11 Okt 2026",
    time: "09.30",
    actor: "Admin AIRA",
    action: "Edit titik air",
    actionType: "edit",
    object: "Embung Botodayaan",
    description: "Informasi titik air diperbarui",
  },
  {
    id: 4,
    date: "10 Okt 2026",
    time: "15.10",
    actor: "Rahmat Yusuf",
    action: "Kontribusi baru",
    actionType: "contribution",
    object: "Sumur Gali Masjid Al-Ikhlas Bohol",
    description: "Masuk antrean verifikasi",
  },
  {
    id: 5,
    date: "10 Okt 2026",
    time: "13.25",
    actor: "Admin AIRA",
    action: "Verifikasi",
    actionType: "verification",
    object: "Tandon Air SDN Pucanganom",
    description: "Kontribusi berhasil diverifikasi",
  },
  {
    id: 6,
    date: "10 Okt 2026",
    time: "09.15",
    actor: "Tri Wahyuni",
    action: "Kontribusi baru",
    actionType: "contribution",
    object: "Mata Air Pundung Rongkop",
    description: "Masuk antrean verifikasi",
  },
];
