// Membuat data/katalogTindakanFallback.js dari CSV katalog tindakan.
// Dipakai sebagai cadangan terakhir bila tabel Supabase `katalog_tindakan` tidak dapat dibaca.
// Jalankan ulang setiap kali katalog di Supabase berubah:
//   node scripts/buat-katalog-fallback.mjs data/AIRA_Katalog_Tindakan_Final_REVISED.csv
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sumber = resolve(process.argv[2] ?? `${akar}/data/AIRA_Katalog_Tindakan_Final_REVISED.csv`);
const tujuan = resolve(akar, "data/katalogTindakanFallback.js");

// Parser CSV sederhana (RFC 4180): mendukung tanda kutip, koma dan baris baru di dalam kutip.
function parseCsv(teks) {
  const baris = [];
  let sel = "";
  let row = [];
  let dalamKutip = false;
  for (let i = 0; i < teks.length; i++) {
    const c = teks[i];
    if (dalamKutip) {
      if (c === '"' && teks[i + 1] === '"') { sel += '"'; i++; }
      else if (c === '"') dalamKutip = false;
      else sel += c;
    } else if (c === '"') dalamKutip = true;
    else if (c === ",") { row.push(sel); sel = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && teks[i + 1] === "\n") i++;
      row.push(sel); sel = "";
      baris.push(row); row = [];
    } else sel += c;
  }
  if (sel !== "" || row.length) { row.push(sel); baris.push(row); }
  return baris.filter((r) => r.some((x) => x.trim() !== ""));
}

const [header, ...isi] = parseCsv(readFileSync(sumber, "utf8").replace(/^\uFEFF/, ""));
const kolom = header.map((h) => h.trim());
const rows = isi.map((r) =>
  Object.fromEntries(kolom.map((k, i) => [k, (r[i] ?? "").trim() === "" ? null : r[i].trim()]))
);

const keluaran =
  `// DIHASILKAN OTOMATIS oleh scripts/buat-katalog-fallback.mjs dari ${sumber.split("/").pop()}.\n` +
  `// Jangan edit manual: ubah katalog di Supabase/CSV lalu jalankan ulang skrip.\n` +
  `export const KATALOG_FALLBACK = ${JSON.stringify(rows, null, 2)};\n`;
writeFileSync(tujuan, keluaran);
console.log(`${rows.length} tindakan ditulis ke ${tujuan}`);
