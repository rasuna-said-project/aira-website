import { redirect } from "next/navigation";

// Alamat lama C03. Halaman Kelola Titik Air kini berada di /admin/kelola-titik-air
// (sesuai menu sidebar admin). Tautan lama tetap bekerja lewat pengalihan ini.
export default function TitikAirRedirect() {
  redirect("/admin/kelola-titik-air");
}
