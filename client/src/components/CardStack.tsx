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

  const currentQuestion = filteredQuestions[currentIndex];
  const nextQuestion = filteredQuestions[currentIndex + 1];
  const thirdQuestion = filteredQuestions[currentIndex + 2];

  const handleSwipeRight = () => {
    if (currentQuestion) {
      onSwipeRight(currentQuestion.id);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSwipeLeft = () => {
    if (currentQuestion) {
      onSwipeLeft(currentQuestion.id);
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (!currentQuestion) {
    return (
      <motion.div 
        className="flex items-center justify-center h-[400px] text-muted-foreground text-center px-8"
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

  const currentCategory = categories.find(c => c.id === currentQuestion.categoryId);
  const nextCategory = nextQuestion ? categories.find(c => c.id === nextQuestion.categoryId) : null;
  const thirdCategory = thirdQuestion ? categories.find(c => c.id === thirdQuestion.categoryId) : null;

  if (!currentCategory) return null;

  return (
    <div className="relative h-[730px] w-full" data-testid="card-stack">
      <AnimatePresence mode="popLayout">
        {thirdQuestion && thirdCategory && (
          <motion.div
            key={`third-${thirdQuestion.id}`}
            className="absolute w-full"
            initial={{ scale: 0.85, y: 24, opacity: 0.5 }}
            animate={{ scale: 0.9, y: 24, opacity: 0.7 }}
            exit={{ scale: 0.95, y: 12, opacity: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ zIndex: 0 }}
          >
            <div
              className="rounded-2xl p-8 min-h-[670px] shadow-md"
              style={{
                background: `linear-gradient(135deg, ${thirdCategory.colorPrimary} 0%, ${thirdCategory.colorSecondary} 100%)`,
              }}
            />
          </motion.div>
        )}
        
        {nextQuestion && nextCategory && (
          <motion.div
            key={`next-${nextQuestion.id}`}
            className="absolute w-full"
            initial={{ scale: 0.9, y: 24, opacity: 0.7 }}
            animate={{ scale: 0.95, y: 12, opacity: 0.9 }}
            exit={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ zIndex: 1 }}
          >
            <div
              className="rounded-2xl p-8 min-h-[670px] shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${nextCategory.colorPrimary} 0%, ${nextCategory.colorSecondary} 100%)`,
              }}
            />
          </motion.div>
        )}
        
        <SwipeCard
          key={`current-${currentQuestion.id}`}
          question={currentQuestion}
          category={currentCategory}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          isTop={true}
          style={{ zIndex: 2 }}
        />
      </AnimatePresence>

      {showPremiumTeaser && (
        <PremiumTeaser onClose={() => setShowPremiumTeaser(false)} />
      )}
    </div>
  );
}
