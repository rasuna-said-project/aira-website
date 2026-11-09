import { MapPin, CalendarDays, MessageSquareWarning } from "lucide-react";
import VerificationBadge from "./VerificationBadge";

export default function ContributionList({ contributions, onEdit }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(30,80,90,0.07)] sm:p-6">
      <h2 className="mb-4 text-base font-semibold text-[#176B78]">
        Kontribusi Anda
      </h2>

      {contributions.length === 0 ? (
        <div className="rounded-2xl bg-[#F7FAFA] px-5 py-12 text-center">
          <MapPin className="mx-auto text-[#94D2BD]" size={34} />
          <p className="mt-3 text-sm font-medium text-[#176B78]">
            Belum ada kontribusi titik air
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Tambahkan informasi titik air yang Anda ketahui untuk membantu
            masyarakat menemukan sumber air.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {contributions.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl bg-[#F7FAFA] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    {item.type}
                  </p>

                  <h3 className="mt-0.5 text-sm font-semibold text-[#176B78]">
                    {item.name}
                  </h3>

                  <p className="mt-2 flex items-start gap-1.5 text-xs text-gray-500">
                    <MapPin
                      size={14}
                      className="mt-0.5 shrink-0 text-[#E99A83]"
                    />
                    {item.address}
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-400">
                    <CalendarDays size={13} />
                    Dikirim {item.date}
                  </p>
                </div>

                <div className="shrink-0">
                  <VerificationBadge status={item.status} />
                </div>
              </div>

              {item.adminNote && (
                <div className="mt-3 rounded-xl bg-[#F4EBDD] p-3">
                  <p className="flex items-start gap-2 text-[11px] leading-relaxed text-[#59636A]">
                    <MessageSquareWarning
                      size={14}
                      className="mt-0.5 shrink-0 text-[#D77C68]"
                    />
                    <span>
                      <strong>Catatan admin:</strong> {item.adminNote}
                    </span>
                  </p>
                </div>
              )}

              {item.status === "Perlu Perbaikan" && (
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="mt-3 rounded-full border border-[#176B78] px-4 py-2 text-xs font-medium text-[#176B78] transition hover:bg-[#EAF5F4]"
                >
                  Perbaiki dan Kirim Ulang
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
} 