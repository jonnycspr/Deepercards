import { motion } from 'framer-motion';
import { Check, Clock, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Category, Question } from '@/lib/categories';

interface ConversationJournalProps {
  questions: Question[];
  categories: Category[];
  savedQuestions: number[];
  answeredQuestions: number[];
  onMoveToTop: (questionId: number) => void;
}

export default function ConversationJournal({
  questions,
  categories,
  savedQuestions,
  answeredQuestions,
  onMoveToTop,
}: ConversationJournalProps) {
  const savedItems = questions.filter(q => savedQuestions.includes(q.id));
  const answeredItems = questions.filter(q => answeredQuestions.includes(q.id));
  const totalQuestions = questions.length;
  const progressPercent = totalQuestions > 0 
    ? Math.round((answeredQuestions.length / totalQuestions) * 100) 
    : 0;

  const getCategoryForQuestion = (categoryId: number) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Overall Progress</span>
          <span className="text-sm font-medium">
            {answeredQuestions.length}/{totalQuestions} discussed
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="saved" className="relative" data-testid="tab-saved">
            Saved for Later
            {savedItems.length > 0 && (
              <span className="ml-2 min-w-[20px] h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center px-1.5">
                {savedItems.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="discussed" data-testid="tab-discussed">
            Discussed
            <span className="ml-2 text-muted-foreground">
              ({answeredItems.length})
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-2">
          {savedItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No saved questions yet</p>
              <p className="text-sm">Swipe left on a card to save it</p>
            </div>
          ) : (
            savedItems.map((question) => {
              const category = getCategoryForQuestion(question.categoryId);
              return (
                <motion.button
                  key={question.id}
                  onClick={() => onMoveToTop(question.id)}
                  className="w-full text-left p-4 rounded-lg bg-card border border-card-border flex items-start gap-3 group hover-elevate active-elevate-2"
                  whileTap={{ scale: 0.98 }}
                  data-testid={`saved-question-${question.id}`}
                >
                  <div
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{ backgroundColor: category?.colorPrimary }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {question.questionText}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category?.name}
                    </p>
                  </div>
                  <RotateCcw className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </motion.button>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="discussed" className="space-y-2">
          {answeredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Check className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No discussed questions yet</p>
              <p className="text-sm">Swipe right on a card to mark as discussed</p>
            </div>
          ) : (
            answeredItems.map((question) => {
              const category = getCategoryForQuestion(question.categoryId);
              return (
                <div
                  key={question.id}
                  className="w-full p-4 rounded-lg bg-muted/50 flex items-start gap-3 opacity-60"
                  data-testid={`discussed-question-${question.id}`}
                >
                  <div
                    className="w-1 self-stretch rounded-full flex-shrink-0 opacity-50"
                    style={{ backgroundColor: category?.colorPrimary }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {question.questionText}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category?.name}
                    </p>
                  </div>
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                </div>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
