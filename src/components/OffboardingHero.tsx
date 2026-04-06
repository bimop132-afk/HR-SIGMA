import ResignModal from "./ResignModal";

export default function OffboardingHero() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
      <div className="space-y-2">
        <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Talent Management</span>
        <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">Manajemen Offboarding</h2>
        <p className="text-on-surface-variant max-w-xl font-body leading-relaxed">
          Kelola proses transisi karyawan dengan presisi. Pastikan seluruh checklist clearance terpenuhi untuk menjaga integritas aset perusahaan.
        </p>
      </div>
      <ResignModal />
    </div>
  );
}
