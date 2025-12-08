import { useState } from 'react';
import CategoryFilter from '../CategoryFilter';
import { defaultCategories } from '@/lib/categories';

export default function CategoryFilterExample() {
  const [selected, setSelected] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const handleToggle = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-[360px] mx-auto bg-background rounded-xl">
      <CategoryFilter
        categories={defaultCategories}
        selectedCategories={selected}
        onToggleCategory={handleToggle}
        onShowAll={() => setSelected([1, 2, 3, 4, 5, 6, 7, 8, 9])}
        onClearAll={() => setSelected([])}
      />
    </div>
  );
}
