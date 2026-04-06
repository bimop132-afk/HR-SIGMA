export default function OffboardingStatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between aspect-video md:aspect-auto">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-primary/10 rounded-xl">
            <span className="material-symbols-outlined text-primary">logout</span>
          </div>
          <span className="text-tertiary text-xs font-bold font-label">+12% Bulan Ini</span>
        </div>
        <div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Total Resign</p>
          <h3 className="text-4xl font-headline font-extrabold text-on-surface">42</h3>
        </div>
      </div>
      
      <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-error/10 rounded-xl">
            <span className="material-symbols-outlined text-error">warning</span>
          </div>
        </div>
        <div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">PHK / Darurat</p>
          <h3 className="text-4xl font-headline font-extrabold text-on-surface">08</h3>
        </div>
      </div>
      
      <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-secondary/10 rounded-xl">
            <span className="material-symbols-outlined text-secondary">pending_actions</span>
          </div>
        </div>
        <div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Menunggu Clearance</p>
          <h3 className="text-4xl font-headline font-extrabold text-on-surface">15</h3>
        </div>
      </div>
      
      <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-tertiary/10 rounded-xl">
            <span className="material-symbols-outlined text-tertiary">task_alt</span>
          </div>
        </div>
        <div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Selesai (Q4)</p>
          <h3 className="text-4xl font-headline font-extrabold text-on-surface">128</h3>
        </div>
      </div>
    </div>
  );
}
