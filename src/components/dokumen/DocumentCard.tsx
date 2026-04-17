"use client";
import { useState } from "react";

type DocType = "Kontrak" | "KTP" | "NPWP" | "SK" | "Paklaring" | "Ijazah" | "Lainnya";

interface DocumentData {
  id: number;
  fileName: string;
  type: DocType;
  size: string;
  ownerName: string;
  ownerAvatar: string;
  uploadDate: string;
  icon: string;
}

const TYPE_STYLES: Record<DocType, { bg: string; text: string; iconColor: string; iconBg: string }> = {
  Kontrak: {
    bg: "bg-tertiary-container/20",
    text: "text-tertiary",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  KTP: {
    bg: "bg-surface-variant",
    text: "text-on-surface-variant",
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10",
  },
  NPWP: {
    bg: "bg-surface-variant",
    text: "text-on-surface-variant",
    iconColor: "text-error",
    iconBg: "bg-error/10",
  },
  SK: {
    bg: "bg-surface-variant",
    text: "text-on-surface-variant",
    iconColor: "text-tertiary",
    iconBg: "bg-tertiary/10",
  },
  Paklaring: {
    bg: "bg-surface-variant",
    text: "text-on-surface-variant",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  Ijazah: {
    bg: "bg-surface-variant",
    text: "text-on-surface-variant",
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10",
  },
  Lainnya: {
    bg: "bg-surface-variant",
    text: "text-on-surface-variant",
    iconColor: "text-outline",
    iconBg: "bg-surface-container-high",
  },
};

interface DocumentData {
  id: number;
  fileName: string;
  type: DocType;
  size: string;
  ownerName: string;
  ownerAvatar: string;
  uploadDate: string;
  icon: string;
  filePath: string;
}

export default function DocumentCard({ doc, onView }: { doc: DocumentData; onView?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const style = TYPE_STYLES[doc.type];

  return (
    <div 
      className="glass p-5 rounded-3xl border border-white/5 space-y-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 relative cursor-pointer group"
      onClick={(e) => {
        if (!menuOpen && onView) onView();
      }}
    >
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 ${style.iconBg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
          <span
            className={`material-symbols-outlined ${style.iconColor} text-3xl`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {doc.icon}
          </span>
        </div>
        <button
          className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer active:scale-90 duration-150 p-2 -mr-2"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          <span className="material-symbols-outlined">more_vert</span>
        </button>

        {/* Context Menu */}
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
            <div className="absolute right-5 top-14 z-20 bg-surface-container-highest backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/80 py-2 min-w-[160px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {["Lihat", "Unduh", "Bagikan", "Ganti Nama", "Hapus"].map((action) => (
                <button
                  key={action}
                  className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors hover:bg-white/5 cursor-pointer flex items-center gap-3 ${
                    action === "Hapus" ? "text-error" : "text-on-surface"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    if (action === "Lihat" && onView) onView();
                    if (action === "Unduh") {
                      const link = document.createElement("a");
                      link.href = doc.filePath;
                      link.download = doc.fileName;
                      link.target = "_blank";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                >
                  <span className="material-symbols-outlined text-lg">
                    {action === "Lihat" ? "visibility" : 
                     action === "Unduh" ? "download" : 
                     action === "Bagikan" ? "share" : 
                     action === "Ganti Nama" ? "edit" : "delete"}
                  </span>
                  {action}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* File Info */}
      <div>
        <h4 className="font-headline font-bold text-on-surface text-base truncate pr-2">{doc.fileName}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`text-[10px] ${style.bg} ${style.text} px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter`}
          >
            {doc.type}
          </span>
          <span className="text-on-surface-variant text-xs font-medium">{doc.size}</span>
        </div>
      </div>

      {/* Owner Row */}
      <div className="pt-4 border-t border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden flex-shrink-0 ring-1 ring-white/10">
          <img alt={doc.ownerName} className="w-full h-full object-cover" src={doc.ownerAvatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(doc.ownerName)} />
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface">{doc.ownerName}</p>
          <p className="text-[10px] text-outline">Diunggah {doc.uploadDate}</p>
        </div>
      </div>
    </div>
  );
}
