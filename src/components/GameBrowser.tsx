import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Clock, Loader2, RefreshCw } from 'lucide-react';
import { useBackendConnection } from '@/hooks/usePredictions';
import { motion } from 'framer-motion';
import { BorderTrail } from '@/components/ui/border-trail';

interface Game {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamName: string;
  awayTeamName: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  statusShort: string;
  isLive: boolean;
  isFinished: boolean;
  homeScore?: number | null;
  awayScore?: number | null;
  week: string;
}

interface GameBrowserProps {
  onGameSelect?: (homeTeam: string, awayTeam: string, game: Game) => void;
  selectedGameId?: number | null;
}

export function GameBrowser({ onGameSelect, selectedGameId }: GameBrowserProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useBackendConnection();

  const fetchGames = async () => {
    if (!isConnected) {
      setError('Flask server not connected');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://127.0.0.1:5001/games');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setGames(data || []);
    } catch (err: any) {
      console.error('Failed to fetch games:', err);
      setError(err.message || 'Failed to fetch games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [isConnected]);

  const handleGameSelect = (game: Game) => {
    if (onGameSelect && !game.isFinished) {
      onGameSelect(game.homeTeam, game.awayTeam, game);
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch {
      return timeStr;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (game: Game) => {
    if (game.isLive) {
      return (
        <Badge variant="destructive" className="bg-destructive text-primary-foreground animate-pulse">
          LIVE
        </Badge>
      );
    }
    if (game.isFinished) {
      return <Badge variant="secondary" className="bg-muted text-muted-foreground">FINAL</Badge>;
    }
    return <Badge variant="outline" className="border-border text-muted-foreground">UPCOMING</Badge>;
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            NFL Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2 p-3 bg-muted rounded-lg">
                <div className="h-4 bg-accent rounded w-3/4"></div>
                <div className="h-3 bg-accent rounded w-1/2"></div>
                <div className="h-3 bg-accent rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            NFL Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 space-y-2">
            <div className="text-destructive text-sm">Failed to Load Games</div>
            <div className="text-muted-foreground text-xs">{error}</div>
            <Button
              onClick={fetchGames}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const upcomingGames = games.filter(g => !g.isFinished);
  const liveGames = games.filter(g => g.isLive);
  const finishedGames = games.filter(g => g.isFinished);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          NFL Games
          <Badge variant="secondary" className="text-xs bg-accent text-accent-foreground">
            {games.length} games
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {/* Live Games */}
        {liveGames.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-chart-1 uppercase tracking-wide">Live Now</h4>
            {liveGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                  selectedGameId === game.id
                    ? 'border-primary bg-accent/50'
                    : 'border-border bg-card hover:bg-accent/30'
                }`}
                onClick={() => handleGameSelect(game)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-foreground">
                    {game.awayTeamName} @ {game.homeTeamName}
                  </div>
                  {getStatusBadge(game)}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(game.time)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {game.venue}
                  </div>
                </div>
                {game.homeScore !== null && game.awayScore !== null && (
                  <div className="mt-2 text-sm font-medium text-foreground">
                    Score: {game.awayTeam} {game.awayScore} - {game.homeScore} {game.homeTeam}
                  </div>
                )}
              </motion.div>
            ))}
            <Separator className="bg-border" />
          </div>
        )}

        {/* Upcoming Games */}
        {upcomingGames.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-chart-2 uppercase tracking-wide">Upcoming</h4>
            {upcomingGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                  selectedGameId === game.id
                    ? 'border-primary bg-accent/50'
                    : 'border-border bg-card hover:bg-accent/30'
                }`}
                onClick={() => handleGameSelect(game)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-foreground">
                    {game.awayTeamName} @ {game.homeTeamName}
                  </div>
                  {getStatusBadge(game)}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(game.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(game.time)}
                  </div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {game.venue}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Finished Games */}
        {finishedGames.length > 0 && (
          <div className="space-y-2">
            <Separator className="bg-border" />
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recent Results</h4>
            {finishedGames.slice(0, 3).map((game, index) => (
              <div
                key={game.id}
                className="p-3 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-foreground">
                    {game.awayTeamName} @ {game.homeTeamName}
                  </div>
                  {getStatusBadge(game)}
                </div>
                {game.homeScore !== null && game.awayScore !== null && (
                  <div className="text-sm font-medium text-foreground">
                    Final: {game.awayTeam} {game.awayScore} - {game.homeScore} {game.homeTeam}
                  </div>
                )}
                <div className="mt-1 text-xs text-muted-foreground">
                  {formatDate(game.date)}
                </div>
              </div>
            ))}
          </div>
        )}

        {games.length === 0 && (
          <div className="text-center py-4">
            <div className="text-muted-foreground text-sm">No games available</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}