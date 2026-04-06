export default function AiInsightsCard() {
  return (
    <div className="lg:col-span-6 glass p-8 rounded-3xl flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold font-headline mb-4">Wawasan AI</h3>
        <div className="space-y-4">
          <div className="flex gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <p className="text-sm text-on-surface-variant leading-relaxed">Tingkat retensi meningkat sebesar <span className="text-primary font-bold">12%</span> setelah implementasi program mentoring baru di bulan Juni.</p>
          </div>
          <div className="flex gap-4 p-4 rounded-2xl bg-secondary/5 border border-secondary/10">
            <span className="material-symbols-outlined text-secondary">warning</span>
            <p className="text-sm text-on-surface-variant leading-relaxed">Turnover di Departemen Teknologi menunjukkan tren naik. Disarankan untuk meninjau kebijakan work-from-home.</p>
          </div>
        </div>
      </div>
      <button className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 duration-200 cursor-pointer">
        Buat Laporan Lengkap <span className="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
  );
}
