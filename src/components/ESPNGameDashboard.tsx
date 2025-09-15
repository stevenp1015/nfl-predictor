import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Clock, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BorderTrail } from '@/components/ui/border-trail';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useNFLData } from '@/hooks/use-nfl-data';
import { usePrediction, usePredictions } from '@/hooks/usePredictions';
import type { Event, Team, Competitor } from '@/types';

// Utility function to format Eastern time
function formatEasternTime(dateStr: string, timeStr?: string): { date: string; time: string } {
  const date = new Date(`${dateStr}T${timeStr || '12:00:00'}`);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric'
  };

  const formatted = date.toLocaleString('en-US', options).replace(',', '');
  const [time, datePart] = formatted.split(' ');
  return { time, date: datePart || 'Today' };
}

// Get team logo path - use ESPNs logo or fallback
function getTeamLogo(team: Team): string {
  return team.logo || `/nfl_logos/${team.abbreviation}.png`;
}

// Status indicators
function getStatusIndicator(gameDate: string, state: string): { color: string; label: string } {
  const today = new Date();
  const gameDay = new Date(gameDate);
  const isToday = gameDay.toDateString() === today.toDateString();

  switch (state) {
    case 'pre':
      return isToday ? { color: '#eab308', label: 'TODAY' } : { color: '#3b82f6', label: 'UPCOMING' };
    case 'in': return { color: '#ef4444', label: 'LIVE' };
    case 'post': return { color: '#6b7280', label: 'FINISHED' };
    default: return { color: '#6b7280', label: 'UPCOMING' };
  }
}

interface GameCardProps {
  event: Event;
  onClick: () => void;
  isExpanded: boolean;
}

function GameCard({ event, onClick, isExpanded }: GameCardProps) {
  const [homeTeam, awayTeam] = event.competitions[0].competitors.sort((a, b) => a.homeAway === 'home' ? 1 : -1);
  const home = homeTeam.team;
  const away = awayTeam.team;
  const status = getStatusIndicator(event.date, event.status.type.state);
  const { date, time } = formatEasternTime(event.date, event.competitions[0]?.date.split('T')[1]);

  // Border trail from away to home team color
  const trailColors = ['#' + (away.color || '888'), '#' + (home.color || '888')];

  const cardVariants = {
    collapsed: { scale: 1, zIndex: 1 },
    expanded: { scale: 1.05, zIndex: 10 },
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      animate={isExpanded ? 'expanded' : 'collapsed'}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative cursor-pointer"
      onClick={onClick}
    >
      <Card className="relative overflow-hidden">
        {!isExpanded && (
          <BorderTrail
            transition={{ duration: 4, repeat: Infinity }}
            size={20}
            style={{
              background: `linear-gradient(90deg, ${trailColors[0]}, ${trailColors[1]})`
            }}
          />
        )}

        <CardContent className="p-4 space-y-3">
          {/* Status Badge */}
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold">
              {away.shortDisplayName} @ {home.shortDisplayName}
            </span>
            <Badge style={{ backgroundColor: status.color, color: 'white' }} className="text-xs">
              {status.label}
            </Badge>
          </div>

          {/* Team Logos */}
          <div className="flex items-center justify-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={getTeamLogo(away)} />
              <AvatarFallback style={{ backgroundColor: away.color }}>{away.abbreviation}</AvatarFallback>
            </Avatar>
            <span className="text-lg">VS</span>
            <Avatar className="w-12 h-12">
              <AvatarImage src={getTeamLogo(home)} />
              <AvatarFallback style={{ backgroundColor: home.color }}>{home.abbreviation}</AvatarFallback>
            </Avatar>
          </div>

          {/* Score/Time */}
          <div className="text-center text-xs text-muted-foreground">
            {event.status.type.state === 'post' ? (
              <span>{awayTeam.score}-{homeTeam.score} FINAL</span>
            ) : event.status.type.state === 'in' ? (
              <span>{awayTeam.score}-{homeTeam.score} • {event.status.displayClock} Q{event.status.period}</span>
            ) : (
              <span>{date}, {time}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ExpandedGameDetailsProps {
  event: Event;
  prediction: any;
  savedPredictions: any[];
}

function ExpandedGameDetails({ event, prediction, savedPredictions }: ExpandedGameDetailsProps) {
  const [homeTeam, awayTeam] = event.competitions[0].competitors.sort((a, b) => a.homeAway === 'home' ? 1 : -1);
  const home = homeTeam.team;
  const away = awayTeam.team;
  const weather = event.weather;

  // Find historical prediction
  const historicalPrediction = savedPredictions.find(pred =>
    pred.homeTeam === home.abbreviation && pred.awayTeam === away.abbreviation
  );

  const predictedWinner = prediction?.predictedMargin > 0 ? home.shortDisplayName : away.shortDisplayName;
  const actualMargin = parseInt(homeTeam.score) - parseInt(awayTeam.score);
  const isCorrect = historicalPrediction &&
    ((prediction?.predictedMargin > 0 && actualMargin > 0) ||
     (prediction?.predictedMargin < 0 && actualMargin < 0));

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3"
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Venue */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{event.competitions[0]?.venue?.fullName || 'TBD'}</span>
        </div>

        {/* Weather */}
        <div className="flex items-center gap-2 text-sm">
          <span>🏈</span>
          <span>{weather?.displayValue || 'N/A'}</span>
        </div>
      </div>

      {/* Prediction */}
      {prediction && (
        <>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span><Trophy className="w-4 h-4 inline mr-1" />Predicted Winner: {predictedWinner} by {Math.abs(prediction.predictedMargin)}</span>
            <Badge variant="secondary">{(prediction.confidenceScore * 100).toFixed(1)}% confidence</Badge>
          </div>

          {event.status.type.state === 'post' && historicalPrediction && (
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4" />
              <span>Result: </span>
              <Badge variant={isCorrect ? 'default' : 'destructive'}>
                {isCorrect ? 'Correct' : 'Incorrect'}
              </Badge>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

export function ESPNGameDashboard() {
  const { events, calendar, loading, error, loadWeekData, currentWeek: hookCurrentWeek } = useNFLData();
  const { prediction, fetchPrediction } = usePrediction();
  const { savedPredictions, savePrediction } = usePredictions();
  const [currentWeek, setCurrentWeek] = useState<number>(parseInt(hookCurrentWeek || '1'));
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [gamePredictions, setGamePredictions] = useState<Record<string, any>>({});

  // Sync with hook current week
  useEffect(() => {
    if (hookCurrentWeek) {
      setCurrentWeek(parseInt(hookCurrentWeek));
    }
  }, [hookCurrentWeek]);

  const handleWeekChange = (direction: 'prev' | 'next') => {
    const newWeek = direction === 'prev' ? currentWeek - 1 : currentWeek + 1;
    if (newWeek > 0) {
      setCurrentWeek(newWeek);
      loadWeekData(newWeek);
      setExpandedCard(null);
    }
  };

  const handleCardClick = async (event: Event) => {
    const eventId = event.id;
    const isExpanding = expandedCard !== eventId;
    setExpandedCard(isExpanding ? eventId : null);

    if (isExpanding && !gamePredictions[eventId]) {
      // Generate prediction for this game
      const comp = event.competitions[0];
      const [homeTeam, awayTeam] = comp.competitors.map(c => c.team.abbreviation);
      await fetchPrediction(homeTeam, awayTeam);
    }
  };

  const weekEvents = events.filter(e => e.week.number === currentWeek);
  const currentWeekData = calendar?.[0]?.entries.find(e => e.value === currentWeek.toString());

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Week Header */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleWeekChange('prev')}
          disabled={loading}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="text-center">
          <h2 className="text-2xl font-bold">Week {currentWeek}</h2>
          {currentWeekData && (
            <p className="text-sm text-muted-foreground">
              {new Date(currentWeekData.startDate).toLocaleDateString()} - {new Date(currentWeekData.endDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleWeekChange('next')}
          disabled={loading}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {loading && <div className="text-center">Loading games...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Game Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {weekEvents.map(event => (
            <GameCard
              key={event.id}
              event={event}
              onClick={() => handleCardClick(event)}
              isExpanded={expandedCard === event.id}
            />
          ))}
        </AnimatePresence>

        {weekEvents.map(event => (
          <AnimatePresence key={`expanded-${event.id}`}>
            {expandedCard === event.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="col-span-full"
              >
                <Card className="mt-4">
                  <CardContent>
                    <ExpandedGameDetails
                      event={event}
                      prediction={prediction}
                      savedPredictions={savedPredictions}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </motion.div>

      {!loading && weekEvents.length === 0 && (
        <div className="text-center text-muted-foreground">No games scheduled for this week.</div>
      )}
    </div>
  );
}
