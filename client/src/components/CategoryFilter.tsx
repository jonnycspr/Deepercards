import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Category } from '@/lib/categories';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: number[];
  onToggleCategory: (categoryId: number) => void;
  onShowAll: () => void;
  onClearAll: () => void;
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  onToggleCategory,
  onShowAll,
  onClearAll,
}: CategoryFilterProps) {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold">Categories</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShowAll}
            data-testid="button-show-all"
          >
            Show All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            data-testid="button-clear-all"
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <motion.button
              key={category.id}
              onClick={() => onToggleCategory(category.id)}
              className="relative aspect-square rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${category.colorPrimary} 0%, ${category.colorSecondary} 100%)`
                  : undefined,
              }}
              whileTap={{ scale: 0.95 }}
              data-testid={`category-${category.id}`}
            >
              {!isSelected && (
                <div
                  className="absolute inset-0 rounded-xl border-2 border-muted"
                />
              )}
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}

              <span className="text-2xl">{category.icon}</span>
              <span
                className={`text-xs font-medium text-center leading-tight ${
                  isSelected ? 'text-white' : 'text-foreground'
                }`}
              >
                {category.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
