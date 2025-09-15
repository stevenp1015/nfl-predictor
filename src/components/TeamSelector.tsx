import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getAllTeams, convertToTeamInterface, getTeamsByConference } from '@/data/nflTeams';
import { GlowingCard } from './GlowingCard';

interface TeamSelectorProps {
  teams?: any[]; // Using NFLTeam[] type, but keeping flexible
  selectedTeam?: any;
  onTeamSelect?: (team: any) => void;
}

export function TeamSelector({ teams, selectedTeam, onTeamSelect }: TeamSelectorProps) {
  const [selectedConference, setSelectedConference] = useState<'AFC' | 'NFC'>('AFC');

  const afcTeams = getTeamsByConference('AFC').map(convertToTeamInterface);
  const nfcTeams = getTeamsByConference('NFC').map(convertToTeamInterface);
  const currentTeams = selectedConference === 'AFC' ? afcTeams : nfcTeams;

  return (
    <GlowingCard className="p-6" glowColor={selectedTeam?.color || "#3b82f6"} isActive={!!selectedTeam}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Select Team</h3>
        </div>

        {/* Conference Toggle */}
        <div className="flex gap-2">
          <Button
            variant={selectedConference === 'AFC' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedConference('AFC')}
            className="flex-1"
          >
            AFC ({afcTeams.length})
          </Button>
          <Button
            variant={selectedConference === 'NFC' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedConference('NFC')}
            className="flex-1"
          >
            NFC ({nfcTeams.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
          {currentTeams.map((team) => (
            <motion.div
              key={team.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedTeam?.id === team.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onTeamSelect?.(team)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={team.logo} alt={team.name} />
                  <AvatarFallback style={{ backgroundColor: team.color, fontSize: '10px' }}>
                    {team.name.split(' ').map(w => w[0]).join('').slice(0,3)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{team.name}</h4>
                  <p className="text-xs text-muted-foreground">{team.record}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs mb-1">
                    {team.stats.recent}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    O:{team.stats.offense} D:{team.stats.defense}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlowingCard>
  );
}
