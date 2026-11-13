import {
  X,
  MapPin,
  UserRound,
  CalendarDays,
  Droplets,
  Phone,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ClipboardList,
} from "lucide-react";

import {
  VerificationBadge,
  AvailabilityBadge,
} from "./VerificationBadge"; 

export default function VerificationDetail({
  item,
  onClose,
  onUpdateStatus,
}) {
  const [notes, setNotes] = useState(item?.notes || "");

  if (!item) return null;

  const isWaiting =
    item.verificationStatus === "Menunggu Verifikasi";

  function handleDecision(status) {
    onUpdateStatus(item.id, status, notes);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="verification-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-aira-primary/10 bg-white px-6 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-aira-primary/60">
              Detail Kontribusi
            </p>

            <h2
              id="verification-title"
              className="mt-1 text-lg font-bold text-aira-primary"
            >
              Pemeriksaan Titik Air
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail"
            className="rounded-full p-2 text-aira-text/50 transition hover:bg-aira-bg hover:text-aira-primary"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {/* Nama titik air */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-aira-text/45">
              Nama titik air
            </p>

            <h3 className="mt-1 text-base font-bold text-aira-primary">
              {item.name}
            </h3>

            <p className="mt-1 text-xs text-aira-text/55">
              ID Kontribusi: {item.id}
            </p>
          </div>

          {/* Status */}
          <div className="flex flex-wrap gap-2">
            <AvailabilityBadge status={item.availability} />
            <VerificationBadge status={item.verificationStatus} />
          </div>

          {/* Informasi */}
          <div className="grid gap-4 rounded-xl bg-aira-bg p-4 sm:grid-cols-2">
            <Info
              icon={UserRound}
              label="Pengirim"
              value={item.contributor}
            />

            <Info
              icon={CalendarDays}
              label="Tanggal pengiriman"
              value={item.submittedAt}
            />

            <Info
              icon={Droplets}
              label="Kategori titik air"
              value={item.category}
            />

            <Info
              icon={Phone}
              label="Kontak"
              value={item.contact}
            />
          </div>

          {/* Lokasi */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-aira-text">
              <MapPin size={16} className="text-aira-primary" />
              Informasi Lokasi
            </h4>

            <div className="space-y-2 rounded-xl border border-aira-primary/10 p-4">
              <Info label="Alamat" value={item.address} />
              <Info label="Koordinat" value={item.coordinates} />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-aira-text">
              Deskripsi Kontribusi
            </h4>

            <p className="rounded-xl bg-aira-bg p-4 text-xs leading-relaxed text-aira-text/70">
              {item.description}
            </p>
          </div>

          {/* Catatan pemeriksaan */}
          <div>
            <label
              htmlFor="verification-notes"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-aira-text"
            >
              <ClipboardList size={16} className="text-aira-primary" />
              Catatan Admin
            </label>

            {isWaiting ? (
              <textarea
                id="verification-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Tuliskan catatan atau alasan keputusan..."
                rows={3}
                className="w-full resize-none rounded-xl border border-aira-primary/15 bg-white p-3 text-xs text-aira-text outline-none transition focus:border-aira-secondary focus:ring-2 focus:ring-aira-secondary/20"
              />
            ) : (
              <p className="rounded-xl bg-aira-bg p-4 text-xs leading-relaxed text-aira-text/70">
                {item.notes || "Tidak ada catatan pemeriksaan."}
              </p>
            )}
          </div>

          {/* Tombol keputusan */}
          {isWaiting ? (
            <div className="space-y-3 border-t border-aira-primary/10 pt-4">
              <p className="text-xs font-semibold text-aira-text">
                Keputusan Verifikasi
              </p>

              <button
                type="button"
                onClick={() => handleDecision("Terverifikasi")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-aira-primary px-4 py-3 text-xs font-semibold text-white transition hover:bg-aira-primary-dark"
              >
                <CheckCircle2 size={15} />
                Verifikasi Kontribusi
              </button>

              <button
                type="button"
                onClick={() => handleDecision("Perlu Perbaikan")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-100 px-4 py-3 text-xs font-semibold text-amber-800 transition hover:bg-amber-200"
              >
                <AlertCircle size={15} />
                Minta Perbaikan
              </button>

              <button
                type="button"
                onClick={() => handleDecision("Ditolak")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FCE3DC] px-4 py-3 text-xs font-semibold text-[#A94D37] transition hover:bg-[#F8D2C8]"
              >
                <XCircle size={15} />
                Tolak Kontribusi
              </button>
            </div>
          ) : (
            <div className="rounded-xl bg-aira-bg p-4 text-xs text-aira-text/60">
              Kontribusi ini sudah mendapatkan keputusan pemeriksaan.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-[10px] text-aira-text/45">
        {Icon && <Icon size={12} />}
        {label}
      </p>

      <p className="mt-1 break-words text-xs font-medium text-aira-text">
        {value || "-"}
      </p>
    </div>
  );
} 