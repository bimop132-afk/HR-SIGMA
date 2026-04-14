"use client";
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";

interface DownloadHistoryItem {
  id: number;
  name: string;
  by: string;
  time: string;
  icon: string;
  color: string;
  bg: string;
  status: string;
  statusColor: string;
  url: string;
}

export default function ExportPage() {
  const [selected, setSelected] = useState<"masuk" | "resign" | "denda" | "analitik" | null>("masuk");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("export_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }

    // Hitung tutup buku tanggal 25
    const today = new Date();
    let start, end;
    if (today.getDate() <= 25) {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 26);
      end = new Date(today.getFullYear(), today.getMonth(), 25);
    } else {
      start = new Date(today.getFullYear(), today.getMonth(), 26);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 25);
    }
    
    const formatDate = (d: Date) => {
      const ms = d.getMonth() + 1;
      const m = ms < 10 ? `0${ms}` : ms;
      const ds = d.getDate();
      const dy = ds < 10 ? `0${ds}` : ds;
      return `${d.getFullYear()}-${m}-${dy}`;
    };
    
    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  }, []);

  const handleDownload = () => {
    if (!selected) return;
    setIsDownloading(true);
    
    // Calls the export API
    const endpoint = selected === "masuk" ? "employees" : selected;
    const url = `/api/export/${endpoint}?start=${startDate}&end=${endDate}`;
    
    const fileName = `Export_${selected}_${new Date().toISOString().split("T")[0]}.xlsx`;
    const newItem: DownloadHistoryItem = {
      id: Date.now(),
      name: fileName,
      by: "Admin", // Should be user name in future
      time: "Baru saja",
      icon: "table_view",
      color: "text-zinc-200",
      bg: "bg-zinc-700/10",
      status: "Berhasil",
      statusColor: "text-red-500",
      url: url
    };
    
    const newHistory = [newItem, ...history].slice(0, 5); // Keep last 5
    setHistory(newHistory);
    localStorage.setItem("export_history", JSON.stringify(newHistory));

    window.location.href = url;
    
    setTimeout(() => setIsDownloading(false), 2000); // Reset state after timeout
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 pb-32 max-w-5xl mx-auto lg:mx-0 w-full">

        {/* Hero Header */}
        <div className="mb-10">
          <h2 className="text-[2rem] md:text-[2.25rem] font-headline font-bold leading-tight mb-2">
            Digital Curator{" "}
            <span className="text-primary tracking-tighter">Exports</span>
          </h2>
          <p className="text-on-surface-variant max-w-xl text-sm">
            Konfigurasi dan unduh laporan manajemen SDM Anda dalam format spreadsheet premium untuk analisis mendalam.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Config Section */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. Report Type */}
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-lg font-headline font-semibold">1. Pilih Tipe Laporan</h4>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest bg-surface-container-highest px-2 py-1 rounded-lg">
                  Wajib
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "masuk",   icon: "person_add",    label: "Karyawan Masuk",   desc: "Laporan harian/bulanan rekrutmen baru" },
                  { id: "resign",  icon: "person_remove", label: "Karyawan Resign",  desc: "Data terminasi dan perputaran karyawan" },
                  { id: "denda",   icon: "gavel",         label: "Laporan Denda",    desc: "Rekapitulasi pinalti dan kedisiplinan" },
                  { id: "analitik",icon: "analytics",     label: "Analitik SDM",     desc: "Ringkasan statistik dan tren karyawan" },
                ].map((opt) => {
                  const isActive = selected === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelected(opt.id as any)}
                      className={`group text-left p-6 rounded-2xl border transition-all duration-300 active:scale-[0.98] cursor-pointer ${
                        isActive
                          ? "bg-red-500/10 border-red-500 ring-2 ring-red-500/20"
                          : "bg-surface-container border-transparent hover:bg-red-500/5 hover:border-red-500/20"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4 transition-transform duration-300 ${
                          isActive ? "scale-110 shadow-lg shadow-red-500/20" : "group-hover:scale-110"
                        }`}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                          {opt.icon}
                        </span>
                      </div>
                      <p className={`font-headline font-bold text-sm mb-1 ${isActive ? "text-red-400" : "text-on-surface"}`}>
                        {opt.label}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Date Range */}
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-lg font-headline font-semibold">2. Tentukan Periode</h4>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest bg-surface-container-highest px-2 py-1 rounded-lg">
                  Otomatis
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest">
                    Mulai Tanggal
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-surface-container-highest border border-white/5 rounded-xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                      calendar_month
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest">
                    Sampai Tanggal
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-surface-container-highest border border-white/5 rounded-xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                      event
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Summary & Download */}
          <div className="lg:col-span-4">
            <div className="bg-red-950/20 rounded-3xl p-6 md:p-8 border border-red-500/20 flex flex-col h-full min-h-[360px]">
              <h4 className="text-lg font-headline font-semibold mb-6">Ringkasan Unduhan</h4>

              <div className="space-y-4 flex-1">
                {/* Format */}
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    description
                  </span>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Format Berkas</p>
                    <p className="text-sm font-bold text-on-surface">Excel Spreadsheet (.xlsx)</p>
                  </div>
                </div>

                {/* Size */}
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
                  <span className="material-symbols-outlined text-secondary">storage</span>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Estimasi Ukuran</p>
                    <p className="text-sm font-bold text-on-surface">
                      ~1.5 MB
                    </p>
                  </div>
                </div>

                {/* Tipe terpilih */}
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
                  <span className="material-symbols-outlined text-primary">assignment</span>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Tipe Laporan</p>
                    <p className="text-sm font-bold text-on-surface capitalize">
                      {selected ? `Laporan ${selected}` : "Belum dipilih"}
                    </p>
                  </div>
                </div>

                {/* Info note */}
                <div className="p-5 bg-surface-container-highest rounded-2xl border-l-4 border-secondary">
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Sistem akan mengkurasi data berdasarkan periode terpilih secara real-time dari basis data utama.
                  </p>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={!selected || isDownloading}
                className={`liquid-light mt-6 w-full py-5 rounded-2xl font-headline font-extrabold text-on-primary-fixed tracking-tight flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:shadow-[0_15px_40px_rgba(220,38,38,0.4)] active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isDownloading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Memproses...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      download
                    </span>
                    Download Laporan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Download History */}
        <div className="mt-14 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-headline font-bold">Riwayat Unduhan</h4>
            <button className="text-xs font-label text-secondary uppercase tracking-widest hover:underline cursor-pointer transition-opacity hover:opacity-80">
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {history.length === 0 && <p className="text-on-surface-variant text-sm py-4">Belum ada riwayat unduhan.</p>}
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-5 bg-surface-container-low rounded-3xl hover:bg-surface-container transition-colors duration-200"
              >
                {/* File Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-11 h-11 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-headline font-bold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Diunduh {item.time} oleh {item.by}
                    </p>
                  </div>
                </div>

                {/* Status + Re-download */}
                <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Status</p>
                    <p className={`text-sm font-medium ${item.statusColor}`}>{item.status}</p>
                  </div>
                  <button onClick={() => window.location.href = item.url} className="p-3 bg-surface-container-highest rounded-xl text-on-surface-variant hover:text-on-surface active:scale-90 transition-all cursor-pointer" title="Unduh ulang">
                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
