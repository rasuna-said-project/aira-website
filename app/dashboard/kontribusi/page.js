"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import ContributionList from "@/components/dashboard/kontribusi/ContributionList";
import ContributionForm from "@/components/dashboard/kontribusi/ContributionForm";

const initialContributions = [
  {
    id: 1,
    type: "Tangki BPBD",
    name: "Posko Bantuan Tangki Air BPBD Rongkop",
    address: "Jl. Raya Semanu - Rongkop, Kab. Gunungkidul",
    date: "11 Okt 2026",
    status: "Menunggu Verifikasi",
  },
  {
    id: 2,
    type: "Sumur bor",
    name: "Sumur Bor Komunal Padukuhan Bohol",
    address: "Padukuhan Bohol, Desa Bohol, Rongkop, Gunungkidul",
    date: "28 Sep 2026",
    status: "Terverifikasi",
  },
  {
    id: 3,
    type: "Embung",
    name: "Embung Botodayaan",
    address: "Desa Botodayaan, Rongkop, Gunungkidul",
    date: "27 Sep 2026",
    status: "Perlu Perbaikan",
    adminNote: "Mohon lengkapi jam akses dan kontak pengelola.",
    availability: "Tersedia",
  },
  {
    id: 4,
    type: "Sumur gali",
    name: "Sumur Pribadi Keluarga Pak Paijo",
    address: "Desa Bohol, Rongkop, Gunungkidul",
    date: "10 Sep 2026",
    status: "Ditolak",
    adminNote: "Sumur milik pribadi warga dan tidak terbuka untuk umum.",
  },
];

export default function ContributionPage() {
  const [contributions, setContributions] = useState(initialContributions);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditData(null);
  }, []);

  function handleAdd() {
    setEditData(null);
    setIsFormOpen(true);
  }

  function handleEdit(item) {
    setEditData(item);
    setIsFormOpen(true);
  }

  function handleSubmit(form) {
    const date = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());

    if (editData) {
      setContributions((previous) =>
        previous.map((item) =>
          item.id === editData.id
            ? {
                ...item,
                ...form,
                status: "Menunggu Verifikasi",
                date,
                adminNote: "",
              }
            : item
        )
      );
    } else {
      const newContribution = {
        id: Date.now(),
        ...form,
        date,
        status: "Menunggu Verifikasi",
        adminNote: "",
      };

      setContributions((previous) => [newContribution, ...previous]);
    }

    closeForm();
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header halaman */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-[#176B78] sm:text-3xl">
              Kontribusi Titik Air
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Tambahkan titik air yang Anda ketahui. Admin akan meninjau
              datanya sebelum tampil di Navigasi Air.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#176B78] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#125762] sm:self-center"
          >
            <Plus size={17} />
            Tambah Titik Air
          </button>
        </div>

        {/* Daftar kontribusi */}
        <ContributionList
          contributions={contributions}
          onEdit={handleEdit}
        />
      </div>

      {/* Modal form kontribusi */}
      <ContributionForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        editData={editData}
      />
    </>
  );
} 