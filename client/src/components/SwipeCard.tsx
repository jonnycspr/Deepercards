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

  const getCardBackground = () => {
    if (category.fillType === 'gradient' && category.gradientFrom && category.gradientTo) {
      return `linear-gradient(${category.gradientAngle || 180}deg, ${category.gradientFrom} 0%, ${category.gradientTo} 100%)`;
    }
    if (category.fillType === 'image' && category.imageUrl) {
      return `url(${category.imageUrl})`;
    }
    return category.colorPrimary;
  };

  const textColor = category.textColor || '#FFFFFF';
  const borderColor = category.borderColor || '#FFFFFF';
  const borderWidth = category.borderWidth || 8;

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
      <div
        className="relative rounded-[32px] h-[calc(100dvh-180px)] max-h-[600px] min-h-[400px] flex flex-col overflow-hidden"
        style={{
          backgroundColor: borderColor,
          padding: `${borderWidth}px`,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)',
        }}
      >
        <motion.div
          className="relative rounded-[24px] flex-1 flex flex-col overflow-hidden"
          style={{
            background: getCardBackground(),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {isTop && (
            <>
              <motion.div
                className="absolute inset-0 rounded-[24px] pointer-events-none"
                style={{
                  opacity: rightGlowOpacity,
                  boxShadow: '0 0 60px 20px rgba(34, 197, 94, 0.5), inset 0 0 30px rgba(34, 197, 94, 0.2)',
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-[24px] pointer-events-none"
                style={{
                  opacity: leftGlowOpacity,
                  boxShadow: '0 0 60px 20px rgba(251, 191, 36, 0.5), inset 0 0 30px rgba(251, 191, 36, 0.2)',
                }}
              />
            </>
          )}

          <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 relative z-10">
            <p 
              className="text-3xl font-semibold text-center leading-relaxed"
              style={{ 
                color: textColor,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {category.name}
            </p>
            
            <div className="mt-8 w-full max-w-[280px]">
              <p 
                className="text-xl font-medium text-center leading-relaxed opacity-90"
                style={{ 
                  color: textColor,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {question.questionText}
              </p>
            </div>
          </div>

          {isTop && (
            <>
              <motion.div
                className="absolute top-1/2 right-6 -translate-y-1/2 z-20"
                style={{ 
                  opacity: rightIndicatorOpacity,
                  scale: rightIndicatorScale,
                }}
              >
                <motion.div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center border-4 border-white">
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </motion.div>
                <p className="text-white text-xs font-bold text-center mt-2 uppercase tracking-wide">
                  Discussed
                </p>
              </motion.div>

              <motion.div
                className="absolute top-1/2 left-6 -translate-y-1/2 z-20"
                style={{ 
                  opacity: leftIndicatorOpacity,
                  scale: leftIndicatorScale,
                }}
              >
                <motion.div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center border-4 border-white">
                  <Clock className="w-8 h-8 text-white" strokeWidth={3} />
                </motion.div>
                <p className="text-white text-xs font-bold text-center mt-2 uppercase tracking-wide">
                  Save
                </p>
              </motion.div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-8 text-white/70 text-sm z-10 font-medium">
                <span className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Clock className="w-4 h-4" /> Save
                </span>
                <span className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Done <Check className="w-4 h-4" />
                </span>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
});

SwipeCard.displayName = 'SwipeCard';

export default SwipeCard;
