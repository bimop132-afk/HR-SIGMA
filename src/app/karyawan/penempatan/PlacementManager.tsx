"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PlacementManager({ initialEmployees }: { initialEmployees: any[] }) {
  const router = useRouter();
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedEmp, setSelectedEmp] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [sektor, setSektor] = useState("");
  const [regu, setRegu] = useState("");

  const openModal = (emp: any) => {
    setSelectedEmp(emp);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmp(null);
    setIsModalOpen(false);
    setSektor("");
    setRegu("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp || !sektor || !regu) {
      toast.error("Mohon pilih Sektor dan Regu");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/employees/${selectedEmp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sektor: parseInt(sektor),
          regu: parseInt(regu),
          status: "AKTIF"
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal update penempatan");

      toast.success(`Penempatan ${selectedEmp.nama_lengkap} berhasil diperbarui!`);
      
      // Update local state
      setEmployees(prev => prev.filter(e => e.id !== selectedEmp.id));
      closeModal();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {employees.length === 0 ? (
        <div className="glass-card rounded-[2rem] p-20 flex flex-col items-center justify-center text-center space-y-4 border border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className="w-20 h-20 rounded-3xl bg-tertiary/10 flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-5xl">task_alt</span>
          </div>
          <h2 className="text-2xl font-headline font-bold text-on-surface">Semua Karyawan Sudah Memiliki Penempatan</h2>
          <p className="text-on-surface-variant max-w-md">Tidak ada karyawan baru yang menunggu penempatan saat ini.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((emp) => (
            <div key={emp.id} className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between hover:bg-white/5 transition-all group">
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {emp.nama_lengkap.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-lg text-on-surface">{emp.nama_lengkap}</h3>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">NIP {emp.nip}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Posisi</p>
                    <p className="text-sm font-bold text-secondary">{emp.posisi || "-"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Dibuat</p>
                    <p className="text-sm font-bold text-on-surface">
                      {new Date(emp.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openModal(emp)}
                className="mt-6 w-full py-3 bg-red-600/10 text-red-500 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">assignment_ind</span>
                Tentukan Penempatan
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Placement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-surface relative z-10 w-full max-w-md rounded-3xl shadow-2xl p-8 border border-white/10 flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-headline text-2xl font-bold text-on-surface">Penempatan</h3>
              <button onClick={closeModal} className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black">
                {selectedEmp?.nama_lengkap.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">{selectedEmp?.nama_lengkap}</p>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">NIP {selectedEmp?.nip}</p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Pilih Sektor</label>
                <select
                  required
                  value={sektor}
                  onChange={(e) => setSektor(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary appearance-none h-14"
                >
                  <option value="">Pilih Sektor...</option>
                  {[1, 2, 3, 4, 5, 6, 8, 9, 10].map(s => <option key={s} value={s}>Sektor {s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Pilih Regu</label>
                <select
                  required
                  value={regu}
                  onChange={(e) => setRegu(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary appearance-none h-14"
                >
                  <option value="">Pilih Regu...</option>
                  {[1, 2, 3].map(r => <option key={r} value={r}>Regu {r}</option>)}
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={closeModal} className="flex-1 py-4 bg-surface-container-highest text-on-surface-variant rounded-xl font-bold transition-all">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] py-4 bg-red-600 text-white rounded-xl font-bold font-headline shadow-lg shadow-red-500/20 active:scale-95 transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    "Konfirmasi"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
