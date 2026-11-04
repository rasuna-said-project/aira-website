import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";

// Halaman Daftar: kartu yang sama dengan halaman Masuk.
export default function RegisterScreen() {
  return (
    <AuthCard
      title="Buat akun AIRA"
      subtitle="Simpan hasil perhitungan dan ikut menambah titik air untuk komunitas."
    >
      <RegisterForm />
    </AuthCard>
  );
} 