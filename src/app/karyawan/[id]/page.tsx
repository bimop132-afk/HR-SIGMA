import { supabaseAdmin as supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import WarningLetterModal from "@/components/WarningLetterModal";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";

export const dynamic = "force-dynamic";

function getInitials(name: string) {
  if (!name) return "??";
  return name.trim().split(/\s+/).map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

export default async function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employeeId = parseInt(id);
  if (isNaN(employeeId)) notFound();

  // Fetch employee and related data in parallel for better performance and control
  const [
    { data: employee, error: emError },
    { data: contractsList, error: coError },
    { data: penaltiesList, error: peError },
    { data: documentsList, error: doError },
    { data: spList, error: spError }
  ] = await Promise.all([
    supabase.from("employees").select("*").eq("id", employeeId).single(),
    supabase.from("contracts").select("*").eq("employee_id", employeeId).order("tanggal_mulai", { ascending: false }),
    supabase.from("penalties").select("*").eq("employee_id", employeeId).order("tanggal_denda", { ascending: false }),
    supabase.from("documents").select("*").eq("employee_id", employeeId).order("upload_date", { ascending: false }),
    supabase.from("warning_letters").select("*").eq("employee_id", employeeId).order("tanggal_terbit", { ascending: false })
  ]);

  if (emError || !employee) notFound();

  const initials = getInitials(employee.nama_lengkap);
  const statusColor = employee.status === "AKTIF" ? "text-tertiary bg-tertiary-container/20" : "text-outline bg-surface-variant";

  const totalPenalties = (penaltiesList || []).reduce((acc, curr) => acc + (curr.status === "BELUM_BAYAR" ? curr.jumlah : 0), 0);
  const formattedTotalPenalties = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(totalPenalties);

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-background pb-20">
        {/* Header / Top Bar */}
        <div className="sticky top-0 z-30 glass border-b border-white/5 px-4 py-4 flex items-center gap-4">
          <Link href="/karyawan" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 active:scale-90 transition-all text-on-surface">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-headline font-bold text-lg text-on-surface">Profil Karyawan</h1>
        </div>

        <div className="p-6 max-w-5xl mx-auto space-y-8">
          {/* Hero Section */}
          <section className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className={`w-32 h-32 md:w-40 md:h-40 rounded-[2rem] flex items-center justify-center text-4xl md:text-5xl font-bold shadow-2xl ${
                employee.status === "AKTIF" ? "bg-primary text-on-primary" : "bg-surface-variant text-on-surface-variant"
              }`}>
                {initials}
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight">
                      {employee.nama_lengkap}
                    </h2>
                    <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${statusColor}`}>
                      {employee.status}
                    </span>
                    <WarningLetterModal employeeId={employee.id} onSuccess={() => {}} />
                  </div>
                  <p className="text-lg text-on-surface-variant font-medium">NIP: {employee.nip}</p>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] text-outline uppercase tracking-widest mb-1">Posisi</p>
                    <p className="font-bold text-secondary">{employee.posisi}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] text-outline uppercase tracking-widest mb-1">Sektor</p>
                    <p className="font-bold text-on-surface">Sektor {employee.sektor}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] text-outline uppercase tracking-widest mb-1">Regu</p>
                    <p className="font-bold text-on-surface">Regu {employee.regu}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] text-outline uppercase tracking-widest mb-1">Jalur Masuk</p>
                    <p className="font-bold text-primary">{employee.jalur_masuk}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Personal Info & Stats */}
            <div className="space-y-8">
              <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
                <h3 className="font-headline font-bold text-lg text-on-surface">Informasi Personal</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-sm text-on-surface-variant font-medium">NIK KTP</span>
                    <span className="text-sm font-bold text-on-surface">{employee.nik}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-sm text-on-surface-variant font-medium">Nomor BPJS</span>
                    <span className="text-sm font-bold text-primary">{employee.nomor_bpjs || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-sm text-on-surface-variant font-medium">Tanggal Masuk</span>
                    <span className="text-sm font-bold text-on-surface">
                      {format(new Date(employee.tanggal_masuk), "dd MMMM yyyy", { locale: localeId })}
                    </span>
                  </div>
                  {employee.tanggal_keluar && (
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-on-surface-variant font-medium">Tanggal Keluar</span>
                      <span className="text-sm font-bold text-error">
                        {format(new Date(employee.tanggal_keluar), "dd MMMM yyyy", { locale: localeId })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6 border border-white/5 bg-gradient-to-br from-error/10 to-transparent">
                <h3 className="font-headline font-bold text-lg text-on-surface mb-4">Ringkasan Denda & SP</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-error/20 flex items-center justify-center text-error">
                      <span className="material-symbols-outlined font-bold">account_balance_wallet</span>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-error">{formattedTotalPenalties}</p>
                      <p className="text-xs text-on-surface-variant font-medium">Total Denda Belum Lunas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                    <div className="w-12 h-12 rounded-2xl bg-error/20 flex items-center justify-center text-error">
                      <span className="material-symbols-outlined font-bold">gavel</span>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-error">{(spList || []).length}</p>
                      <p className="text-xs text-on-surface-variant font-medium">Total Surat Peringatan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Tabs/Lists */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contracts */}
              <div className="glass-card rounded-3xl p-6 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">description</span>
                    Riwayat Kontrak
                  </h3>
                  <span className="text-xs font-black bg-white/5 px-2 py-1 rounded text-outline">{(contractsList || []).length} PKWT</span>
                </div>
                <div className="space-y-4">
                  {(contractsList || []).map((contract) => (
                    <div key={contract.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-on-surface">{contract.tipe_kontrak?.replace("_", " ")}</p>
                        <p className="text-xs text-on-surface-variant">
                          {format(new Date(contract.tanggal_mulai), "dd/MM/yy")} - {format(new Date(contract.tanggal_selesai), "dd/MM/yy")}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        contract.status === "AKTIF" ? "bg-tertiary-container/30 text-tertiary" : "bg-white/5 text-outline"
                      }`}>
                        {contract.status}
                      </span>
                    </div>
                  ))}
                  {(!contractsList || contractsList.length === 0) && (
                    <p className="text-center py-4 text-sm text-on-surface-variant">Belum ada data kontrak.</p>
                  )}
                </div>
              </div>

              {/* Warning Letters History */}
              <div className="glass-card rounded-3xl p-6 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-error">history_edu</span>
                    Riwayat Surat Peringatan
                  </h3>
                </div>
                <div className="space-y-4">
                  {(spList || []).map((sp) => {
                    let isExpired = false;
                    try {
                      isExpired = new Date(sp.tanggal_berakhir) < new Date();
                    } catch (e) {}
                    return (
                      <div key={sp.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-error/20 flex items-center justify-center text-error flex-shrink-0">
                            <span className="font-black text-xs">{sp.tipe?.replace("_", " ")}</span>
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">{sp.alasan}</p>
                            <p className="text-xs text-on-surface-variant">
                              {format(new Date(sp.tanggal_terbit), "dd/MM/yy")} — {format(new Date(sp.tanggal_berakhir), "dd/MM/yy")}
                            </p>
                            {sp.keterangan && <p className="text-[10px] text-outline mt-1 italic">"{sp.keterangan}"</p>}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-tighter ${
                          !isExpired ? "bg-error text-white" : "bg-white/10 text-outline"
                        }`}>
                          {!isExpired ? "AKTIF" : "EXPIRED"}
                        </span>
                      </div>
                    );
                  })}
                  {(!spList || spList.length === 0) && (
                    <p className="text-center py-4 text-sm text-on-surface-variant">Karyawan ini tidak memiliki riwayat SP.</p>
                  )}
                </div>
              </div>

              {/* Catatan Kedisiplinan */}
              <div className="glass-card rounded-3xl p-6 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-error">gavel</span>
                    Catatan Kedisiplinan
                  </h3>
                  <Link href="/denda" className="text-xs font-bold text-primary hover:underline">Lihat Semua</Link>
                </div>
                <div className="space-y-4">
                  {(penaltiesList || []).slice(0, 3).map((penalty) => (
                    <div key={penalty.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-on-surface">{penalty.alasan}</p>
                        <p className="text-[10px] text-on-surface-variant">
                          {format(new Date(penalty.tanggal_denda), "dd MMM yyyy", { locale: localeId })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${penalty.status === "LUNAS" ? "text-tertiary" : "text-error"}`}>
                          Rp {penalty.jumlah.toLocaleString("id-ID")}
                        </p>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-outline">{penalty.status?.replace("_", " ")}</span>
                      </div>
                    </div>
                  ))}
                  {(!penaltiesList || penaltiesList.length === 0) && (
                    <p className="text-center py-4 text-sm text-on-surface-variant">Tidak ada catatan denda.</p>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div className="glass-card rounded-3xl p-6 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">folder_shared</span>
                    Berkas Digital
                  </h3>
                  <Link href="/dokumen" className="text-xs font-bold text-primary hover:underline">Kelola Berkas</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(documentsList || []).map((doc) => (
                    <div key={doc.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-base">description</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-on-surface truncate">{doc.file_name}</p>
                        <p className="text-[10px] text-on-surface-variant uppercase font-black">{doc.tipe}</p>
                      </div>
                    </div>
                  ))}
                  {(!documentsList || documentsList.length === 0) && (
                    <p className="col-span-2 text-center py-4 text-sm text-on-surface-variant">Belum ada dokumen diunggah.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
