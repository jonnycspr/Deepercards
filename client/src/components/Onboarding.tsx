import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeeperLogo from '@/components/DeeperLogo';
import { useLocalStorage, defaultSettings, AppSettings } from '@/lib/useLocalStorage';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [settings] = useLocalStorage<AppSettings>('deeper-settings', defaultSettings);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: settings.backgroundColor }}>
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center w-full max-w-[320px]"
        >
          {/* Logo */}
          <div className="mx-auto mb-8 flex items-center justify-center">
            <DeeperLogo color={settings.logoColor} className="h-20" />
          </div>

          {/* Welcome Title */}
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'rgba(0, 74, 126, 1)' }}>Welcome to Deeper</h1>
          <p className="text-muted-foreground mb-10 leading-relaxed" style={{ fontSize: '18px', color: 'rgba(92, 92, 92, 1)' }}>
            Build meaningful conversations with your partner through faith-based discussion cards.
          </p>

          {/* Swipe Instructions */}
          <div className="space-y-6 mb-10">
            {/* Swipe Right */}
            <div className="flex items-center gap-4">
              <motion.div
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center relative flex-shrink-0"
                animate={{ x: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ backgroundImage: 'none', background: 'unset' }}
              >
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 1)' }}>
                  <ArrowRight className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  className="absolute -right-1 top-1/2 -translate-y-1/2"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              </motion.div>
              <div className="text-left flex-1">
                <h3 className="font-semibold mb-1">Swipe Right</h3>
                <p className="text-sm text-muted-foreground">
                  Mark questions as discussed when you've talked about them together.
                </p>
              </div>
            </div>

            {/* Swipe Left */}
            <div className="flex items-center gap-4">
              <motion.div
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center relative flex-shrink-0"
                animate={{ x: [0, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center">
                  <ArrowLeft className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  className="absolute -left-1 top-1/2 -translate-y-1/2"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              </motion.div>
              <div className="text-left flex-1">
                <h3 className="font-semibold mb-1">Swipe Left</h3>
                <p className="text-sm text-muted-foreground" style={{ color: 'rgba(92, 92, 92, 1)' }}>
                  Save questions for later if you're not ready to discuss them yet.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-8 pb-12">
        <Button
          onClick={onComplete}
          className="w-full"
          size="lg"
          data-testid="button-onboarding-next"
          style={{
            height: '72px',
            borderRadius: '16px',
            fontSize: '18px',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            borderWidth: '0px',
            borderStyle: 'none',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderImage: 'none',
            color: 'rgba(0, 74, 126, 1)',
          }}
        >
          Let's Go
        </Button>
      </div>
    </div>
  );
}
