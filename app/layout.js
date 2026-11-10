import "@/app/globals.css";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import { ambilSesiNavbar } from "@/lib/sesiNavbar";

// Heading: Plus Jakarta Sans (variable font lokal)
const plusJakartaSans = localFont({
  src: [
    {
      path: "./font/PlusJakartaSans-Variable.woff2",
      style: "normal",
    },
    {
      path: "./font/PlusJakartaSans-Italic-Variable.woff2",
      style: "italic",
    },
  ],
  variable: "--font-plus-jakarta",
});

// Teks isi: Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// TAMBAHKAN ICONS DI DALAM METADATA DI BAWAH INI:
export const metadata = {
  title: "AIRA - Smart Water Resilience for Every Woman",
  description: "Solusi Digital Ketahanan Air, Sanitasi, dan Respons Krisis",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({ children }) {
  // Status login dibaca di server agar Navbar langsung benar di semua halaman.
  const sesi = await ambilSesiNavbar();

  return (
    <html lang="id">
      
    <body
      className={`
      ${plusJakartaSans.variable}
      ${inter.variable}
      min-h-dvh
      flex flex-col
     bg-aira-bg
     text-aira-text
      font-body
      antialiased
    `}
>
  <Navbar sesi={sesi} />

    <main className="w-full min-w-0 flex-1">
       {children}
     </main>

      <ConditionalFooter />
    </body>

  </html>
  );
}