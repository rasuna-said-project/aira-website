"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getAdminContributionsAction,
  reviewContributionAction,
} from "@/app/actions/admin-verifikasi";

import VerificationTabs from "./VerificationTabs";
import VerificationTable from "./VerificationTable";
import VerificationDetail from "./VerificationDetail";

// Mengambil data dari Server Action.
// Fungsi ini tidak mengubah state React.
async function fetchContributions() {
  const result = await getAdminContributionsAction();

  if (!result?.success) {
    throw new Error(
      result?.message || "Gagal mengambil data kontribusi."
    );
  }

  return Array.isArray(result.data) ? result.data : [];
}

export default function VerificationWorkspace() {
  const [contributions, setContributions] = useState([]);
  const [activeTab, setActiveTab] = useState("waiting");
  const [selectedItem, setSelectedItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Pemuatan awal data dari database.
  // State baru diperbarui setelah proses pengambilan data selesai.
  useEffect(() => {
    let isMounted = true;

    async function initialLoad() {
      try {
        const data = await fetchContributions();

        if (isMounted) {
          setContributions(data);
          setError("");
        }
      } catch (err) {
        console.error("Gagal memuat kontribusi:", err);

        if (isMounted) {
          setError(
            err.message || "Terjadi kesalahan saat mengambil data."
          );
          setContributions([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initialLoad();

    return () => {
      isMounted = false;
    };
  }, []);

  // Digunakan untuk memuat ulang data melalui interaksi pengguna
  // atau setelah keputusan verifikasi berhasil disimpan.
  const loadContributions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchContributions();
      setContributions(data);
    } catch (err) {
      console.error("Gagal memuat ulang kontribusi:", err);

      setError(
        err.message || "Terjadi kesalahan saat mengambil data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Jumlah kontribusi yang belum diverifikasi.
  const waitingCount = useMemo(() => {
    return contributions.filter(
      (item) =>
        item.verificationStatus === "Menunggu Verifikasi"
    ).length;
  }, [contributions]);

  // Jumlah kontribusi yang sudah mendapatkan keputusan.
  const reviewedCount = useMemo(() => {
    return contributions.filter(
      (item) =>
        item.verificationStatus !== "Menunggu Verifikasi"
    ).length;
  }, [contributions]);

  // Data yang ditampilkan mengikuti tab aktif.
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

  // Menyimpan keputusan verifikasi ke database.
  async function handleUpdateStatus(id, status, notes) {
    if (saving) return;

    setSaving(true);
    setError("");

    try {
      const result = await reviewContributionAction({
        contributionId: id,
        status,
        notes,
      });

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Keputusan verifikasi gagal disimpan."
        );
      }

      // Tutup detail dan pindah ke tab yang sudah ditinjau.
      setSelectedItem(null);
      setActiveTab("reviewed");

      // Ambil kembali data terbaru dari database.
      await loadContributions();
    } catch (err) {
      console.error("Gagal memperbarui status:", err);

      setError(
        err.message ||
          "Terjadi kesalahan saat menyimpan keputusan."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="w-full min-w-0">
        <div
          className="
            w-full min-w-0
            rounded-[16px]
            border border-aira-primary/10
            bg-white
            p-4
            shadow-[0_5px_20px_rgba(23,107,120,0.08)]
          "
        >
          <div className="mb-3">
            <VerificationTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              waitingCount={waitingCount}
              reviewedCount={reviewedCount}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={loadContributions}
                disabled={loading || saving}
                className="mt-2 font-semibold underline disabled:opacity-50"
              >
                Coba muat ulang
              </button>
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-sm text-aira-text/60">
              Memuat data kontribusi...
            </div>
          ) : (
            <VerificationTable
              data={filteredData}
              activeTab={activeTab}
              onSelect={setSelectedItem}
            />
          )}

          {!loading &&
            !error &&
            contributions.length === 0 && (
              <div className="py-8 text-center text-sm text-aira-text/60">
                Belum ada kontribusi titik air.
              </div>
            )}
        </div>
      </section>

      {selectedItem && (
        <VerificationDetail
          item={selectedItem}
          onClose={() => {
            if (!saving) {
              setSelectedItem(null);
            }
          }}
          onUpdateStatus={handleUpdateStatus}
          saving={saving}
        />
      )}
    </>
  );
}