import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SwipeCard from './SwipeCard';
import PremiumTeaser from './PremiumTeaser';
import { Category, Question } from '@/lib/categories';
import { UserProgress } from '@/lib/useLocalStorage';

interface CardStackProps {
  questions: Question[];
  categories: Category[];
  progress: UserProgress;
  onSwipeRight: (questionId: number) => void;
  onSwipeLeft: (questionId: number) => void;
  maxQuestionsPerCategory?: number;
}

const STACK_OFFSET = 8;
const STACK_SCALE_DIFF = 0.04;

export default function CardStack({
  questions,
  categories,
  progress,
  onSwipeRight,
  onSwipeLeft,
  maxQuestionsPerCategory = 10,
}: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPremiumTeaser, setShowPremiumTeaser] = useState(false);

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (!progress.currentFilters.includes(q.categoryId)) return false;
      if (progress.answeredQuestions.includes(q.id)) return false;
      if (progress.savedForLater.includes(q.id)) return false;
      
      const shownCount = progress.shownQuestionsPerCategory[q.categoryId] || 0;
      if (shownCount >= maxQuestionsPerCategory && !q.isPremium) {
        return false;
      }
      return true;
    });
  }, [questions, progress, maxQuestionsPerCategory]);

  const visibleCards = filteredQuestions.slice(currentIndex, currentIndex + 4);

  const handleSwipeRight = () => {
    const currentQuestion = visibleCards[0];
    if (currentQuestion) {
      onSwipeRight(currentQuestion.id);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSwipeLeft = () => {
    const currentQuestion = visibleCards[0];
    if (currentQuestion) {
      onSwipeLeft(currentQuestion.id);
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (visibleCards.length === 0) {
    return (
      <motion.div 
        className="flex items-center justify-center h-[calc(100vh-180px)] max-h-[730px] min-h-[400px] text-muted-foreground text-center px-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div>
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-lg font-medium mb-2">No more questions!</p>
            <p className="text-sm">Check your saved questions or adjust your filters.</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-180px)] max-h-[730px] min-h-[400px] w-full" data-testid="card-stack">
      <AnimatePresence mode="popLayout">
        {visibleCards.map((question, index) => {
          const category = categories.find(c => c.id === question.categoryId);
          if (!category) return null;

          const isTop = index === 0;
          const stackPosition = index;
          
          const yOffset = stackPosition * STACK_OFFSET;
          const scale = 1 - (stackPosition * STACK_SCALE_DIFF);
          const opacity = 1 - (stackPosition * 0.1);

          if (isTop) {
            return (
              <SwipeCard
                key={`card-${question.id}`}
                question={question}
                category={category}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
                isTop={true}
                style={{ zIndex: 10 - index }}
              />
            );
          }

          return (
            <motion.div
              key={`card-${question.id}`}
              className="absolute w-full"
              initial={{ 
                scale: scale - STACK_SCALE_DIFF, 
                y: yOffset + STACK_OFFSET, 
                opacity: opacity - 0.15 
              }}
              animate={{ 
                scale, 
                y: yOffset, 
                opacity,
              }}
              exit={{ 
                scale: scale + STACK_SCALE_DIFF, 
                y: yOffset - STACK_OFFSET, 
                opacity: opacity + 0.1,
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 30,
                mass: 0.8,
              }}
              style={{ zIndex: 10 - index }}
            >
              <div
                className="rounded-2xl p-6 h-[calc(100vh-200px)] max-h-[670px] min-h-[380px] shadow-lg flex flex-col"
                style={{
                  background: `linear-gradient(135deg, ${category.colorPrimary} 0%, ${category.colorSecondary} 100%)`,
                }}
              >
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wide">
                    <span className="text-base">{category.icon}</span>
                    {category.name}
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-white text-2xl font-medium text-center leading-relaxed drop-shadow-sm">
                    {question.questionText}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {showPremiumTeaser && (
        <PremiumTeaser onClose={() => setShowPremiumTeaser(false)} />
      )}
    </div>
  );
}
