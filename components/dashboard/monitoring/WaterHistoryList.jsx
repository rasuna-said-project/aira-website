import { Clock3 } from "lucide-react";

// Riwayat pemantauan. `items` berasal dari data pengguna (database), terbaru lebih dulu.
export default function WaterHistoryList({ items = [], total = items.length }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#26363B]">
          Riwayat Pemantauan
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Catatan pembaruan kondisi air sebelumnya.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-[#EAF5F4] p-2">
                  <Clock3 size={16} className="text-[#176B78]" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#26363B]">
                    {item.source}
                  </p>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  item.availability === "Mencukupi"
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {item.availability}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              {item.note}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Kondisi: {item.condition}
            </p>
          </div>
        ))}
      </div>

      {total > items.length && (
        <p className="mt-4 text-xs text-gray-400">
          Menampilkan {items.length} dari {total} pembaruan terbaru.
        </p>
      )}
    </section>
  );
}