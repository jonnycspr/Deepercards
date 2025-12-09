import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Pencil, GripVertical, Upload, Image } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ObjectUploader } from '@/components/ObjectUploader';
import type { Category } from '@shared/schema';
import type { UploadResult } from '@uppy/core';

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
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
        fillType: editCategory.fillType,
        gradientFrom: editCategory.gradientFrom,
        gradientTo: editCategory.gradientTo,
        gradientAngle: editCategory.gradientAngle,
        textColor: editCategory.textColor,
        borderColor: editCategory.borderColor,
        borderWidth: editCategory.borderWidth,
        imageUrl: editCategory.imageUrl,
        iconImageUrl: editCategory.iconImageUrl,
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

  const getCardBackground = (cat: Category) => {
    if (cat.fillType === 'gradient' && cat.gradientFrom && cat.gradientTo) {
      return `linear-gradient(${cat.gradientAngle || 180}deg, ${cat.gradientFrom} 0%, ${cat.gradientTo} 100%)`;
    }
    if (cat.fillType === 'image' && cat.imageUrl) {
      return `url(${cat.imageUrl})`;
    }
    return cat.colorPrimary;
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
                          <span className="text-xs text-muted-foreground">{category.fillType}</span>
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
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                          </DialogHeader>
                          {editCategory && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
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
                              </div>

                              <div className="space-y-4 border-t pt-4">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Card Fill</h3>
                                
                                <div className="space-y-2">
                                  <Label>Fill Type</Label>
                                  <Select
                                    value={editCategory.fillType}
                                    onValueChange={(value) =>
                                      setEditCategory({ ...editCategory, fillType: value })
                                    }
                                  >
                                    <SelectTrigger data-testid="select-fill-type">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="solid">Solid Color</SelectItem>
                                      <SelectItem value="gradient">Gradient</SelectItem>
                                      <SelectItem value="image">Image</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {editCategory.fillType === 'solid' && (
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
                                )}

                                {editCategory.fillType === 'gradient' && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Gradient From</Label>
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="color"
                                            value={editCategory.gradientFrom || editCategory.colorPrimary}
                                            onChange={(e) =>
                                              setEditCategory({ ...editCategory, gradientFrom: e.target.value })
                                            }
                                            className="w-10 h-10 rounded cursor-pointer border-0"
                                            data-testid="input-gradient-from"
                                          />
                                          <Input
                                            value={editCategory.gradientFrom || ''}
                                            onChange={(e) =>
                                              setEditCategory({ ...editCategory, gradientFrom: e.target.value })
                                            }
                                            placeholder="#000000"
                                            className="font-mono text-sm"
                                          />
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Gradient To</Label>
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="color"
                                            value={editCategory.gradientTo || editCategory.colorSecondary}
                                            onChange={(e) =>
                                              setEditCategory({ ...editCategory, gradientTo: e.target.value })
                                            }
                                            className="w-10 h-10 rounded cursor-pointer border-0"
                                            data-testid="input-gradient-to"
                                          />
                                          <Input
                                            value={editCategory.gradientTo || ''}
                                            onChange={(e) =>
                                              setEditCategory({ ...editCategory, gradientTo: e.target.value })
                                            }
                                            placeholder="#FFFFFF"
                                            className="font-mono text-sm"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Gradient Angle: {editCategory.gradientAngle || 180}°</Label>
                                      <Slider
                                        value={[editCategory.gradientAngle || 180]}
                                        onValueChange={([value]) =>
                                          setEditCategory({ ...editCategory, gradientAngle: value })
                                        }
                                        min={0}
                                        max={360}
                                        step={15}
                                        data-testid="slider-gradient-angle"
                                      />
                                    </div>
                                  </div>
                                )}

                                {editCategory.fillType === 'image' && (
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label>Upload Image</Label>
                                      <ObjectUploader
                                        maxNumberOfFiles={1}
                                        maxFileSize={10485760}
                                        onGetUploadParameters={async () => {
                                          const response = await apiRequest('POST', '/api/objects/upload');
                                          const data = await response.json();
                                          return {
                                            method: 'PUT' as const,
                                            url: data.uploadURL,
                                          };
                                        }}
                                        onComplete={async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                                          if (result.successful && result.successful.length > 0) {
                                            const uploadedUrl = result.successful[0].uploadURL;
                                            if (uploadedUrl && editCategory) {
                                              try {
                                                await apiRequest('PUT', `/api/admin/categories/${editCategory.id}/icon`, { iconUrl: uploadedUrl });
                                                await queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
                                                await queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
                                                setEditCategory({ ...editCategory, imageUrl: uploadedUrl });
                                                toast({ title: 'Image uploaded successfully!' });
                                              } catch (error) {
                                                toast({ title: 'Failed to save image', variant: 'destructive' });
                                              }
                                            }
                                          }
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <Upload className="w-4 h-4" />
                                          <span>Upload PNG Image</span>
                                        </div>
                                      </ObjectUploader>
                                    </div>
                                    
                                    <div className="text-xs text-muted-foreground text-center">or</div>
                                    
                                    <div className="space-y-2">
                                      <Label>Image URL (manual)</Label>
                                      <Input
                                        value={editCategory.imageUrl || ''}
                                        onChange={(e) =>
                                          setEditCategory({ ...editCategory, imageUrl: e.target.value })
                                        }
                                        placeholder="https://example.com/image.jpg"
                                        data-testid="input-image-url"
                                      />
                                    </div>
                                    
                                    {editCategory.imageUrl && (
                                      <div className="space-y-2">
                                        <Label>Current Image Preview</Label>
                                        <div className="w-20 h-20 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                                          {editCategory.imageUrl.startsWith('/objects/') ? (
                                            <img 
                                              src={editCategory.imageUrl} 
                                              alt="Category icon"
                                              className="w-full h-full object-cover"
                                            />
                                          ) : editCategory.imageUrl.startsWith('http') ? (
                                            <img 
                                              src={editCategory.imageUrl} 
                                              alt="Category icon"
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <Image className="w-8 h-8 text-muted-foreground" />
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="space-y-4 border-t pt-4">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Icon Image (Top-Left Placeholder)</h3>
                                <p className="text-xs text-muted-foreground">This image appears in the small placeholder on the top-left of the card</p>
                                
                                <div className="space-y-2">
                                  <Label>Upload Icon Image</Label>
                                  <ObjectUploader
                                    maxNumberOfFiles={1}
                                    maxFileSize={5242880}
                                    onGetUploadParameters={async () => {
                                      const response = await apiRequest('POST', '/api/objects/upload');
                                      const data = await response.json();
                                      return {
                                        method: 'PUT' as const,
                                        url: data.uploadURL,
                                      };
                                    }}
                                    onComplete={async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                                      if (result.successful && result.successful.length > 0) {
                                        const uploadedUrl = result.successful[0].uploadURL;
                                        if (uploadedUrl && editCategory) {
                                          setEditCategory({ ...editCategory, iconImageUrl: uploadedUrl });
                                          toast({ title: 'Icon image uploaded!' });
                                        }
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Upload className="w-4 h-4" />
                                      <span>Upload Icon PNG</span>
                                    </div>
                                  </ObjectUploader>
                                </div>
                                
                                <div className="text-xs text-muted-foreground text-center">or enter URL manually</div>
                                
                                <div className="space-y-2">
                                  <Label>Icon Image URL</Label>
                                  <Input
                                    value={editCategory.iconImageUrl || ''}
                                    onChange={(e) =>
                                      setEditCategory({ ...editCategory, iconImageUrl: e.target.value })
                                    }
                                    placeholder="https://example.com/icon.png"
                                    data-testid="input-icon-image-url"
                                  />
                                </div>
                                
                                {editCategory.iconImageUrl && (
                                  <div className="space-y-2">
                                    <Label>Icon Preview</Label>
                                    <div className="w-16 h-20 rounded-[20px] border overflow-hidden bg-muted flex items-center justify-center">
                                      <img 
                                        src={editCategory.iconImageUrl} 
                                        alt="Icon preview"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-4 border-t pt-4">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Text Color</h3>
                                <div className="space-y-2">
                                  <Label>Text Color</Label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={editCategory.textColor || '#FFFFFF'}
                                      onChange={(e) =>
                                        setEditCategory({ ...editCategory, textColor: e.target.value })
                                      }
                                      className="w-10 h-10 rounded cursor-pointer border-0"
                                      data-testid="input-text-color"
                                    />
                                    <Input
                                      value={editCategory.textColor || '#FFFFFF'}
                                      onChange={(e) =>
                                        setEditCategory({ ...editCategory, textColor: e.target.value })
                                      }
                                      className="font-mono text-sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4 border-t pt-4">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Card Border</h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Border Color</Label>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="color"
                                        value={editCategory.borderColor || '#FFFFFF'}
                                        onChange={(e) =>
                                          setEditCategory({ ...editCategory, borderColor: e.target.value })
                                        }
                                        className="w-10 h-10 rounded cursor-pointer border-0"
                                        data-testid="input-border-color"
                                      />
                                      <Input
                                        value={editCategory.borderColor || '#FFFFFF'}
                                        onChange={(e) =>
                                          setEditCategory({ ...editCategory, borderColor: e.target.value })
                                        }
                                        className="font-mono text-sm"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Border Width: {editCategory.borderWidth || 8}px</Label>
                                    <Slider
                                      value={[editCategory.borderWidth || 8]}
                                      onValueChange={([value]) =>
                                        setEditCategory({ ...editCategory, borderWidth: value })
                                      }
                                      min={0}
                                      max={20}
                                      step={1}
                                      data-testid="slider-border-width"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4 border-t pt-4">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Card Preview</h3>
                                <div
                                  className="rounded-[32px] p-2"
                                  style={{
                                    backgroundColor: editCategory.borderColor || '#FFFFFF',
                                    padding: `${editCategory.borderWidth || 8}px`,
                                  }}
                                >
                                  <div
                                    className="rounded-[24px] p-6 min-h-[200px] flex flex-col relative"
                                    style={{
                                      background: getCardBackground(editCategory),
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center',
                                    }}
                                  >
                                    {/* Top section with icon and category name */}
                                    <div className="flex items-start justify-between mb-4">
                                      <div 
                                        className="w-10 h-12 rounded-[12px] flex items-center justify-center overflow-hidden"
                                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
                                      >
                                        {editCategory.iconImageUrl ? (
                                          <img 
                                            src={editCategory.iconImageUrl} 
                                            alt="Icon"
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-5 h-5 rounded-full bg-white/30" />
                                        )}
                                      </div>
                                      <p 
                                        className="text-sm font-medium text-right"
                                        style={{ 
                                          color: editCategory.textColor || '#FFFFFF',
                                          fontFamily: "'DM Sans', sans-serif",
                                        }}
                                      >
                                        {editCategory.name}
                                      </p>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-center">
                                      <p 
                                        className="text-lg font-semibold text-center"
                                        style={{ 
                                          color: editCategory.textColor || '#FFFFFF',
                                          fontFamily: "'DM Sans', sans-serif",
                                        }}
                                      >
                                        Sample question text would appear here...
                                      </p>
                                    </div>
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
              <CardTitle>Quick Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {editCategory ? (
                <div
                  className="rounded-[32px]"
                  style={{
                    backgroundColor: editCategory.borderColor || '#FFFFFF',
                    padding: `${editCategory.borderWidth || 8}px`,
                  }}
                >
                  <div
                    className="rounded-[24px] p-6 min-h-[300px] flex flex-col relative"
                    style={{
                      background: getCardBackground(editCategory),
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Top section with icon and category name */}
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-14 h-[70px] rounded-[16px] flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
                      >
                        {editCategory.iconImageUrl ? (
                          <img 
                            src={editCategory.iconImageUrl} 
                            alt="Icon"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-white/30" />
                        )}
                      </div>
                      <p 
                        className="text-lg font-medium text-right"
                        style={{ 
                          color: editCategory.textColor || '#FFFFFF',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {editCategory.name}
                      </p>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <p 
                        className="text-2xl font-semibold text-center max-w-[280px]"
                        style={{ 
                          color: editCategory.textColor || '#FFFFFF',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        Sample question text would appear here...
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl p-6 min-h-[300px] flex items-center justify-center bg-muted text-muted-foreground">
                  Click edit on a category to see preview
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
