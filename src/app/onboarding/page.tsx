import AppLayout from "@/components/AppLayout";
import OnboardingForm from "@/components/OnboardingForm";

export default function OnboardingPage() {
  return (
    <AppLayout isTransactional={true} showBottomNav={true}>
      <div className="p-6 md:p-10 mb-20">
        <div className="max-w-2xl mx-auto w-full">
          <OnboardingForm />
        </div>
      </div>
    </AppLayout>
  );
}
