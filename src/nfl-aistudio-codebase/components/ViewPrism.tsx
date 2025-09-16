import React from 'react';
import { motion } from 'framer-motion';
import { ViewKey } from '../types';
import { Target, BarChart2, CalendarDays, Bookmark, Bot } from 'lucide-react';

interface ViewPrismProps {
  selectedView: ViewKey;
  setSelectedView: (view: ViewKey) => void;
}

const views: { key: ViewKey; label: string; icon: React.ElementType }[] = [
  { key: 'browse', label: 'Navigator', icon: CalendarDays },
  { key: 'single', label: 'Duel', icon: Target },
  { key: 'bulk', label: 'Engine', icon: Bot },
  { key: 'saved', label: 'War Room', icon: Bookmark },
  { key: 'performance', label: 'Pulse', icon: BarChart2 },
];

const viewRotations: Record<ViewKey, { x: number; y: number }> = {
  browse: { x: 0, y: 0 },
  single: { x: 0, y: -72 },
  bulk: { x: 0, y: -144 },
  saved: { x: 0, y: -216 },
  performance: { x: 0, y: -288 },
};

const ViewPrism: React.FC<ViewPrismProps> = ({ selectedView, setSelectedView }) => {
  const rotation = viewRotations[selectedView];
  const faceHeight = 60;
  const radius = Math.round(faceHeight / (2 * Math.tan(Math.PI / views.length)));

  return (
    <div className="w-full h-24 flex justify-center items-center perspective-container">
      <motion.div
        className="relative preserve-3d w-48"
        style={{ height: `${faceHeight}px` }}
        animate={rotation}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        {views.map((view, index) => {
          const angle = index * (360 / views.length);
          const isSelected = view.key === selectedView;

          return (
            <motion.div
              key={view.key}
              className="relative w-48 flex items-center justify-center cursor-pointer"
              style={{
                height: `${faceHeight}px`,
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                backgroundColor: isSelected ? 'var(--glow-cyan)' : 'var(--dark-pane)',
//              backgroundColor: isSelected ? 'var(--glow-cyan)' : 'var(--dark-pane)',
                borderColor: isSelected ? 'transparent' : 'var(--dark-border)',
                borderWidth: '1px',
                boxShadow: isSelected ? `0 0 25px 5px var(--glow-cyan)` : 'none',
              }}
              onClick={() => setSelectedView(view.key)}
              transition={{ duration: 0.3 }}
            >
              <view.icon className={`h-5 w-5 mr-2 ${isSelected ? 'text-black' : 'text-gray-300'}`} />
              <span className={`font-bold uppercase tracking-widest ${isSelected ? 'text-black' : 'text-gray-200'}`}>
                {view.label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ViewPrism;
