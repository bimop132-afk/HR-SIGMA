import Link from "next/link";

interface TransactionalAppBarProps {
  onToggle?: () => void;
}

export default function TransactionalAppBar({ onToggle }: TransactionalAppBarProps) {
  return (
    <header className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-6 h-16 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-3">
        <div className="w-10" /> {/* Spacer for the sidebar toggle */}
        <h1 className="font-manrope font-bold text-xl text-red-500 tracking-tight ml-4">HR SIGMA</h1>
      </div>
      <Link href="/" className="text-zinc-400 hover:text-white transition-colors active:scale-95 duration-200">
        <span className="material-symbols-outlined block">close</span>
      </Link>
    </header>
  );
}
