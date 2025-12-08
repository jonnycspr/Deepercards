import Onboarding from '../Onboarding';

export default function OnboardingExample() {
  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-xl border border-border">
      <Onboarding onComplete={() => console.log('Onboarding complete')} />
    </div>
  );
}
