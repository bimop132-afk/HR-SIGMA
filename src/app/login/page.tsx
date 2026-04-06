"use client";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@hrsigma.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Login gagal. Periksa kredensial Anda.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-error/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Branding */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 shadow-2xl shadow-red-500/10">
            <span
              className="material-symbols-outlined text-red-600 text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_person
            </span>
          </div>
          <h1 className="text-3xl font-black text-on-surface font-headline tracking-tight">
            HR SIGMA
          </h1>
          <p className="text-on-surface-variant text-sm mt-2 font-medium">
            Human Resource Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="glass rounded-[2rem] p-8 shadow-2xl shadow-black/40 border border-white/5 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-[60px]"></div>
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-error/10 rounded-full blur-[60px]"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <h2 className="text-xl font-headline font-bold text-on-surface mb-1">
                Selamat Datang
              </h2>
              <p className="text-on-surface-variant text-xs">
                Masuk untuk mengakses dashboard
              </p>
            </div>

            {error && (
              <div className="bg-error-container/20 border border-error/30 rounded-xl p-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-sm">
                  error
                </span>
                <p className="text-error text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                  mail
                </span>
                <input
                  className="w-full bg-surface-container-highest/50 border-0 border-b-2 border-transparent py-4 pl-12 pr-4 rounded-t-xl text-on-surface focus:bg-surface-container-highest transition-all duration-300 focus:border-primary outline-none"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hrsigma.local"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-on-surface-variant font-label text-xs uppercase tracking-widest block">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                  lock
                </span>
                <input
                  className="w-full bg-surface-container-highest/50 border-0 border-b-2 border-transparent py-4 pl-12 pr-4 rounded-t-xl text-on-surface focus:bg-surface-container-highest transition-all duration-300 focus:border-primary outline-none"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="liquid-light w-full py-4 rounded-2xl text-on-primary-container font-headline font-extrabold text-lg shadow-xl shadow-red-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-xl">
                    progress_activity
                  </span>
                  Memproses...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">
                    login
                  </span>
                  Masuk
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-on-surface-variant/40 text-[10px] mt-8 uppercase tracking-widest font-bold">
          HR SIGMA v0.1.0 &bull; Admin Panel
        </p>
      </div>
    </div>
  );
}
