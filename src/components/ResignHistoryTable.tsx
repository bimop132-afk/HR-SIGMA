"use client";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import Link from "next/link";

type ResignationInfo = {
  id: number;
  employeeName: string;
  employeeNip: string;
  date: string;
  type: string;
  statusClearance: string;
  avatarColor: string;
  initials: string;
};

export default function ResignHistoryTable({ data }: { data: ResignationInfo[] }) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <div className="xl:col-span-2 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-headline font-bold text-on-surface">Riwayat Resign</h3>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button className="p-2 rounded-lg bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </div>
      
      <div className="glass rounded-3xl overflow-x-auto border border-white/5 pb-24">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-white/5">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Karyawan</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Tgl Resign</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Tipe</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-on-surface-variant">Belum ada riwayat resign.</td>
              </tr>
            )}
            {data.map((item) => {
              let typeClass = "bg-surface-variant text-on-surface-variant";
              if (item.type === "PHK") typeClass = "bg-error-container/20 text-error";
              else if (item.type === "MENDADAK") typeClass = "bg-primary/10 text-primary";
              else if (item.type === "TANPA_BERITA") typeClass = "bg-yellow-500/10 text-yellow-400";

              const isCompleted = item.statusClearance === "SELESAI";
              const dotClass = isCompleted ? "bg-surface-variant" : "bg-tertiary animate-pulse";
              const textClass = isCompleted ? "text-on-surface-variant" : "text-tertiary";
              const statusText = isCompleted ? "Selesai" : "Proses";

              return (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group relative">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${item.avatarColor}`}>
                        {item.initials}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">{item.employeeName}</p>
                        <p className="text-xs text-on-surface-variant font-medium">NIP: {item.employeeNip}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">
                    {format(new Date(item.date), "dd MMM yyyy", { locale: id })}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeClass}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${dotClass}`}></div>
                      <span className={`text-xs font-bold ${textClass}`}>{statusText}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right relative">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                      className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-2"
                    >
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                    {openMenuId === item.id && (
                      <div className="absolute right-8 top-10 z-50 bg-surface-container-highest backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/80 py-2 min-w-[200px] flex flex-col text-left animate-pop-in">
                        <Link href={`/resign/${item.id}`} className="px-5 py-3 text-sm font-medium transition-colors hover:bg-white/5 text-on-surface flex items-center gap-3">
                          <span className="material-symbols-outlined text-[18px]">visibility</span> Lihat Detail
                        </Link>
                        <button onClick={() => window.print()} className="px-5 py-3 text-sm font-medium transition-colors hover:bg-white/5 text-on-surface flex items-center gap-3 text-left">
                          <span className="material-symbols-outlined text-[18px]">print</span> Cetak Dokumen
                        </button>
                        <div className="h-px w-full bg-white/10 my-1"></div>
                        <button className="px-5 py-3 text-sm font-medium transition-colors hover:bg-error/10 text-error flex items-center gap-3 text-left">
                          <span className="material-symbols-outlined text-[18px]">delete</span> Hapus Data
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Click outside to close handler placeholder */}
        {openMenuId !== null && (
          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)}></div>
        )}
      </div>
    </div>
  );
}
