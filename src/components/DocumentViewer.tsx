"use client";

import { useEffect, useState } from "react";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  fileName: string;
}

export default function DocumentViewer({ isOpen, onClose, url, fileName }: DocumentViewerProps) {
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    if (url) {
      // Logic for detecting if it's a PDF
      // In Supabase URLs, sometimes the extension is in the path before query params
      const cleanUrl = url.split("?")[0];
      const extension = cleanUrl.split(".").pop()?.toLowerCase();
      setIsPdf(extension === "pdf");
    }
  }, [url]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank"; // Open in new tab as fallback
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      {/* Container */}
      <div className="relative z-[201] w-full max-w-6xl h-[90vh] glass rounded-[2.5rem] border border-white/10 flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-300">
        
        {/* Decorative background light */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full -ml-32 -mb-32 pointer-events-none" />

        {/* Header */}
        <div className="relative flex justify-between items-center p-6 md:px-10 border-b border-white/5 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              isPdf ? "bg-red-500/20 text-red-400" : "bg-primary/20 text-primary"
            }`}>
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPdf ? "description" : "image"}
              </span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-on-surface text-lg truncate max-w-[200px] md:max-w-md">
                {fileName}
              </h3>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                  isPdf ? "bg-red-500/20 text-red-500" : "bg-primary/20 text-primary"
                }`}>
                  {isPdf ? "Portable Document" : "Visual Asset"}
                </span>
                <span className="text-[10px] text-outline">•</span>
                <span className="text-[10px] text-outline font-medium tracking-wide">PREVIEW MODE</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 active:scale-95 text-on-surface font-bold rounded-2xl transition-all border border-white/5 group"
              title="Unduh Dokumen"
            >
              <span className="material-symbols-outlined text-xl group-hover:translate-y-0.5 transition-transform">download</span>
              <span className="hidden sm:inline">Unduh</span>
            </button>
            <div className="w-px h-8 bg-white/5 mx-1 hidden sm:block" />
            <button 
              onClick={onClose} 
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-error/20 hover:text-error transition-all text-on-surface-variant cursor-pointer active:scale-90 border border-white/5"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Viewport Area */}
        <div className="relative flex-1 bg-black/40 flex items-center justify-center overflow-hidden p-2 sm:p-6 md:p-10">
          {isPdf ? (
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white/5">
              <iframe 
                src={`${url}#toolbar=0`} 
                className="w-full h-full border-none"
                title={fileName}
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center group overflow-auto custom-scrollbar">
              <img 
                src={url} 
                alt={fileName} 
                className="max-w-full max-h-full rounded-xl shadow-2xl object-contain transition-transform duration-700 hover:scale-[1.01]"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>
          )}
        </div>
        
        {/* Footer info (optional) */}
        <div className="py-3 px-10 bg-white/5 flex justify-center border-t border-white/5">
          <p className="text-[9px] text-outline uppercase tracking-[0.2em] font-medium">
            PT. Mitra Sigma Tekindo • Digital Archive Management
          </p>
        </div>
      </div>
    </div>
  );
}
