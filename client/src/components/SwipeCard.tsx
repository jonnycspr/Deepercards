import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Check, Clock } from 'lucide-react';
import { Category, Question } from '@/lib/categories';

interface SwipeCardProps {
  question: Question;
  category: Category;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  isTop?: boolean;
  style?: React.CSSProperties;
}

export default function SwipeCard({
  question,
  category,
  onSwipeRight,
  onSwipeLeft,
  isTop = true,
  style,
}: SwipeCardProps) {
  const [exitX, setExitX] = useState<number>(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  
  const rightIndicatorOpacity = useTransform(x, [0, 100], [0, 1]);
  const leftIndicatorOpacity = useTransform(x, [-100, 0], [1, 0]);
  
  const rightGlowOpacity = useTransform(x, [0, 150], [0, 0.6]);
  const leftGlowOpacity = useTransform(x, [-150, 0], [0.6, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      setExitX(300);
      onSwipeRight();
    } else if (info.offset.x < -100) {
      setExitX(-300);
      onSwipeLeft();
    }
  };

  return (
    <motion.div
      data-testid={`card-question-${question.id}`}
      className="absolute w-full cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity,
        ...style,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX, opacity: 0, transition: { duration: 0.3 } } : {}}
    >
      <div
        className="relative rounded-2xl p-8 min-h-[320px] flex flex-col shadow-lg overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${category.colorPrimary} 0%, ${category.colorSecondary} 100%)`,
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            opacity: rightGlowOpacity,
            boxShadow: '0 0 40px 10px rgba(34, 197, 94, 0.6)',
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            opacity: leftGlowOpacity,
            boxShadow: '0 0 40px 10px rgba(251, 191, 36, 0.6)',
          }}
        />

        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wide">
            <span>{category.icon}</span>
            {category.name}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <p className="text-white text-2xl font-medium text-center leading-relaxed">
            {question.questionText}
          </p>
        </div>

        <motion.div
          className="absolute top-1/2 right-6 -translate-y-1/2"
          style={{ opacity: rightIndicatorOpacity }}
        >
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <Check className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-6 -translate-y-1/2"
          style={{ opacity: leftIndicatorOpacity }}
        >
          <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
