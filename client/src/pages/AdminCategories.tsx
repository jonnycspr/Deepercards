import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Pencil, GripVertical } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@shared/schema';

export default function AdminCategories() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const { data: session } = useQuery<{ isAdmin: boolean }>({
    queryKey: ['/api/admin/session'],
  });

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/admin/categories'],
    enabled: !!session?.isAdmin,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) =>
      apiRequest('PUT', `/api/admin/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({ title: 'Category updated successfully' });
      setEditCategory(null);
    },
    onError: () => {
      toast({ title: 'Failed to update category', variant: 'destructive' });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: ({ id, order }: { id: number; order: number }) =>
      apiRequest('PUT', `/api/admin/categories/${id}/order`, { order }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    },
  });

  if (!session?.isAdmin) {
    setLocation('/admin');
    return null;
  }

  const handleUpdateCategory = () => {
    if (!editCategory) return;
    updateMutation.mutate({
      id: editCategory.id,
      data: {
        name: editCategory.name,
        icon: editCategory.icon,
        colorPrimary: editCategory.colorPrimary,
        colorSecondary: editCategory.colorSecondary,
      },
    });
  };

  const handleMoveUp = (category: Category, index: number) => {
    if (index === 0 || !categories) return;
    const prevCategory = categories[index - 1];
    reorderMutation.mutate({ id: category.id, order: prevCategory.order });
    reorderMutation.mutate({ id: prevCategory.id, order: category.order });
  };

  const handleMoveDown = (category: Category, index: number) => {
    if (!categories || index === categories.length - 1) return;
    const nextCategory = categories[index + 1];
    reorderMutation.mutate({ id: category.id, order: nextCategory.order });
    reorderMutation.mutate({ id: nextCategory.id, order: category.order });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/admin/dashboard')} data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Categories Management</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>All Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {categories?.map((category, index) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                      data-testid={`category-row-${category.id}`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => handleMoveUp(category, index)}
                          disabled={index === 0}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                          data-testid={`button-move-up-${category.id}`}
                        >
                          <GripVertical className="w-4 h-4 rotate-90" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(category, index)}
                          disabled={index === (categories?.length || 0) - 1}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                          data-testid={`button-move-down-${category.id}`}
                        >
                          <GripVertical className="w-4 h-4 rotate-90" />
                        </button>
                      </div>
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0"
                        style={{ backgroundColor: category.colorPrimary }}
                      >
                        {category.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{category.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: category.colorPrimary }}
                            title="Primary color"
                          />
                          <div
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: category.colorSecondary }}
                            title="Secondary color"
                          />
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditCategory(category)}
                            data-testid={`button-edit-${category.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                          </DialogHeader>
                          {editCategory && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                  value={editCategory.name}
                                  onChange={(e) =>
                                    setEditCategory({ ...editCategory, name: e.target.value })
                                  }
                                  data-testid="input-edit-name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Icon (emoji)</Label>
                                <Input
                                  value={editCategory.icon}
                                  onChange={(e) =>
                                    setEditCategory({ ...editCategory, icon: e.target.value })
                                  }
                                  data-testid="input-edit-icon"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Primary Color</Label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={editCategory.colorPrimary}
                                      onChange={(e) =>
                                        setEditCategory({ ...editCategory, colorPrimary: e.target.value })
                                      }
                                      className="w-10 h-10 rounded cursor-pointer border-0"
                                      data-testid="input-edit-primary-color"
                                    />
                                    <Input
                                      value={editCategory.colorPrimary}
                                      onChange={(e) =>
                                        setEditCategory({ ...editCategory, colorPrimary: e.target.value })
                                      }
                                      className="font-mono text-sm"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Secondary Color</Label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={editCategory.colorSecondary}
                                      onChange={(e) =>
                                        setEditCategory({ ...editCategory, colorSecondary: e.target.value })
                                      }
                                      className="w-10 h-10 rounded cursor-pointer border-0"
                                      data-testid="input-edit-secondary-color"
                                    />
                                    <Input
                                      value={editCategory.colorSecondary}
                                      onChange={(e) =>
                                        setEditCategory({ ...editCategory, colorSecondary: e.target.value })
                                      }
                                      className="font-mono text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleUpdateCategory} disabled={updateMutation.isPending} data-testid="button-update">
                              {updateMutation.isPending ? 'Updating...' : 'Update'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {editCategory ? (
                <div
                  className="rounded-2xl p-6 min-h-[200px] flex flex-col"
                  style={{
                    background: `linear-gradient(135deg, ${editCategory.colorPrimary} 0%, ${editCategory.colorSecondary} 100%)`,
                  }}
                >
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wide">
                      <span>{editCategory.icon}</span>
                      {editCategory.name}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-white text-xl font-medium text-center">
                      Sample question text would appear here...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl p-6 min-h-[200px] flex items-center justify-center bg-muted text-muted-foreground">
                  Select a category to preview
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
