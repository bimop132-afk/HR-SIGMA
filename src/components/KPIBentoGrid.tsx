export default function KPIBentoGrid({ stats }: { stats: { totalAktif: number, masukBulanIni: number, resignBulanIni: number, kontrakHabis: number } }) {
  return (
    <section className="grid grid-cols-2 gap-4">
      {/* Total Aktif */}
      <div className="glass p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between h-36">
        <div className="flex justify-between items-start">
          <span className="font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Total Aktif</span>
          <span className="material-symbols-outlined text-tertiary-fixed">group</span>
        </div>
        <div className="mt-auto">
          <div className="font-headline text-3xl font-bold">{stats.totalAktif}</div>
          <div className="flex items-center text-[10px] text-tertiary font-medium">
            <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
            Karyawan
          </div>
        </div>
      </div>
      {/* Masuk Bulan Ini */}
      <div className="glass p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between h-36">
        <div className="flex justify-between items-start">
          <span className="font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Masuk</span>
          <span className="material-symbols-outlined text-secondary">person_add</span>
        </div>
        <div className="mt-auto">
          <div className="font-headline text-3xl font-bold">{stats.masukBulanIni}</div>
          <div className="font-label text-[10px] text-on-surface-variant">Bulan ini</div>
        </div>
      </div>
      {/* Resign Bulan Ini */}
      <div className="glass p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between h-36">
        <div className="flex justify-between items-start">
          <span className="font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Resign</span>
          <span className="material-symbols-outlined text-error">person_remove</span>
        </div>
        <div className="mt-auto">
          <div className="font-headline text-3xl font-bold">{stats.resignBulanIni}</div>
          <div className="font-label text-[10px] text-on-surface-variant">Bulan ini</div>
        </div>
      </div>
      {/* Kontrak Habis */}
      <div className="glass p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between h-36 border border-primary-container/20">
        <div className="flex justify-between items-start">
          <span className="font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Kontrak</span>
          <span className="material-symbols-outlined text-primary">timer</span>
        </div>
        <div className="mt-auto">
          <div className="font-headline text-3xl font-bold">{stats.kontrakHabis}</div>
          <div className="font-label text-[10px] text-on-surface-variant">Hampir habis (&lt; 30 hr)</div>
        </div>
      </div>
    </section>
  );
}
