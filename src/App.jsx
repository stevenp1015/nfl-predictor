import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TeamSelector from './components/TeamSelector';
import PredictionDisplay from './components/PredictionDisplay';
import ModelStats from './components/ModelStats';
import SavedPredictions from './components/SavedPredictions';
import EnhancedTodaysGames from './components/EnhancedTodaysGames';
import { AnimatedCard } from './components/ui/animated-card';
import { StatsCard } from './components/ui/stats-card';
import { usePrediction } from './hooks/usePrediction';
import { cn } from "@/lib/utils";
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Target, TrendingUp, Users, Trophy } from 'lucide-react';

function App() {
  const [selectedTeams, setSelectedTeams] = useState({
    home: '',
    away: ''
  });
  const [refreshSavedPredictions, setRefreshSavedPredictions] = useState(0);

  const { prediction, isLoading, error, fetchPrediction } = usePrediction();

  const triggerSavedPredictionsRefresh = () => {
    setRefreshSavedPredictions(prev => prev + 1);
  };

  const handleGetPrediction = () => {
    if (selectedTeams.home && selectedTeams.away) {
      fetchPrediction(selectedTeams.home, selectedTeams.away);
    }
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
              <p className="text-xl text-muted-foreground">
                ML powered insights for every game, every week.
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
                value="calculating..."
                change="+x%"
                icon={<Target className="w-5 h-5" />}
                trend="up"
              />
              <StatsCard
                title="Accuracy Rate"
                value="?? calculating..."
                change="+x%"
                icon={<TrendingUp className="w-5 h-5" />}
                trend="up"
              />
              <StatsCard
                title="placeholder for..."
                value="something?"
                change="+x%"
                icon={<Users className="w-5 h-5" />}
                trend="up"
              />
              <StatsCard
                title="Live Games"
                value="16"
                change="-2"
                icon={<Trophy className="w-5 h-5" />}
                trend="down"
              />
            </motion.div>

            {/* Main Prediction Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AnimatedCard variant="nfl" className="mb-8">

                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Single Game Predictor</h2>
                    <p className="text-gray-200">
                      Select teams for head-to-head prediction analysis
                    </p>
                  </div>
                  <div className="text-right">
                  </div>
                </div>
                <div className="p-8 bg-white/95 backdrop-blur-sm">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex-1">
                      <TeamSelector
                        label="Away Team"
                        value={selectedTeams.away}
                        onChange={(team) => setSelectedTeams(prev => ({...prev, away: team}))}
                      />
                    </div>
                    <div className="flex items-center justify-center text-3xl font-bold text-gray-600 mt-6">
                      @
                    </div>
                    <div className="flex-1">
                      <TeamSelector
                        label="Home Team"
                        value={selectedTeams.home}
                        onChange={(team) => setSelectedTeams(prev => ({...prev, home: team}))}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <GlowingEffect 
                      spread={100}
                      glow={true}
                      disabled={false}
                      proximity={64}
                      inactiveZone={0.01}
                      borderWidth={2}
                    />
                    <button
                      onClick={handleGetPrediction}
                      disabled={!selectedTeams.home || !selectedTeams.away || isLoading}
                      className={cn(
                        "w-full py-4 px-6 text-lg font-semibold rounded-lg relative z-10 transition-all duration-300",
                        "bg-gradient-to-r from-green-500 to-blue-600 text-white",
                        "hover:from-green-600 hover:to-blue-700 hover:shadow-lg",
                        "disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                      )}
                    >
                      {isLoading ? 'Analyzing game data...' : 'Get Prediction'}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-red-700 font-medium">
                        {error}
                      </div>
                    </div>
                  )}

                  {prediction && (
                    <div className="mt-6">
                      <PredictionDisplay 
                        prediction={prediction} 
                        homeTeam={selectedTeams.home} 
                        awayTeam={selectedTeams.away}
                        onSave={triggerSavedPredictionsRefresh}
                      />
                    </div>
                  )}
                </div>
              </AnimatedCard>
            </motion.div>
            
            {/* Today's Games Section - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <AnimatedCard variant="dark" className="mb-8">
                <div className="p-8">
                  <EnhancedTodaysGames onSave={triggerSavedPredictionsRefresh} />
                </div>
              </AnimatedCard>
            </motion.div>
            
            {/* Saved Predictions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <AnimatedCard variant="default" className="mb-8">
                <div className="p-8">
                  <SavedPredictions refreshTrigger={refreshSavedPredictions} />
                </div>
              </AnimatedCard>
            </motion.div>
            
            <ModelStats />
            
            {/* Code Playground - Enhanced with glow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AnimatedCard variant="dark" className="mt-8">
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-white mb-6">Code Playground</h3>
                  <div className="relative">
                    <GlowingEffect 
                      spread={60}
                      glow={true}
                      disabled={false}
                      proximity={80}
                      inactiveZone={0.1}
                      borderWidth={1}
                    />
                    <textarea
                      className="w-full h-64 p-4 font-mono text-sm bg-black/50 text-green-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent relative z-10 backdrop-blur-sm"
                      placeholder="Start coding here, you magnificent bastard..."
                    ></textarea>
                  </div>
                  <p className="mt-4 text-sm text-gray-400">
                    Just a little something to scratch that coding itch, Steven. Don't go breaking anything important now, you hear.
                  </p>
                </div>
              </AnimatedCard>
            </motion.div>
          </div>
        </div>
  );
}

export default App;