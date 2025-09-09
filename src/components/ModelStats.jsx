import React from 'react';
import { AnimatedCard, StatCard } from './ui/animated-card';

const ModelStats = () => {
  return (
    <AnimatedCard 
      variant="nfl" 
      className="mt-8"
      glowProps={{ spread: 80, borderWidth: 2 }}
    >
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-white mb-8 text-center">
          Model Performance Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            value="89.1%" 
            label="placeholder crap"
            animate={true}
          />
          <StatCard 
            value="55.3%" 
            label="wtf stupid placeholder"
            animate={true}
          />
          <StatCard 
            value="91.7%" 
            label="fake placeholder"
            animate={true}
          />
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-blue-200">
            Trained on 10,000+ hours of Love. and Data.
          </p>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ModelStats;