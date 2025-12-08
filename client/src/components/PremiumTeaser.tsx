import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PremiumTeaserProps {
  onClose: () => void;
}

export default function PremiumTeaser({ onClose }: PremiumTeaserProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 z-10"
    >
      <div
        className="relative rounded-2xl p-8 min-h-[320px] flex flex-col items-center justify-center shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A78BFA 100%)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          data-testid="button-close-premium"
        >
          <X className="w-6 h-6" />
        </button>

        <Sparkles className="w-16 h-16 text-white mb-6" />
        
        <h3 className="text-white text-2xl font-bold text-center mb-3">
          Want to go deeper?
        </h3>
        
        <p className="text-white/90 text-center mb-8 max-w-[250px]">
          Unlock all 264 questions with Premium
        </p>

        <Button
          variant="secondary"
          size="lg"
          className="bg-white text-purple-700 hover:bg-white/90 font-semibold"
          data-testid="button-unlock-premium"
          onClick={() => console.log('Premium unlock clicked')}
        >
          Unlock Premium
        </Button>
      </div>
    </motion.div>
  );
}
