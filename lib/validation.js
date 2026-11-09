// Aturan validasi form (dipakai Masuk dan Daftar). Pesan sama dengan prototipe Figma Make.
export const MIN_PASSWORD = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (value) => value.trim().toLowerCase();

export const validateEmail = (value) => (EMAIL_RE.test(value.trim()) ? "" : "Format email tidak valid.");

export const validatePassword = (value) =>
  value.length >= MIN_PASSWORD ? "" : `Kata sandi minimal ${MIN_PASSWORD} karakter.`;
