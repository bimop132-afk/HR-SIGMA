type Employee = {
  initials: string;
  name: string;
  nip: string;
  posisi: string;
  sektor: string;
  regu: string;
  status: "Aktif" | "Non-Aktif";
  avatarColor: string;
  opacity?: string;
  statusBgClass: string;
  statusDotClass: string;
};

export default function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <div className={`glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group ${employee.opacity || ""}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg ${employee.avatarColor}`}>
            {employee.initials}
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg text-on-surface">{employee.name}</h3>
            <p className="text-sm text-on-surface-variant font-medium">NIP {employee.nip}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors active:scale-90">
          <span className="material-symbols-outlined text-outline">more_vert</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-y-3 mb-4">
        <div>
          <p className="text-[10px] text-outline uppercase tracking-wider mb-1">Posisi</p>
          <p className="text-sm font-semibold text-secondary">{employee.posisi}</p>
        </div>
        <div>
          <p className="text-[10px] text-outline uppercase tracking-wider mb-1">Sektor</p>
          <p className="text-sm font-semibold text-on-surface">{employee.sektor}</p>
        </div>
        <div>
          <p className="text-[10px] text-outline uppercase tracking-wider mb-1">Regu</p>
          <p className="text-sm font-semibold text-on-surface">{employee.regu}</p>
        </div>
        <div>
          <p className="text-[10px] text-outline uppercase tracking-wider mb-1">Status</p>
          <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${employee.statusBgClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${employee.statusDotClass}`}></span>
            {employee.status}
          </span>
        </div>
      </div>
    </div>
  );
}
