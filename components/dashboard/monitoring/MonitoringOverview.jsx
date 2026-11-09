import { Droplets, ClipboardList, CalendarDays } from "lucide-react";

const overviewItems = [
  {
    label: "Total Pembaruan",
    value: "12 kali",
    description: "Data pemantauan tercatat",
    icon: ClipboardList,
  },
  {
    label: "Kondisi Terakhir",
    value: "Aman",
    description: "Berdasarkan pembaruan terakhir",
    icon: Droplets,
  },
  {
    label: "Pembaruan Terakhir",
    value: "9 Nov 2026",
    description: "Tanggal pemantauan terakhir",
    icon: CalendarDays,
  },
];

export default function MonitoringOverview() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {overviewItems.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <h3 className="mt-2 text-2xl font-semibold text-[#176B78]">
                  {item.value}
                </h3>
              </div>

              <div className="rounded-xl bg-[#EAF5F4] p-3">
                <Icon size={21} className="text-[#176B78]" />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-400">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
} 