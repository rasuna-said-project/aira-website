// Inisial untuk avatar (maksimal 2 huruf), contoh "Siti Rahma" -> "SR".
export function inisialDari(nama) {
  const hasil = String(nama || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((kata) => kata[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return hasil || "AR";
}
