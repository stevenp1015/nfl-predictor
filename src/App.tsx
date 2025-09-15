'use client'

import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, Clock, Target, BarChart3, Trophy, Zap, Calendar, MapPin, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import { usePredictions, usePrediction, useBackendConnection } from '@/hooks/usePredictions';
import { getAllTeams, convertToTeamInterface, getTeamsByConference } from '@/data/nflTeams';
import PredictionManager from '@/components/PredictionManager';
import { PredictionTest } from '@/components/PredictionTest';
import { RealStatsCard } from '@/components/RealStatsCard';
import { GameBrowser } from '@/components/GameBrowser';
import { BorderTrail } from "@/components/ui/border-trail";

interface Team {
  id: string;
  name: string;
  logo: string;
  record: string;
  color: string;
  stats: {
    offense: number;
    defense: number;
    recent: string;
  };
}

interface GamePrediction {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  gameTime: string;
  venue: string;
  spread: number;
  overUnder: number;
  confidence: number;
  prediction: 'home' | 'away';
  aiAnalysis: string;
}

interface PredictionCardProps {
  game?: GamePrediction;
  onTeamSelect?: (team: Team) => void;
  onPredictionSubmit?: (prediction: any) => void;
}

// Get all NFL teams and convert to Team interface
const getAllNFLTeams = (): Team[] => {
  return getAllTeams().map(convertToTeamInterface);
};

const defaultTeams: Team[] = getAllNFLTeams();

// Remove hardcoded game - we'll use dynamic team selection instead

function GlowingCard({ children, className = "", glowColor = "#3b82f6", isActive = false }: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  isActive?: boolean;
}) {
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

function TeamSelector({ teams = defaultTeams, selectedTeam, onTeamSelect }: {
  teams?: Team[];
  selectedTeam?: Team;
  onTeamSelect?: (team: Team) => void;
}) {
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

interface RealPredictionCardProps {
  onPredictionSubmit?: (prediction: any) => void;
  selectedHomeTeam?: string;
  selectedAwayTeam?: string;
}

function RealPredictionCard({ onPredictionSubmit, selectedHomeTeam, selectedAwayTeam }: RealPredictionCardProps) {
  const [homeTeam, setHomeTeam] = useState<string>(selectedHomeTeam || '');
  const [awayTeam, setAwayTeam] = useState<string>(selectedAwayTeam || '');
  const [selectedPrediction, setSelectedPrediction] = useState<'home' | 'away' | null>(null);
  const [confidence, setConfidence] = useState(75);
  const { prediction, isLoading, error, fetchPrediction } = usePrediction();

  const teams = getAllTeams();

  // Update teams when props change
  useEffect(() => {
    if (selectedHomeTeam) setHomeTeam(selectedHomeTeam);
    if (selectedAwayTeam) setAwayTeam(selectedAwayTeam);
  }, [selectedHomeTeam, selectedAwayTeam]);

  // Get team data for display
  const getHomeTeamData = () => teams.find(t => t.shortName === homeTeam);
  const getAwayTeamData = () => teams.find(t => t.shortName === awayTeam);

  // Generate prediction when both teams are selected
  const handleGeneratePrediction = async () => {
    if (!homeTeam || !awayTeam || homeTeam === awayTeam) return;
    await fetchPrediction(homeTeam, awayTeam);
  };

  // Auto-generate prediction when teams change
  useEffect(() => {
    if (homeTeam && awayTeam && homeTeam !== awayTeam) {
      handleGeneratePrediction();
    }
  }, [homeTeam, awayTeam]);

  const homeTeamData = getHomeTeamData();
  const awayTeamData = getAwayTeamData();

  return (
    <GlowingCard
      className="p-6"
      glowColor={selectedPrediction === 'home' ? homeTeamData?.primaryColor : selectedPrediction === 'away' ? awayTeamData?.primaryColor : "#3b82f6"}
      isActive={!!selectedPrediction || !!prediction}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">ML Prediction Generator</h3>
          </div>
          {isLoading && (
            <Badge className="bg-blue-500 text-white">
              <Clock className="w-3 h-3 mr-1 animate-spin" />
              Generating...
            </Badge>
          )}
          {prediction && !error && (
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              ML Ready
            </Badge>
          )}
        </div>

        {/* Team Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Away Team</label>
            <Select value={awayTeam} onValueChange={setAwayTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Select away team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(team => (
                  <SelectItem key={team.id} value={team.shortName} disabled={team.shortName === homeTeam}>
                    <div className="flex items-center gap-2">
                      <img src={team.logo} alt={team.name} className="w-4 h-4" />
                      {team.name} ({team.shortName})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Home Team</label>
            <Select value={homeTeam} onValueChange={setHomeTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Select home team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(team => (
                  <SelectItem key={team.id} value={team.shortName} disabled={team.shortName === awayTeam}>
                    <div className="flex items-center gap-2">
                      <img src={team.logo} alt={team.name} className="w-4 h-4" />
                      {team.name} ({team.shortName})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* ML Prediction Results */}
        {prediction && !error && homeTeamData && awayTeamData && (
          <>
            {/* Matchup Display */}
            <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-2">
                  <AvatarImage src={awayTeamData.logo} alt={awayTeamData.name} />
                  <AvatarFallback style={{ backgroundColor: awayTeamData.primaryColor }}>
                    {awayTeamData.shortName}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm font-semibold">{awayTeamData.name}</div>
                <div className="text-xs text-muted-foreground">@ Away</div>
              </div>
              <div className="text-2xl font-bold">VS</div>
              <div className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-2">
                  <AvatarImage src={homeTeamData.logo} alt={homeTeamData.name} />
                  <AvatarFallback style={{ backgroundColor: homeTeamData.primaryColor }}>
                    {homeTeamData.shortName}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm font-semibold">{homeTeamData.name}</div>
                <div className="text-xs text-muted-foreground">Home</div>
              </div>
            </div>

            {/* ML Prediction Data */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {prediction.predictedMargin > 0 ? '+' : ''}{prediction.predictedMargin.toFixed(1)}
                </div>
                <div className="text-sm text-blue-800">ML Margin</div>
                <div className="text-xs text-blue-600 mt-1">
                  {prediction.predictedMargin > 0 ? 'Home favored' : 'Away favored'}
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(prediction.winProbability * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-green-800">Win Probability</div>
                <div className="text-xs text-green-600 mt-1">
                  Favored team
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {(prediction.confidenceScore * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-purple-800">ML Confidence</div>
                <div className="text-xs text-purple-600 mt-1">
                  Model certainty
                </div>
              </div>
            </div>

            {/* Key ML Factors */}
            {prediction.keyFactors && prediction.keyFactors.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">🔍 Key ML Factors:</h4>
                <div className="space-y-2">
                  {prediction.keyFactors.map((factor, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm">{factor.factor}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        factor.impact === 'High' ? 'bg-red-100 text-red-700' :
                        factor.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {factor.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prediction Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Your Prediction:</span>
                <div className="flex gap-2">
                  <Button
                    variant={selectedPrediction === 'away' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPrediction('away')}
                  >
                    Away Win
                  </Button>
                  <Button
                    variant={selectedPrediction === 'home' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPrediction('home')}
                  >
                    Home Win
                  </Button>
                </div>
              </div>

              {selectedPrediction && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Your Confidence:</span>
                    <span className="text-sm font-mono">{confidence}%</span>
                  </div>
                  <Progress value={confidence} className="h-2" />
                  <div className="flex gap-2">
                    {[50, 65, 80, 95].map((val) => (
                      <Button
                        key={val}
                        variant="outline"
                        size="sm"
                        onClick={() => setConfidence(val)}
                        className="text-xs"
                      >
                        {val}%
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              <Button
                className="w-full"
                disabled={!selectedPrediction || !prediction}
                onClick={() => onPredictionSubmit?.({
                  homeTeam: homeTeam,
                  awayTeam: awayTeam,
                  team: selectedPrediction,
                  confidence: confidence,
                  prediction: prediction,
                  game: `${awayTeam}_at_${homeTeam}`
                })}
              >
                <Zap className="w-4 h-4 mr-2" />
                Save ML Prediction
              </Button>
            </div>
          </>
        )}

        {/* Instructions */}
        {!homeTeam || !awayTeam && (
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Select two teams to generate ML predictions</p>
          </div>
        )}
      </div>
    </GlowingCard>
  );
}

// Removed fake StatsCard - replaced with RealStatsCard component

function RecentPredictions() {
  const predictions = [
    { game: 'Chiefs vs Bills', prediction: 'Chiefs -2.5', result: 'W', confidence: 78 },
    { game: 'Cowboys vs Eagles', prediction: 'Eagles +3', result: 'W', confidence: 65 },
    { game: 'Packers vs Lions', prediction: 'Over 48.5', result: 'L', confidence: 82 },
  ];

  return (
    <GlowingCard className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Predictions</h3>
        </div>
        <div className="space-y-3">
          {predictions.map((pred, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="space-y-1">
                <div className="text-sm font-medium">{pred.game}</div>
                <div className="text-xs text-muted-foreground">{pred.prediction}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={pred.result === 'W' ? 'default' : 'destructive'}>
                  {pred.result}
                </Badge>
                <span className="text-xs text-muted-foreground">{pred.confidence}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlowingCard>
  );
}

export function SportsPredictionDashboard() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState('predictions');
  const [selectedGameTeams, setSelectedGameTeams] = useState<{home: string, away: string} | null>(null);
  
  const {
    predictions,
    todaysGames,
    savedPredictions,
    loading,
    error,
    deletePrediction,
    editPrediction,
    savePrediction
  } = usePredictions();
  
  const { isConnected, checkConnection } = useBackendConnection();

  const handlePredictionSubmit = async (prediction: any) => {
    try {
      console.log('Saving ML prediction:', prediction);

      // Save to Flask backend with proper prediction data
      const predictionData = {
        homeTeam: prediction.homeTeam,
        awayTeam: prediction.awayTeam,
        prediction: prediction.prediction, // Contains the ML prediction data
        matchup: `${prediction.awayTeam} @ ${prediction.homeTeam}`,
        gameId: prediction.game,
        venue: 'TBD', // Can be enhanced later
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
      };

      await savePrediction(predictionData);

      console.log('ML prediction saved successfully!');
    } catch (error) {
      console.error('Failed to save ML prediction:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              NFL Prediction Dashboard
            </h1>
            <motion.div
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                isConnected 
                  ? 'bg-green-500/20 text-green-600 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-600 border border-red-500/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => checkConnection()}
              style={{ cursor: 'pointer' }}
            >
              {isConnected ? (
                <>
                  <Wifi className="w-3 h-3" />
                  API Connected
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" />
                  API Disconnected
                </>
              )}
            </motion.div>
          </div>
          <p className="text-muted-foreground">
            AI-powered sports predictions with real-time analytics
          </p>
          {error && (
            <div className="bg-red-500/20 text-red-600 border border-red-500/30 rounded-lg p-3 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
          {loading && (
            <div className="bg-blue-500/20 text-blue-600 border border-blue-500/30 rounded-lg p-3 text-sm">
              Loading predictions from Flask backend...
            </div>
          )}
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full"
          onSelect={(value) => {
            if (value !== 'predictions') {
              setSelectedGameTeams(null); // Clear selection when leaving tab
            }
          }}
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="manage">Manage ({savedPredictions.length})</TabsTrigger>
            <TabsTrigger value="test">🧪 Test Flask</TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <RealPredictionCard
                  onPredictionSubmit={handlePredictionSubmit}
                  selectedHomeTeam={selectedGameTeams?.home}
                  selectedAwayTeam={selectedGameTeams?.away}
                />
              </div>
              <div className="space-y-6">
                <GameBrowser onGameSelect={(homeTeam, awayTeam, game) => {
                  // Auto-select the game teams in the prediction card
                  setSelectedGameTeams({ home: homeTeam, away: awayTeam });
                  console.log('Selected game:', { homeTeam, awayTeam, game });
                }} />
                <RealStatsCard />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RealStatsCard />
              <RecentPredictions />
              <Card className="p-6 relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <h3 className="text-lg font-semibold">Performance Trends</h3>
                  <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Chart Placeholder</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TeamSelector 
                selectedTeam={selectedTeam} 
                onTeamSelect={setSelectedTeam} 
              />
              {selectedTeam && (
                <GlowingCard className="p-6" glowColor={selectedTeam.color} isActive>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={selectedTeam.logo} alt={selectedTeam.name} />
                        <AvatarFallback style={{ backgroundColor: selectedTeam.color }}>
                          {selectedTeam.name.split(' ').map(w => w[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">{selectedTeam.name}</h3>
                        <p className="text-muted-foreground">Record: {selectedTeam.record}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Offense Rating</span>
                          <span>{selectedTeam.stats.offense}/100</span>
                        </div>
                        <Progress value={selectedTeam.stats.offense} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Defense Rating</span>
                          <span>{selectedTeam.stats.defense}/100</span>
                        </div>
                        <Progress value={selectedTeam.stats.defense} className="h-2" />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Recent Form:</span>
                        <Badge variant="outline">{selectedTeam.stats.recent}</Badge>
                      </div>
                    </div>
                  </div>
                </GlowingCard>
              )}
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <PredictionManager
              predictions={savedPredictions}
              onDeletePrediction={deletePrediction}
              onEditPrediction={editPrediction}
            />
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <PredictionTest />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function App() {
  return <SportsPredictionDashboard />;
}