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