import AppLayout from "@/components/AppLayout";
import AnalitikKPIBento from "@/components/analitik/AnalitikKPIBento";
import AttritionChart from "@/components/analitik/AttritionChart";
import ResignReasonsPie from "@/components/analitik/ResignReasonsPie";
import WeeklyTurnover from "@/components/analitik/WeeklyTurnover";
import AiInsightsCard from "@/components/analitik/AiInsightsCard";

export default function AnalitikPage() {
  return (
    <AppLayout showBottomNav={false}>
      <div className="p-6 md:p-10 mb-20">
        
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-on-surface font-headline tracking-tight mb-2">Analitik SDM</h2>
          <p className="text-on-surface-variant font-body mb-8">Wawasan mendalam tentang retensi dan pertumbuhan tenaga kerja Anda.</p>
        </div>
        
        <AnalitikKPIBento />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <AttritionChart />
          <ResignReasonsPie />
          <WeeklyTurnover />
          <AiInsightsCard />
        </div>

      </div>

      {/* FAB - Adjusted position since no bottom navigation on mobile for this page */}
      <button className="fixed bottom-10 right-6 md:hidden liquid-light text-on-primary-fixed w-14 h-14 rounded-2xl shadow-2xl shadow-red-500/50 flex items-center justify-center active:scale-90 transition-transform duration-150 z-50 cursor-pointer">
        <span className="material-symbols-outlined font-bold text-3xl">download</span>
      </button>
    </AppLayout>
  );
}
