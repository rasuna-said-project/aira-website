import {
  Calculator,
  MapPinned,
  MessageCircleHeart,
  Droplets,
  Brain,
  ShieldCheck,
  Zap,
} from "lucide-react";

// Konten statis halaman beranda. Ubah teks/tautan di sini tanpa menyentuh komponen.

export const HERO_CONTENT = {
  badge: "Smart Water Resilience for Every Woman",
  title: "Bersama Perempuan, Wujudkan Ketahanan Air",
  description:
    "AIRA membantu perempuan dan keluarga di daerah rawan kekeringan memahami cadangan air, menemukan titik air terdekat, dan bertindak lebih awal sebelum krisis datang.",
  primaryCta: { label: "Hitung Ketahanan Air", href: "/kalkulator-air" },
  secondaryCta: { label: "Cari Titik Air", href: "/navigasi-air" },
  note: "Gratis dan terbuka untuk semua. Tidak perlu login untuk menghitung.",
  image: {
    src: "/images/hero-perempuan-desa.jpg",
    alt: "Perempuan bekerja di bawah sinar matahari di desa pedesaan",
  },
  statusCard: {
    title: "Cadangan 5,2 hari",
    subtitle: "Keluarga 4 orang, status Waspada",
  },
};

export const FEATURES_CONTENT = {
  eyebrow: "Mulai dari sini",
  title: "Apa yang ingin Anda ketahui hari ini?",
  items: [
    {
      icon: Calculator,
      title: "Kalkulator Ketahanan Air",
      desc: "Hitung berapa hari cadangan air keluarga Anda akan bertahan dan dapatkan langkah yang tepat.",
      cta: "Hitung sekarang",
      href: "/kalkulator-air",
      tint: "bg-aira-sand",
    },
    {
      icon: MapPinned,
      title: "Navigasi Air",
      desc: "Temukan titik air terdekat lengkap dengan status verifikasi, ketersediaan, dan waktu pembaruan.",
      cta: "Cari titik air",
      href: "/navigasi-air",
      tint: "bg-white",
    },
    {
      icon: MessageCircleHeart,
      title: "AIRA Assistant",
      desc: "Tanyakan penghematan air, kebersihan menstruasi, dan sanitasi dalam bahasa yang sederhana.",
      cta: "Mulai bertanya",
      href: "/assistant",
      tint: "bg-aira-sage/30",
    },
  ],
};

export const VALUES_CONTENT = {
  eyebrow: "Nilai AIRA",
  title: "Dari akses menuju aksi",
  description:
    "Empat prinsip yang memandu setiap fitur: Access, Intelligence, Resilience, Action.",
  items: [
    {
      icon: Droplets,
      key: "Access",
      title: "Akses",
      desc: "Informasi titik air dan solusi praktis yang mudah dijangkau semua keluarga, tanpa perlu masuk akun.",
      iconStyle: "bg-aira-secondary/15 text-aira-secondary",
    },
    {
      icon: Brain,
      key: "Intelligence",
      title: "Kecerdasan",
      desc: "Perhitungan cerdas dan asisten yang membantu membaca kondisi air rumah tangga.",
      iconStyle: "bg-aira-primary/10 text-aira-primary",
    },
    {
      icon: ShieldCheck,
      key: "Resilience",
      title: "Ketahanan",
      desc: "Membangun kesiapan keluarga menghadapi kemarau panjang dan krisis air.",
      iconStyle: "bg-aira-sage/40 text-aira-primary",
    },
    {
      icon: Zap,
      key: "Action",
      title: "Aksi",
      desc: "Rekomendasi langkah nyata yang bisa dilakukan hari ini, bersama komunitas.",
      iconStyle: "bg-aira-peach/25 text-aira-coral-dark",
    },
  ],
}; 
export const ABOUT_CONTENT = {
  id: "tentang-kami",
  eyebrow: "Tentang Kami",
  title: "Apa itu AIRA?",
  paragraphs: [
    "AIRA (Access, Intelligence, Resilience, Action) adalah platform web yang membantu perempuan dan keluarga di daerah rawan kekeringan memahami kondisi air rumah tangga dan menentukan langkah yang tepat. Lewat Kalkulator Ketahanan Air, Navigasi Air, dan AIRA Assistant, AIRA mengubah informasi air dan sanitasi menjadi tindakan nyata sebelum krisis datang.",
    "AIRA dikembangkan oleh Tim Rasuna Said sebagai proyek akhir Bootcamp AI Full Stack Web Development Perempuan Inovasi GENerasi AI 2026, dengan tema Air, Sanitasi, dan Ketahanan Iklim.",
  ],
  photoCaption: "Foto ilustrasi",
  mosaic: [
    { src: "/images/about/air-perempuan.jpg", alt: "Perempuan dan anak mengisi baskom air di stasiun air biru beratap seng", cls: "rounded-[1.25rem_2.5rem_1.25rem_2.5rem]" },
    { src: "/images/about/air-tangki.webp", alt: "Warga mengisi jeriken dan botol dari tangki air di samping truk", cls: "rounded-[2.5rem_1.25rem_2.5rem_1.25rem]" },
    { src: "/images/about/air-warga.jpg", alt: "Kerumunan warga mengambil air dari sumur", cls: "rounded-[2.5rem_1.25rem_2.5rem_1.25rem]" },
    { src: "/images/about/air-keran.png", alt: "Tangan menampung air yang mengalir dari keran", cls: "rounded-[1.25rem_2.5rem_1.25rem_2.5rem]" },
  ],
  teamTitle: "Tim Pengembang",
  teamDesc: "Peserta Bootcamp AI Full Stack Web Development Perempuan Inovasi GENerasi AI 2026.",
  team: [
    { name: "Tria Agusti Khoirun Nisa’", role: "Team Lead · Backend & AI Developer", photo: "/images/about/tim-tria.png", lead: true },
    { name: "Amanda Putri", role: "Database & Backend Developer", photo: "/images/about/tim-amanda.png", lead: false },
    { name: "Reikananta Fauziah Lazuardi", role: "Frontend Developer · UI Designer", photo: "/images/about/tim-reikananta.png", lead: false },
    { name: "Siti Hafsoh", role: "Frontend Developer · UI Designer", photo: "/images/about/tim-hafsoh.png", lead: false },
  ],
};
