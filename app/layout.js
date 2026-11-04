import "@/app/globals.css";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";

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

export const metadata = {
  title: "AIRA - Smart Water Resilience for Every Woman",
  description: "Solusi Digital Ketahanan Air, Sanitasi, dan Respons Krisis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} bg-aira-bg text-aira-text font-body min-h-screen flex flex-col justify-between antialiased`}
      >
    <Navbar />
      <main className="grow">{children}</main>
      <ConditionalFooter />
      </body>
    </html>
  );
} 