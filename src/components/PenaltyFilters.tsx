export default function PenaltyFilters() {
  return (
    <section className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
      <button className="glass-card flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border border-white/10 text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap cursor-pointer">
        Semua Status
        <span className="material-symbols-outlined text-[18px]">expand_more</span>
      </button>
      <button className="glass-card flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border border-white/10 text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap cursor-pointer">
        Semua Tipe
        <span className="material-symbols-outlined text-[18px]">expand_more</span>
      </button>
      <button className="bg-surface-container-highest/50 flex items-center justify-center p-2.5 rounded-full text-secondary cursor-pointer hover:bg-surface-container-highest transition-colors">
        <span className="material-symbols-outlined">tune</span>
      </button>
    </section>
  );
}
