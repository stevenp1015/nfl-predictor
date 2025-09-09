import React from 'react';
import { GlowingEffect } from './glowing-effect';
import { cn } from '@/lib/utils';

const AnimatedCard = ({ 
  children, 
  className = "",
  glowProps = {},
  variant = "default"
}) => {
  const baseGlowProps = {
    spread: 60,
    glow: true,
    disabled: false,
    proximity: 80,
    inactiveZone: 0.05,
    borderWidth: 2,
    ...glowProps
  };

  const cardVariants = {
    default: "bg-white/90 backdrop-blur-sm border-gray-200/50",
    dark: "bg-gray-900/90 backdrop-blur-sm border-gray-700/50",
    nfl: "bg-gradient-to-br from-blue-900/20 to-green-900/20 backdrop-blur-md border-blue-300/30",
    stats: "bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-md border-white/10"
  };

  return (
    <div className={cn("relative rounded-xl overflow-hidden", className)}>
      <GlowingEffect {...baseGlowProps} />
      <div className={cn(
        "relative z-10 rounded-xl border shadow-xl transition-all duration-300 hover:shadow-2xl",
        cardVariants[variant],
        className
      )}>
        {children}
      </div>
    </div>
  );
};

const StatCard = ({ 
  value, 
  label, 
  className = "",
  animate = true 
}) => {
  return (
    <AnimatedCard 
      variant="stats"
      className={cn("w-full h-32", className)}
      glowProps={{
        spread: 40,
        borderWidth: 1,
        proximity: 60
      }}
    >
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className={cn(
          "text-3xl font-extrabold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent",
          animate && "animate-pulse"
        )}>
          {value}
        </div>
        <div className="mt-1 text-sm tracking-wide text-gray-400">{label}</div>
      </div>
    </AnimatedCard>
  );
};

const GameCard = ({ 
  homeTeam, 
  awayTeam, 
  prediction, 
  status = "upcoming", 
  children,
  className = "" 
}) => {
  const statusVariants = {
    upcoming: "nfl",
    live: "dark", 
    finished: "default"
  };

  return (
    <AnimatedCard 
      variant={statusVariants[status]}
      className={cn("w-full", className)}
      glowProps={{
        spread: 80,
        borderWidth: 3,
        proximity: 100
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold text-white">
            {awayTeam} @ {homeTeam}
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            status === "live" ? "bg-red-500/20 text-red-400 border border-red-400/30" :
            status === "finished" ? "bg-green-500/20 text-green-400 border border-green-400/30" :
            "bg-blue-500/20 text-blue-400 border border-blue-400/30"
          )}>
            {status.toUpperCase()}
          </div>
        </div>
        {children}
      </div>
    </AnimatedCard>
  );
};

export { AnimatedCard, StatCard, GameCard };