import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion';
import type { SpringOptions } from 'framer-motion';
import type { RefObject } from 'react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ScrollProgressProps = {
  className?: string;
  springOptions?: SpringOptions;
  containerRef?: RefObject<HTMLDivElement>;
  progress?: number; // New: manual progress override (0 to 1)
  orientation?: 'horizontal' | 'vertical'; // New: orientation support
};

const DEFAULT_SPRING_OPTIONS: SpringOptions = {
  stiffness: 200,
  damping: 50,
  restDelta: 0.001,
};

export function ScrollProgress({
  className,
  springOptions,
  containerRef,
  progress,
  orientation = 'horizontal', // Default to horizontal for backward compatibility
}: ScrollProgressProps) {
  // Use manual progress if provided, otherwise use scroll-based progress
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  // Create a motion value for manual progress
  const manualProgress = useMotionValue(progress ?? 0);

  // Update manual progress when prop changes
  useEffect(() => {
    if (progress !== undefined) {
      manualProgress.set(progress);
    }
  }, [progress, manualProgress]);

  // Choose which progress value to use
  const activeProgress = progress !== undefined ? manualProgress : scrollYProgress;

  const scale = useSpring(activeProgress, {
    ...DEFAULT_SPRING_OPTIONS,
    ...(springOptions ?? {}),
  });

  // Default classes based on orientation
  const defaultClasses = orientation === 'horizontal' 
    ? 'inset-x-0 top-0 h-1 origin-left'
    : 'inset-y-0 left-0 w-1 origin-top';

  // Motion style based on orientation  
  const motionStyle = orientation === 'horizontal'
    ? { scaleX: scale }
    : { scaleY: scale };

  return (
    <motion.div
      className={cn(defaultClasses, className)}
      style={motionStyle}
    />
  );
}
