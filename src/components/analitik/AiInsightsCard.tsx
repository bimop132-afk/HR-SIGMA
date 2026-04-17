"use client";
import { useEffect, useState } from "react";

interface InsightData {
  type: "positive" | "negative" | "neutral";
  icon: string;
  text: string;
}

export default function AiInsightsCard() {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/insights")
      .then(res => res.json())
      .then(body => {
        if (body.success) setInsights(body.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStyle = (type: string) => {
    switch(type) {
      case "positive": return { bg: "bg-primary/5 border-primary/10", text: "text-primary" };
      case "negative": return { bg: "bg-error/5 border-error/10", text: "text-error" };
      default: return { bg: "bg-secondary/5 border-secondary/10", text: "text-secondary" };
    }
  };

  return (
    <div className="lg:col-span-6 glass p-8 rounded-3xl flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold font-headline mb-4">Wawasan AI</h3>
        <div className="space-y-4">
          {loading ? (
            <div className="py-4 flex justify-center">
              <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
            </div>
          ) : insights.map((insight, idx) => {
            const style = getStyle(insight.type);
            return (
              <div key={idx} className={`flex gap-4 p-4 rounded-2xl border ${style.bg}`}>
                <span className={`material-symbols-outlined ${style.text}`}>{insight.icon}</span>
                <p className="text-sm text-on-surface-variant leading-relaxed">{insight.text}</p>
              </div>
            );
          })}
        </div>
      </div>
      <button 
        onClick={() => window.print()}
        className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 duration-200 cursor-pointer"
      >
        Buat Laporan Lengkap <span className="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
  );
}
