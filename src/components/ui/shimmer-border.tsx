import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerBorderProps {
  fromColor?: string;
  toColor?: string;
  duration?: number;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function ShimmerBorder({
  fromColor = '#ffffff',
  toColor = '#888888',
  duration = 10,
  active = true,
  className,
  children,
}: ShimmerBorderProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl p-px', // p-px creates the border width
        active
          ? 'bg-[conic-gradient(from_-135deg_at_50%_50%,var(--shimmer-from)_0%,var(--shimmer-to)_50%,var(--shimmer-from)_100%)] animate-spin-slow'
          : 'bg-border',
        className
      )}
      style={{
        '--shimmer-from': fromColor,
        '--shimmer-to': toColor,
        '--shimmer-duration': `${duration}s`,
      } as React.CSSProperties}
    >
      {/* The inner div has the card's actual background and is slightly smaller, revealing the parent's gradient background as a border. */}
      <div className="relative h-full w-full rounded-[calc(0.75rem)] bg-card">
        {/* A subtle inner glow to tie it all together */}
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,var(--shimmer-from)0A,transparent_80%)]"
        />
        {children}
      </div>
    </div>
  );
}