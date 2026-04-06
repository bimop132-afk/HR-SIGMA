"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function OnboardingForm() {
  const router = useRouter();

  const [jalurMasuk, setJalurMasuk] = useState<"LPK" | "UMUM">("LPK");
  const [tanggalMasuk, setTanggalMasuk] = useState<string>("");
  const [generatedNIP, setGeneratedNIP] = useState<string>("");
  const [isLoadingNIP, setIsLoadingNIP] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate NIP whenever 'jalurMasuk' or 'tanggalMasuk' changes
  useEffect(() => {
    if (tanggalMasuk) {
      const fetchNIP = async () => {
        setIsLoadingNIP(true);
        try {
          const res = await fetch(
            `/api/employees/nip/generate?tanggalMasuk=${tanggalMasuk}&jalurMasuk=${jalurMasuk}`
          );
          const body = await res.json();
          if (body.success) {
            setGeneratedNIP(body.data.nip);
          } else {
            setGeneratedNIP("");
          }
        } catch (error) {
          console.error("Failed to generate NIP", error);
        } finally {
          setIsLoadingNIP(false);
        }
      };

      fetchNIP();
    } else {
      setGeneratedNIP("");
    }
  }, [tanggalMasuk, jalurMasuk]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      namaLengkap: formData.get("namaLengkap") as string,
      nik: formData.get("nik") as string,
      posisi: formData.get("posisi") as string,
      sektor: parseInt(formData.get("sektor") as string),
      regu: parseInt(formData.get("regu") as string),
      jalurMasuk,
      tanggalMasuk,
    };

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan karyawan");
      }

      toast.success("Karyawan berhasil ditambahkan!");
      router.push("/karyawan");
    } catch (error: any) {
      toast.error(error.message);
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass rounded-[2rem] p-8 shadow-2xl shadow-black/40 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        {/* Jalur Masuk (Radio) */}
        <div className="space-y-4">
          <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">
            Jalur Masuk
          </label>
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                checked={jalurMasuk === "LPK"}
                onChange={() => setJalurMasuk("LPK")}
                className="hidden peer"
                name="jalur"
                type="radio"
              />
              <div className="flex items-center justify-center h-14 rounded-xl border border-outline-variant/20 peer-checked:bg-primary/10 peer-checked:border-primary transition-all duration-200">
                <span className="text-on-surface font-medium">LPK</span>
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                checked={jalurMasuk === "UMUM"}
                onChange={() => setJalurMasuk("UMUM")}
                className="hidden peer"
                name="jalur"
                type="radio"
              />
              <div className="flex items-center justify-center h-14 rounded-xl border border-outline-variant/20 peer-checked:bg-primary/10 peer-checked:border-primary transition-all duration-200">
                <span className="text-on-surface font-medium">Umum</span>
              </div>
            </label>
          </div>
        </div>

        {/* Tanggal Masuk */}
        <div className="space-y-2">
          <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">
            Tanggal Masuk
          </label>
          <div className="relative">
            <input
              required
              value={tanggalMasuk}
              onChange={(e) => setTanggalMasuk(e.target.value)}
              className="w-full bg-surface-container-highest/50 border-0 border-b-2 border-transparent py-4 px-4 rounded-t-xl text-on-surface focus:bg-surface-container-highest transition-all duration-300"
              type="date"
            />
          </div>
        </div>

        {/* NIP (Read Only) */}
        <div className="space-y-2">
          <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">
            NIP (Otomatis)
          </label>
          <input
            className="w-full bg-surface-container-low border-0 py-4 px-4 rounded-xl text-primary font-bold opacity-80 cursor-not-allowed"
            placeholder={isLoadingNIP ? "Menghasilkan NIP..." : "Masukkan Tanggal Masuk dulu"}
            value={generatedNIP}
            readOnly
            type="text"
          />
          <p className="text-[10px] text-outline italic">
            Nomor Induk Pegawai digenerate otomatis berdasarkan tanggal & jalur masuk.
          </p>
        </div>

        {/* Nama Lengkap */}
        <div className="space-y-2">
          <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">
            Nama Lengkap
          </label>
          <input
            name="namaLengkap"
            required
            className="w-full bg-surface-container-highest/50 border-0 border-b-2 border-transparent py-4 px-4 rounded-t-xl text-on-surface focus:bg-surface-container-highest transition-all duration-300"
            placeholder="Masukkan nama sesuai KTP"
            type="text"
          />
        </div>

        {/* NIK */}
        <div className="space-y-2">
          <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">
            NIK (16 Digit)
          </label>
          <input
            name="nik"
            required
            pattern="\d{16}"
            title="NIK harus 16 digit angka"
            className="w-full bg-surface-container-highest/50 border-0 border-b-2 border-transparent py-4 px-4 rounded-t-xl text-on-surface focus:bg-surface-container-highest transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="3210XXXXXXXXXXXX"
            type="text"
          />
        </div>

        {/* Posisi Dropdown */}
        <div className="space-y-2">
          <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">
            Posisi
          </label>
          <select
            name="posisi"
            required
            defaultValue=""
            className="w-full bg-surface-container-highest/50 border-0 border-b-2 border-transparent py-4 px-4 rounded-t-xl text-on-surface focus:bg-surface-container-highest transition-all duration-300 appearance-none"
          >
            <option disabled value="">
              Pilih Posisi Pekerjaan
            </option>
            <option value="PIC Line">PIC Line</option>
            <option value="Packing">Packing</option>
            <option value="Susun">Susun</option>
            <option value="Sortir">Sortir</option>
            <option value="Lakban">Lakban</option>
            <option value="Foreman">Foreman</option>
          </select>
        </div>

        {/* Sektor & Regu (Row) */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">
              Sektor
            </label>
            <select
              name="sektor"
              required
              defaultValue=""
              className="w-full bg-surface-container-highest/50 border-0 border-b-2 border-transparent py-4 px-4 rounded-t-xl text-on-surface focus:bg-surface-container-highest transition-all duration-300"
            >
              <option disabled value="">
                -
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">
              Regu
            </label>
            <select
              name="regu"
              required
              defaultValue=""
              className="w-full bg-surface-container-highest/50 border-0 border-b-2 border-transparent py-4 px-4 rounded-t-xl text-on-surface focus:bg-surface-container-highest transition-all duration-300"
            >
              <option disabled value="">
                -
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 space-y-4">
          <button
            disabled={isSubmitting || !generatedNIP}
            className="liquid-light w-full py-4 rounded-2xl text-on-primary-container font-headline font-extrabold text-lg shadow-xl shadow-red-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            {isSubmitting ? "Menyimpan..." : "Lanjut (Simpan)"}
          </button>
          <Link
            href="/"
            className="block text-center w-full py-2 text-outline-variant font-medium text-sm hover:text-on-surface transition-colors"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
