export const INITIAL_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content:
    "Halo, saya AIRA Assistant. Saya siap membantu soal hemat air, kebersihan menstruasi, dan sanitasi keluarga. Apa yang ingin Anda tanyakan?",
  topics: [],
};

export const SUGGESTED_QUESTIONS = [
  "Cara hemat air saat kemarau",
  "Panduan MHM & sanitasi",
  "Cara mengolah air agar aman diminum",
  "Bagaimana memprioritaskan cadangan kritis?",
  "Apa arti hasil kalkulator saya?",
];

export const ASSISTANT_CONFIG = {
  title: "AIRA Assistant",
  subtitle: "Siap membantu, tanpa perlu login",
  mode: "Mode simulasi — respons menggunakan basis pengetahuan contoh.",
  placeholder: "Tulis pertanyaan Anda...",
  initialLoadingText: "Mencari referensi AIRA...",
  notice:
    "AIRA Assistant memberikan informasi umum, tidak mengubah hasil kalkulator, dan bukan pengganti tenaga kesehatan.",
};

export const ASSISTANT_LINKS = [
  {
    label: "Buka Kalkulator",
    href: "/kalkulator-air",
    icon: "calculator",
  },
  {
    label: "Lihat Navigasi Air",
    href: "/navigasi-air",
    icon: "map",
  },
]; 