import React from 'react';

type Severity = 'critical' | 'warning' | 'safe';

interface ContractData {
  name: string;
  nip: string;
  position: string;
  department: string;
  daysLeft: number;
  severity: Severity;
  avatar: string;
}

export default function ContractCard({ contract }: { contract: ContractData }) {
  const isCritical = contract.severity === 'critical';
  const isWarning = contract.severity === 'warning';
  
  const borderClass = isCritical ? 'border-error/80' : isWarning ? 'border-secondary/80' : 'border-tertiary/80';
  const iconColor = isCritical ? 'text-error/30' : isWarning ? 'text-secondary/30' : 'text-tertiary/30';
  const iconName = isCritical ? 'warning' : isWarning ? 'schedule' : 'verified';
  const numberColor = isCritical ? 'text-error' : isWarning ? 'text-secondary' : 'text-tertiary';
  
  const badgeClass = isCritical 
    ? 'bg-error-container text-on-error-container' 
    : isWarning 
      ? 'bg-surface-variant text-on-surface-variant' 
      : 'bg-tertiary-container/20 text-tertiary';
      
  const statusText = isCritical ? 'Segera Berakhir' : isWarning ? 'Perlu Tindakan' : 'Status Aman';

  return (
    <div className={`glass p-5 rounded-2xl border-l-4 ${borderClass} relative overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg`}>
      <div className="absolute top-0 right-0 p-3">
        <span className={`material-symbols-outlined ${iconColor} text-4xl`}>{iconName}</span>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <img alt={contract.name} className="w-12 h-12 rounded-xl object-cover" src={contract.avatar} />
        <div>
          <h3 className="font-headline font-bold text-on-surface">{contract.name}</h3>
          <p className="text-on-surface-variant text-xs font-medium">NIP: {contract.nip}</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-on-surface-variant">Posisi:</span>
          <span className="text-on-surface font-medium">{contract.position}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-on-surface-variant">Departemen:</span>
          <span className="text-on-surface font-medium">{contract.department}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Sisa Waktu</span>
          <span className={`text-lg font-headline font-black ${numberColor}`}>{contract.daysLeft} HARI</span>
        </div>
        <span className={`${badgeClass} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter`}>{statusText}</span>
      </div>
    </div>
  );
}
