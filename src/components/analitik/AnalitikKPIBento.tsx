export default function AnalitikKPIBento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      <div className="glass p-6 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <span className="material-symbols-outlined text-5xl text-primary">groups</span>
        </div>
        <p className="text-on-surface-variant text-sm font-label uppercase tracking-wider mb-2">Total Karyawan</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold font-headline">1,284</h3>
          <span className="text-tertiary text-xs font-bold">+4.2%</span>
        </div>
      </div>
      
      <div className="glass p-6 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <span className="material-symbols-outlined text-5xl text-secondary">trending_up</span>
        </div>
        <p className="text-on-surface-variant text-sm font-label uppercase tracking-wider mb-2">Turnover Rate</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold font-headline">2.4%</h3>
          <span className="text-error text-xs font-bold">-0.8%</span>
        </div>
      </div>
      
      <div className="glass p-6 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <span className="material-symbols-outlined text-5xl text-primary-container">person_add</span>
        </div>
        <p className="text-on-surface-variant text-sm font-label uppercase tracking-wider mb-2">Karyawan Baru</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold font-headline">42</h3>
          <span className="text-on-surface-variant text-xs opacity-60">Bulan ini</span>
        </div>
      </div>
      
      <div className="glass p-6 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <span className="material-symbols-outlined text-5xl text-tertiary">sentiment_satisfied</span>
        </div>
        <p className="text-on-surface-variant text-sm font-label uppercase tracking-wider mb-2">Skor Kepuasan</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold font-headline">8.2</h3>
          <span className="text-tertiary text-xs font-bold">Excellent</span>
        </div>
      </div>
    </div>
  );
}
