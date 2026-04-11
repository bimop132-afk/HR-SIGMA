"use client";

import { useState } from "react";
import DocumentViewer from "@/components/DocumentViewer";

interface Document {
  id: number;
  file_name: string;
  tipe: string;
  file_path: string;
  file_size: number;
  upload_date: string;
}

interface EmployeeDocumentsSectionProps {
  documents: Document[];
}

export default function EmployeeDocumentsSection({ documents }: EmployeeDocumentsSectionProps) {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">folder_shared</span>
          Berkas Digital
        </h3>
        <span className="text-xs font-black bg-white/5 px-2 py-1 rounded text-outline">{documents.length} Berkas</span>
      </div>

      {documents.length === 0 ? (
        <p className="text-center py-8 text-sm text-on-surface-variant bg-white/5 rounded-2xl border border-dashed border-white/10">
          Belum ada dokumen diunggah.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              onClick={() => setSelectedDoc(doc)}
              className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer flex items-center gap-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-2xl rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">
                  {doc.tipe === "Kontrak" ? "description" : 
                   doc.tipe === "KTP" ? "badge" : 
                   doc.tipe === "Ijazah" ? "school" : "article"}
                </span>
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">{doc.file_name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-on-surface-variant uppercase font-black tracking-tight">{doc.tipe}</span>
                  <span className="text-[10px] text-outline">•</span>
                  <span className="text-[10px] text-outline">{new Date(doc.upload_date).toLocaleDateString("id-ID")}</span>
                </div>
              </div>

              <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all">
                <span className="material-symbols-outlined text-lg">visibility</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Viewer Modal */}
      {selectedDoc && (
        <DocumentViewer 
          isOpen={!!selectedDoc} 
          onClose={() => setSelectedDoc(null)} 
          url={selectedDoc.file_path} 
          fileName={selectedDoc.file_name} 
        />
      )}
    </div>
  );
}
