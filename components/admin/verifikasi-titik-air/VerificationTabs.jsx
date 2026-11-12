"use client";

export default function VerificationTabs({
  activeTab,
  onTabChange,
  waitingCount,
  reviewedCount,
}) {
  const tabs = [
    { id: "waiting", label: "Menunggu", count: waitingCount },
    { id: "reviewed", label: "Sudah ditinjau", count: reviewedCount },
  ];

  return (
    <div
      role="tablist"
      aria-label="Filter status verifikasi"
      className="flex flex-wrap items-center gap-2"
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-aira-secondary/40 ${
              active
                ? "border-aira-primary bg-aira-primary text-white shadow-sm"
                : "border-aira-primary/20 bg-white text-aira-primary hover:bg-aira-bg"
            }`}
          >
            {tab.label}
            <span
              className={`inline-flex min-w-[22px] items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none ${
                active
                  ? "bg-white/20 text-white"
                  : "bg-aira-primary/10 text-aira-primary"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
} 