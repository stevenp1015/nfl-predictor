import React from 'react';
import { TeamInfo } from '../types';
import TeamLogo from './TeamLogo';

interface TeamBlockProps {
    team?: TeamInfo;
    theme: 'dark' | 'light';
    textSubtle: string;
}

const TeamBlock = ({ team, theme, textSubtle }: TeamBlockProps) => {
    if (!team) {
      return (
        <div className="flex items-center gap-3">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <div>
            <p className="text-sm font-semibold">Awaiting team data</p>
            <p className={`text-xs ${textSubtle}`}>Syncing roster intel</p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-3">
        <TeamLogo team={team} theme={theme} size="md" />
        <div>
          <p className="text-lg font-bold">
            {team.city} {team.name}
          </p>
          <p className={`text-xs ${textSubtle}`}>
            {team.record} • {team.recentForm}
          </p>
        </div>
      </div>
    );
  };

export default TeamBlock;
