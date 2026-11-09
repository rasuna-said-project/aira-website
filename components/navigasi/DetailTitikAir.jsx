import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Beaker,
  Clock,
  Compass,
  Crosshair,
  Database,
  Droplets,
  ExternalLink,
  MapPin,
  MessageCircleHeart,
  Navigation,
  Phone,
  User,
  Wallet,
} from "lucide-react";
import { AvailabilityBadge, VerificationBadge } from "@/components/StatusBadge";
import LaporkanInformasi from "@/components/navigasi/LaporkanInformasi";
import { buatTautanMaps, formatKoordinat } from "@/lib/googleMaps";

export default function DetailTitikAir({ titik }) {
  const maps = buatTautanMaps(titik);
  const koordinat = formatKoordinat(titik);

  // Kolom kosong tidak boleh tampil sebagai fakta: selalu ada teks "belum ..." yang wajar.
  const baris = [
    { Ikon: Clock, label: "Jam operasional", nilai: titik.hours || "Belum diketahui" },
    { Ikon: Wallet, label: "Akses & biaya", nilai: titik.access || "Informasi belum tersedia" },
    { Ikon: Beaker, label: "Catatan kualitas", nilai: titik.quality || "Belum ada informasi kualitas" },
    { Ikon: Crosshair, label: "Koordinat", nilai: koordinat || "Koordinat belum tersedia" },
    { Ikon: Compass, label: "Petunjuk lokasi", nilai: titik.locationHint || "Belum dikonfirmasi" },
    { Ikon: Droplets, label: "Peruntukan air", nilai: titik.usagePurpose || "Belum dikonfirmasi" },
    { Ikon: Database, label: "Sumber informasi", nilai: titik.source || "Belum diketahui" },
  ];

  return (
    <div className="min-h-[calc(100vh-72px)] bg-aira-bg">
      <div className="fade-up mx-auto max-w-[1100px] px-4 py-8 sm:px-5 sm:py-14">
        <Link
          href="/navigasi-air"
          className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-aira-primary transition-all hover:gap-3"
        >
          <ArrowLeft className="size-5" /> Kembali ke daftar
        </Link>

        <header className="relative mt-4 overflow-hidden rounded-[28px] border border-aira-primary/5 bg-white p-6 shadow-soft sm:p-10">
          <div className="absolute -right-16 -top-16 size-56 rounded-[50%_50%_40%_60%] bg-aira-sage/30" aria-hidden="true" />
          <div className="relative">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-aira-sand px-3 py-1 text-sm font-semibold text-aira-primary">{titik.type}</span>
              <span className="rounded-full bg-aira-secondary/15 px-3 py-1 text-sm font-semibold text-aira-primary">
                Data simulasi
              </span>
            </div>
            <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-aira-primary sm:text-4xl">{titik.name}</h1>
            <p className="mt-3 flex max-w-2xl gap-2 text-aira-text/80">
              <MapPin className="mt-0.5 size-5 shrink-0 text-aira-peach" />
              {titik.address || "Informasi alamat belum tersedia"}
            </p>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-7">
            <div className="rounded-[28px] border border-aira-primary/5 bg-white p-6 shadow-soft sm:p-7">
              <h2 className="text-xl font-semibold text-aira-primary">Status & akses operasional</h2>

              {/* Ketersediaan dan verifikasi adalah dua informasi berbeda: ditampilkan terpisah (PRD). */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-aira-bg p-4">
                  <p className="mb-2 text-xs text-aira-text/60">Ketersediaan air</p>
                  <AvailabilityBadge v={titik.availability} />
                </div>
                <div className="rounded-2xl bg-aira-bg p-4">
                  <p className="mb-2 text-xs text-aira-text/60">Verifikasi data</p>
                  <VerificationBadge v={titik.verification} />
                </div>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-aira-text/70">
                <Clock className="size-4" /> Pembaruan terakhir: {titik.updated || "Belum diketahui"}
              </p>

              <ul className="mt-6 divide-y divide-aira-primary/10">
                {baris.map(({ Ikon, label, nilai }) => (
                  <li key={label} className="flex gap-4 py-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-aira-sage/40 text-aira-primary">
                      <Ikon className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm text-aira-text/60">{label}</p>
                      <p className="font-medium">{nilai}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {titik.note && <p className="mt-2 rounded-2xl bg-aira-sand p-4 text-[15px] leading-relaxed">{titik.note}</p>}
            </div>

            <div className="flex gap-3 rounded-2xl border border-aira-warning-line bg-aira-warning p-5 text-sm leading-relaxed text-aira-warning-text">
              <AlertTriangle className="mt-0.5 size-5 shrink-0" />
              <p>
                Informasi dapat berubah sewaktu-waktu. Verifikasi hanya menunjukkan bahwa data telah ditinjau dan tidak
                menjamin air masih tersedia, titik sedang beroperasi, atau air aman diminum. Konfirmasi sebelum berangkat
                dan olah air sebelum diminum.
              </p>
            </div>
          </section>

          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-[28px] bg-aira-primary p-6 text-white shadow-soft sm:p-7">
              <h2 className="text-xl font-semibold">Menuju lokasi</h2>
              <p className="mt-2 text-[15px] text-white/80">Rute dibuka di aplikasi Google Maps pada tab baru.</p>
              {maps.href ? (
                <>
                  <a
                    href={maps.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-aira-peach px-6 py-4 text-lg font-bold text-[#3b1409] transition hover:brightness-105"
                  >
                    <Navigation className="size-5" /> Buka di Google Maps <ExternalLink className="size-4" />
                  </a>
                  {maps.dasar === "alamat" && (
                    <p className="mt-3 text-xs text-white/80">Lokasi berdasarkan alamat, bukan koordinat.</p>
                  )}
                </>
              ) : (
                <p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-white/85">
                  Lokasi valid belum tersedia. Navigasi belum dapat dibuka.
                </p>
              )}
            </div>

            <div className="rounded-[28px] border border-aira-primary/5 bg-white p-6 shadow-soft sm:p-7">
              <h2 className="text-xl font-semibold text-aira-primary">Kontak pengelola</h2>
              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <User className="mt-0.5 size-5 shrink-0 text-aira-peach" />
                  <div>
                    <p className="text-sm text-aira-text/60">Penyedia</p>
                    <p className="font-medium">{titik.provider || "Belum diketahui"}</p>
                    <p className="text-[15px] text-aira-text/80">{titik.contact || "Informasi belum tersedia"}</p>
                  </div>
                </div>
                {titik.phone ? (
                  <a
                    href={`tel:${titik.phone.replace(/-/g, "")}`}
                    className="flex min-h-[52px] items-center justify-center gap-2 rounded-full border-2 border-aira-primary px-6 py-3.5 font-semibold text-aira-primary transition-colors hover:bg-aira-primary/10"
                  >
                    <Phone className="size-5" /> {titik.phone}
                  </a>
                ) : (
                  <p className="rounded-2xl bg-aira-bg p-4 text-sm text-aira-text/70">Kontak belum tersedia.</p>
                )}
              </div>
            </div>

            <LaporkanInformasi />

            <Link
              href="/assistant"
              className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-aira-sand px-6 py-4 font-semibold text-aira-primary transition-colors hover:bg-aira-sand-border"
            >
              <MessageCircleHeart className="size-5" /> Tanya AIRA Assistant
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
