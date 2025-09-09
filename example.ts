import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flame, MessageCircle, TrendingUp, Users, Clock, Target, Trophy, Calendar } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Team {
  id: string;
  name: string;
  logo: string;
  record: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

interface GamePrediction {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  gameTime: string;
  spread: number;
  overUnder: number;
  homeWinProbability: number;
  awayWinProbability: number;
  confidence: number;
  totalBank: number;
  homeBank: number;
  awayBank: number;
  homePlayers: number;
  awayPlayers: number;
}

interface PredictionCardProps {
  prediction: GamePrediction;
  onBetHome?: () => void;
  onBetAway?: () => void;
  className?: string;
}

const defaultTeams: Team[] = [
  {
    id: "chiefs",
    name: "Kansas City Chiefs",
    logo: "https://static.www.nfl.com/image/private/t_headshot_desktop/league/u9fltoslqdsyao8cpm85",
    record: "11-1",
    color: "#E31837",
    gradientFrom: "#E31837",
    gradientTo: "#FFB81C"
  },
  {
    id: "bills",
    name: "Buffalo Bills", 
    logo: "https://static.www.nfl.com/image/private/t_headshot_desktop/league/giphcy6ie9mxmyviib85",
    record: "10-2",
    color: "#00338D",
    gradientFrom: "#00338D",
    gradientTo: "#C60C30"
  },
  {
    id: "ravens",
    name: "Baltimore Ravens",
    logo: "https://static.www.nfl.com/image/private/t_headshot_desktop/league/uchjqgrljgoalkfurmvn",
    record: "8-4",
    color: "#241773",
    gradientFrom: "#241773",
    gradientTo: "#000000"
  },
  {
    id: "dolphins",
    name: "Miami Dolphins",
    logo: "https://static.www.nfl.com/image/private/t_headshot_desktop/league/lits6p8ycth9o4bkdxj2",
    record: "5-7",
    color: "#008E97",
    gradientFrom: "#008E97",
    gradientTo: "#FC4C02"
  }
];

const defaultPredictions: GamePrediction[] = [
  {
    id: "game1",
    homeTeam: defaultTeams[0],
    awayTeam: defaultTeams[1],
    gameTime: "Sunday 4:25 PM EST",
    spread: -3.5,
    overUnder: 47.5,
    homeWinProbability: 65,
    awayWinProbability: 35,
    confidence: 87,
    totalBank: 245680,
    homeBank: 159692,
    awayBank: 85988,
    homePlayers: 2847,
    awayPlayers: 1523
  },
  {
    id: "game2", 
    homeTeam: defaultTeams[2],
    awayTeam: defaultTeams[3],
    gameTime: "Sunday 1:00 PM EST",
    spread: -7,
    overUnder: 44,
    homeWinProbability: 78,
    awayWinProbability: 22,
    confidence: 92,
    totalBank: 189450,
    homeBank: 147771,
    awayBank: 41679,
    homePlayers: 3156,
    awayPlayers: 892
  }
];

function PredictionCard({ prediction, onBetHome, onBetAway, className }: PredictionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current && !shouldReduceMotion) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setMousePosition({ x, y });
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const homeWinPercentage = (prediction.homeBank / prediction.totalBank) * 100;

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative rounded-2xl overflow-hidden bg-card border border-border", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      {/* Glowing background effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: `radial-gradient(circle at ${mousePosition.x + 200}px ${mousePosition.y + 200}px, ${prediction.homeTeam.color}15 0%, ${prediction.awayTeam.color}10 30%, transparent 70%)`,
          }}
        />
      )}

      <CardContent className="p-6 relative z-10">
        {/* Header with badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
              <Flame className="w-3 h-3 mr-1" />
              HOT PICK
            </Badge>
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
              <Trophy className="w-3 h-3 mr-1" />
              NFL
            </Badge>
          </div>
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            <Target className="w-3 h-3 mr-1" />
            {prediction.confidence}% Confidence
          </Badge>
        </div>

        {/* Teams matchup */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={prediction.awayTeam.logo} alt={prediction.awayTeam.name} />
              <AvatarFallback style={{ backgroundColor: prediction.awayTeam.color }}>
                {prediction.awayTeam.name.split(' ').map(word => word[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{prediction.awayTeam.name}</h3>
              <p className="text-sm text-muted-foreground">{prediction.awayTeam.record}</p>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">VS</div>
            <div className="text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 inline mr-1" />
              {prediction.gameTime}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <h3 className="font-semibold text-foreground">{prediction.homeTeam.name}</h3>
              <p className="text-sm text-muted-foreground">{prediction.homeTeam.record}</p>
            </div>
            <Avatar className="w-12 h-12">
              <AvatarImage src={prediction.homeTeam.logo} alt={prediction.homeTeam.name} />
              <AvatarFallback style={{ backgroundColor: prediction.homeTeam.color }}>
                {prediction.homeTeam.name.split(' ').map(word => word[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Betting lines */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Spread</p>
            <p className="text-lg font-bold" style={{ color: prediction.homeTeam.color }}>
              {prediction.spread > 0 ? '+' : ''}{prediction.spread}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Over/Under</p>
            <p className="text-lg font-bold text-foreground">{prediction.overUnder}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Bank</p>
            <p className="text-lg font-bold text-yellow-500">{formatCurrency(prediction.totalBank)}</p>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Win probabilities */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {prediction.awayTeam.name} Win
              </p>
              <p className="text-xl font-bold" style={{ color: prediction.awayTeam.color }}>
                {prediction.awayWinProbability}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {prediction.homeTeam.name} Win
              </p>
              <p className="text-xl font-bold" style={{ color: prediction.homeTeam.color }}>
                {prediction.homeWinProbability}%
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ 
                background: `linear-gradient(to right, ${prediction.awayTeam.color}, ${prediction.homeTeam.color})`,
                width: `${homeWinPercentage}%`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${homeWinPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          {/* Player counts */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              <Users className="w-4 h-4 inline mr-1" />
              {prediction.awayPlayers.toLocaleString()} players
            </span>
            <span>
              <Users className="w-4 h-4 inline mr-1" />
              {prediction.homePlayers.toLocaleString()} players
            </span>
          </div>
        </div>

        {/* Betting buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onBetAway}
              className="w-full relative overflow-hidden font-semibold py-3 rounded-xl border transition-all duration-300 group"
              style={{ 
                backgroundColor: prediction.awayTeam.color,
                borderColor: `${prediction.awayTeam.color}50`
              }}
            >
              <span className="relative z-10">
                BET {prediction.awayTeam.name.split(' ').pop()?.toUpperCase()} ↗
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onBetHome}
              className="w-full relative overflow-hidden font-semibold py-3 rounded-xl border transition-all duration-300 group"
              style={{ 
                backgroundColor: prediction.homeTeam.color,
                borderColor: `${prediction.homeTeam.color}50`
              }}
            >
              <span className="relative z-10">
                BET {prediction.homeTeam.name.split(' ').pop()?.toUpperCase()} ↘
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </motion.div>
  );
}

interface TeamSelectorProps {
  teams?: Team[];
  selectedTeam?: string;
  onTeamSelect?: (teamId: string) => void;
  className?: string;
}

function TeamSelector({ teams = defaultTeams, selectedTeam, onTeamSelect, className }: TeamSelectorProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground">Select Your Team</h3>
      </div>
      
      <Select value={selectedTeam} onValueChange={onTeamSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a team to follow" />
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                <span>{team.name}</span>
                <span className="text-muted-foreground">({team.record})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  className?: string;
}

function StatsCard({ title, value, change, icon, trend, className }: StatsCardProps) {
  return (
    <motion.div
      className={cn("relative", className)}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="text-muted-foreground">{icon}</div>
            <div className={cn("text-xs font-medium", trend === 'up' ? 'text-green-500' : 'text-red-500')}>
              {change}
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function SportsPredictionDashboard() {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [predictions] = useState<GamePrediction[]>(defaultPredictions);

  const handleBetHome = (gameId: string) => {
    console.log(`Betting on home team for game ${gameId}`);
  };

  const handleBetAway = (gameId: string) => {
    console.log(`Betting on away team for game ${gameId}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            NFL Prediction Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-powered predictions and live betting markets
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <StatsCard
            title="Total Predictions"
            value="1,247"
            change="+12%"
            icon={<Target className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="Accuracy Rate"
            value="87.3%"
            change="+2.1%"
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="Active Users"
            value="24.8K"
            change="+8.4%"
            icon={<Users className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="Live Games"
            value="16"
            change="-2"
            icon={<Clock className="w-5 h-5" />}
            trend="down"
          />
        </motion.div>

        {/* Team Selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TeamSelector
            teams={defaultTeams}
            selectedTeam={selectedTeam}
            onTeamSelect={setSelectedTeam}
            className="max-w-md"
          />
        </motion.div>

        {/* Prediction Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {predictions.map((prediction, index) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <PredictionCard
                prediction={prediction}
                onBetHome={() => handleBetHome(prediction.id)}
                onBetAway={() => handleBetAway(prediction.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
