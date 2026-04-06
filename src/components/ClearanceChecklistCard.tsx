export default function ClearanceChecklistCard({ name, status }: { name: string, status: string }) {
  const isProcess = status !== "SELESAI";
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-headline font-bold text-on-surface">
        Detail Clearance
      </h3>
      <div className="glass rounded-3xl border border-white/5 p-8 relative overflow-hidden group">
        {/* Decorative glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-[40px] transition-all group-hover:bg-primary/30"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-primary/40 bg-surface-variant flex items-center justify-center">
              <span className="text-on-surface-variant font-bold text-lg">{name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-on-surface">
                {name}
              </h4>
              <p className="text-xs text-primary font-bold tracking-widest uppercase">
                {isProcess ? "Dalam Proses" : "Selesai"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-md border-2 border-primary bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span
                  className="material-symbols-outlined text-sm text-primary"
                  style={{ fontVariationSettings: "'wght' 700" }}
                >
                  check
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">
                  Pengembalian ID Card
                </p>
                <p className="text-xs text-on-surface-variant">
                  Diserahkan ke Kantor
                </p>
              </div>
              <span className="text-[10px] font-bold text-tertiary-fixed uppercase">
                Verified
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-md border-2 border-outline-variant flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">
                  Alat Pelindung Diri (APD)
                </p>
                <p className="text-xs text-on-surface-variant">
                  Seragam, Sepatu, Haircup, Apron
                </p>
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                Pending
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-md border-2 border-outline-variant flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">
                  Serah Terima Tugas
                </p>
                <p className="text-xs text-on-surface-variant">
                  Koordinasi dengan Tim
                </p>
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                Pending
              </span>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5">
            <button className="w-full py-4 rounded-2xl bg-surface-container-highest border border-outline-variant/30 text-on-surface font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-sm">print</span>
              Cetak Form Clearance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
