"use client";
import { useEffect, useState } from "react";

export default function AnalitikKPIBento() {
  const [data, setData] = useState({
    totalAktif: 0,
    masukBulanIni: 0,
    resignBulanIni: 0,
    kontrakHampirHabis: 0,
    percentChange: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/kpi")
      .then(res => res.json())
      .then(body => {
        if (body.success) setData(body.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const turnoverRate = data.totalAktif > 0 ? ((data.resignBulanIni / data.totalAktif) * 100).toFixed(1) : "0.0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      <div className="glass p-6 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <span className="material-symbols-outlined text-5xl text-primary">groups</span>
        </div>
        <p className="text-on-surface-variant text-sm font-label uppercase tracking-wider mb-2">Total Karyawan</p>
        <div className="flex items-baseline gap-2">
          {loading ? (
            <h3 className="text-3xl font-bold font-headline animate-pulse bg-surface-container h-9 w-20 rounded"></h3>
          ) : (
            <>
              <h3 className="text-3xl font-bold font-headline">{data.totalAktif}</h3>
              <span className="text-tertiary text-xs font-bold">Aktif</span>
            </>
          )}
        </div>
      </div>
      
      <div className="glass p-6 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <span className="material-symbols-outlined text-5xl text-secondary">trending_up</span>
        </div>
        <p className="text-on-surface-variant text-sm font-label uppercase tracking-wider mb-2">Turnover Rate</p>
        <div className="flex items-baseline gap-2">
          {loading ? (
            <h3 className="text-3xl font-bold font-headline animate-pulse bg-surface-container h-9 w-20 rounded"></h3>
          ) : (
            <>
              <h3 className="text-3xl font-bold font-headline">{turnoverRate}%</h3>
              <span className="text-error text-xs font-bold">{data.resignBulanIni} Resign</span>
            </>
          )}
        </div>
      </div>
      
      <div className="glass p-6 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <span className="material-symbols-outlined text-5xl text-primary-container">person_add</span>
        </div>
        <p className="text-on-surface-variant text-sm font-label uppercase tracking-wider mb-2">Karyawan Baru</p>
        <div className="flex items-baseline gap-2">
          {loading ? (
            <h3 className="text-3xl font-bold font-headline animate-pulse bg-surface-container h-9 w-12 rounded"></h3>
          ) : (
            <>
              <h3 className="text-3xl font-bold font-headline">{data.masukBulanIni}</h3>
              <span className="text-on-surface-variant text-xs opacity-60">Bulan ini</span>
            </>
          )}
        </div>
      </div>
      
      <div className="glass p-6 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <span className="material-symbols-outlined text-5xl text-tertiary">assignment_late</span>
        </div>
        <p className="text-on-surface-variant text-sm font-label uppercase tracking-wider mb-2">Kontrak ±30 Hari</p>
        <div className="flex items-baseline gap-2">
          {loading ? (
            <h3 className="text-3xl font-bold font-headline animate-pulse bg-surface-container h-9 w-12 rounded"></h3>
          ) : (
            <>
              <h3 className="text-3xl font-bold font-headline">{data.kontrakHampirHabis}</h3>
              <span className="text-tertiary text-xs font-bold">Akan Habis</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
