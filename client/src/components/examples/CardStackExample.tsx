import CardStack from '../CardStack';
import { defaultCategories, mockQuestions } from '@/lib/categories';
import { defaultProgress } from '@/lib/useLocalStorage';

export default function CardStackExample() {
  return (
    <div className="w-full max-w-[360px] mx-auto px-4">
      <CardStack
        questions={mockQuestions}
        categories={defaultCategories}
        progress={defaultProgress}
        onSwipeRight={(id) => console.log('Discussed:', id)}
        onSwipeLeft={(id) => console.log('Saved for later:', id)}
      />
    </div>
  );
}
