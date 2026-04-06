export default function WeeklyTurnover() {
  return (
    <div className="lg:col-span-6 glass p-8 rounded-3xl">
      <h3 className="text-xl font-bold font-headline mb-6">Turnover Rate Mingguan</h3>
      <div className="flex items-end h-40 gap-4">
        <div className="flex-1 bg-surface-container-highest rounded-t-xl h-[20%] relative group">
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">0.8%</div>
        </div>
        <div className="flex-1 bg-surface-container-highest rounded-t-xl h-[45%] relative group">
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">1.2%</div>
        </div>
        <div className="flex-1 bg-primary/40 rounded-t-xl h-[80%] relative group">
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded opacity-100 transition-opacity">2.4%</div>
        </div>
        <div className="flex-1 bg-surface-container-highest rounded-t-xl h-[35%] relative group">
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">0.9%</div>
        </div>
      </div>
      <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-label uppercase tracking-widest">
        <span>Minggu 1</span>
        <span>Minggu 2</span>
        <span>Minggu 3</span>
        <span>Minggu 4</span>
      </div>
    </div>
  );
}
