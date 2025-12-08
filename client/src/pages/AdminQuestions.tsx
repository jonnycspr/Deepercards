import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft,
  Plus, 
  Pencil, 
  Trash2,
  Upload,
  Search
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Question, Category } from '@shared/schema';

export default function AdminQuestions() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [csvData, setCsvData] = useState('');
  const [isCsvOpen, setIsCsvOpen] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    categoryId: '',
    isPremium: false,
  });

  const { data: session } = useQuery<{ isAdmin: boolean }>({
    queryKey: ['/api/admin/session'],
  });

  const { data: questions, isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ['/api/admin/questions'],
    enabled: !!session?.isAdmin,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/admin/categories'],
    enabled: !!session?.isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: (data: { questionText: string; categoryId: number; isPremium: boolean }) =>
      apiRequest('POST', '/api/admin/questions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/questions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
      toast({ title: 'Question created successfully' });
      setIsAddOpen(false);
      setNewQuestion({ questionText: '', categoryId: '', isPremium: false });
    },
    onError: () => {
      toast({ title: 'Failed to create question', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Question> }) =>
      apiRequest('PUT', `/api/admin/questions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/questions'] });
      toast({ title: 'Question updated successfully' });
      setEditQuestion(null);
    },
    onError: () => {
      toast({ title: 'Failed to update question', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/questions/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/questions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
      toast({ title: 'Question deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete question', variant: 'destructive' });
    },
  });

  const bulkMutation = useMutation({
    mutationFn: (questions: Array<{ questionText: string; categoryId: number; isPremium: boolean }>) =>
      apiRequest('POST', '/api/admin/questions/bulk', { questions }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/questions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
      toast({ title: `${data.created} questions imported successfully` });
      setIsCsvOpen(false);
      setCsvData('');
    },
    onError: () => {
      toast({ title: 'Failed to import questions', variant: 'destructive' });
    },
  });

  if (!session?.isAdmin) {
    setLocation('/admin');
    return null;
  }

  const handleAddQuestion = () => {
    if (!newQuestion.questionText || !newQuestion.categoryId) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    createMutation.mutate({
      questionText: newQuestion.questionText,
      categoryId: parseInt(newQuestion.categoryId, 10),
      isPremium: newQuestion.isPremium,
    });
  };

  const handleUpdateQuestion = () => {
    if (!editQuestion) return;
    updateMutation.mutate({
      id: editQuestion.id,
      data: {
        questionText: editQuestion.questionText,
        categoryId: editQuestion.categoryId,
        isPremium: editQuestion.isPremium,
      },
    });
  };

  const handleCsvImport = () => {
    const lines = csvData.trim().split('\n');
    const questions: Array<{ questionText: string; categoryId: number; isPremium: boolean }> = [];

    for (const line of lines) {
      const parts = line.split(',');
      if (parts.length >= 2) {
        const questionText = parts[0].trim().replace(/^"|"$/g, '');
        const categoryName = parts[1].trim().replace(/^"|"$/g, '');
        const category = categories?.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
        
        if (category && questionText) {
          questions.push({
            questionText,
            categoryId: category.id,
            isPremium: false,
          });
        }
      }
    }

    if (questions.length === 0) {
      toast({ title: 'No valid questions found in CSV', variant: 'destructive' });
      return;
    }

    bulkMutation.mutate(questions);
  };

  const filteredQuestions = questions?.filter(q => {
    const matchesSearch = q.questionText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || q.categoryId === parseInt(filterCategory, 10);
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: number) => {
    return categories?.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const getCategoryColor = (categoryId: number) => {
    return categories?.find(c => c.id === categoryId)?.colorPrimary || '#888';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/admin/dashboard')} data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Questions Management</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
            <CardTitle>All Questions</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Dialog open={isCsvOpen} onOpenChange={setIsCsvOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" data-testid="button-import-csv">
                    <Upload className="w-4 h-4 mr-2" />
                    Import CSV
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Questions from CSV</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Format: question_text, category_name (one per line)
                    </p>
                    <Textarea
                      placeholder={`"What is your favorite scripture?", "Faith & Spirituality"\n"How do you handle stress?", "Communication"`}
                      value={csvData}
                      onChange={(e) => setCsvData(e.target.value)}
                      rows={8}
                      data-testid="textarea-csv"
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleCsvImport} disabled={bulkMutation.isPending} data-testid="button-import">
                      {bulkMutation.isPending ? 'Importing...' : 'Import'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-question">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Question</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question Text</Label>
                      <Textarea
                        value={newQuestion.questionText}
                        onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                        placeholder="Enter your question..."
                        data-testid="input-question-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={newQuestion.categoryId}
                        onValueChange={(v) => setNewQuestion({ ...newQuestion, categoryId: v })}
                      >
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.icon} {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newQuestion.isPremium}
                        onCheckedChange={(c) => setNewQuestion({ ...newQuestion, isPremium: c })}
                        data-testid="switch-premium"
                      />
                      <Label>Premium Question</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddQuestion} disabled={createMutation.isPending} data-testid="button-save">
                      {createMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[200px]" data-testid="select-filter-category">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {questionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredQuestions?.map((question) => (
                  <div
                    key={question.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                    data-testid={`question-row-${question.id}`}
                  >
                    <div
                      className="w-1 self-stretch rounded-full flex-shrink-0"
                      style={{ backgroundColor: getCategoryColor(question.categoryId) }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{question.questionText}</p>
                      <p className="text-xs text-muted-foreground">
                        {getCategoryName(question.categoryId)}
                        {question.isPremium && ' • Premium'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditQuestion(question)}
                            data-testid={`button-edit-${question.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Question</DialogTitle>
                          </DialogHeader>
                          {editQuestion && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Question Text</Label>
                                <Textarea
                                  value={editQuestion.questionText}
                                  onChange={(e) =>
                                    setEditQuestion({ ...editQuestion, questionText: e.target.value })
                                  }
                                  data-testid="input-edit-question-text"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                  value={editQuestion.categoryId.toString()}
                                  onValueChange={(v) =>
                                    setEditQuestion({ ...editQuestion, categoryId: parseInt(v, 10) })
                                  }
                                >
                                  <SelectTrigger data-testid="select-edit-category">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories?.map((cat) => (
                                      <SelectItem key={cat.id} value={cat.id.toString()}>
                                        {cat.icon} {cat.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={editQuestion.isPremium}
                                  onCheckedChange={(c) =>
                                    setEditQuestion({ ...editQuestion, isPremium: c })
                                  }
                                  data-testid="switch-edit-premium"
                                />
                                <Label>Premium Question</Label>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleUpdateQuestion} disabled={updateMutation.isPending} data-testid="button-update">
                              {updateMutation.isPending ? 'Updating...' : 'Update'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(question.id)}
                        data-testid={`button-delete-${question.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredQuestions?.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No questions found</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
