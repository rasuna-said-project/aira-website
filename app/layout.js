import "@/app/globals.css";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Setup Variable Font Plus Jakarta Sans
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

export const metadata = {
  title: "AIRA - Smart Water Resilience for Every Woman",
  description: "Solusi Digital Ketahanan Air, Sanitasi, dan Respons Krisis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${plusJakartaSans.variable} bg-aira-bg text-aira-text font-body min-h-screen flex flex-col justify-between antialiased`}
      >
        <Navbar />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}