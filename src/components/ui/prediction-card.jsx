import React, { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from './badge';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Separator } from './separator';
import { Flame, Target, Trophy, Calendar, Users } from 'lucide-react';
import { cn } from "@/lib/utils";

function PredictionCard({ 
  prediction, 
  onBetHome, 
  onBetAway, 
  className 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e) => {
    if (cardRef.current && !shouldReduceMotion) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setMousePosition({ x, y });
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return `${amount}`;
  };

  const homeWinPercentage = (prediction.homeBank / prediction.totalBank) * 100;

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative rounded-2xl overflow-hidden bg-gray-900/90 border border-gray-700/50 backdrop-blur-sm", className)}
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
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: prediction.awayTeam.color }}
            >
              {prediction.awayTeam.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
            </div>
            <div>
              <h3 className="font-semibold text-white">{prediction.awayTeam.name}</h3>
              <p className="text-sm text-gray-400">{prediction.awayTeam.record}</p>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-white">VS</div>
            <div className="text-xs text-gray-400">
              <Calendar className="w-3 h-3 inline mr-1" />
              {prediction.gameTime}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <h3 className="font-semibold text-white">{prediction.homeTeam.name}</h3>
              <p className="text-sm text-gray-400">{prediction.homeTeam.record}</p>
            </div>
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: prediction.homeTeam.color }}
            >
              {prediction.homeTeam.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
            </div>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Betting lines */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Spread</p>
            <p className="text-lg font-bold" style={{ color: prediction.homeTeam.color }}>
              {prediction.spread > 0 ? '+' : ''}{prediction.spread}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Over/Under</p>
            <p className="text-lg font-bold text-white">{prediction.overUnder}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Total Bank</p>
            <p className="text-lg font-bold text-yellow-400">{formatCurrency(prediction.totalBank)}</p>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Win probabilities */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {prediction.awayTeam.name.split(' ').pop()} Win
              </p>
              <p className="text-xl font-bold" style={{ color: prediction.awayTeam.color }}>
                {prediction.awayWinProbability}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {prediction.homeTeam.name.split(' ').pop()} Win
              </p>
              <p className="text-xl font-bold" style={{ color: prediction.homeTeam.color }}>
                {prediction.homeWinProbability}%
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
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
          <div className="flex justify-between text-sm text-gray-400">
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
                borderColor: `${prediction.awayTeam.color}50`,
                color: 'white'
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
                borderColor: `${prediction.homeTeam.color}50`,
                color: 'white'
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

export { PredictionCard };