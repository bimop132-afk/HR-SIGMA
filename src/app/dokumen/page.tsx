"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import DocumentCard from "@/components/dokumen/DocumentCard";
import DocumentViewer from "@/components/DocumentViewer";
import { motion } from "framer-motion";
import AnimatedModal from "@/components/ui/AnimatedModal";

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
  nip?: string;
  posisi?: string;
  sektor?: string;
  status?: string;
  employeeId?: number;
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
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  
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
            icon: getIcon(item.type),
            ownerName: item.ownerName || "Tidak Diketahui",
            nip: item.nip,
            posisi: item.posisi,
            sektor: item.sektor,
            status: item.status,
            employeeId: item.employeeId
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
          setEmployees(d.data.map((e: any) => ({ id: e.id, nama: e.nama_lengkap || e.namaLengkap })));
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
      const ownerName = doc.ownerName || "Tidak Diketahui";
      const fileName = doc.fileName || "";
      const matchSearch =
        searchQuery === "" ||
        ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fileName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [activeFilter, searchQuery, documents]);

  const groupedDocuments = useMemo(() => {
    const groups: Record<string, DocumentItem[]> = {};
    filtered.forEach(doc => {
      const gName = doc.ownerName || "Tidak Diketahui";
      if (!groups[gName]) {
        groups[gName] = [];
      }
      groups[gName].push(doc);
    });
    // Sort by name
    return Object.fromEntries(
      Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
    );
  }, [filtered]);

  return (
    <AppLayout>
      <div className="p-6 md:p-10 mb-28 max-w-4xl mx-auto lg:mx-0 w-full">
        {/* Editorial Header */}
        <section className="space-y-2 mb-8 text-left">
          <h2 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface">
            📁 Manajemen Dokumen
          </h2>
          <p className="text-on-surface-variant text-sm font-medium">
            Kurasi dan kelola berkas digital karyawan yang terorganisir per individu.
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
        <section className="space-y-8">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-headline font-bold text-lg text-secondary">Berkas Karyawan</h3>
            <span className="text-xs font-label text-outline uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
              {filtered.length} Total Berkas
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="glass rounded-3xl border border-white/5 p-12 flex flex-col items-center justify-center gap-3 text-center">
              <span className="material-symbols-outlined text-5xl text-outline">folder_off</span>
              <p className="font-headline font-bold text-on-surface-variant">Tidak ada berkas ditemukan</p>
              <p className="text-xs text-outline">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedDocuments).map(([ownerName, docs]) => {
                const emp = docs[0];
                const initials = ownerName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
                const isActive = emp.status !== "Non-Aktif";
                
                return (
                  <div key={ownerName} className="glass-card border border-white/10 rounded-[2rem] overflow-hidden relative group transition-all duration-300 hover:border-white/20">
                    {/* Employee Card Header */}
                    <div className="p-5 md:p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-5 bg-surface/50">
                      
                      <div className="flex gap-4 items-center pl-1">
                        {emp.ownerAvatar ? (
                          <img src={emp.ownerAvatar} alt={ownerName} className="w-16 h-16 rounded-2xl object-cover ring-1 ring-white/10 shadow-lg" />
                        ) : (
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl bg-gradient-to-br from-surface-container-high to-surface-container-highest text-on-surface ring-1 ring-white/5 shadow-lg`}>
                            {initials}
                          </div>
                        )}
                        <div>
                          <h3 className="font-headline font-extrabold text-xl text-on-surface tracking-tight mb-1">{ownerName}</h3>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-sm font-bold text-on-surface-variant font-mono bg-surface-container px-2 py-0.5 rounded-md">
                              {emp.nip || "-"}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-outline/50 hidden sm:block"></span>
                            <span className="text-secondary text-sm font-semibold">{emp.posisi || "-"}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-5 sm:gap-8 bg-surface-container-low px-6 py-4 rounded-2xl border border-white/5">
                        <div className="flex gap-6 sm:gap-8">
                          <div className="text-right">
                            <p className="text-[10px] text-outline uppercase tracking-widest font-black mb-1">Sektor</p>
                            <p className="text-sm font-bold text-on-surface">{emp.sektor || "-"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-outline uppercase tracking-widest font-black mb-1">Status</p>
                            <span className={`inline-flex items-center text-xs font-bold leading-none ${isActive ? 'text-primary' : 'text-error'}`}>
                               <span className={`w-1.5 h-1.5 rounded-full mr-2 ${isActive ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]' : 'bg-error shadow-[0_0_8px_rgba(var(--error),0.8)]'}`}></span>
                               {emp.status || "Aktif"}
                            </span>
                          </div>
                        </div>
                        <div className="h-10 w-px bg-white/10 hidden sm:block"></div>
                        <div className="text-center text-primary">
                          <p className="text-2xl font-black leading-none">{docs.length}</p>
                          <p className="text-[9px] uppercase font-black tracking-[0.2em]">Berkas</p>
                        </div>
                      </div>

                    </div>
                    
                    {/* Documents List */}
                    <div className="p-5 md:p-6 bg-surface-container-highest/20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {docs.map((doc) => (
                        <DocumentCard 
                          key={doc.id} 
                          doc={doc} 
                          onView={() => setSelectedDoc(doc)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Viewer */}
      {selectedDoc && (
        <DocumentViewer 
          isOpen={!!selectedDoc} 
          onClose={() => setSelectedDoc(null)} 
          url={selectedDoc.filePath} 
          fileName={selectedDoc.fileName} 
        />
      )}

      {/* Upload FAB */}
      <motion.button
        layoutId="upload-doc-action"
        onClick={() => setShowUploadModal(true)}
        className={`fixed bottom-24 right-6 w-14 h-14 rounded-2xl liquid-light text-on-primary-fixed shadow-lg shadow-primary/30 flex items-center justify-center active:scale-90 transition-all duration-150 z-50 hover:shadow-xl hover:shadow-primary/40 ${showUploadModal ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        title="Unggah Dokumen Baru"
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          add
        </span>
      </motion.button>

      {/* Upload Modal */}
      <AnimatedModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} layoutId="upload-doc-action">
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
              accept=".pdf,.jpg,.jpeg,.png,.webp"
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
              <p className="text-xs text-outline text-center">PDF, JPG, PNG, WEBP — Maks. 20 MB</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <select value={docType} onChange={e => setDocType(e.target.value as DocType)} className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-on-surface font-body cursor-pointer text-left">
                <option value="">Pilih Jenis Dokumen</option>
                {(["KTP", "NPWP", "Kontrak", "SK", "Paklaring", "Ijazah", "Lainnya"] as DocType[]).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select value={empId} onChange={e => setEmpId(e.target.value)} className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-on-surface font-body cursor-pointer text-left">
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
      </AnimatedModal>
    </AppLayout>
  );
}
