export default function TurnoverChartArea() {
  return (
    <section className="glass p-6 rounded-[2.5rem] space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-headline text-lg font-bold">Laju Perputaran</h2>
        <span className="material-symbols-outlined text-on-surface-variant">more_horiz</span>
      </div>
      <div className="h-48 w-full flex items-end justify-between gap-2 px-2">
        {/* Mockup Line Graph Bars */}
        <div className="flex flex-col items-center gap-2 group w-full">
          <div className="w-full bg-surface-container-highest rounded-full h-24 relative overflow-hidden">
            <div className="absolute bottom-0 w-full bg-red-500/20 h-12"></div>
          </div>
          <span className="text-[10px] font-medium text-on-surface-variant">Jan</span>
        </div>
        <div className="flex flex-col items-center gap-2 group w-full">
          <div className="w-full bg-surface-container-highest rounded-full h-32 relative overflow-hidden">
            <div className="absolute bottom-0 w-full bg-red-500/20 h-16"></div>
          </div>
          <span className="text-[10px] font-medium text-on-surface-variant">Feb</span>
        </div>
        <div className="flex flex-col items-center gap-2 group w-full">
          <div className="w-full bg-surface-container-highest rounded-full h-20 relative overflow-hidden">
            <div className="absolute bottom-0 w-full bg-red-500/20 h-10"></div>
          </div>
          <span className="text-[10px] font-medium text-on-surface-variant">Mar</span>
        </div>
        <div className="flex flex-col items-center gap-2 group w-full">
          <div className="w-full bg-surface-container-highest rounded-full h-40 relative overflow-hidden">
            <div className="absolute bottom-0 w-full liquid-light h-28"></div>
          </div>
          <span className="text-[10px] font-bold text-primary">Apr</span>
        </div>
        <div className="flex flex-col items-center gap-2 group w-full">
          <div className="w-full bg-surface-container-highest rounded-full h-28 relative overflow-hidden">
            <div className="absolute bottom-0 w-full bg-red-500/20 h-14"></div>
          </div>
          <span className="text-[10px] font-medium text-on-surface-variant">Mei</span>
        </div>
        <div className="flex flex-col items-center gap-2 group w-full">
          <div className="w-full bg-surface-container-highest rounded-full h-36 relative overflow-hidden">
            <div className="absolute bottom-0 w-full bg-red-500/20 h-20"></div>
          </div>
          <span className="text-[10px] font-medium text-on-surface-variant">Jun</span>
        </div>
      </div>
    </section>
  );
}
