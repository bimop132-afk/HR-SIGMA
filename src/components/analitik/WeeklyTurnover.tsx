"use client";
import { useEffect, useState } from "react";

interface WeeklyData {
  minggu: string;
  rate: string;
  resign: number;
}

export default function WeeklyTurnover() {
  const [data, setData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/weekly-turnover")
      .then(res => res.json())
      .then(body => {
        if (body.success) setData(body.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Max value to scale height (ensure at least 2% for visual scaling if everything is 0s)
  const maxRate = Math.max(...data.map(d => parseFloat(d.rate)), 2);

  return (
    <div className="lg:col-span-6 glass p-8 rounded-3xl">
      <h3 className="text-xl font-bold font-headline mb-6">Turnover Rate Mingguan</h3>
      <div className="flex items-end h-40 gap-4">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
             <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
          </div>
        ) : (
          data.map((item, idx) => {
            const heightPercent = Math.max((parseFloat(item.rate) / maxRate) * 100, 5); // Minimum 5% height
            // Make the middle elements visually different like original design if desired, or all same
            const isHighest = parseFloat(item.rate) === maxRate && maxRate > 0;
            return (
              <div key={idx} className={`flex-1 ${isHighest ? "bg-primary/40" : "bg-surface-container-highest"} rounded-t-xl relative group transition-all`} style={{ height: `${heightPercent}%` }}>
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded transition-opacity ${isHighest ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                  {item.rate}%
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-label uppercase tracking-widest">
        {data.map((item, idx) => (
          <span key={idx}>{item.minggu}</span>
        ))}
      </div>
    </div>
  );
}
