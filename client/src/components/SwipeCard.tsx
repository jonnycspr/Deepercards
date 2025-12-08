import { forwardRef, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from 'framer-motion';
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

const SwipeCard = forwardRef<HTMLDivElement, SwipeCardProps>(({
  question,
  category,
  onSwipeRight,
  onSwipeLeft,
  isTop = true,
  style,
}, ref) => {
  const controls = useAnimation();
  const constraintsRef = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25]);
  const scale = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0.95, 1, 1, 1, 0.95]
  );
  
  const rightIndicatorOpacity = useTransform(x, [0, 80, 150], [0, 0.5, 1]);
  const leftIndicatorOpacity = useTransform(x, [-150, -80, 0], [1, 0.5, 0]);
  const rightIndicatorScale = useTransform(x, [0, 100, 150], [0.5, 0.8, 1]);
  const leftIndicatorScale = useTransform(x, [-150, -100, 0], [1, 0.8, 0.5]);
  
  const rightGlowOpacity = useTransform(x, [0, 100, 200], [0, 0.3, 0.7]);
  const leftGlowOpacity = useTransform(x, [-200, -100, 0], [0.7, 0.3, 0]);
  
  const cardBackground = useTransform(
    x,
    [-200, 0, 200],
    [
      `linear-gradient(135deg, ${category.colorPrimary} 0%, ${category.colorSecondary} 100%)`,
      `linear-gradient(135deg, ${category.colorPrimary} 0%, ${category.colorSecondary} 100%)`,
      `linear-gradient(135deg, ${category.colorPrimary} 0%, ${category.colorSecondary} 100%)`,
    ]
  );

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100;
    const velocityThreshold = 500;
    
    const shouldSwipeRight = info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold;
    const shouldSwipeLeft = info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold;
    
    if (shouldSwipeRight) {
      await controls.start({
        x: 400,
        y: info.velocity.y * 0.1,
        rotate: 30,
        opacity: 0,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20,
          velocity: info.velocity.x,
        },
      });
      onSwipeRight();
    } else if (shouldSwipeLeft) {
      await controls.start({
        x: -400,
        y: info.velocity.y * 0.1,
        rotate: -30,
        opacity: 0,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20,
          velocity: info.velocity.x,
        },
      });
      onSwipeLeft();
    } else {
      controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        transition: {
          type: 'spring',
          stiffness: 500,
          damping: 30,
        },
      });
    }
  };

  return (
    <motion.div
      ref={ref}
      data-testid={`card-question-${question.id}`}
      className="absolute w-full cursor-grab active:cursor-grabbing touch-none"
      style={{
        x,
        y,
        rotate,
        scale,
        ...style,
      }}
      drag={isTop ? true : false}
      dragElastic={0.7}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileDrag={{ cursor: 'grabbing' }}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 12 }}
    >
      <motion.div
        className="relative rounded-2xl p-8 min-h-[670px] flex flex-col shadow-xl overflow-hidden select-none"
        style={{
          background: cardBackground,
        }}
        whileTap={{ scale: isTop ? 0.98 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            opacity: rightGlowOpacity,
            boxShadow: '0 0 60px 20px rgba(34, 197, 94, 0.5), inset 0 0 30px rgba(34, 197, 94, 0.2)',
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            opacity: leftGlowOpacity,
            boxShadow: '0 0 60px 20px rgba(251, 191, 36, 0.5), inset 0 0 30px rgba(251, 191, 36, 0.2)',
          }}
        />

        <div className="mb-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wide">
            <span className="text-base">{category.icon}</span>
            {category.name}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center relative z-10">
          <p className="text-white text-2xl font-medium text-center leading-relaxed drop-shadow-sm">
            {question.questionText}
          </p>
        </div>

        <motion.div
          className="absolute top-1/2 right-4 -translate-y-1/2 z-20"
          style={{ 
            opacity: rightIndicatorOpacity,
            scale: rightIndicatorScale,
          }}
        >
          <motion.div 
            className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg border-4 border-white/30"
            initial={{ rotate: 0 }}
            animate={{ rotate: 0 }}
          >
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          </motion.div>
          <p className="text-white text-xs font-bold text-center mt-2 uppercase tracking-wide drop-shadow-md">
            Discussed
          </p>
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-4 -translate-y-1/2 z-20"
          style={{ 
            opacity: leftIndicatorOpacity,
            scale: leftIndicatorScale,
          }}
        >
          <motion.div 
            className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-4 border-white/30"
            initial={{ rotate: 0 }}
            animate={{ rotate: 0 }}
          >
            <Clock className="w-8 h-8 text-white" strokeWidth={3} />
          </motion.div>
          <p className="text-white text-xs font-bold text-center mt-2 uppercase tracking-wide drop-shadow-md">
            Save
          </p>
        </motion.div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-8 text-white/60 text-xs z-10">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> Swipe left
          </span>
          <span className="flex items-center gap-1">
            Swipe right <Check className="w-3 h-3" />
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
});

SwipeCard.displayName = 'SwipeCard';

export default SwipeCard;
