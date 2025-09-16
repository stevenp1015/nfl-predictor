import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nflTeams } from "../constants";
import { getTeamByCode } from "../utils";
import TeamLogo from "./TeamLogo";

interface TeamSelectProps {
  label: string;
  value?: string;
  onChange: (code: string) => void;
  theme: "dark" | "light";
  prefersReducedMotion: boolean;
  excludedCodes?: string[];
}

const TeamSelect = ({
  label,
  value,
  onChange,
  theme,
  prefersReducedMotion,
  excludedCodes = [],
}: TeamSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedTeam = value ? getTeamByCode(value) : undefined;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  const gridItemVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="glass-pane flex w-full items-center justify-between p-3 transition-all duration-300 hover:border-cyan-400/60"
      >
        {selectedTeam ? (
          <div className="flex items-center gap-3">
            <TeamLogo team={selectedTeam} theme={theme} size="sm" />
            <div className="text-left">
              <p className="font-semibold">{selectedTeam.city} {selectedTeam.name}</p>
              <p className="text-xs text-gray-400">{selectedTeam.record}</p>
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Select team</span>
        )}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-lg text-gray-400">▾</motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-pane absolute z-40 mt-2 w-full p-4 shadow-2xl"
          >
            <motion.div
              variants={gridContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid max-h-80 grid-cols-4 gap-2 overflow-y-auto pr-2"
            >
              {nflTeams.map((team) => {
                const isDisabled = excludedCodes.includes(team.code);
                return (
                  <motion.button
                    key={team.code}
                    variants={gridItemVariants}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) {
                        onChange(team.code);
                        setIsOpen(false);
                      }
                    }}
                    className="group relative flex flex-col items-center justify-center rounded-lg p-2 transition-colors duration-200 enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <TeamLogo team={team} theme={theme} size="sm" />
                    <span className="mt-1 text-[10px] font-bold text-gray-300 group-hover:text-white">{team.code}</span>
                    <div
                      className="absolute inset-0 rounded-lg opacity-0 transition-all duration-300 group-hover:opacity-100"
                      style={{ boxShadow: `0 0 15px 3px ${team.primaryColor}60` }}
                    />
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamSelect;
