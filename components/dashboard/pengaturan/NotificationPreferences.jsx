const preferences = [
  {
    title: "Peringatan Waspada dan Krisis",
    description: "Kabar jika catatan Anda menunjukkan cadangan menipis",
  },
  {
    title: "Pengingat catat kondisi air",
    description: "Pengingat mingguan untuk memperbarui volume tandon",
  },
  {
    title: "Hasil verifikasi kontribusi",
    description: "Saat admin mengubah status titik air yang Anda kirim",
  },
];

export default function NotificationPreferences() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(30,80,90,0.07)] sm:p-7">
      <h2 className="text-base font-semibold text-[#176B78]">
        Preferensi notifikasi
      </h2>

      <p className="mt-1 text-[11px] text-[#89969A]">
        Pengaturan ini belum tersimpan dan akan tersedia pada pembaruan
        berikutnya.
      </p>

      <div className="mt-4">
        {preferences.map((item, index) => (
          <div
            key={item.title}
            className={`flex items-center justify-between gap-4 py-3 ${
              index !== preferences.length - 1
                ? "border-b border-[#E5EFF1]"
                : ""
            }`}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium text-[#35464C]">
                  {item.title}
                </p>

                <span className="rounded-full bg-[#F4EBDD] px-2 py-0.5 text-[9px] font-medium text-[#176B78]">
                  Segera hadir
                </span>
              </div>

              <p className="mt-1 text-[10px] leading-relaxed text-[#98A3A7]">
                {item.description}
              </p>
            </div>

            {/* Toggle visual, belum interaktif */}
            <div
              aria-label={`${item.title}, segera hadir`}
              className="relative h-6 w-10 shrink-0 rounded-full bg-[#8DB9BF]"
            >
              <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 