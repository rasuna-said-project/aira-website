// SEMENTARA: akun disimpan di localStorage browser agar alur Masuk dan Daftar bisa dicoba di localhost.
// Nanti seluruh isi file ini diganti Supabase Auth / Server Action (Tria). Jangan dipakai di production:
// kata sandi di sini tersimpan apa adanya di browser.
const STORAGE_KEY = "aira_mock_accounts";
const DELAY_MS = 700;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const same = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

function readAccounts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

// Masuk. Mengembalikan { ok: true, user } atau { ok: false, error }.
export async function loginUser({ email, password }) {
  await wait(DELAY_MS);
  const account = readAccounts().find((a) => same(a.email, email) && a.password === password);
  if (!account) return { ok: false, error: "Email atau kata sandi salah." };
  return { ok: true, user: { name: account.name, email: account.email } };
}

// Daftar (untuk halaman Daftar). Mengembalikan { ok: true, user } atau { ok: false, error }.
export async function registerUser({ name, email, phone, password }) {
  await wait(DELAY_MS);
  const accounts = readAccounts();
  if (accounts.some((a) => same(a.email, email))) return { ok: false, error: "Email sudah terdaftar. Silakan masuk." };
  accounts.push({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  return { ok: true, user: { name: name.trim(), email: email.trim() } };
}

// Lupa kata sandi. Jawaban selalu sama agar tidak membocorkan email mana yang terdaftar.
export async function requestPasswordReset({ email }) {
  await wait(DELAY_MS);
  return { ok: true, email };
}
