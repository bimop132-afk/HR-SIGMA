"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type FormStep = 1 | 2 | 3 | 4 | 5 | 6;

export default function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState<FormStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Pekerjaan
    jalurMasuk: "LPK" as "LPK" | "UMUM",
    tanggalMasuk: "",
    nip: "",
    posisi: "",
    
    // Step 2: Pribadi
    namaLengkap: "",
    jenisKelamin: "L" as "L" | "P",
    golonganDarah: "",
    tempatLahir: "",
    tanggalLahir: "",
    namaIbuKandung: "",
    
    // Step 3: Kontak & Alamat
    noHp: "",
    emailAktif: "",
    alamatLengkap: "",
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    
    // Step 4: Identitas 
    nik: "",
    noKk: "",
    masaLakuIdentitas: "SEUMUR HIDUP",
    
    // Step 5: Ukuran
    seragamSize: "",
    sepatuSize: "",
    
    // Step 6: Berkas (URLs)
    fotoUrl: "",
    fotoKtpUrl: "",
    fotoKkUrl: "",
    fotoIjazahUrl: "",
  });

  const [isLoadingNIP, setIsLoadingNIP] = useState(false);

  // Auto-generate NIP
  useEffect(() => {
    if (formData.tanggalMasuk && step === 1) {
      const fetchNIP = async () => {
        setIsLoadingNIP(true);
        try {
          const res = await fetch(
            `/api/employees/nip/generate?tanggalMasuk=${formData.tanggalMasuk}&jalurMasuk=${formData.jalurMasuk}`
          );
          const body = await res.json();
          if (body.success) {
            setFormData(prev => ({ ...prev, nip: body.data.nip }));
          }
        } catch (error) {
          console.error("Failed to generate NIP", error);
        } finally {
          setIsLoadingNIP(false);
        }
      };
      fetchNIP();
    }
  }, [formData.tanggalMasuk, formData.jalurMasuk, step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(fieldName);
    const body = new FormData();
    body.append("file", file);
    body.append("path", "onboarding");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, [fieldName]: data.url }));
        toast.success("File terunggah!");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error("Gagal unggah: " + err.message);
    } finally {
      setIsUploading(null);
    }
  };

  const nextStep = () => {
    if (step < 6) setStep((prev) => (prev + 1) as FormStep);
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => (prev - 1) as FormStep);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 6) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert numeric fields
      const payload = {
        ...formData,
        sepatuSize: formData.sepatuSize ? parseInt(formData.sepatuSize) : null,
      };

      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data");

      toast.success("Karyawan berhasil didaftarkan!");
      router.push("/karyawan/penempatan"); // Redirect to placement page
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass rounded-[2.5rem] p-8 shadow-2xl shadow-black/40 relative overflow-hidden max-w-2xl mx-auto border border-white/5">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 rounded-full blur-[100px]"></div>

      {/* Progress Header */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-headline font-bold text-on-surface">Onboarding Baru</h2>
          <span className="text-primary font-bold bg-primary/10 px-4 py-1 rounded-full text-sm">Langkah {step} dari 6</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
          {[1,2,3,4,5,6].map(s => (
            <div 
              key={s} 
              className={`h-full flex-1 transition-all duration-500 rounded-full ${s <= step ? 'bg-primary shadow-[0_0_10px_rgba(255,100,100,0.5)]' : 'bg-white/5'}`}
            ></div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        
        {/* STEP 1: INFO PEKERJAAN */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Jalur Masuk</label>
              <div className="flex gap-4">
                {["LPK", "UMUM"].map((j) => (
                  <label key={j} className="flex-1 cursor-pointer">
                    <input
                      checked={formData.jalurMasuk === j}
                      onChange={() => setFormData(prev => ({ ...prev, jalurMasuk: j as "LPK" | "UMUM" }))}
                      className="hidden peer"
                      type="radio"
                    />
                    <div className="flex items-center justify-center h-16 rounded-2xl border border-white/5 bg-surface-container-highest/30 peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary transition-all font-bold">
                      {j}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Tanggal Masuk</label>
              <input
                required
                name="tanggalMasuk"
                value={formData.tanggalMasuk}
                onChange={handleChange}
                className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface focus:bg-surface-container-highest focus:ring-2 focus:ring-primary transition-all"
                type="date"
              />
            </div>

            <div className="space-y-2">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">NIP (Otomatis)</label>
              <input
                className="w-full bg-surface-container-low border border-white/5 py-4 px-4 rounded-xl text-primary font-bold opacity-80 cursor-not-allowed"
                value={isLoadingNIP ? "Menghasilkan..." : formData.nip}
                placeholder="Pilih Tanggal Masuk"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Posisi / Bagian</label>
              <select
                name="posisi"
                required
                value={formData.posisi}
                onChange={handleChange}
                className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface focus:bg-surface-container-highest appearance-none"
              >
                <option value="">Pilih Posisi...</option>
                <option value="Helper Produksi">Helper Produksi</option>
                <option value="PIC">PIC</option>
                <option value="Foreman">Foreman</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: DATA PRIBADI */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
            <div className="space-y-2">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Nama Lengkap (Sesuai KTP)</label>
              <input
                required
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
                placeholder="Budi Santoso"
                className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface focus:ring-2 focus:ring-primary"
                type="text"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Jenis Kelamin</label>
                <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface">
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Gol. Darah</label>
                <input name="golonganDarah" value={formData.golonganDarah} onChange={handleChange} placeholder="O / A / B / AB" className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface uppercase" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Tempat Lahir</label>
                <input name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} placeholder="Jakarta" className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" />
              </div>
              <div className="space-y-2">
                <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Tanggal Lahir</label>
                <input name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Nama Ibu Kandung</label>
              <input name="namaIbuKandung" value={formData.namaIbuKandung} onChange={handleChange} className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" />
            </div>
          </div>
        )}

        {/* STEP 3: KONTAK & ALAMAT */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">No. HP (WhatsApp)</label>
                <input name="noHp" value={formData.noHp} onChange={handleChange} placeholder="0812..." className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" />
              </div>
              <div className="space-y-2">
                <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Email Aktif</label>
                <input name="emailAktif" value={formData.emailAktif} onChange={handleChange} placeholder="email@gmail.com" className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" type="email" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Alamat Lengkap</label>
              <textarea name="alamatLengkap" value={formData.alamatLengkap} onChange={handleChange} rows={2} className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">RT</label>
                <input name="rt" value={formData.rt} onChange={handleChange} placeholder="001" className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" />
              </div>
              <div className="space-y-2">
                <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">RW</label>
                <input name="rw" value={formData.rw} onChange={handleChange} placeholder="002" className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Kelurahan/Desa</label>
                <input name="kelurahan" value={formData.kelurahan} onChange={handleChange} className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" />
              </div>
              <div className="space-y-2">
                <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Kecamatan</label>
                <input name="kecamatan" value={formData.kecamatan} onChange={handleChange} className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Kabupaten/Kota</label>
              <input name="kabupaten" value={formData.kabupaten} onChange={handleChange} className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" />
            </div>
          </div>
        )}

        {/* STEP 4: IDENTITAS */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
            <div className="space-y-2">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Nomor KTP (NIK)</label>
              <input name="nik" value={formData.nik} onChange={handleChange} maxLength={16} placeholder="16 Digit" className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" />
            </div>
            <div className="space-y-2">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Nomor Kartu Keluarga (KK)</label>
              <input name="noKk" value={formData.noKk} onChange={handleChange} placeholder="16 Digit" className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" />
            </div>
            <div className="space-y-2">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Masa Laku Identitas</label>
              <input name="masaLakuIdentitas" value={formData.masaLakuIdentitas} onChange={handleChange} placeholder="Contoh: SEUMUR HIDUP" className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" />
            </div>
          </div>
        )}

        {/* STEP 5: UKURAN */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
             <div className="space-y-2">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Ukuran Seragam</label>
              <select name="seragamSize" value={formData.seragamSize} onChange={handleChange} className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface">
                <option value="">Pilih Ukuran...</option>
                <option value="S">Small (S)</option>
                <option value="M">Medium (M)</option>
                <option value="L">Large (L)</option>
                <option value="XL">Extra Large (XL)</option>
                <option value="XXL">Double Extra Large (XXL)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">Ukuran Sepatu (Nomor)</label>
              <input name="sepatuSize" value={formData.sepatuSize} onChange={handleChange} type="number" placeholder="Contoh: 40" className="w-full bg-surface-container-highest/50 border border-white/5 py-4 px-4 rounded-xl text-on-surface" />
            </div>
          </div>
        )}

        {/* STEP 6: UNGGAH BERKAS */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
            <p className="text-xs text-on-surface-variant mb-4 italic">Format: JPG/PNG, Maksimal 2MB per file</p>
            
            {[
              { label: "Foto Diri (Latar Polos)", name: "fotoUrl" },
              { label: "Foto KTP", name: "fotoKtpUrl" },
              { label: "Foto Kartu Keluarga", name: "fotoKkUrl" },
              { label: "Foto Ijazah Terakhir", name: "fotoIjazahUrl" },
            ].map((file) => (
              <div key={file.name} className="p-4 rounded-2xl bg-surface-container-low border border-white/5 flex flex-col gap-3">
                <label className="text-sm font-bold text-on-surface">{file.label}</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, file.name)} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-20"
                      disabled={!!isUploading}
                    />
                    <div className="h-12 bg-white/5 rounded-xl flex items-center px-4 text-xs text-outline-variant overflow-hidden">
                      {formData[file.name as keyof typeof formData] ? "✓ File Terpilih" : "Pilih Berkas..."}
                    </div>
                  </div>
                  {isUploading === file.name && <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>}
                  {formData[file.name as keyof typeof formData] && (
                    <div className="w-10 h-10 rounded-lg bg-tertiary/20 flex items-center justify-center text-tertiary">
                      <span className="material-symbols-outlined">check_circle</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-8 flex gap-4">
          {step > 1 && (
            <button
              onClick={prevStep}
              type="button"
              className="flex-1 py-4 rounded-2xl bg-surface-container-highest text-on-surface font-bold hover:bg-surface-container-high transition-all"
            >
              Kembali
            </button>
          )}
          <button
            disabled={isSubmitting || (step === 1 && !formData.nip) || !!isUploading}
            className={`flex-[2] py-4 rounded-2xl font-headline font-extrabold text-lg shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              step === 6 ? 'liquid-light text-on-primary-container shadow-red-500/20' : 'bg-on-surface text-surface'
            }`}
            type="submit"
          >
            {isSubmitting ? "Menyimpan..." : step === 6 ? "Selesai & Simpan" : "Lanjut"}
          </button>
        </div>
      </form>
    </div>
  );
}
