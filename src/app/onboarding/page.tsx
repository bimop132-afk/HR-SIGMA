import AppLayout from "@/components/AppLayout";
import OnboardingProgressRail from "@/components/OnboardingProgressRail";
import OnboardingForm from "@/components/OnboardingForm";

export default function OnboardingPage() {
  return (
    <AppLayout isTransactional={true} showBottomNav={true}>
      <div className="p-6 md:p-10 mb-20">
        <div className="max-w-2xl mx-auto lg:mx-0 w-full">
          <OnboardingProgressRail />
          <OnboardingForm />
        </div>
      </div>
    </AppLayout>
  );
}
