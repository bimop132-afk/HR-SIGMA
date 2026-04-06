"use client";

export default function PrintAction() {
  return (
    <button
      onClick={() => window.print()}
      className="fixed bottom-10 right-10 print:hidden bg-red-600 text-white px-6 py-4 rounded-full shadow-2xl shadow-red-600/30 font-bold flex items-center gap-2 hover:bg-red-700 active:scale-95 transition-all cursor-pointer z-50"
    >
      <span className="material-symbols-outlined">print</span>
      Cetak Form A4
    </button>
  );
}
