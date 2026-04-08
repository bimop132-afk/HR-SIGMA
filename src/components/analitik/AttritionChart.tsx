"use client";
import { useEffect, useState } from "react";

interface TurnoverItem {
  month: string;
  masuk: number;
  keluar: number;
  hiddenMobile?: boolean; // We can add this dynamically for older months
}

export default function AttritionChart() {
  const [data, setData] = useState<TurnoverItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/turnover")
      .then(r => r.json())
      .then(body => {
        if (body.success && body.data) {
          // Process data to hide the first 2 of 6 on mobile if needed
          const processed = body.data.map((d: any, idx: number) => ({
            ...d,
            hiddenMobile: idx < 2 // hide oldest 2 months on mobile
          }));
          setData(processed);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Calculate max for normalization
  const maxVal = Math.max(...data.map(d => Math.max(d.masuk, d.keluar)), 1);

  return (
    <div className="lg:col-span-8 glass p-8 rounded-3xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold font-headline">Rasio Masuk vs Keluar</h3>
          <p className="text-on-surface-variant text-sm">Tren pertumbuhan 6 bulan terakhir</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-2 text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary"></span> Masuk
          </span>
          <span className="flex items-center gap-2 text-xs font-medium px-3 py-1 bg-secondary/10 text-secondary rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary"></span> Keluar
          </span>
        </div>
      </div>
      
      <div className="relative h-64 w-full flex items-end justify-between px-2 gap-2">
        {/* Chart Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
          <div className="border-t border-on-surface w-full"></div>
          <div className="border-t border-on-surface w-full"></div>
          <div className="border-t border-on-surface w-full"></div>
          <div className="border-t border-on-surface w-full"></div>
        </div>
        
        {/* Bars */}
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
          </div>
        ) : (
          data.map((item, idx) => (
            <div key={idx} className={`flex-1 flex flex-col justify-end items-center gap-1 group relative ${item.hiddenMobile ? "hidden md:flex" : ""}`}>
              {/* Tooltip on hover */}
              <div className="absolute -top-10 bg-surface-container text-on-surface px-2 py-1 rounded shadow-lg text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                M: {item.masuk} | K: {item.keluar}
              </div>
              
              <div className="w-full flex gap-1 items-end h-full">
                <div 
                  className="flex-1 bg-primary rounded-t-sm transition-all group-hover:opacity-80" 
                  style={{ height: `${Math.max((item.masuk / maxVal) * 100, 5)}%` }}
                ></div>
                <div 
                  className="flex-1 bg-secondary rounded-t-sm transition-all group-hover:opacity-80" 
                  style={{ height: `${Math.max((item.keluar / maxVal) * 100, 5)}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-on-surface-variant font-label">{item.month}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
