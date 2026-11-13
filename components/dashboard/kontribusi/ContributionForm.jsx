"use client";

import { useEffect } from "react";
import { X, Send } from "lucide-react";

const initialForm = {
  name: "",
  type: "Sumur bor",
  address: "",
  mapsUrl: "",
  availability: "Tersedia",
  accessHours: "",
  manager: "",
  managerContact: "",
  informationSource: "",
  note: "",
};

function getFormValues(editData) {
  if (!editData) {
    return initialForm;
  }

  return {
    name: editData.name || "",
    type: editData.type || "Sumur bor",
    address: editData.address || "",
    mapsUrl: editData.mapsUrl || "",
    availability: editData.availability || "Tersedia",
    accessHours: editData.accessHours || "",
    manager: editData.manager || "",
    managerContact: editData.managerContact || "",
    informationSource: editData.informationSource || "",
    note: editData.note || "",
  };
}

export default function ContributionForm({
  isOpen,
  onClose,
  onSubmit,
  editData,
}) {
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formValues = getFormValues(editData);

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const form = {
      name: String(formData.get("name") || "").trim(),
      type: String(formData.get("type") || "Sumur bor"),
      address: String(formData.get("address") || "").trim(),
      mapsUrl: String(formData.get("mapsUrl") || "").trim(),
      availability: String(
        formData.get("availability") || "Tersedia"
      ),
      accessHours: String(formData.get("accessHours") || "").trim(),
      manager: String(formData.get("manager") || "").trim(),
      managerContact: String(
        formData.get("managerContact") || ""
      ).trim(),
      informationSource: String(
        formData.get("informationSource") || ""
      ),
      note: String(formData.get("note") || "").trim(),
    };

    onSubmit(form);
  }

  const inputClass =
    "w-full rounded-xl border border-[#C9DDE3] bg-white px-3 py-3 text-xs text-[#34464B] outline-none transition placeholder:text-gray-400 focus:border-[#4EA8DE] focus:ring-2 focus:ring-[#4EA8DE]/20";

  const labelClass = "mb-2 block text-xs font-medium text-[#34464B]";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#164F58]/60 p-3 backdrop-blur-[2px] sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contribution-form-title"
        className="flex max-h-[92vh] w-full max-w-127.5 flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Header modal */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="contribution-form-title"
              className="text-base font-semibold text-aira-primary"
            >
              {editData ? "Perbaiki Titik Air" : "Kirim Titik Air Baru"}
            </h2>

            <p className="mt-1 max-w-97.5 text-[11px] leading-relaxed text-gray-400">
              Lengkapi informasi yang Anda ketahui. Admin akan memverifikasi
              sebelum data ditampilkan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir"
            className="ml-3 rounded-lg p-1 text-gray-500 transition hover:bg-gray-100"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form scroll area */}
        <form
          key={JSON.stringify(editData || null)}
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            {/* Nama dan jenis sumber */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="contribution-name">
                  Nama titik air
                </label>
                <input
                  id="contribution-name"
                  required
                  name="name"
                  defaultValue={formValues.name}
                  placeholder="Contoh: Sumur Komunal RT 04"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="contribution-type">
                  Jenis sumber
                </label>
                <select
                  id="contribution-type"
                  name="type"
                  defaultValue={formValues.type}
                  className={inputClass}
                >
                  <option>Sumur bor</option>
                  <option>Sumur gali</option>
                  <option>Mata air</option>
                  <option>Embung</option>
                  <option>Waduk</option>
                  <option>Sungai</option>
                  <option>Tangki air</option>
                  <option>PDAM</option>
                  <option>Lainnya</option>
                </select>
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label className={labelClass} htmlFor="contribution-address">
                Alamat lengkap
              </label>
              <textarea
                id="contribution-address"
                required
                name="address"
                defaultValue={formValues.address}
                rows={2}
                placeholder="Jalan, RT/RW, desa, kecamatan"
                className={`${inputClass} resize-y`}
              />
            </div>

            {/* Google Maps */}
            {/* Google Maps */}
            <div>
              <label className={labelClass} htmlFor="contribution-maps">
                Tautan Google Maps
              </label>
              <input
                id="contribution-maps"
                name="mapsUrl"
                type="url"
                defaultValue={formValues.mapsUrl}
                placeholder="https://maps.app.goo.gl/..."
                className={inputClass}
              />
              <p className="mt-1 text-[10px] text-gray-400">
                Buka lokasi di Google Maps, pilih Bagikan, lalu tempel tautannya.
              </p>
            </div>

            {/* Ketersediaan dan jam akses */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  className={labelClass}
                  htmlFor="contribution-availability"
                >
                  Ketersediaan air saat ini
                </label>
                <select
                  id="contribution-availability"
                  name="availability"
                  defaultValue={formValues.availability}
                  className={inputClass}
                >
                  <option>Tersedia</option>
                  <option>Terbatas</option>
                  <option>Tidak tersedia</option>
                  <option>Belum diketahui</option>
                </select>
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="contribution-access-hours"
                >
                  Jam akses
                </label>
                <input
                  id="contribution-access-hours"
                  name="accessHours"
                  defaultValue={formValues.accessHours}
                  placeholder="Contoh: 06.00 - 18.00"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Pengelola */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  className={labelClass}
                  htmlFor="contribution-manager"
                >
                  Nama pengelola
                </label>
                <input
                  id="contribution-manager"
                  name="manager"
                  defaultValue={formValues.manager}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="contribution-manager-contact"
                >
                  Kontak pengelola
                </label>
                <input
                  id="contribution-manager-contact"
                  name="managerContact"
                  defaultValue={formValues.managerContact}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Sumber informasi */}
            <div>
              <label
                className={labelClass}
                htmlFor="contribution-information-source"
              >
                Sumber informasi (opsional)
              </label>
              <select
                id="contribution-information-source"
                name="informationSource"
                defaultValue={formValues.informationSource}
                className={inputClass}
              >
                <option value="">Pilih sumber informasi</option>
                <option>Pengamatan langsung</option>
                <option>Pengelola sumber air</option>
                <option>Masyarakat sekitar</option>
                <option>Pemerintah desa</option>
                <option>Sumber lainnya</option>
              </select>
            </div>

            {/* Catatan tambahan */}
            <div>
              <label className={labelClass} htmlFor="contribution-note">
                Catatan tambahan
              </label>
              <textarea
                id="contribution-note"
                name="note"
                defaultValue={formValues.note}
                rows={3}
                placeholder="Biaya, antrean, aturan penggunaan"
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>

          {/* Footer tetap di bawah */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-white px-5 py-3 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2.5 text-xs font-medium text-aira-primary transition hover:bg-[#EAF5F4]"
            >
              Batal
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-aira-primary px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#125762]"
            >
              <Send size={14} />
              {editData ? "Kirim Ulang" : "Kirim untuk Verifikasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
