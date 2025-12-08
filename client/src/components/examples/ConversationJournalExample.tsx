import ConversationJournal from '../ConversationJournal';
import { defaultCategories, mockQuestions } from '@/lib/categories';

export default function ConversationJournalExample() {
  return (
    <div className="w-full max-w-[360px] mx-auto bg-background rounded-xl">
      <ConversationJournal
        questions={mockQuestions}
        categories={defaultCategories}
        savedQuestions={[3, 5, 7]}
        answeredQuestions={[1, 2]}
        onMoveToTop={(id) => console.log('Move to top:', id)}
      />
    </div>
  );
}
