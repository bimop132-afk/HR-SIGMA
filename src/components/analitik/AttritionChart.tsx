export default function AttritionChart() {
  const data = [
    { month: "Jan", primary: "40%", secondary: "15%" },
    { month: "Feb", primary: "55%", secondary: "20%" },
    { month: "Mar", primary: "45%", secondary: "30%" },
    { month: "Apr", primary: "70%", secondary: "25%" },
    { month: "Mei", primary: "60%", secondary: "40%" },
    { month: "Jun", primary: "85%", secondary: "10%" },
    { month: "Jul", primary: "40%", secondary: "35%", hiddenMobile: true },
    { month: "Agu", primary: "30%", secondary: "60%", hiddenMobile: true },
  ];

  return (
    <div className="lg:col-span-8 glass p-8 rounded-3xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold font-headline">Rasio Masuk vs Keluar</h3>
          <p className="text-on-surface-variant text-sm">Tren pertumbuhan 12 bulan terakhir</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-2 text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary"></span> Masuk
          </span>
          <span className="flex items-center gap-2 text-xs font-medium px-3 py-1 bg-secondary/10 text-secondary rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary"></span> Keluar
          </span>
        </div>
      </div>
      
      {/* Simulated Bar/Line Chart */}
      <div className="relative h-64 w-full flex items-end justify-between px-2 gap-2">
        {/* Chart Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
          <div className="border-t border-on-surface w-full"></div>
          <div className="border-t border-on-surface w-full"></div>
          <div className="border-t border-on-surface w-full"></div>
          <div className="border-t border-on-surface w-full"></div>
        </div>
        
        {/* Bars */}
        {data.map((item, idx) => (
          <div key={idx} className={`flex-1 flex flex-col justify-end items-center gap-1 group ${item.hiddenMobile ? "hidden md:flex" : ""}`}>
            <div className="w-full flex gap-1 items-end h-full">
              <div 
                className="flex-1 bg-primary rounded-t-sm transition-all group-hover:opacity-80" 
                style={{ height: item.primary }}
              ></div>
              <div 
                className="flex-1 bg-secondary rounded-t-sm transition-all group-hover:opacity-80" 
                style={{ height: item.secondary }}
              ></div>
            </div>
            <span className="text-[10px] text-on-surface-variant font-label">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
