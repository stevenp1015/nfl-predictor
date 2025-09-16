import React, { useState } from 'react';
import { TeamInfo } from '../types';

const TeamLogo = ({
  team,
  theme,
  size = "md",
}: {
  team: TeamInfo;
  theme: "dark" | "light";
  size?: "sm" | "md" | "lg";
}) => {
  const [failed, setFailed] = useState(false);
  const dimension =
    size === "lg" ? "h-16 w-16" : size === "sm" ? "h-10 w-10" : "h-12 w-12";
  const imageDimension =
    size === "lg" ? "h-12 w-12" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const tone =
    theme === "dark"
      ? "bg-white/15 text-white ring-white/20"
      : "bg-white text-slate-900 ring-slate-200";
  return (
    <div
      className={`flex items-center justify-center rounded-2xl ring-1 ${tone} ${dimension}`}
      style={{
        backgroundColor: theme === "dark" ? "rgba(255,255,255,0.08)" : undefined,
      }}
    >
      {failed ? (
        <span className="text-sm font-bold uppercase tracking-widest">
          {team.code}
        </span>
      ) : (
        <img
          src={team.logo}
          alt={`${team.city} ${team.name} logo`}
          className={`${imageDimension} object-contain`}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
};

export default TeamLogo;
