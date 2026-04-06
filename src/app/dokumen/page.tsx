"use client";
import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import DocumentCard from "@/components/dokumen/DocumentCard";

type DocType = "Kontrak" | "KTP" | "NPWP" | "SK" | "Lainnya";
type FilterType = "Semua" | DocType;

const MOCK_DOCUMENTS = [
  {
    id: 1,
    fileName: "Kontrak_Kerja_Q3_2023.pdf",
    type: "Kontrak" as DocType,
    size: "8.2 MB",
    ownerName: "Budi Setiawan",
    ownerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsos0ibQI8v-JS5p9w8v_e-Miy2YvPWW4kFQVLuPuiyNBSrJs7oiBJrcIB92JSBHqP9eAT3SdIDnOlRoBE_4z-PSd38eY7hAfQkbJhv1VFfl2JGTw_CgRFw5lFa1tHMXCqSeks2OzYtTXa7310JSe_7MMKik3VOiIPwtx7NPU5RtakC78OlvShm1QXGyVCHObBUqxp_bEajeXG42GU9PexZTIO-Tu3pRg6ocBR-AZMAlWMEjjaaBblY9j1bqElkDIYPU5ElGoV3Pff",
    uploadDate: "12 Okt 2023",
    icon: "description",
  },
  {
    id: 2,
    fileName: "KTP_Digital_Final.jpg",
    type: "KTP" as DocType,
    size: "1.4 MB",
    ownerName: "Siti Aminah",
    ownerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrGLhHbp25ueb0QoDmezqqSdqnhgoaw8fxcxVOFNmwRsPcbO8Gz9iVICpQeUpj15gLpP6iEo_PVa07hy-lGkuX1DfLpSfTMqTQTW6wfy7jO1klQLeRU_dSyfqp7Whc1WScvQIwl1rM2aXg0Wh0LG71LTHQyPftfRsbbcIpMpB5ueWycz-s3GnmwYMdTDeFA556EBaEqqEcKxnrjXPHMbH9rosd6Kzr2dm4Qfw9URgYJvUDlkA665wSbCGbR7xBpWDnX3M4PIkBaVWE",
    uploadDate: "14 Okt 2023",
    icon: "badge",
  },
  {
    id: 3,
    fileName: "SK_Pengangkatan_2023.pdf",
    type: "SK" as DocType,
    size: "4.5 MB",
    ownerName: "Andi Wijaya",
    ownerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDvug6IETFS2_2P5P6zvFj-t9n6tL9Mtbw83JAdDvvkqFY05TUl38LMHmpFvurQJkno4bOvBR8BnbZmcSTbf1yhzqBIn0uXr78kMJ-iBwxIDb_ETX5pX-DNg5PG4KuL4BFJ8OZ4HfYExQZU5pUpRuuMahKGKVOo0_EnM9_zEDKypzFUOmv2eHIfr21HVw5J3AgPQS2HfcamqWdDwUzHRRdosZMfoc37kS3ulwN5BpV-i-xiVnvEp5OfAvb0phrLM4-ZdRl4ZvocOcNQ",
    uploadDate: "15 Okt 2023",
    icon: "gavel",
  },
  {
    id: 4,
    fileName: "NPWP_Adinda_Putri.pdf",
    type: "NPWP" as DocType,
    size: "0.8 MB",
    ownerName: "Adinda Putri",
    ownerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuClWgVjzVnzbDNAoTRAI38sygzdmpEQyuIlIt_Tpy6xsroKGhG8F0buB8Jh2z92m-FinoR-4otILdCRI9HQ0pwpJet7FnO7UGPUPv1PrtbeeTRx9UZu3IoBz0wm13QR052Hu5dT9h1O2DZBtbeRrAf3u58Ivi-iws1dLYh3RCtab2je_9y7Umx5X-NqPE4yLcOThjrghwwsAgNTjDnZanRWnYKSWrFMh0Pf28ThCmx4EzyU4Lc3rIUS4g3wMWz1aaCoR87VM6VRz0Xp",
    uploadDate: "16 Okt 2023",
    icon: "receipt_long",
  },
  {
    id: 5,
    fileName: "Kontrak_PKWT_Budi_S.pdf",
    type: "Kontrak" as DocType,
    size: "6.1 MB",
    ownerName: "Budi Santoso",
    ownerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDZ14UowXXl9Y8JYKrTRwpRo3PCArVXnlGDpUOJbu9z3TAzVtyg7yCf-MYOvhMaYuC8kXjGq5iyzWHBFJuTAV-PNp57-7dYbHL3hvzshYIdJJBA-BAdN6a2I6CGlyg0V8sYkkc0Zj2zDddgn-S2u8c3r-StU6bjz4d4RRiPqtarkN4HUvcrr5KbTrGVnN9Qhprj_9mE1drxYIXwFGsCzoXbONmQhI3larKQhWwMxyFXgO4IilLWjn65K5J_5Sl5_2NRbnZzf2Cwzun",
    uploadDate: "20 Okt 2023",
    icon: "description",
  },
  {
    id: 6,
    fileName: "SK_Jabatan_Citra_L.pdf",
    type: "SK" as DocType,
    size: "3.2 MB",
    ownerName: "Citra Lestari",
    ownerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBT-4UHYSQfIXLt_cbyIlJ79ImQmWM-6Dz35yPTigapMYSznXLludQci4-6LLQ1EdKDHePBR1I-iqF3tCgMBeOqTAIntgVlIC3MSkNOyWJ47OjLJ9f5W-C7-mkW_nUimRcx_cJNci18Sh5180BM6SBkLuSn2uBBLkuPo26A13nJQbbta2cLhFNQrdIreFqjmuT1_8FboKdNMjNluVfoAOal2tz8UHAhSh0hgUqtKXGpzDmJYUh2i9G0B1NkT0_iQCIx_rIPtg6327sx",
    uploadDate: "22 Okt 2023",
    icon: "gavel",
  },
];

const FILTER_TABS: FilterType[] = ["Semua", "KTP", "NPWP", "Kontrak", "SK"];

export default function DokumenPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_DOCUMENTS.filter((doc) => {
      const matchFilter = activeFilter === "Semua" || doc.type === activeFilter;
      const matchSearch =
        searchQuery === "" ||
        doc.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <AppLayout>
      <div className="p-6 md:p-10 mb-28 max-w-2xl mx-auto lg:mx-0 w-full">
        {/* Editorial Header */}
        <section className="space-y-2 mb-8">
          <h2 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface">
            📁 Manajemen Dokumen
          </h2>
          <p className="text-on-surface-variant text-sm font-medium">
            Kurasi dan kelola berkas digital karyawan.
          </p>
        </section>

        {/* Search */}
        <section className="space-y-4 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline">search</span>
            </div>
            <input
              className="w-full bg-surface-container-highest border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all font-body text-sm"
              placeholder="Cari Nama Karyawan atau nama berkas..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-4 flex items-center text-outline hover:text-on-surface transition-colors"
                onClick={() => setSearchQuery("")}
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`flex-shrink-0 px-5 py-2 rounded-full font-semibold text-xs transition-all duration-200 active:scale-95 cursor-pointer ${
                  activeFilter === tab
                    ? "bg-primary text-on-primary-fixed shadow-lg shadow-primary/20"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* Document List */}
        <section className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-headline font-bold text-lg text-secondary">Berkas Terbaru</h3>
            <span className="text-xs font-label text-outline uppercase tracking-widest">
              {filtered.length} Berkas
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="glass rounded-3xl border border-white/5 p-12 flex flex-col items-center justify-center gap-3 text-center">
              <span className="material-symbols-outlined text-5xl text-outline">folder_off</span>
              <p className="font-headline font-bold text-on-surface-variant">Tidak ada berkas ditemukan</p>
              <p className="text-xs text-outline">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filtered.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Upload FAB */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-2xl liquid-light text-on-primary-fixed shadow-lg shadow-primary/30 flex items-center justify-center active:scale-90 transition-all duration-150 z-50 hover:shadow-xl hover:shadow-primary/40"
        title="Unggah Dokumen Baru"
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          add
        </span>
      </button>

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="glass border border-white/10 rounded-3xl p-7 w-full max-w-sm shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-lg text-on-surface">Unggah Dokumen</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-outline hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Drop Zone */}
            <div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-primary/60 transition-colors cursor-pointer hover:bg-primary/5">
              <span
                className="material-symbols-outlined text-4xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                cloud_upload
              </span>
              <p className="text-sm font-medium text-on-surface text-center">
                Klik atau seret berkas ke sini
              </p>
              <p className="text-xs text-outline text-center">PDF, JPG, PNG — Maks. 20 MB</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <select className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-on-surface font-body cursor-pointer">
                <option value="">Pilih Jenis Dokumen</option>
                {(["KTP", "NPWP", "Kontrak", "SK", "Lainnya"] as DocType[]).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-on-surface placeholder:text-outline font-body"
                placeholder="Nama Pemilik Berkas"
                type="text"
              />
            </div>

            <button className="w-full liquid-light text-on-primary-fixed font-bold py-3.5 rounded-2xl text-sm transition-all active:scale-95 hover:opacity-90 cursor-pointer">
              Simpan &amp; Unggah
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
