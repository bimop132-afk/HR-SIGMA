"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import DocumentCard from "@/components/dokumen/DocumentCard";

type DocType = "Kontrak" | "KTP" | "NPWP" | "SK" | "Paklaring" | "Ijazah" | "Lainnya";
type FilterType = "Semua" | DocType;

interface DocumentItem {
  id: number;
  fileName: string;
  type: DocType;
  size: string;
  ownerName: string;
  ownerAvatar: string;
  uploadDate: string;
  icon: string;
  filePath: string;
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const getIcon = (tipe: string) => {
  switch (tipe) {
    case "Kontrak": return "description";
    case "KTP": return "badge";
    case "NPWP": return "receipt_long";
    case "SK": return "gavel";
    case "Paklaring": return "history_edu";
    case "Ijazah": return "school";
    default: return "folder";
  }
};

const FILTER_TABS: FilterType[] = ["Semua", "KTP", "NPWP", "Kontrak", "SK", "Paklaring", "Ijazah"];

export default function DokumenPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [employees, setEmployees] = useState<{id: number, nama: string}[]>([]);
  
  // Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocType | "">("");
  const [empId, setEmpId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const fetchDocs = () => {
    fetch("/api/documents")
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const formatted = d.data.map((item: any) => ({
            ...item,
            size: formatSize(item.size),
            icon: getIcon(item.type)
          }));
          setDocuments(formatted);
        }
      });
  };

  useEffect(() => {
    fetchDocs();
    fetch("/api/employees")
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setEmployees(d.data.map((e: any) => ({ id: e.id, nama: e.namaLengkap })));
        }
      });
  }, []);

  const handleUpload = async () => {
    if (!file || !docType || !empId) return alert("Pilih file, tipe, dan karyawan");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", docType);
    formData.append("employeeId", empId);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setShowUploadModal(false);
        setFile(null);
        setDocType("");
        setEmpId("");
        fetchDocs(); // Refresh
      } else {
        alert("Gagal upload: " + data.error);
      }
    } catch (e) {
      alert("Error uploading");
    } finally {
      setIsUploading(false);
    }
  };

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
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
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-primary/60 transition-colors cursor-pointer hover:bg-primary/5"
            >
              <span
                className="material-symbols-outlined text-4xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                cloud_upload
              </span>
              <p className="text-sm font-medium text-on-surface text-center">
                {file ? file.name : "Klik atau seret berkas ke sini"}
              </p>
              <p className="text-xs text-outline text-center">PDF, JPG, PNG — Maks. 20 MB</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <select value={docType} onChange={e => setDocType(e.target.value as DocType)} className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-on-surface font-body cursor-pointer">
                <option value="">Pilih Jenis Dokumen</option>
                {(["KTP", "NPWP", "Kontrak", "SK", "Paklaring", "Ijazah", "Lainnya"] as DocType[]).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select value={empId} onChange={e => setEmpId(e.target.value)} className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-on-surface font-body cursor-pointer">
                <option value="">Pilih Karyawan</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.nama}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleUpload}
              disabled={isUploading || !file || !docType || !empId}
              className="w-full liquid-light text-on-primary-fixed font-bold py-3.5 rounded-2xl text-sm transition-all active:scale-95 hover:opacity-90 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? "Mengunggah..." : "Simpan & Unggah"}
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
