"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ClearanceItem {
  id: number;
  nama_item: string;
  deskripsi: string;
  status: string; // 'PENDING' | 'VERIFIED' | 'HILANG' | 'KOTOR'
}

interface Props {
  resignationId?: number;
  name: string;
  status: string;
  items?: ClearanceItem[];
}

export default function ClearanceChecklistCard({ resignationId, name, status, items: initialItems = [] }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<ClearanceItem[]>(initialItems);
  const [updating, setUpdating] = useState<number | null>(null);

  const isProcess = status !== "SELESAI";

  const handleUpdateStatus = async (itemId: number, newStatus: string) => {
    if (!resignationId) return;
    setUpdating(itemId);
    try {
      const res = await fetch(`/api/resignations/${resignationId}/clearance/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.map(item => item.id === itemId ? { ...item, status: newStatus } : item));
        router.refresh();
      } else {
        alert("Gagal mengupdate item: " + data.error);
      }
    } catch (error) {
      alert("Terjadi kesalahan.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-headline font-bold text-on-surface">
        Detail Clearance
      </h3>
      <div className="glass rounded-3xl border border-white/5 p-8 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-[40px] transition-all group-hover:bg-primary/30"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-primary/40 bg-surface-variant flex items-center justify-center">
              <span className="text-on-surface-variant font-bold text-lg">{name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-on-surface">
                {name}
              </h4>
              <p className="text-xs text-primary font-bold tracking-widest uppercase">
                {isProcess ? "Dalam Proses" : "Selesai"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {items.length === 0 && (
              <p className="text-sm text-outline italic text-center py-4">Data clearance tidak tersedia</p>
            )}

            {items.map((item) => {
              const isVerified = item.status === "VERIFIED";
              const isPenalty = item.status === "HILANG" || item.status === "KOTOR";
              const isPending = item.status === "PENDING";
              
              return (
                <div key={item.id} className="flex items-start gap-4 flex-col sm:flex-row sm:items-center p-3 -mx-3 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-4 flex-1 w-full">
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                      isVerified ? "border-primary bg-primary/20" : 
                      isPenalty ? "border-error bg-error/20" : "border-outline-variant"
                    }`}>
                      {isVerified && <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'wght' 700" }}>check</span>}
                      {isPenalty && <span className="material-symbols-outlined text-sm text-error" style={{ fontVariationSettings: "'wght' 700" }}>warning</span>}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-on-surface">
                        {item.nama_item}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {item.deskripsi}
                      </p>
                      {/* Interactive Buttons for Pending State */}
                      {isPending && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <button 
                            disabled={updating === item.id}
                            onClick={() => handleUpdateStatus(item.id, "VERIFIED")}
                            className="bg-primary/20 hover:bg-primary/30 text-primary text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors border border-primary/30 disabled:opacity-50"
                          >
                            VERIFIKASI
                          </button>
                          {(item.nama_item !== "Serah Terima Tugas") && (
                            <button 
                              disabled={updating === item.id}
                              onClick={() => handleUpdateStatus(item.id, "HILANG")}
                              className="bg-error/20 hover:bg-error/30 text-error text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors border border-error/30 disabled:opacity-50"
                            >
                              HILANG (DENDA)
                            </button>
                          )}
                          {(item.nama_item === "Seragam") && (
                            <button 
                              disabled={updating === item.id}
                              onClick={() => handleUpdateStatus(item.id, "KOTOR")}
                              className="bg-error/20 hover:bg-error/30 text-error text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors border border-error/30 disabled:opacity-50"
                            >
                              KOTOR (DENDA)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="sm:ml-auto">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 flex items-center justify-center rounded-full ${
                      isVerified ? "bg-tertiary-fixed/20 text-tertiary-fixed" : 
                      isPenalty ? "bg-error/20 text-error" : 
                      "bg-surface-variant text-on-surface-variant"
                    }`}>
                      {updating === item.id ? "Memproses..." : item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-6 border-t border-white/5">
            <button className="w-full py-4 rounded-2xl bg-surface-container-highest border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-sm">print</span>
              Cetak Form Clearance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
