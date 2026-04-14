"use client";

import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

type ErrorLog = { sheet: string; error: string; type: 'warning' | 'fatal' };

export default function AbsensiAutomatorPage() {
  const [targetMonth, setTargetMonth] = useState("April 2026");
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files).filter(f => f.name.endsWith(".xlsx")));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const processExcel = async () => {
    if (files.length === 0) return toast.error("Silakan masukkan minimal 1 file Excel!");
    if (!targetMonth) return toast.error("Bulan target wajib diisi!");

    setIsProcessing(true);
    setLogs([]);
    setIsLocked(false);
    
    let allSektorData: any[] = [];
    let allPelaksanaData: any[] = [];
    let currentLogs: ErrorLog[] = [];
    let hasFatalError = false;

    // Helper to calculate OFF logic
    const calcOff = (code: any) => {
      if (!code) return 0;
      const t = code.toString().trim().toUpperCase();
      // Off adalah gabungan SAKIT (S), IZIN (I), LIBUR, OFF, PIC, dll. Anything that's not H or A basically.
      if (t !== 'H' && t !== 'A') return 1;
      return 0;
    };

    try {
      for (const file of files) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });

        for (const sheetName of workbook.SheetNames) {
          const isPelaksana = sheetName.toUpperCase().includes("PELAKSANA") || sheetName.toUpperCase().includes("LEADER");
          
          const worksheet = workbook.Sheets[sheetName];
          // Gunakan raw: false agar tanggal bulan (misal "April 2026") terbaca sebagai teks, bukan angka serial Excel 45000+
          const rawData = XLSX.utils.sheet_to_json<any[][]>(worksheet, { header: 1, defval: "", raw: false });

          // 1. Find Anchor Row (Mencari Teks Bulan)
          let anchorRowIdx = -1;
          for (let r = 0; r < rawData.length; r++) {
            const rowStr = rawData[r].map(c => c ? c.toString().toUpperCase() : "").join(" ");
            if (rowStr.includes(targetMonth.toUpperCase())) {
              anchorRowIdx = r;
              break;
            }
          }

          // Fallback: Jika tidak ketemu teks bulannya, kita coba cari baris yang isinya angka tanggal 26, 27, 28
          if (anchorRowIdx === -1) {
            for (let r = 0; r < rawData.length; r++) {
              const rowStr = rawData[r].map(c => c ? c.toString().trim() : "").join(",");
              if (rowStr.includes("26") && rowStr.includes("27") && rowStr.includes("28") && rowStr.includes("25")) {
                 anchorRowIdx = r > 0 ? r - 1 : r; // Set anchor to the row above dates (or current)
                 break;
              }
            }
          }

          if (anchorRowIdx === -1) {
            currentLogs.push({ sheet: `${file.name} - ${sheetName}`, error: `Jangkar '${targetMonth}' atau deret tanggal absen tidak ditemukan. Lembar ini dilewati.`, type: 'warning' });
            continue; // Skip sheet if absolutely no anchor/dates found
          }

          // In the image, Month string is Row 5. The dates (26, 27..) are Row 6. Data starts row 7.
          // We will find the row with dates dynamically by looking at anchorRowIdx + 1, or anchorRowIdx itself if dates are on the same row.
          let dateRowIdx = anchorRowIdx + 1;
          // Find Column map for dates
          // Assuming dates 26..25 are consecutive across columns.
          let dateColumns: { colIdx: number, dateStr: string }[] = [];
          for (let c = 0; c < rawData[dateRowIdx].length; c++) {
            const val = rawData[dateRowIdx][c];
            if (val && !isNaN(parseInt(val.toString()))) {
              dateColumns.push({ colIdx: c, dateStr: val.toString() });
            }
          }

          // Ensure we got roughly 30 days
          if (dateColumns.length < 28) {
            currentLogs.push({ sheet: `${file.name} - ${sheetName}`, error: `Hanya menemukan ${dateColumns.length} kolom tanggal di bawah jangkar.`, type: 'warning' });
          }

          // Read data rows starting from dateRowIdx + 1
          let emptyEncountered = 0;
          for (let r = dateRowIdx + 1; r < rawData.length; r++) {
            const rowStrFull = rawData[r].map(c => c ? c.toString().toUpperCase().trim() : "").join(" ");
            
            // Jika menemukan bagian tanda tangan atau catatan kaki, langsung berhenti membaca sheet ini
            if (
              rowStrFull.includes("MENGETAHUI") || 
              rowStrFull.includes("DIBUAT OLEH") || 
              rowStrFull.includes("DISETUJUI") || 
              rowStrFull.includes("KEBERADAAN DI AREA") ||
              rowStrFull.includes("DILARANG BERADA")
            ) {
              break;
            }

            const row = rawData[r];
            const nik = row[1]?.toString().trim(); // Column B
            const nama = row[2]?.toString().trim(); // Column C
            
            // If NIK empty, increment blank row counter. Stop after 3 consecutive blanks to avoid reading indefinitely
            if (!nik && !nama) {
              emptyEncountered++;
              if (emptyEncountered > 3) break;
              continue;
            } else {
              emptyEncountered = 0; // reset
            }

            // Abaikan baris yang merupakan header tabel dari halaman/sheet lain
            if (nik?.toUpperCase() === 'NIK' || nama?.toUpperCase() === 'NAMA' || nama?.toUpperCase() === 'NAMA KARYAWAN') {
              continue;
            }

            // Only process if both NIK and NAMA exist
            if (nik && nama) {

              const area = row[3]?.toString() || "";
              const sektor = row[4]?.toString() || "";
              const regu = row[5]?.toString() || "";

              let hadir = 0;
              let alfa = 0;
              let off = 0;
              
              let missingDates: string[] = [];
              let dailyRecord: any = {};

              // Extract daily cells
              for (const dc of dateColumns) {
                const cellValue = row[dc.colIdx]?.toString().trim() || "";
                dailyRecord[`Tgl ${dc.dateStr}`] = cellValue;
                
                if (!cellValue) {
                  missingDates.push(dc.dateStr);
                } else if (cellValue.toUpperCase() === 'H') {
                  hadir++;
                } else if (cellValue.toUpperCase() === 'A') {
                  alfa++;
                } else {
                  off += calcOff(cellValue);
                }
              }

              if (missingDates.length > 0) {
                // Changed from fatal to just a stark warning so download continues
                currentLogs.push({ 
                  sheet: `${file.name} - ${sheetName}`, 
                  error: `${nama} (${nik}) memiliki sel kosong pada tanggal: ${missingDates.join(", ")}`, 
                  type: 'fatal' 
                });
              }

              const rowData = {
                "NO": 0, // Set later
                "NIK": nik,
                "NAMA KARYAWAN": nama,
                "AREA": area,
                "SEKTOR": sektor,
                "REGU": regu,
                ...dailyRecord,
                "HADIR": hadir,
                "FULL MINGGU": "",
                "MENJADI HELPER": "",
                "OFF": off,
                "ALFA": alfa,
                "%": alfa > 0 ? (alfa / 25) : 0 // percentage
              };

              if (isPelaksana) {
                allPelaksanaData.push(rowData);
              } else {
                allSektorData.push(rowData);
              }
            }
          }
        }
      }

      setLogs(currentLogs);

      if (allSektorData.length === 0 && allPelaksanaData.length === 0) {
        toast.error("Tidak ada data valid yang berhasil diekstrak!");
        return;
      }
      
      if (currentLogs.some(log => log.type === 'fatal')) {
        toast.error("File diunduh, namun perhatikan daftar Peringatan Sel Kosong!");
      }

      // Re-index
      allSektorData = allSektorData.map((d, i) => ({ ...d, "NO": i + 1 }));
      allPelaksanaData = allPelaksanaData.map((d, i) => ({ ...d, "NO": i + 1 }));

      // Generate Excel
      const workbook = XLSX.utils.book_new();

      if (allSektorData.length > 0) {
        const wsSektor = XLSX.utils.json_to_sheet(allSektorData);
        // Format percentage column
        const range = XLSX.utils.decode_range(wsSektor['!ref'] || "A1:A1");
        // find % col
        let percentCol = -1;
        for (let C = range.s.c; C <= range.e.c; ++C) {
          if (wsSektor[XLSX.utils.encode_cell({r:0, c:C})]?.v === "%") percentCol = C;
          // bold header
          if (wsSektor[XLSX.utils.encode_cell({r:0, c:C})]) wsSektor[XLSX.utils.encode_cell({r:0, c:C})].s = { font: { bold: true } };
        }
        if (percentCol > -1) {
          for (let R = 1; R <= range.e.r; ++R) {
            const cell = wsSektor[XLSX.utils.encode_cell({r:R, c:percentCol})];
            if (cell) cell.z = "0.00%";
          }
        }
        XLSX.utils.book_append_sheet(workbook, wsSektor, "REKAP SEKTOR");
      }

      if (allPelaksanaData.length > 0) {
        const wsPel = XLSX.utils.json_to_sheet(allPelaksanaData);
        const range = XLSX.utils.decode_range(wsPel['!ref'] || "A1:A1");
        let percentCol = -1;
        for (let C = range.s.c; C <= range.e.c; ++C) {
          if (wsPel[XLSX.utils.encode_cell({r:0, c:C})]?.v === "%") percentCol = C;
          if (wsPel[XLSX.utils.encode_cell({r:0, c:C})]) wsPel[XLSX.utils.encode_cell({r:0, c:C})].s = { font: { bold: true } };
        }
        if (percentCol > -1) {
          for (let R = 1; R <= range.e.r; ++R) {
            const cell = wsPel[XLSX.utils.encode_cell({r:R, c:percentCol})];
            if (cell) cell.z = "0.00%";
          }
        }
        XLSX.utils.book_append_sheet(workbook, wsPel, "REKAP PELAKSANA");
      }

      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MASTER_REKAP_ABSENSI_${targetMonth.replace(" ", "_")}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success("Master File berhasil dibakar dan disimpan otomatis!");

    } catch (e: any) {
      toast.error(e.message || "Gagal memproses file Excel");
      setIsLocked(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-background p-6 lg:p-8 lg:ml-72 pb-24">
        <h1 className="font-headline font-black text-3xl mb-2 text-on-background">Mesin Automator Absen</h1>
        <p className="text-on-surface-variant font-medium mb-8">Pengekstrak & Penggabung Data Leader (Sektor 1-10) Menjadi 1 Master</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
              <label className="block text-sm font-bold text-on-surface uppercase tracking-widest">Titik Jangkar Bulan</label>
              <input
                type="text"
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
                placeholder="Contoh: April 2026"
                className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-on-surface-variant">Sistem akan memburu teks ini di dalam Sektor/Sheet untuk menghindari rekap bulan lalu yang terpendam di bawahnya.</p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
              <h3 className="block text-sm font-bold text-on-surface uppercase tracking-widest">File Absensi (.xlsx)</h3>
              
              <div 
                className="border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="material-symbols-outlined text-4xl text-primary mb-2">upload_file</span>
                <p className="text-sm font-bold text-on-surface">Drag & Drop file R1, R2, R3.xlsx ke sini</p>
                <p className="text-xs text-on-surface-variant">Atau klik untuk memilih file Excel</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".xlsx" 
                  multiple 
                  onChange={handleFileSelect}
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2 mt-4">
                  {files.map((f, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-surface-container rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="material-symbols-outlined text-green-500">table_view</span>
                        <p className="text-xs font-bold text-on-surface truncate">{f.name}</p>
                      </div>
                      <button onClick={() => removeFile(i)} className="text-error hover:text-error/80 cursor-pointer">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={processExcel}
              disabled={isProcessing}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer liquid-light text-on-primary-fixed shadow-lg shadow-primary/20`}
            >
              <span className="material-symbols-outlined">bolt</span>
              {isProcessing ? "Membakar Data..." : "Bakar Master Data"}
            </button>
            {isLocked && (
              <button 
                onClick={() => { setIsLocked(false); setLogs([]); }}
                className="w-full mt-2 py-3 bg-surface-container hover:bg-surface-container-high rounded-xl text-primary text-sm font-bold cursor-pointer transition-colors"
                >
                Reset Status
              </button>
            )}
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col max-h-[80vh]">
            <h3 className="block text-sm font-bold text-on-surface uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">monitor_heart</span>
              Radar Audit Sel Bolong
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant opacity-50 pt-20">
                  <span className="material-symbols-outlined text-6xl mb-4">check_circle</span>
                  <p className="font-bold">Belum ada anomali ditemukan</p>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={`p-4 rounded-2xl flex gap-3 items-start border ${
                    log.type === 'fatal' ? 'bg-error/10 border-error/20 text-error' : 'bg-secondary/10 border-secondary/20 text-secondary'
                  }`}>
                    <span className="material-symbols-outlined mt-0.5">{log.type === 'fatal' ? 'cancel' : 'warning'}</span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider opacity-70 mb-1">{log.sheet}</p>
                      <p className="text-sm font-bold">{log.error}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
