import { useState } from 'react';
import BottomNav from '../BottomNav';

export default function BottomNavExample() {
  const [activeTab, setActiveTab] = useState<'home' | 'filter' | 'journal'>('home');

  return (
    <div className="relative h-20">
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={5}
      />
    </div>
  );
}
