export default function ResignReasonsPie() {
  return (
    <div className="lg:col-span-4 glass p-8 rounded-3xl">
      <h3 className="text-xl font-bold font-headline mb-2">Alasan Resign</h3>
      <p className="text-on-surface-variant text-sm mb-8">Distribusi alasan pengunduran diri</p>
      
      <div className="relative w-48 h-48 mx-auto mb-8">
        <svg className="transform -rotate-90" viewBox="0 0 100 100">
          {/* Career Growth (55%) */}
          <circle cx="50" cy="50" fill="transparent" r="40" stroke="#cabeff" strokeDasharray="140 251.2" strokeWidth="20"></circle>
          {/* Compensation (24%) */}
          <circle cx="50" cy="50" fill="transparent" r="40" stroke="#947dff" strokeDasharray="60 251.2" strokeDashoffset="-140" strokeWidth="20"></circle>
          {/* Work-Life Balance (12%) */}
          <circle cx="50" cy="50" fill="transparent" r="40" stroke="#5de6ff" strokeDasharray="30 251.2" strokeDashoffset="-200" strokeWidth="20"></circle>
          {/* Others (9%) */}
          <circle cx="50" cy="50" fill="transparent" r="40" stroke="#484555" strokeDasharray="21.2 251.2" strokeDashoffset="-230" strokeWidth="20"></circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold">100%</span>
          <span className="text-[10px] uppercase text-on-surface-variant">Total</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-sm font-label">Pertumbuhan Karir</span>
          </div>
          <span className="text-sm font-bold">55%</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-container"></div>
            <span className="text-sm font-label">Kompensasi</span>
          </div>
          <span className="text-sm font-bold">24%</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
            <span className="text-sm font-label">Work-Life Balance</span>
          </div>
          <span className="text-sm font-bold">12%</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
            <span className="text-sm font-label">Lainnya</span>
          </div>
          <span className="text-sm font-bold">9%</span>
        </div>
      </div>
    </div>
  );
}
