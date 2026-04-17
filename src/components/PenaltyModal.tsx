"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import AnimatedModal from "@/components/ui/AnimatedModal";

type Employee = {
  id: number;
  nama_lengkap: string;
  nip: string;
  status: string;
};

export default function PenaltyModal({ onSuccess }: { onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Form State
  const [employeeId, setEmployeeId] = useState("");
  const [alasan, setAlasan] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [tanggalDenda, setTanggalDenda] = useState(new Date().toISOString().split("T")[0]);
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
      const res = await fetch("/api/employees?status=AKTIF");
      const json = await res.json();
      if (json?.success && json?.data) {
        setEmployees(json.data);
      }
    } catch (e: any) {
      toast.error("Gagal memuat data karyawan");
    } finally {
      setFetching(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setEmployeeId("");
    setAlasan("");
    setJumlah("");
    setSearchTerm("");
    setShowDropdown(false);
  };

  const setDendaAlfa = () => {
    setAlasan("Denda Alfa (Tanpa Keterangan)");
    setJumlah("50000"); // Standard amount if applicable, can be adjusted
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !alasan || !jumlah || !tanggalDenda) {
      toast.error("Mohon lengkapi semua data!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        employeeId: parseInt(employeeId),
        alasan,
        jumlah: parseInt(jumlah),
        tanggalDenda,
      };

      const res = await fetch("/api/penalties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Denda berhasil ditambahkan!");
        closeModal();
        onSuccess();
      } else {
        throw new Error(json.error || "Gagal menyimpan denda");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full">
        <button 
          onClick={openModal}
          className="group relative w-full h-28 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/5 active:scale-[0.98]"
        >
          {/* Animated Background (Morph Seed) */}
          <motion.div 
            layoutId="penalty-action" 
            className="absolute inset-0 bg-gradient-to-br from-red-600/80 to-red-900/40 z-0"
            style={{ opacity: isOpen ? 0 : 1 }}
          />

          {/* Card Content (Fades during morph) */}
          <div className={`relative z-10 flex items-center gap-6 px-6 h-full text-on-primary transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <span className="material-symbols-outlined text-3xl font-bold">gavel</span>
            </div>
            <div className="flex flex-col items-start text-left">
              <h3 className="text-lg font-headline font-bold">Tambah Denda Karyawan</h3>
              <p className="text-sm opacity-70 font-body">Input denda alfa, seragam, atau denda lainnya</p>
            </div>
          </div>
        </button>
      </div>

      <AnimatedModal isOpen={isOpen} onClose={closeModal} layoutId="penalty-action">
        <div className="bg-surface relative z-10 w-full max-w-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-white/10 flex flex-col max-h-[90vh]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-2xl font-bold text-on-surface">Tambah Denda Baru</h3>
            <button onClick={closeModal} className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
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
                    placeholder="Cari NIP atau Nama..."
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

              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={setDendaAlfa}
                  className="px-4 py-2 bg-error-container/30 text-error rounded-xl text-xs font-bold hover:bg-error-container/50 transition-all"
                >
                  Preset: Denda Alfa
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Alasan / Jenis Denda</label>
                <input
                  type="text"
                  required
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Contoh: Terlambat, Merusak APD, dll"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Jumlah (Rp)</label>
                  <input
                    type="number"
                    required
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={tanggalDenda}
                    onChange={(e) => setTanggalDenda(e.target.value)}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary h-14"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4 mt-auto">
                <button type="button" onClick={closeModal} className="flex-1 py-4 bg-surface-container-highest bg-opacity-50 text-on-surface-variant rounded-2xl font-bold cursor-pointer hover:bg-opacity-100 transition-all">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 liquid-light text-on-primary-fixed rounded-xl font-bold font-headline shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  ) : (
                    "Simpan Denda"
                  )}
                </button>
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
