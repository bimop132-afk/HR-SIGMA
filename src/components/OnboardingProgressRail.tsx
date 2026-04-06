export default function OnboardingProgressRail() {
  return (
    <div className="mb-10 px-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-secondary font-headline font-bold text-sm tracking-wide">LANGKAH 1 DARI 4</p>
          <h2 className="text-on-surface font-headline font-extrabold text-2xl mt-1">Data Pribadi</h2>
        </div>
        <div className="h-12 w-12 rounded-full border-2 border-primary-container/30 flex items-center justify-center">
          <span className="text-primary font-bold">25%</span>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-1.5 w-1/4 rounded-full bg-primary shadow-[0_0_12px_rgba(202,190,255,0.3)]"></div>
        <div className="h-1.5 w-1/4 rounded-full bg-surface-container-highest"></div>
        <div className="h-1.5 w-1/4 rounded-full bg-surface-container-highest"></div>
        <div className="h-1.5 w-1/4 rounded-full bg-surface-container-highest"></div>
      </div>
    </div>
  );
}
