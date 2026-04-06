export type RecentActivity = {
  id: number;
  type: string;
  name: string;
  desc: string;
  timeAgo: string;
};

export default function RecentActivityFeed({ activities }: { activities?: RecentActivity[] }) {
  const data = activities || [];

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="font-headline text-xl font-bold">Aktivitas Terbaru</h2>
        <button className="text-primary text-xs font-semibold">Lihat Semua</button>
      </div>
      <div className="space-y-3">
        {data.length === 0 && (
          <div className="glass p-8 rounded-[2rem] text-center text-sm text-on-surface-variant font-medium border border-white/5">
            Belum ada aktivitas tercatat hari ini.
          </div>
        )}
        
        {data.map((item) => {
          let icon = "info";
          let bgClass = "bg-surface-variant text-on-surface-variant";
          
          if (item.type === "ONBOARDING") {
            icon = "person_add";
            bgClass = "liquid-light text-on-primary";
          } else if (item.type === "OFFBOARDING") {
            icon = "person_remove";
            bgClass = "bg-secondary-container/30 text-secondary";
          } else if (item.type === "PENALTY") {
            icon = "gavel";
            bgClass = "bg-error-container/30 text-error";
          } else if (item.type === "DOCUMENT_UPLOAD") {
            icon = "description";
            bgClass = "bg-tertiary-container/30 text-tertiary";
          }

          return (
            <div key={item.id} className="glass p-4 rounded-2xl flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgClass}`}>
                <span className="material-symbols-outlined">{icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  <span className="font-bold text-on-surface mr-1">{item.name}</span>
                  {item.desc}
                </p>
                <p className="text-[10px] text-on-surface-variant capitalize">{item.timeAgo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
