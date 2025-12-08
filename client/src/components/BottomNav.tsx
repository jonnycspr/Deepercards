import { Home, SlidersHorizontal, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

type NavTab = 'home' | 'filter' | 'journal';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  savedCount: number;
}

export default function BottomNav({ activeTab, onTabChange, savedCount }: BottomNavProps) {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'filter' as NavTab, label: 'Filter', icon: SlidersHorizontal },
    { id: 'journal' as NavTab, label: 'Journal', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 z-50">
      <div className="max-w-[480px] mx-auto h-full flex items-center justify-around px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-1 py-2 px-6 transition-colors"
              data-testid={`nav-${tab.id}`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                {tab.id === 'journal' && savedCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-2 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center px-1"
                  >
                    {savedCount > 99 ? '99+' : savedCount}
                  </motion.span>
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
