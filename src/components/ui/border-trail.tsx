'use client';
import { cn } from '@/lib/utils';
import { motion, Transition, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

type BorderTrailProps = {
  className?: string;
  size?: number;
  transition?: Transition;
  delay?: number;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
  fromColor?: string;
  toColor?: string;
};

export function BorderTrail({
  className,
  size = 60,
  transition,
  delay,
  onAnimationComplete,
  style,
  fromColor = '#3b82f6',
  toColor = '#ef4444',
}: BorderTrailProps) {
  const BASE_TRANSITION = {
    repeat: Infinity,
    duration: 5,
    ease: 'linear',
  } as const;

  const progress = useMotionValue(0);

  // Create color interpolation based on position around the border
  // The trail moves: top-left → top-right → bottom-right → bottom-left → back to start
  // We want: fromColor on left side, toColor on right side
  const backgroundColor = useTransform(
    progress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      fromColor,           // Start (top-left) - from color
      toColor,             // Top-right - to color
      toColor,             // Bottom-right - to color
      fromColor,           // Bottom-left - from color
      fromColor            // Back to start - from color
    ]
  );

  useEffect(() => {
    const controls = progress.set(0);
    return controls;
  }, [progress]);

  return (
    <div className='pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]'>
      <motion.div
        className={cn('absolute aspect-square', className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          backgroundColor,
          boxShadow: `0 0 ${size/2}px ${backgroundColor}`,
          ...style,
        }}
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={transition ?? { ...BASE_TRANSITION, delay }}
        onAnimationComplete={onAnimationComplete}
        onUpdate={(latest) => {
          if (latest.offsetDistance) {
            const percentage = parseFloat(latest.offsetDistance.toString().replace('%', '')) / 100;
            progress.set(percentage);
          }
        }}
      />
    </div>
  );
}
