import { useMemo, useCallback, useState } from 'react';
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

const STACK_OFFSET = 6;
const STACK_SCALE_DIFF = 0.035;

export default function CardStack({
  questions,
  categories,
  progress,
  onSwipeRight,
  onSwipeLeft,
  maxQuestionsPerCategory = 10,
}: CardStackProps) {
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

  // Show up to 4 cards from the filtered list - no index needed since
  // filteredQuestions already excludes answered/saved cards
  const visibleCards = filteredQuestions.slice(0, 4);

  const handleSwipeRight = useCallback(() => {
    const currentQuestion = visibleCards[0];
    if (currentQuestion) {
      onSwipeRight(currentQuestion.id);
    }
  }, [visibleCards, onSwipeRight]);

  const handleSwipeLeft = useCallback(() => {
    const currentQuestion = visibleCards[0];
    if (currentQuestion) {
      onSwipeLeft(currentQuestion.id);
    }
  }, [visibleCards, onSwipeLeft]);

  if (visibleCards.length === 0) {
    return (
      <motion.div 
        className="flex items-center justify-center h-full text-muted-foreground text-center px-8"
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
    <div className="card-stack-container relative h-full w-full flex flex-col" data-testid="card-stack" style={{ borderWidth: 0, borderStyle: 'none', borderColor: 'rgba(0, 0, 0, 0)', borderImage: 'none' }}>
      <AnimatePresence initial={false}>
        {visibleCards.map((question, index) => {
          const category = categories.find(c => c.id === question.categoryId);
          if (!category) return null;

          const isTop = index === 0;
          const stackPosition = index;
          
          const yOffset = stackPosition * STACK_OFFSET;
          const cardScale = 1 - (stackPosition * STACK_SCALE_DIFF);

          return (
            <motion.div
              key={question.id}
              className="card-stack-item absolute inset-x-0 h-full"
              initial={{ 
                scale: cardScale - STACK_SCALE_DIFF,
                y: yOffset + STACK_OFFSET,
              }}
              animate={{ 
                scale: cardScale,
                y: yOffset,
              }}
              exit={{ 
                opacity: 0,
              }}
              transition={{ 
                type: 'spring',
                stiffness: 350,
                damping: 28,
                mass: 0.8,
              }}
              style={{ 
                zIndex: 10 - index,
                transformOrigin: 'center bottom',
              }}
            >
              <SwipeCard
                question={question}
                category={category}
                onSwipeRight={isTop ? handleSwipeRight : undefined}
                onSwipeLeft={isTop ? handleSwipeLeft : undefined}
                isTop={isTop}
              />
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
