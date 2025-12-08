import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { AnimatePresence, motion } from 'framer-motion';
import CardStack from '@/components/CardStack';
import BottomNav from '@/components/BottomNav';
import CategoryFilter from '@/components/CategoryFilter';
import ConversationJournal from '@/components/ConversationJournal';
import Onboarding from '@/components/Onboarding';
import { useLocalStorage, defaultProgress, UserProgress } from '@/lib/useLocalStorage';
import type { Category, Question } from '@shared/schema';

type NavTab = 'home' | 'filter' | 'journal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
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
    setActiveTab('home');
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
  }));

  const transformedQuestions = questions.map(q => ({
    id: q.id,
    questionText: q.questionText,
    categoryId: q.categoryId,
    isPremium: q.isPremium,
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-[480px] mx-auto">
        <header className="px-4 py-6 text-center">
          <h1 className="text-2xl font-bold text-primary">Deeper</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeTab === 'home' && 'Swipe to explore'}
            {activeTab === 'filter' && 'Choose your categories'}
            {activeTab === 'journal' && 'Your conversation history'}
          </p>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="px-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-muted-foreground">Loading questions...</div>
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
              
              <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>Swipe right for "discussed"</p>
                <p>Swipe left for "save for later"</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'filter' && (
            <motion.div
              key="filter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CategoryFilter
                categories={transformedCategories}
                selectedCategories={progress.currentFilters}
                onToggleCategory={handleToggleCategory}
                onShowAll={handleShowAllCategories}
                onClearAll={handleClearAllCategories}
              />
            </motion.div>
          )}

          {activeTab === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ConversationJournal
                questions={transformedQuestions}
                categories={transformedCategories}
                savedQuestions={progress.savedForLater}
                answeredQuestions={progress.answeredQuestions}
                onMoveToTop={handleMoveToTop}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={progress.savedForLater.length}
      />
    </div>
  );
}
