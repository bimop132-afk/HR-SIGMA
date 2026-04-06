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
          
          <div className="mt-12 flex justify-center opacity-30">
            <img 
              alt="Abstrak data" 
              className="h-20 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_oVm2MA5QNPeko_iqHenNl-46I0RNPKlqj96LpkyL18-SzirT6ZXx-AEUDs81wt8fyeeVEc09dtpj8TRbrQenqLZcB9Sl4aE02W6ZrNpCDGLBluGjvWBKEUXrm8BvwpVLqZfJCzFa1qSK15FbVzzES8k1zPWUoMuSwOctEFznl5gvEml8yZWy3PS4ptCbWfyKgXWhyxGGt5O7_Pih5gvFt2W1nCFhGsUot4dlTmyIcjEHekwkaSeklJrZQ4SjJoV0tWxrpGtfdVEX" 
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
