import React, { useMemo } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { addDays, format, isToday, isYesterday, isTomorrow } from 'date-fns';
import { clamp } from '../utils';

interface TimelineScrubberProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const TimelineScrubber: React.FC<TimelineScrubberProps> = ({ selectedDate, setSelectedDate }) => {
  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 31 }, (_, i) => addDays(today, i - 15));
  }, []);

  const selectedIndex = dates.findIndex(d => format(d, 'yyyy-MM-dd') === selectedDate);
  const itemWidth = 100;
  const containerWidth = 31 * itemWidth;
  const dragConstraints = {
    left: -containerWidth + itemWidth * 5,
    right: 0
  };

  const x = useMotionValue(selectedIndex > -1 ? -selectedIndex * itemWidth + (2*itemWidth) : 0);
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
    const targetIndex = Math.round(-x.get() / itemWidth);
    const clampedIndex = clamp(targetIndex, 0, dates.length - 1);
    const newDate = dates[clampedIndex];
    setSelectedDate(format(newDate, 'yyyy-MM-dd'));
    x.set(-clampedIndex * itemWidth + (2 * itemWidth));
  };
  
  return (
    <div className="relative w-full h-24 overflow-hidden glass-pane p-2">
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-cyan-400 z-20 rounded-full shadow-[0_0_10px_2px_var(--glow-cyan)]" />
      <motion.div
        className="flex h-full items-center cursor-grab active:cursor-grabbing"
        drag="x"
        _dragX={x}
        dragConstraints={dragConstraints}
        onDragEnd={handleDragEnd}
        style={{ x }}
        dragTransition={{ bounceStiffness: 200, bounceDamping: 25 }}
      >
        {dates.map((date, index) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const isSelected = dateStr === selectedDate;

          let label = format(date, 'd');
          if (isToday(date)) label = 'Today';
          if (isYesterday(date)) label = 'Yesterday';
          if (isTomorrow(date)) label = 'Tomorrow';

          return (
            <motion.div
              key={date.toISOString()}
              className="flex-shrink-0 flex flex-col justify-center items-center text-center h-full relative"
              style={{ width: itemWidth }}
              onClick={() => {
                setSelectedDate(dateStr);
                x.set(-index * itemWidth + (2 * itemWidth));
              }}
            >
              <span className={`text-xs uppercase font-bold tracking-widest ${isSelected ? 'text-cyan-300' : 'text-gray-400'}`}>
                {format(date, 'MMM')}
              </span>
              <span className={`text-2xl font-black ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                {label}
              </span>
              <span className={`text-[10px] font-mono ${isSelected ? 'text-cyan-400/80' : 'text-gray-500'}`}>
                {format(date, 'EEE')}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TimelineScrubber;
