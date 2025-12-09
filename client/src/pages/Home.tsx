import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { AnimatePresence, motion } from 'framer-motion';
import { Grid3X3, BookOpen, X } from 'lucide-react';
import CardStack from '@/components/CardStack';
import CategoryFilter from '@/components/CategoryFilter';
import ConversationJournal from '@/components/ConversationJournal';
import Onboarding from '@/components/Onboarding';
import { useLocalStorage, defaultProgress, UserProgress } from '@/lib/useLocalStorage';
import type { Category, Question } from '@shared/schema';
import deeperLogo from '@assets/Light_Blue_Deeper_1765293060014.png';

type ActivePanel = 'cards' | 'filter' | 'journal';

export default function Home() {
  const [activePanel, setActivePanel] = useState<ActivePanel>('cards');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [progress, setProgress] = useLocalStorage<UserProgress>('deeper-progress', defaultProgress);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: questions = [], isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ['/api/questions'],
  });

  useEffect(() => {
    const hasSeenOnboarding = Cookies.get('deeper-onboarding-complete');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    Cookies.set('deeper-onboarding-complete', 'true', { expires: 365 });
    setShowOnboarding(false);
  };

  const handleSwipeRight = (questionId: number) => {
    setProgress(prev => ({
      ...prev,
      answeredQuestions: [...prev.answeredQuestions, questionId],
    }));
  };

  const handleSwipeLeft = (questionId: number) => {
    setProgress(prev => ({
      ...prev,
      savedForLater: [...prev.savedForLater, questionId],
    }));
  };

  const handleToggleCategory = (categoryId: number) => {
    setProgress(prev => ({
      ...prev,
      currentFilters: prev.currentFilters.includes(categoryId)
        ? prev.currentFilters.filter(id => id !== categoryId)
        : [...prev.currentFilters, categoryId],
    }));
  };

  const handleShowAllCategories = () => {
    setProgress(prev => ({
      ...prev,
      currentFilters: categories.map(c => c.id),
    }));
  };

  const handleClearAllCategories = () => {
    setProgress(prev => ({
      ...prev,
      currentFilters: [],
    }));
  };

  const handleMoveToTop = (questionId: number) => {
    setProgress(prev => ({
      ...prev,
      savedForLater: prev.savedForLater.filter(id => id !== questionId),
    }));
    setActivePanel('cards');
  };

  useEffect(() => {
    if (categories.length > 0 && progress.currentFilters.length === 0) {
      setProgress(prev => ({
        ...prev,
        currentFilters: categories.map(c => c.id),
      }));
    }
  }, [categories]);

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const isLoading = categoriesLoading || questionsLoading;

  const transformedCategories = categories.map(c => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    colorPrimary: c.colorPrimary,
    colorSecondary: c.colorSecondary,
    order: c.order,
    fillType: c.fillType,
    gradientFrom: c.gradientFrom,
    gradientTo: c.gradientTo,
    gradientAngle: c.gradientAngle,
    textColor: c.textColor,
    borderColor: c.borderColor,
    borderWidth: c.borderWidth,
    imageUrl: c.imageUrl,
  }));

  const transformedQuestions = questions.map(q => ({
    id: q.id,
    questionText: q.questionText,
    categoryId: q.categoryId,
    isPremium: q.isPremium,
  }));

  return (
    <div 
      className="min-h-[100dvh] relative overflow-hidden"
      style={{ 
        background: '#BDE1FF',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="max-w-[480px] mx-auto h-[100dvh] flex flex-col relative">
        <AnimatePresence mode="wait">
          {activePanel === 'cards' && (
            <motion.div
              key="cards"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex-1 flex flex-col pt-6 pb-24 px-4"
            >
              <div className="flex justify-center mb-4">
                <img 
                  src={deeperLogo} 
                  alt="Deeper" 
                  className="h-16 object-contain"
                />
              </div>
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <motion.div 
                    className="text-gray-600 text-lg font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Loading cards...
                  </motion.div>
                </div>
              ) : (
                <CardStack
                  questions={transformedQuestions}
                  categories={transformedCategories}
                  progress={progress}
                  onSwipeRight={handleSwipeRight}
                  onSwipeLeft={handleSwipeLeft}
                />
              )}
            </motion.div>
          )}

          {activePanel === 'filter' && (
            <motion.div
              key="filter"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex-1 overflow-auto pb-24"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Topics</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActivePanel('cards')}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                    data-testid="button-close-filter"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
                <CategoryFilter
                  categories={transformedCategories}
                  selectedCategories={progress.currentFilters}
                  onToggleCategory={handleToggleCategory}
                  onShowAll={handleShowAllCategories}
                  onClearAll={handleClearAllCategories}
                />
              </div>
            </motion.div>
          )}

          {activePanel === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex-1 overflow-auto pb-24"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Journal</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActivePanel('cards')}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                    data-testid="button-close-journal"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
                <ConversationJournal
                  questions={transformedQuestions}
                  categories={transformedCategories}
                  savedQuestions={progress.savedForLater}
                  answeredQuestions={progress.answeredQuestions}
                  onMoveToTop={handleMoveToTop}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activePanel === 'cards' && (
          <>
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePanel('filter')}
              className="fixed bottom-6 left-6 w-16 h-16 rounded-full bg-white flex items-center justify-center z-50"
              data-testid="button-topics"
            >
              <Grid3X3 className="w-7 h-7 text-gray-700" />
            </motion.button>

            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 400, damping: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePanel('journal')}
              className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-white flex items-center justify-center z-50"
              data-testid="button-journal"
            >
              <BookOpen className="w-7 h-7 text-gray-700" />
              {progress.savedForLater.length > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {progress.savedForLater.length}
                </span>
              )}
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
