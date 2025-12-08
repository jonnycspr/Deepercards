import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, ArrowLeft, Check, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    title: 'Welcome to Deeper',
    description: 'Build meaningful conversations with your partner through faith-based discussion cards.',
    icon: Heart,
  },
  {
    title: 'Swipe Right',
    description: 'When you\'ve discussed a question together, swipe right to mark it as complete.',
    icon: Check,
    animation: 'right',
  },
  {
    title: 'Swipe Left',
    description: 'Not ready for a question? Swipe left to save it for later. Every question must eventually be faced.',
    icon: Clock,
    animation: 'left',
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="mb-8">
              {step.animation === 'right' ? (
                <motion.div
                  className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center relative"
                  animate={{ x: [0, 30, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center">
                    <ArrowRight className="w-12 h-12 text-white" />
                  </div>
                  <motion.div
                    className="absolute -right-2 top-1/2 -translate-y-1/2"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                </motion.div>
              ) : step.animation === 'left' ? (
                <motion.div
                  className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center relative"
                  animate={{ x: [0, -30, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center">
                    <ArrowLeft className="w-12 h-12 text-white" />
                  </div>
                  <motion.div
                    className="absolute -left-2 top-1/2 -translate-y-1/2"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Icon className="w-16 h-16 text-white" />
                </motion.div>
              )}
            </div>

            <h1 className="text-2xl font-bold mb-4">{step.title}</h1>
            <p className="text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-8 pb-12">
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="w-full"
          size="lg"
          data-testid="button-onboarding-next"
        >
          {currentStep === steps.length - 1 ? (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Start Conversations
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  );
}
