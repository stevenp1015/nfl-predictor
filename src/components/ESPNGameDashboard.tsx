import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Clock, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card'; // Card is used inside ShimmerBorder
import { Badge } from '@/components/ui/badge';
import { ShimmerBorder } from '@/components/ui/shimmer-border';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useNFLData } from '@/hooks/use-nfl-data';
import { usePrediction, usePredictions } from '@/hooks/usePredictions';
import type { Event, Team, Competitor } from '@/types';

// Utility function to format Eastern time
// Utility function to format Eastern time
function formatEasternTime(dateStr: string, timeStr?: string): { date: string; time: string } {
  if (!dateStr || dateStr === 'TBD') {
    return { time: 'TBD', date: 'TBD' };
  }

  // Extract date part if it includes time
  const cleanDateStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;

  const date = new Date(`${cleanDateStr}T${timeStr || '12:00:00'}`);
  if (isNaN(date.getTime())) {
    return { time: 'TBD', date: cleanDateStr };
  }

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
  return { time: time || 'TBD', date: datePart || 'Today' };
}

// Utility function to get game date in EST for comparisons
function getGameDateEST(gameDate: string): Date {
  const utc = new Date(gameDate);
  const estFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const formatted = estFormatter.format(utc).split('/');
  // formatted is ['09', '15', '2025']
  return new Date(`${formatted[2]}-${formatted[0].padStart(2, '0')}-${formatted[1].padStart(2, '0')}`);
}

// Get team logo path - use ESPNs logo or fallback
function getTeamLogo(team: Team): string {
  return team.logo || `/nfl_logos/${team.abbreviation}.png`;
}

// Status indicators
function getStatusIndicator(gameDate: string, state: string): { color: string; label: string } {
  const estFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const gameDateEST = estFormatter.format(getGameDateEST(gameDate));
  const todayEST = estFormatter.format(new Date());
  const isToday = gameDateEST === todayEST;

  switch (state) {
    case 'pre':
      return isToday ? { color: 'var(--color-chart-4)', label: 'TODAY' } : { color: 'var(--color-chart-5)', label: 'UPCOMING' };
    case 'in': return { color: 'var(--color-chart-2)', label: 'LIVE' };
    case 'post': return { color: 'var(--color-muted-foreground)', label: 'FINISHED' };
    default: return { color: 'var(--color-chart-5)', label: 'UPCOMING' };
  }
}

interface GameCardProps {
  event: Event;
  onClick: () => void;
  isExpanded: boolean;
}

function GameCard({ event, onClick, isExpanded }: GameCardProps) {
  const competition = event.competitions[0];
  const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
  const awayTeam = competition.competitors.find(c => c.homeAway === 'away');

  if (!homeTeam || !awayTeam) {
    return null; // Or some fallback UI
  }

  const home = homeTeam.team;
  const away = awayTeam.team;
  const status = getStatusIndicator(event.date, event.status.type.state);
  const competitionDate = event.competitions[0]?.date;
  let timeStr;
  if (competitionDate && typeof competitionDate === 'string') {
    const timePart = competitionDate.includes('T') ? competitionDate.split('T')[1] : null;
    timeStr = timePart ? timePart.replace('Z', '') : undefined;
  }
  const { date, time } = formatEasternTime(event.date || 'TBD', timeStr);

  // Team colors for dynamic border trail
  const awayColor = '#' + (away.color || '888');
  const homeColor = '#' + (home.color || '888');

  const cardVariants = {
    collapsed: { scale: 1, zIndex: 1 },
    expanded: { scale: 1.05, zIndex: 10 },
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      animate={isExpanded ? 'expanded' 
                          : 'collapsed'}
      transition={{ type: 'spring',
                    stiffness: 300}}
      className={"relative cursor-pointer" + (isExpanded ? ' expanded' : '')}
      whileHover={{ scale: 1.05,
                    zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <ShimmerBorder
        fromColor={awayColor}
        toColor={homeColor}
        duration={12}
        active={!isExpanded}

      >
        <Card
          className="border-[10px] rounded-2xl"
          style={{ background: `linear-gradient(45deg, ${awayColor}6A, ${homeColor}6A)` }} // 2A is 13% opacity, 1A is 5% opacity, 0A is 0% opacity. the "A" stands for alpha, and it is used to control the opacity of the color instead of rgba. the reason for that is that rgba is not supported in CSS gradients.
        >
          <CardContent className="p-4 space-y-3 bg-transparent">
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
              <div className="flex flex-col items-center">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={getTeamLogo(away)} />
                  <AvatarFallback style={{ backgroundColor: away.color }}>{away.abbreviation}</AvatarFallback>
                </Avatar>
                <span style={{ color: parseInt(awayTeam.score) > parseInt(homeTeam.score) ? 'var(--color-chart-2)' : 'var(--color-chart-1)' }} className="text-2xl font-semibold text-muted-foreground">{awayTeam.score}</span>
              </div>
              <span className="text-lg font-semibold text-muted-foreground">@</span>
              <div className="flex flex-col items-center">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={getTeamLogo(home)} />
                  <AvatarFallback style={{ backgroundColor: home.color }}>{home.abbreviation}</AvatarFallback>
                </Avatar>
                <span style={{ color: parseInt(awayTeam.score) > parseInt(homeTeam.score) ? 'var(--color-chart-1)' : 'var(--color-chart-2)' }} className="text-2xl font-semibold text-muted-foreground">{homeTeam.score}</span>
              </div>
            </div>

            {/* Score/Time */}
            <div className="text-center text-lg font-semibold text-muted-foreground">
              {event.status.type.state === 'post'? (<span 
                                                     style={{color: 
                                                     parseInt(awayTeam.score) > parseInt(homeTeam.score)
                                                     ? 'var(--color-chart-2)' 
                                                     : 'var(--color-chart-1)' }}>
                                                     FINAL
                                                     </span>)

                                                 : event.status.type.state === 'in'? (<span 
                                                                                       style={{ color:
                                                                                       parseInt(awayTeam.score) > parseInt(homeTeam.score)
                                                                                       ? 'var(--color-chart-2)' 
                                                                                       : 'var(--color-chart-1)' }}>
                                                                                       {event.status.displayClock} Q{event.status.period}
                                                                                       </span>) 
                                                                                   : (<span>
                                                                                       {date}, {time}
                                                                                      </span>
                                                                                   )}
            </div>
          </CardContent>
        </Card>
      </ShimmerBorder>
    </motion.div>
  );
}

interface ExpandedGameDetailsProps {
  event: Event;
  prediction: any; 
  savedPredictions: any[];
}

function ExpandedGameDetails({ event, prediction, savedPredictions }: ExpandedGameDetailsProps) {
  const competition = event.competitions[0];
  const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
  const awayTeam = competition.competitors.find(c => c.homeAway === 'away');

  if (!homeTeam || !awayTeam) {
    return null; // Or some fallback UI
  }

  const home = homeTeam.team;
  const away = awayTeam.team;
  const weather = event.weather;

  // Find historical prediction
  const historicalPrediction = savedPredictions.find(pred =>
                               pred.homeTeam === home.abbreviation && // Check if the `homeTeam` property of the `pred` object is equal to the `abbreviation` property of the `home` object
                               pred.awayTeam === away.abbreviation // Check if the `awayTeam` property of the `pred` object is equal to the `abbreviation` property of the `away` object
  );
//
  const predictedWinner = prediction?.predictedMargin > 0
                        ? home.shortDisplayName 
                        : away.shortDisplayName;
//
  const actualMargin = parseInt(homeTeam.score) - parseInt(awayTeam.score);
//
  const isCorrect = historicalPrediction && (
                  ( prediction?.predictedMargin > 0 && actualMargin > 0) ||
                  ( prediction?.predictedMargin < 0 && actualMargin < 0) );
//
  return (
    <motion.div
        initial={{ opacity: 0,
                   height: 0 }}
        animate={{ opacity: 1,
                   height: 'auto' }}
        exit=   {{ opacity: 0,
                   height: 0 }}
        className="mt-4 
                   p-4 
                   bg-muted/50 
                   rounded-lg 
                   space-y-3"
        >
{/* Teams */}
<div 
    className="grid 
               grid-cols-2 
               gap-4">
  {/* Venue */}
  <div 
        className="flex 
                   items-center 
                   gap-2 
                   text-sm">
  {/* Map Pin Icon */}                      
  <MapPin 
        className="w-4 
                   h-4"/>
  {/* Venue Name */}                      
        <span>
                  {event.competitions[0]
                  ?.venue?.fullName || 
                  'TBD'}
        </span>
  </div>
  {/* Weather */}
  <div 
        className="flex 
                   items-center 
                   gap-2 
                   text-sm">
  {/* Weather Icon */}                      
        <span>    "weathericon"
        </span>
        <span>
                  {weather?.displayValue || 
                  'N/A'}
        </span>
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
      const homeCompetitor = comp.competitors.find(c => c.homeAway === 'home');
      const awayCompetitor = comp.competitors.find(c => c.homeAway === 'away');

      if (homeCompetitor && awayCompetitor) {
        const homeTeamAbbr = homeCompetitor.team.abbreviation;
        const awayTeamAbbr = awayCompetitor.team.abbreviation;
        await fetchPrediction(homeTeamAbbr, awayTeamAbbr);
      } else {
        console.error("Could not determine home and away teams for event:", event.id);
      }
    }
  };

  const currentWeekData = calendar?.[0]?.entries?.find(e => e.value === currentWeek.toString());

  const weekEvents = useMemo(() => {
    if (!currentWeekData) return events.filter(e => e.week.number === currentWeek);

    const startEST = getGameDateEST(currentWeekData.startDate);
    const endEST = getGameDateEST(currentWeekData.endDate);

    return events.filter(e => {
      const gameDateEST = getGameDateEST(e.date);
      return gameDateEST >= startEST && gameDateEST <= endEST;
    });
  }, [events, currentWeek, currentWeekData]);

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
                                 {expandedCard === event.id && 
                  (<motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="col-span-full"
                  >

                  <Card 
                        className="mt-4">
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
        <div className="text-center 
                        text-muted-foreground">
                        No games scheduled for this week.
        </div>
      )}
    </div>
  );
}
