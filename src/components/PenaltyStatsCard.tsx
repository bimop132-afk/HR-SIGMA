export default function PenaltyStatsCard() {
  return (
    <section className="liquid-light rounded-3xl p-6 shadow-2xl shadow-red-500/20 relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      <div className="flex justify-between items-start mb-4">
        <span className="material-symbols-outlined text-on-primary-container p-2 bg-white/20 rounded-xl">account_balance_wallet</span>
        <span className="text-xs font-bold uppercase tracking-widest text-on-primary-container/70">Maret 2026</span>
      </div>
      <div className="space-y-1 relative z-10">
        <p className="text-on-primary-container font-medium text-sm">Total Denda Periode Ini</p>
        <p className="font-headline font-bold text-3xl text-on-primary-container">Rp 200.000</p>
      </div>
    </section>
  );
}
