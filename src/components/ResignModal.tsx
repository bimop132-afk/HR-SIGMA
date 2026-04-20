"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import AnimatedModal from "@/components/ui/AnimatedModal";
import MultiStateButton from "@/components/ui/MultiStateButton";

type Employee = {
  id: number;
  nama_lengkap: string;
  nip: string;
  status: string;
};

export default function ResignModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [fetching, setFetching] = useState(false);

  const [employeeId, setEmployeeId] = useState("");
  const [tipe, setTipe] = useState("NORMAL");
  const [tanggalResign, setTanggalResign] = useState("");
  const [alasan, setAlasan] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredEmployees = employees.filter(emp => 
    (emp.nama_lengkap?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (emp.nip?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const openModal = async () => {
    setIsOpen(true);
    setFetching(true);
    try {
      // Fetch active employees only
      const res = await fetch("/api/employees?status=AKTIF");
      const json = await res.json();
      if (json?.success && json?.data) {
        setEmployees(Array.isArray(json.data) ? json.data : []);
      } else {
        toast.error("Gagal format data karyawan");
      }
    } catch (e: any) {
      toast.error(e.message || "Gagal memuat data karyawan");
    } finally {
      setFetching(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setEmployeeId("");
    setTipe("NORMAL");
    setTanggalResign("");
    setAlasan("");
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !tanggalResign) {
      toast.error("Mohon lengkapi data yang wajib diisi!");
      return;
    }

    setButtonState("loading");
    try {
      const payload = {
        employeeId: parseInt(employeeId),
        tipe,
        tanggalResign,
        alasan: alasan || null,
      };

      const res = await fetch("/api/resignations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json && json.success) {
        setButtonState("success");
        toast.success("Data resign berhasil diproses!");
        
        setTimeout(() => {
          closeModal();
          // Redirect to print page directly (avoids popup blockers)
          window.location.href = "/offboarding/print/" + json.data.id;
        }, 800);
      } else {
        throw new Error(json.error || "Terjadi kesalahan sistem");
      }
    } catch (error: any) {
      setButtonState("error");
      toast.error(error.message || "Gagal memproses resign");
      setTimeout(() => setButtonState("idle"), 2000);
    }
  };

  return (
    <>
      <div className="w-full">
        <button 
          onClick={openModal}
          className="group relative w-full h-32 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/5 active:scale-[0.98]"
        >
          {/* Animated Background (Morph Seed) */}
          <motion.div 
            layoutId="resign-action" 
            className="absolute inset-0 bg-gradient-to-br from-error/80 to-error-container z-0"
            style={{ opacity: isOpen ? 0 : 1 }}
          />

          {/* Card Content (Fades during morph) */}
          <div className={`relative z-10 flex items-center justify-between px-8 h-full text-on-error transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-xl font-headline font-bold">Proses Karyawan Resign</h3>
              <p className="text-sm opacity-80 font-body">Input data pengunduran diri & cetak surat A4</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_remove</span>
            </div>
          </div>
        </button>
      </div>

      <AnimatedModal isOpen={isOpen} onClose={closeModal} layoutId="resign-action" className="max-w-lg">
          <div className="flex justify-between items-center px-6 md:px-8 pt-6 md:pt-8 pb-4">
            <h3 className="font-headline text-2xl font-bold text-on-surface">Proses Resign Baru</h3>
            <button 
              onClick={closeModal} 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 overflow-y-auto px-6 md:px-8 pb-6 md:pb-8 custom-scrollbar">
              <div className="space-y-2 relative">
                <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Cari Karyawan (NIP / Nama)</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">search</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                      if (!e.target.value) setEmployeeId("");
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Contoh: 2501LPK... atau Nama"
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl pl-12 pr-4 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50"
                  />
                </div>

                {showDropdown && (searchTerm || fetching) && (
                  <div className="absolute top-full left-0 right-0 z-[110] mt-2 bg-surface-container-high border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar p-2">
                    {fetching ? (
                      <div className="p-4 text-center text-sm text-on-surface-variant animate-pulse">Memuat data...</div>
                    ) : filteredEmployees.length === 0 ? (
                      <div className="p-4 text-center text-sm text-on-surface-variant">Karyawan tidak ditemukan</div>
                    ) : (
                      filteredEmployees.map(emp => (
                        <button
                          key={emp.id}
                          type="button"
                          onClick={() => {
                            setEmployeeId(emp.id.toString());
                            setSearchTerm(`${emp.nama_lengkap} (${emp.nip})`);
                            setShowDropdown(false);
                          }}
                          className={`w-full text-left p-3 rounded-xl transition-colors hover:bg-primary/10 flex flex-col ${employeeId === emp.id.toString() ? 'bg-primary/20 border border-primary/30' : ''}`}
                        >
                          <span className="font-bold text-on-surface">{emp.nama_lengkap}</span>
                          <span className="text-xs text-on-surface-variant">{emp.nip} • {emp.status}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Tipe Resign</label>
                <select
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary appearance-none custom-select"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="MENDADAK">Mendadak</option>
                  <option value="PHK">PHK</option>
                  <option value="TANPA_BERITA">Tanpa Berita</option>
                </select>
                
                {tipe === "MENDADAK" && (
                  <div className="mt-3 p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3">
                    <span className="material-symbols-outlined text-error text-xl">warning</span>
                    <div>
                      <p className="text-sm font-bold text-error">Denda Resign Mendadak</p>
                      <p className="text-xs text-error/80 mt-1">Sistem akan otomatis mencatat denda sebesar <b>Rp 125.000</b> ke dalam riwayat pinalti karyawan ini.</p>
                    </div>
                  </div>
                )}

                {tipe === "TANPA_BERITA" && (
                  <div className="mt-3 p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3">
                    <span className="material-symbols-outlined text-error text-xl">gavel</span>
                    <div>
                      <p className="text-sm font-bold text-error">Denda Mundur Tanpa Berita</p>
                      <p className="text-xs text-error/80 mt-1">Sistem akan otomatis mencatat denda sebesar <b>Rp 550.000</b> ke dalam riwayat pinalti karyawan ini.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Tanggal Efektif Resign</label>
                <input
                  type="date"
                  required
                  value={tanggalResign}
                  onChange={(e) => setTanggalResign(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary h-14"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Alasan</label>
                <textarea
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  placeholder="Tambahkan catatan (opsional)"
                  rows={3}
                  className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              <div className="pt-4 flex gap-4 mt-auto">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-4 bg-surface-container-highest bg-opacity-50 text-on-surface-variant rounded-2xl font-bold cursor-pointer hover:bg-opacity-100 transition-all"
                >
                  Batal
                </button>
                <MultiStateButton
                  type="submit"
                  state={buttonState}
                  idleText="Proses & Cetak ⎙"
                  className="flex-1"
                />
              </div>
            </form>
          </div>
      </AnimatedModal>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-select {
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem top 50%;
          background-size: 0.65rem auto;
        }
      `}} />
    </>
  );
}
