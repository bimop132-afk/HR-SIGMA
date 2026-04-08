"use client";
import { useEffect, useState } from "react";

interface ResignReason {
  tipe: string;
  count: number;
  percentage: number;
}

const COLORS = ["#cabeff", "#947dff", "#5de6ff", "#484555"];

export default function ResignReasonsPie() {
  const [data, setData] = useState<ResignReason[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/resign-reasons")
      .then(r => r.json())
      .then(body => {
        if (body.success && body.data.length > 0) {
          setData(body.data);
        } else {
          // fallback if empty
          setData([
            { tipe: "NORMAL", count: 1, percentage: 100 }
          ]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const total = 251.2;
  let currentOffset = 0;

  return (
    <div className="lg:col-span-4 glass p-8 rounded-3xl flex flex-col">
      <h3 className="text-xl font-bold font-headline mb-2">Tipe Resign</h3>
      <p className="text-on-surface-variant text-sm mb-8">Distribusi alasan pengunduran diri</p>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>
      ) : (
        <>
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
              {data.map((item, idx) => {
                const dash = (item.percentage / 100) * total;
                const offset = currentOffset;
                currentOffset += dash;
                return (
                  <circle 
                    key={item.tipe}
                    cx="50" cy="50" fill="transparent" r="40" 
                    stroke={COLORS[idx % COLORS.length]} 
                    strokeDasharray={`${dash} ${total}`} 
                    strokeDashoffset={-offset} 
                    strokeWidth="20"
                    className="transition-all duration-1000"
                  ></circle>
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-bold">100%</span>
              <span className="text-[10px] uppercase text-on-surface-variant">Total</span>
            </div>
          </div>
          
          <div className="space-y-3 mt-auto">
            {data.map((item, idx) => (
              <div key={item.tipe} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="text-sm font-label">{item.tipe}</span>
                </div>
                <span className="text-sm font-bold">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
