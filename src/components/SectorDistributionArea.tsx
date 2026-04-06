export default function SectorDistributionArea() {
  return (
    <section className="glass p-6 rounded-[2.5rem] space-y-6">
      <h2 className="font-headline text-lg font-bold text-center">Distribusi Sektor</h2>
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
        {/* Visualizing Donut segments with simple SVG */}
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="96" cy="96" fill="transparent" r="80" stroke="#18181b" strokeWidth="24"></circle>
          <circle cx="96" cy="96" fill="transparent" r="80" stroke="#dc2626" strokeDasharray="100 402" strokeDashoffset="0" strokeWidth="24"></circle>
          <circle cx="96" cy="96" fill="transparent" r="80" stroke="#ffffff" strokeDasharray="80 402" strokeDashoffset="-110" strokeWidth="24"></circle>
          <circle cx="96" cy="96" fill="transparent" r="80" stroke="#a1a1aa" strokeDasharray="60 402" strokeDashoffset="-200" strokeWidth="24"></circle>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-headline text-3xl font-bold">10</span>
          <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Sektor</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-[10px] font-medium">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> S1</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-secondary"></div> S2</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-tertiary"></div> S3</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-surface-variant"></div> S4</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-outline"></div> S5</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-950"></div> S6</div>
      </div>
    </section>
  );
}
