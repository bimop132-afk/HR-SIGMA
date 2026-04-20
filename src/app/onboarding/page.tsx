import OnboardingForm from "@/components/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-10 pb-20 px-4 md:px-0">
      <div className="max-w-2xl mx-auto w-full mb-8 text-center">
        <h1 className="font-headline text-3xl font-black tracking-tight text-on-surface">
          HR <span className="text-primary">SIGMA</span>
        </h1>
        <p className="text-on-surface-variant text-sm mt-2 font-medium">Formulir Onboarding Karyawan Baru</p>
      </div>
      <div className="max-w-2xl mx-auto w-full">
        <OnboardingForm />
      </div>
    </div>
  );
}
