import { forwardRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from 'framer-motion';
import { Check, Clock } from 'lucide-react';
import { Category, Question } from '@/lib/categories';

interface SwipeCardProps {
  question: Question;
  category: Category;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  isTop?: boolean;
  style?: React.CSSProperties;
}

const SwipeCard = forwardRef<HTMLDivElement, SwipeCardProps>(({
  question,
  category,
  onSwipeRight,
  onSwipeLeft,
  isTop = false,
  style,
}, ref) => {
  const controls = useAnimation();
  
  const x = useMotionValue(0);
  
  const y = useTransform(x, [-300, -150, 0, 150, 300], [80, 20, 0, 20, 80]);
  
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  
  const scale = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0.95, 0.98, 1, 0.98, 0.95]
  );
  
  const rightIndicatorOpacity = useTransform(x, [0, 60, 120], [0, 0.5, 1]);
  const leftIndicatorOpacity = useTransform(x, [-120, -60, 0], [1, 0.5, 0]);
  const rightIndicatorScale = useTransform(x, [0, 80, 120], [0.5, 0.8, 1]);
  const leftIndicatorScale = useTransform(x, [-120, -80, 0], [1, 0.8, 0.5]);
  
  const rightGlowOpacity = useTransform(x, [0, 100, 200], [0, 0.3, 0.6]);
  const leftGlowOpacity = useTransform(x, [-200, -100, 0], [0.6, 0.3, 0]);

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isTop) return;
    
    const swipeThreshold = 80;
    const velocityThreshold = 400;
    
    const shouldSwipeRight = info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold;
    const shouldSwipeLeft = info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold;
    
    if (shouldSwipeRight && onSwipeRight) {
      await controls.start({
        x: 350,
        y: 120,
        rotate: 20,
        opacity: 0,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 30,
        },
      });
      onSwipeRight();
    } else if (shouldSwipeLeft && onSwipeLeft) {
      await controls.start({
        x: -350,
        y: 120,
        rotate: -20,
        opacity: 0,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 30,
        },
      });
      onSwipeLeft();
    } else {
      controls.start({
        x: 0,
        transition: {
          type: 'spring',
          stiffness: 500,
          damping: 25,
        },
      });
    }
  };

  return (
    <motion.div
      ref={ref}
      data-testid={`card-question-${question.id}`}
      className="absolute w-full touch-none select-none"
      style={{
        x,
        y,
        rotate,
        scale,
        cursor: isTop ? 'grab' : 'default',
        ...style,
      }}
      drag={isTop ? 'x' : false}
      dragElastic={0.9}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <motion.div
        className="relative rounded-2xl p-6 h-[calc(100dvh-200px)] max-h-[670px] min-h-[330px] flex flex-col shadow-xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${category.colorPrimary} 0%, ${category.colorSecondary} 100%)`,
        }}
      >
        {isTop && (
          <>
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
          </>
        )}

        <div className="mb-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wide">
            <span className="text-base">{category.icon}</span>
            {category.name}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center relative z-10">
          <p className="text-white text-2xl font-medium text-center leading-relaxed drop-shadow-sm px-2">
            {question.questionText}
          </p>
        </div>

        {isTop && (
          <>
            <motion.div
              className="absolute top-1/2 right-4 -translate-y-1/2 z-20"
              style={{ 
                opacity: rightIndicatorOpacity,
                scale: rightIndicatorScale,
              }}
            >
              <motion.div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg border-4 border-white/30">
                <Check className="w-7 h-7 text-white" strokeWidth={3} />
              </motion.div>
              <p className="text-white text-xs font-bold text-center mt-1.5 uppercase tracking-wide drop-shadow-md">
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
              <motion.div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-4 border-white/30">
                <Clock className="w-7 h-7 text-white" strokeWidth={3} />
              </motion.div>
              <p className="text-white text-xs font-bold text-center mt-1.5 uppercase tracking-wide drop-shadow-md">
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
          </>
        )}
      </motion.div>
    </motion.div>
  );
});

SwipeCard.displayName = 'SwipeCard';

export default SwipeCard;
