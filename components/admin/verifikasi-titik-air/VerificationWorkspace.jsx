"use client";

import { useMemo, useState } from "react";

import { verificationData } from "@/data/verificationData";

import VerificationTabs from "./VerificationTabs";
import VerificationTable from "./VerificationTable";
import VerificationDetail from "./VerificationDetail";

export default function VerificationWorkspace() {
  const [contributions, setContributions] = useState(
    verificationData
  );

  const [activeTab, setActiveTab] = useState("waiting");
  const [selectedItem, setSelectedItem] = useState(null);

  const waitingCount = contributions.filter(
    (item) =>
      item.verificationStatus === "Menunggu Verifikasi"
  ).length;

  const reviewedCount = contributions.filter(
    (item) =>
      item.verificationStatus !== "Menunggu Verifikasi"
  ).length;

  const filteredData = useMemo(() => {
    return contributions.filter((item) => {
      if (activeTab === "waiting") {
        return (
          item.verificationStatus === "Menunggu Verifikasi"
        );
      }

      return (
        item.verificationStatus !== "Menunggu Verifikasi"
      );
    });
  }, [contributions, activeTab]);

  function handleUpdateStatus(id, status, notes) {
    setContributions((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              verificationStatus: status,
              notes: notes.trim() || getDefaultNote(status),
            }
          : item
      )
    );

    setSelectedItem(null);
    setActiveTab("reviewed");
  }

  return (
    <>
      <section className="w-full min-w-0">
        {/* Kartu utama verifikasi */}
        <div className="
           w-full min-w-0
          rounded-[16px]
          border border-aira-primary/10
         bg-white
         p-4
        shadow-[0_5px_20px_rgba(23,107,120,0.08)]
        ">

          {/* Tab kategori */}
          <div className="mb-3">
            <VerificationTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              waitingCount={waitingCount}
              reviewedCount={reviewedCount}
            />
          </div>

          {/* Tabel kontribusi */}
          <VerificationTable
            data={filteredData}
            activeTab={activeTab}
            onSelect={setSelectedItem}
          />

        </div>
      </section>

      {/* Modal detail kontribusi */}
      {selectedItem && (
        <VerificationDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </>
  );
}

function getDefaultNote(status) {
  const notes = {
    Terverifikasi:
      "Kontribusi telah diperiksa dan disetujui.",

    "Perlu Perbaikan":
      "Mohon lengkapi atau perbaiki informasi kontribusi.",

    Ditolak:
      "Kontribusi belum memenuhi persyaratan verifikasi.",
  };

  return notes[status] || "";
} 