import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
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

  const handleSwipeRight = () => {
    if (currentQuestion) {
      onSwipeRight(currentQuestion.id);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    }
  };

  const handleSwipeLeft = () => {
    if (currentQuestion) {
      onSwipeLeft(currentQuestion.id);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground text-center px-8">
        <div>
          <p className="text-lg font-medium mb-2">No more questions!</p>
          <p className="text-sm">Check your saved questions or adjust your filters.</p>
        </div>
      </div>
    );
  }

  const currentCategory = categories.find(c => c.id === currentQuestion.categoryId);
  const nextCategory = nextQuestion ? categories.find(c => c.id === nextQuestion.categoryId) : null;

  if (!currentCategory) return null;

  return (
    <div className="relative h-[400px] w-full">
      <AnimatePresence>
        {nextQuestion && nextCategory && (
          <SwipeCard
            key={`next-${nextQuestion.id}`}
            question={nextQuestion}
            category={nextCategory}
            onSwipeRight={() => {}}
            onSwipeLeft={() => {}}
            isTop={false}
            style={{
              transform: 'scale(0.95)',
              top: '12px',
              zIndex: 0,
            }}
          />
        )}
        <SwipeCard
          key={`current-${currentQuestion.id}`}
          question={currentQuestion}
          category={currentCategory}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          isTop={true}
          style={{ zIndex: 1 }}
        />
      </AnimatePresence>

      {showPremiumTeaser && (
        <PremiumTeaser onClose={() => setShowPremiumTeaser(false)} />
      )}
    </div>
  );
}
