"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface Installment {
  id: number;
  jumlah: number;
  keterangan: string;
  tanggal: string;
}

import AnimatedModal from "@/components/ui/AnimatedModal";

export default function DepositInstallmentCard({ 
  employeeId, 
  installmentsInitial,
  targetAmount = 500000
}: { 
  employeeId: number, 
  installmentsInitial: Installment[],
  targetAmount?: number
}) {
  const [installments, setInstallments] = useState<Installment[]>(installmentsInitial);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jumlah, setJumlah] = useState("166667");
  const [keterangan, setKeterangan] = useState("Potong Gaji Bulan ");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);

  const totalTerkumpul = installments.reduce((sum, i) => sum + i.jumlah, 0);
  const progressPercent = Math.min((totalTerkumpul / targetAmount) * 100, 100);
  const terutang = Math.max(targetAmount - totalTerkumpul, 0);

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/deposit_installments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          jumlah: parseInt(jumlah),
          keterangan,
          tanggal
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Cicilan berhasil ditambahkan");
        setInstallments([...installments, data.data]);
        setIsOpen(false);
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      toast.error(e.message || "Gagal menambahkan cicilan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glass-card rounded-3xl p-6 border border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">savings</span>
            Uang Jaminan Seragam
          </h3>
          <button 
            onClick={() => setIsOpen(true)}
            className="text-[10px] font-bold bg-primary text-on-primary px-3 py-1.5 rounded-full hover:scale-105 transition-transform cursor-pointer"
          >
            + INPUT CICILAN
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-on-surface-variant font-medium">Terkumpul: <b>{formatter.format(totalTerkumpul)}</b></span>
            <span className="text-outline">Target: {formatter.format(targetAmount)}</span>
          </div>
          <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          {terutang > 0 && <p className="text-[10px] text-error mt-2">Sisa terutang: {formatter.format(terutang)}</p>}
          {terutang === 0 && <p className="text-[10px] text-tertiary mt-2">Uang Jaminan sudah LUNAS!</p>}
        </div>

        {/* History List */}
        <div className="space-y-3">
          {installments.map((inst) => (
            <div key={inst.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
              <div>
                <p className="text-sm font-bold text-on-surface">{inst.keterangan || "Cicilan Jaminan"}</p>
                <p className="text-[10px] text-on-surface-variant">
                  {format(new Date(inst.tanggal), "dd MMM yyyy", { locale: localeId })}
                </p>
              </div>
              <p className="font-bold text-primary">{formatter.format(inst.jumlah)}</p>
            </div>
          ))}
          {installments.length === 0 && (
            <p className="text-center text-xs text-on-surface-variant py-2">Belum ada riwayat cicilan.</p>
          )}
        </div>
      </div>

      <AnimatedModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="bg-surface relative z-10 w-full rounded-3xl shadow-2xl p-6 border border-white/10">
            <h3 className="font-headline font-bold text-xl mb-4 text-on-surface">Input Potong Gaji Jaminan</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-on-surface-variant font-medium">Tanggal Pemotongan</label>
                <input 
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-3 text-sm text-on-surface mt-1 focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-medium">Nominal (Rp)</label>
                <input 
                  type="number"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-3 text-sm text-on-surface mt-1 focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-medium">Keterangan</label>
                <input 
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-3 text-sm text-on-surface mt-1 focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3 bg-surface-container-highest rounded-xl text-sm font-bold text-on-surface-variant cursor-pointer hover:bg-opacity-80 transition-all">Batal</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 liquid-light rounded-xl text-sm font-bold text-on-primary-fixed disabled:opacity-50 cursor-pointer hover:scale-[1.02] transition-transform active:scale-95">
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
      </AnimatedModal>
    </>
  );
}
