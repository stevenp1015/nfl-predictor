import React from "react";
import { motion, PanInfo } from "framer-motion";

interface ShimmerButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  theme: "dark" | "light";
}

const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
  theme,
}) => {
  const motionProps = {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.95, y: 0 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
  };

  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 shadow-lg";

  const variantStyles: Record<"primary" | "secondary" | "ghost", string> = {
    primary: "bg-cyan-500/80 text-white focus-visible:outline-cyan-200 disabled:opacity-50",
    secondary: "bg-emerald-500/80 text-white focus-visible:outline-emerald-200 disabled:opacity-50",
    ghost: "bg-white/5 text-gray-200 hover:bg-white/10 focus-visible:outline-white/60 disabled:opacity-40",
  };

  const glowStyles: Record<"primary" | "secondary" | "ghost", string> = {
    primary: "shadow-[0_0_20px_2px_var(--glow-cyan)]",
    secondary: "shadow-[0_0_20px_2px_var(--glow-emerald)]",
    ghost: ""
  };

  return (
    <motion.button
      {...(!disabled && motionProps)}
      type={type}
      onClick={onClick}
      className={[baseStyles, variantStyles[variant], className, !disabled && glowStyles[variant]].filter(Boolean).join(" ")}
      disabled={disabled}
    >
      <span className="relative z-10 whitespace-nowrap">{children}</span>
      {!disabled && (
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ animation: `shimmer 2.5s infinite` }}
        />
      )}
    </motion.button>
  );
};

export default ShimmerButton;
