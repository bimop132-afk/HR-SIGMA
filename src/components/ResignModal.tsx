"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type Employee = {
  id: number;
  namaLengkap: string;
  nip: string;
  status: string;
};

export default function ResignModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Form State
  const [employeeId, setEmployeeId] = useState("");
  const [tipe, setTipe] = useState("NORMAL");
  const [tanggalResign, setTanggalResign] = useState("");
  const [alasan, setAlasan] = useState("");

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !tanggalResign) {
      toast.error("Mohon lengkapi data yang wajib diisi!");
      return;
    }

    setLoading(true);
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
        toast.success("Data resign berhasil diproses!");
        closeModal();
        // Redirect to print page directly (avoids popup blockers)
        window.location.href = "/offboarding/print/" + json.data.id;
      } else {
        throw new Error(json.error || "Terjadi kesalahan sistem");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal memproses resign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={openModal}
        className="flex items-center gap-2 px-6 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
        Proses Resign Baru
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-surface relative z-10 w-full max-w-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-white/10 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-2xl font-bold text-on-surface">Proses Resign Baru</h3>
              <button 
                onClick={closeModal} 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-2">
                <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Karyawan</label>
                {fetching ? (
                  <div className="h-14 bg-surface-container-highest animate-pulse rounded-xl"></div>
                ) : (
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                    disabled={employees.length === 0}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary appearance-none custom-select disabled:opacity-50"
                  >
                    <option value="" disabled>
                      {employees.length === 0 ? "Tidak ada karyawan dengan status Aktif" : "Pilih Karyawan Aktif..."}
                    </option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.namaLengkap} - {emp.nip}
                      </option>
                    ))}
                  </select>
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
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 liquid-light text-on-primary-fixed rounded-xl font-bold font-headline shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  ) : (
                    <>
                      Proses & Cetak
                      <span className="material-symbols-outlined text-xl">print</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
