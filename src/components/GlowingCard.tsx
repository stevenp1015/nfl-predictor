import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  isActive?: boolean;
}

export function GlowingCard({ children, className = "", glowColor = "#3b82f6", isActive = false }: GlowingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  // When the mouse moves over the card, update the mouse position
  // and the rotation of the card based on the mouse position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current && !shouldReduceMotion) {
      const rect = cardRef.current.getBoundingClientRect();
      // Calculate the x and y offsets of the mouse position relative to the top-left corner of the card
      const x = e.clientX - rect.left - rect.width / rect.height;
      const y = e.clientY - rect.top - rect.height / rect.width;
      // Update the mouse position state
      setMousePosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-xl overflow-hidden bg-card border border-border ${className}`}
      animate={{
        y: isHovered ? 0 : 0,
        scale: isHovered ? 1 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {(isActive || isHovered) && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `radial-gradient(` + // Start the gradient
              `circle at ` + // Use a circle shape
              `${mousePosition.x}px ${mousePosition.y}px, ` + // Position the center of the circle at the current mouse position
              `${glowColor}10 30%, ` + // Start the gradient at 40% opacity of the glowColor, and gradually become transparent towards the end
              `transparent 80%)` // End the gradient at 70% opacity
          }}
          animate={{ opacity: isHovered ? 1 : 1 }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
