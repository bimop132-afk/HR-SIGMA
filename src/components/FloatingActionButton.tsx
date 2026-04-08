"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states specifically for Old Employee
  const [nip, setNip] = useState("");
  const [nik, setNik] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jalurMasuk, setJalurMasuk] = useState<"LPK" | "UMUM">("LPK");
  const [posisi, setPosisi] = useState("Helper Produksi");
  const [sektor, setSektor] = useState(1);
  const [regu, setRegu] = useState(1);
  const [tanggalMasuk, setTanggalMasuk] = useState("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setNip("");
    setNik("");
    setNamaLengkap("");
    setJalurMasuk("LPK");
    setPosisi("Helper Produksi");
    setSektor(1);
    setRegu(1);
    setTanggalMasuk("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      nip,
      nik,
      namaLengkap,
      jalurMasuk,
      posisi,
      sektor,
      regu,
      tanggalMasuk,
    };

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan data karyawan lama");
      }

      toast.success("Karyawan Lama berhasil ditambahkan!");
      closeModal();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={openModal}
        className="fixed bottom-28 right-6 w-16 h-16 bg-primary text-on-primary rounded-2xl shadow-[0_10px_30px_rgba(202,190,255,0.3)] flex items-center justify-center active:scale-90 transition-all z-40 hover:brightness-110"
        title="Input Karyawan Lama"
      >
        <span className="material-symbols-outlined font-bold text-3xl">add</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-surface relative z-10 w-full max-w-2xl rounded-[2rem] shadow-2xl p-6 md:p-10 border border-white/10 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface">Input Karyawan Lama</h3>
                <p className="text-on-surface-variant text-sm mt-1">Form untuk menginput data karyawan beserta NIP yang sudah ada.</p>
              </div>
              <button 
                onClick={closeModal} 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">NAMA LENGKAP</label>
                  <input
                    type="text"
                    required
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">NO NIK KTP</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50"
                    placeholder="16 Digit NIK"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">NO KARYAWAN (NIP)</label>
                  <input
                    type="text"
                    required
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    className="w-full bg-surface-container-highest border border-primary/40 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50"
                    placeholder="NIP Lama (Contoh: 2501LPK10123)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">TANGGAL MASUK LAMA</label>
                  <input
                    type="date"
                    required
                    value={tanggalMasuk}
                    onChange={(e) => setTanggalMasuk(e.target.value)}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary h-14"
                  />
                </div>
              </div>

              {/* Jalur Masuk */}
              <div className="space-y-4">
                <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">
                  Jalur Masuk Lama
                </label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      checked={jalurMasuk === "LPK"}
                      onChange={() => setJalurMasuk("LPK")}
                      className="hidden peer"
                      type="radio"
                      name="jalur"
                    />
                    <div className="w-full py-4 rounded-xl border border-white/5 text-center transition-all bg-surface-container-highest peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary font-bold">
                      LPK
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      checked={jalurMasuk === "UMUM"}
                      onChange={() => setJalurMasuk("UMUM")}
                      className="hidden peer"
                      type="radio"
                      name="jalur"
                    />
                    <div className="w-full py-4 rounded-xl border border-white/5 text-center transition-all bg-surface-container-highest peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary font-bold">
                      UMUM
                    </div>
                  </label>
                </div>
              </div>

              {/* Jabatan & Sektor */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest block">Posisi</label>
                  <select
                    value={posisi}
                    onChange={(e) => setPosisi(e.target.value)}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary appearance-none custom-select"
                  >
                    {["Helper Produksi", "PIC", "Foreman"].map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest block">Sektor</label>
                  <select
                    value={sektor}
                    onChange={(e) => setSektor(parseInt(e.target.value))}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary appearance-none custom-select"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>Sektor {num}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest block">Regu</label>
                  <select
                    value={regu}
                    onChange={(e) => setRegu(parseInt(e.target.value))}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary appearance-none custom-select"
                  >
                    {[1, 2, 3].map((num) => (
                      <option key={num} value={num}>Regu {num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-8 flex gap-4 mt-auto">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-1/3 py-4 bg-surface-container-highest bg-opacity-50 text-on-surface-variant rounded-xl font-bold hover:bg-opacity-100 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-4 liquid-light text-on-primary-fixed rounded-xl font-bold font-headline shadow-[0_0_20px_rgba(202,190,255,0.4)] flex justify-center items-center hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    "Simpan Data Lama"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-select {
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem top 50%;
          background-size: 0.65rem auto;
        }
      `}} />
    </>
  );
}
