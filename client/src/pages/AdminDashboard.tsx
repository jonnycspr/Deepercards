import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderOpen, 
  LogOut,
  Plus
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface DashboardData {
  totalQuestions: number;
  totalCategories: number;
  categoryStats: Array<{
    category: {
      id: number;
      name: string;
      icon: string;
      colorPrimary: string;
    };
    count: number;
  }>;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: session, isLoading: sessionLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ['/api/admin/session'],
  });

  const { data: dashboard, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/admin/dashboard'],
    enabled: !!session?.isAdmin,
  });

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/admin/logout', {});
      queryClient.invalidateQueries({ queryKey: ['/api/admin/session'] });
      toast({ title: 'Logged out successfully' });
      setLocation('/admin');
    } catch (error) {
      toast({ title: 'Logout failed', variant: 'destructive' });
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-8 w-32 mx-auto mb-2" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.isAdmin) {
    setLocation('/admin');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Deeper Admin</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setLocation('/admin/questions')} data-testid="nav-questions">
              <MessageSquare className="w-4 h-4 mr-2" />
              Questions
            </Button>
            <Button variant="outline" onClick={() => setLocation('/admin/categories')} data-testid="nav-categories">
              <FolderOpen className="w-4 h-4 mr-2" />
              Categories
            </Button>
            <Button variant="ghost" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold" data-testid="text-total-questions">
                  {dashboard?.totalQuestions || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <FolderOpen className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold" data-testid="text-total-categories">
                  {dashboard?.totalCategories || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <Plus className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setLocation('/admin/questions')} 
                size="sm"
                data-testid="button-add-question"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Questions by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard?.categoryStats.map((stat) => (
                  <div
                    key={stat.category.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    data-testid={`category-stat-${stat.category.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: stat.category.colorPrimary }}
                      >
                        {stat.category.icon}
                      </div>
                      <span className="font-medium">{stat.category.name}</span>
                    </div>
                    <span className="text-muted-foreground">{stat.count} questions</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
