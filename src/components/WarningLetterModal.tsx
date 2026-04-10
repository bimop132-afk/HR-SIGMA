"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Employee = {
  id: number;
  nama_lengkap: string;
  nip: string;
};

export default function WarningLetterModal({ 
  employeeId: initialEmployeeId, 
  onSuccess 
}: { 
  employeeId?: number; 
  onSuccess?: () => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const router = useRouter();

  // Form State
  const [employeeId, setEmployeeId] = useState(initialEmployeeId?.toString() || "");
  const [tipe, setTipe] = useState("SP_1");
  const [alasan, setAlasan] = useState("");
  const [tanggalTerbit, setTanggalTerbit] = useState(new Date().toISOString().split("T")[0]);
  const [tanggalBerakhir, setTanggalBerakhir] = useState("");
  const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    if (tanggalTerbit) {
      const date = new Date(tanggalTerbit);
      date.setMonth(date.getMonth() + 6); // SP usually lasts for 6 months
      setTanggalBerakhir(date.toISOString().split("T")[0]);
    }
  }, [tanggalTerbit]);

  const openModal = async () => {
    setIsOpen(true);
    if (!initialEmployeeId) {
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
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    if (!initialEmployeeId) setEmployeeId("");
    setAlasan("");
    setKeterangan("");
    setTipe("SP_1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !tipe || !alasan || !tanggalTerbit || !tanggalBerakhir) {
      toast.error("Mohon lengkapi semua data!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        employeeId: parseInt(employeeId),
        tipe,
        alasan,
        tanggalTerbit,
        tanggalBerakhir,
        keterangan: keterangan || null,
      };

      const res = await fetch("/api/warning-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Surat Peringatan ${tipe.replace("_", " ")} berhasil diterbitkan!`);
        closeModal();
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
        }
      } else {
        throw new Error(json.error || "Gagal menerbitkan SP");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-error to-red-700 text-white font-bold rounded-xl shadow-lg shadow-error/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined text-sm">gavel</span>
        Terbitkan SP
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-surface relative z-10 w-full max-w-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-white/10 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-2xl font-bold text-on-surface">Terbitkan Surat Peringatan</h3>
              <button onClick={closeModal} className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar text-left">
              {!initialEmployeeId && (
                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Karyawan</label>
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary appearance-none custom-select"
                  >
                    <option value="" disabled>Pilih Karyawan...</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.nama_lengkap} - {emp.nip}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">
                  Tingkat Peringatan
                </label>
                <div className="flex gap-4">
                  {["SP_1", "SP_2", "SP_3"].map((t) => (
                    <label key={t} className="flex-1 cursor-pointer">
                      <input
                        checked={tipe === t}
                        onChange={() => setTipe(t)}
                        className="hidden peer"
                        type="radio"
                        name="sp_type"
                      />
                      <div className="w-full py-4 rounded-xl border border-white/5 text-center transition-all bg-surface-container-highest peer-checked:bg-error/20 peer-checked:border-error peer-checked:text-error font-bold text-xs">
                        {t.replace("_", " ")}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Alasan / Pelanggaran</label>
                <textarea
                  required
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  rows={2}
                  className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50"
                  placeholder="Deskripsikan jenis pelanggaran"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Tanggal Terbit</label>
                  <input
                    type="date"
                    required
                    value={tanggalTerbit}
                    onChange={(e) => setTanggalTerbit(e.target.value)}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary h-14"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Berlaku Hingga</label>
                  <input
                    type="date"
                    required
                    value={tanggalBerakhir}
                    onChange={(e) => setTanggalBerakhir(e.target.value)}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary h-14"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Keterangan Tambahan (Opsional)</label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Catatan tambahan"
                />
              </div>

              <div className="pt-4 flex gap-4 mt-auto">
                <button type="button" onClick={closeModal} className="flex-1 py-4 bg-surface-container-highest bg-opacity-50 text-on-surface-variant rounded-2xl font-bold cursor-pointer hover:bg-opacity-100 transition-all">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-br from-error to-red-700 text-white rounded-xl font-bold font-headline shadow-lg shadow-error/20 hover:scale-105 active:scale-95 transition-transform flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  ) : (
                    "Terbitkan SP"
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
