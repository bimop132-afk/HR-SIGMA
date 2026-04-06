export type Penalty = {
  id: number;
  name: string;
  reason: string;
  amount: number;
  date: string;
  isLunas: boolean;
};

export default function PenaltyList({ data }: { data: Penalty[] }) {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="font-headline font-bold text-lg text-on-background">Catatan Pinalti</h3>
        <span className="text-xs text-on-surface-variant font-medium">{data.length} Records</span>
      </div>
      
      {data.length === 0 && (
         <div className="text-center py-6 text-sm text-on-surface-variant">Belum ada catatan denda.</div>
      )}
      {data.map((item) => {
        let icon = "gavel";
        let iconColor = "text-error";
        let iconBg = "bg-error-container/30";
        let amountColor = "text-error";

        if (item.isLunas) {
          icon = "check_circle";
          iconColor = "text-tertiary";
          iconBg = "bg-tertiary-container/20";
          amountColor = "text-tertiary";
        } else if (item.reason.toLowerCase().includes("resign")) {
          icon = "exit_to_app";
          iconColor = "text-secondary";
          iconBg = "bg-secondary-container/20";
        } else if (item.reason.toLowerCase().includes("id card") || item.reason.toLowerCase().includes("apd") || item.reason.toLowerCase().includes("seragam")) {
          icon = "badge";
          iconColor = "text-primary";
          iconBg = "bg-primary-container/20";
        }

        const formattedAmount = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0
        }).format(item.amount);

        return (
          <div key={item.id} className="glass-card rounded-2xl p-4 flex items-center gap-4 border border-white/5 hover:bg-white/10 transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
              <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-on-surface">{item.name}</h4>
              <p className="text-xs text-on-surface-variant">{item.reason}</p>
            </div>
            <div className="text-right">
              <p className={`font-bold ${amountColor}`}>{formattedAmount}</p>
              <p className="text-[10px] tracking-tighter text-on-surface-variant/60 font-medium whitespace-nowrap">{item.date}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
