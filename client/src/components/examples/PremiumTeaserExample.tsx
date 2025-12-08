import PremiumTeaser from '../PremiumTeaser';

export default function PremiumTeaserExample() {
  return (
    <div className="relative w-full max-w-[360px] mx-auto h-[400px]">
      <PremiumTeaser onClose={() => console.log('Premium teaser closed')} />
    </div>
  );
}
