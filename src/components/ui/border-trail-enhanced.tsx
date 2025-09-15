'use client';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface BorderTrailEnhancedProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  fromColor?: string;
  toColor?: string;
  trailWidth?: number;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export function BorderTrailEnhanced({
  className,
  size = 60,
  duration = 4,
  delay = 0,
  fromColor = '#3b82f6',
  toColor = '#ef4444',
  trailWidth = 2,
  borderRadius = '0.75rem', // Default for rounded-xl
  style,
}: BorderTrailEnhancedProps) {
  const progress = useMotionValue(0);

  // Create color interpolation based on position around the border
  const backgroundColor = useTransform(
    progress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      fromColor,    // Start (top-left)
      toColor,      // Top-right
      toColor,      // Bottom-right
      fromColor,    // Bottom-left
      fromColor     // Back to start
    ]
  );

  // Create dynamic glow effect that follows the color
  const boxShadow = useTransform(
    progress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      `0 0 ${size/3}px ${fromColor}, 0 0 ${size/6}px ${fromColor}40, 0 0 ${size}px ${fromColor}30`,
      `0 0 ${size/3}px ${toColor}, 0 0 ${size/6}px ${toColor}40, 0 0 ${size}px ${toColor}30`,
      `0 0 ${size/3}px ${toColor}, 0 0 ${size/6}px ${toColor}40, 0 0 ${size}px ${toColor}30`,
      `0 0 ${size/3}px ${fromColor}, 0 0 ${size/6}px ${fromColor}40, 0 0 ${size}px ${fromColor}30`,
      `0 0 ${size/3}px ${fromColor}, 0 0 ${size/6}px ${fromColor}40, 0 0 ${size}px ${fromColor}30`
    ]
  );

  // Calculate glow position for inner radial gradient
  const glowX = useTransform(progress, [0, 0.25, 0.5, 0.75, 1], ['20%', '80%', '80%', '20%', '20%']);
  const glowY = useTransform(progress, [0, 0.25, 0.5, 0.75, 1], ['20%', '20%', '80%', '80%', '20%']);

  // Inner glow background
  const innerGlowBackground = useTransform(
    [backgroundColor, glowX, glowY],
    ([color, x, y]) => `radial-gradient(circle at ${x} ${y}, ${color}12 0%, ${color}06 40%, transparent 70%)`
  );

  return (
    <>
      {/* Inner glow effect that radiates into the card - outside the mask */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background: innerGlowBackground,
          opacity: 0.4,
          zIndex: 1,
        }}
      />

      {/* Border trail container with masking */}
      <div
        className='pointer-events-none absolute inset-0 rounded-[inherit] [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]'
        style={{
          zIndex: 2,
          border: `${trailWidth}px solid transparent`,
        }}
      >
        {/* Main trail element */}
        <motion.div
          className={cn('absolute aspect-square', className)}
          style={{
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${borderRadius})`,
            backgroundColor,
            boxShadow,
          }}
          animate={{
            offsetDistance: ['0%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration,
            ease: 'linear',
            delay,
          }}
          onUpdate={(latest) => {
            if (latest.offsetDistance && typeof latest.offsetDistance === 'string') {
              const percentage = parseFloat(latest.offsetDistance.replace('%', '')) / 100;
              progress.set(percentage);
            }
          }}
        />
      </div>
    </>
  );
}