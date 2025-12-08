import SwipeCard from '../SwipeCard';
import { defaultCategories, mockQuestions } from '@/lib/categories';

export default function SwipeCardExample() {
  const question = mockQuestions[0];
  const category = defaultCategories.find(c => c.id === question.categoryId)!;

  return (
    <div className="relative h-[400px] w-full max-w-[360px] mx-auto">
      <SwipeCard
        question={question}
        category={category}
        onSwipeRight={() => console.log('Swiped right - discussed')}
        onSwipeLeft={() => console.log('Swiped left - saved for later')}
        isTop={true}
      />
    </div>
  );
}
