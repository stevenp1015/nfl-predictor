import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getBulkPredictions, savePrediction, isPredictionCorrect } from '../api/predictions';
import { PredictionCard } from './ui/prediction-card';
import { StatsCard } from './ui/stats-card';
import { Button } from './ui/button';
import { GlowingEffect } from './ui/glowing-effect';
import { Target, TrendingUp, Users, Clock } from 'lucide-react';
import { cn } from "@/lib/utils";

const EnhancedTodaysGames = ({ onSave }) => {
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [savingStates, setSavingStates] = useState({});
  const [saveMessages, setSaveMessages] = useState({});

  // Define NFL team colors for enhanced visuals
  const teamColors = {
    'buffalo-bills': '#00338D',
    'miami-dolphins': '#008E97', 
    'new-england-patriots': '#002244',
    'new-york-jets': '#125740',
    'baltimore-ravens': '#241773',
    'cincinnati-bengals': '#FB4F14',
    'cleveland-browns': '#311D00',
    'pittsburgh-steelers': '#FFB612',
    'houston-texans': '#03202F',
    'indianapolis-colts': '#002C5F',
    'jacksonville-jaguars': '#006778',
    'tennessee-titans': '#0C2340',
    'denver-broncos': '#FB4F14',
    'kansas-city-chiefs': '#E31837',
    'las-vegas-raiders': '#000000',
    'los-angeles-chargers': '#0080C6',
    'dallas-cowboys': '#003594',
    'new-york-giants': '#0B2265',
    'philadelphia-eagles': '#004C54',
    'washington-commanders': '#5A1414',
    'chicago-bears': '#0B162A',
    'detroit-lions': '#0076B6',
    'green-bay-packers': '#203731',
    'minnesota-vikings': '#4F2683',
    'atlanta-falcons': '#A71930',
    'carolina-panthers': '#0085CA',
    'new-orleans-saints': '#D3BC8D',
    'tampa-bay-buccaneers': '#D50A0A',
    'arizona-cardinals': '#97233F',
    'los-angeles-rams': '#003594',
    'san-francisco-49ers': '#AA0000',
    'seattle-seahawks': '#002244'
  };

  const getTeamColor = (teamName) => {
    const key = teamName.toLowerCase().replace(/\s+/g, '-');
    return teamColors[key] || '#1f2937';
  };

  const handleFetchPredictions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getBulkPredictions(selectedDate);
      setPredictions(data);
    } catch (err) {
      setError(err.message);
      setPredictions(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrediction = async (pred) => {
    const gameId = pred.gameId;
    setSavingStates(prev => ({ ...prev, [gameId]: true }));
    
    try {
      const formattedPred = formatPredictionData(pred);
      const predictionData = {
        homeTeam: pred.homeTeam,
        awayTeam: pred.awayTeam,
        prediction: formattedPred,
        matchup: `${pred.awayTeamName} @ ${pred.homeTeamName}`,
        gameId: pred.gameId,
        venue: pred.venue,
        date: pred.date,
        time: pred.time
      };
      
      await savePrediction(predictionData);
      setSaveMessages(prev => ({ ...prev, [gameId]: 'Saved!' }));
      setTimeout(() => {
        setSaveMessages(prev => ({ ...prev, [gameId]: '' }));
      }, 3000);
      if (onSave) onSave();
    } catch (error) {
      setSaveMessages(prev => ({ ...prev, [gameId]: 'Failed to save' }));
      setTimeout(() => {
        setSaveMessages(prev => ({ ...prev, [gameId]: '' }));
      }, 3000);
    } finally {
      setSavingStates(prev => ({ ...prev, [gameId]: false }));
    }
  };

  const convertMarginToWinProbability = (margin, k) => {
    return 1 / (1 + Math.exp(-k * margin));
  };

  const calculateConfidence = (margin, confidenceMap) => {
    const absMargin = Math.abs(margin);
    if (absMargin < 2) return confidenceMap['0-2'] / 100;
    if (absMargin < 4) return confidenceMap['2-4'] / 100;
    if (absMargin < 6) return confidenceMap['4-6'] / 100;
    if (absMargin < 8) return confidenceMap['6-8'] / 100;
    if (absMargin < 10) return confidenceMap['8-10'] / 100;
    if (absMargin < 14) return confidenceMap['10-14'] / 100;
    return confidenceMap['14+'] / 100;
  };

  const formatPredictionData = (pred) => {
    const { predictedMargin, metrics } = pred;
    const homeWinProbability = convertMarginToWinProbability(predictedMargin, metrics.optimal_k);
    const confidenceScore = calculateConfidence(predictedMargin, metrics.confidence_map);
    const winProbabilityForDisplay = predictedMargin > 0 ? homeWinProbability : 1 - homeWinProbability;
    
    return {
      predictedMargin,
      winProbability: winProbabilityForDisplay,
      confidenceScore
    };
  };

  const transformPredictionToCardFormat = (pred) => {
    const formattedPred = formatPredictionData(pred);
    const homeTeamColor = getTeamColor(pred.homeTeamName);
    const awayTeamColor = getTeamColor(pred.awayTeamName);
    
    return {
      id: pred.gameId,
      homeTeam: {
        name: pred.homeTeamName,
        record: "0-0", // You can enhance this with real records
        color: homeTeamColor,
        logo: `https://a.espncdn.com/i/teamlogos/nfl/500/${pred.homeTeam}.png`
      },
      awayTeam: {
        name: pred.awayTeamName, 
        record: "0-0", // You can enhance this with real records
        color: awayTeamColor,
        logo: `https://a.espncdn.com/i/teamlogos/nfl/500/${pred.awayTeam}.png`
      },
      gameTime: `${pred.time} EST`,
      spread: pred.predictedMargin,
      overUnder: 45.5, // Default since not in your data
      homeWinProbability: Math.round(formattedPred.winProbability * 100),
      awayWinProbability: Math.round((1 - formattedPred.winProbability) * 100),
      confidence: Math.round(formattedPred.confidenceScore * 100),
      totalBank: 245680, // Mock data for visual appeal
      homeBank: 159692,
      awayBank: 85988,
      homePlayers: 2847,
      awayPlayers: 1523
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">
          Today's NFL Games
        </h2>
        <p className="text-lg text-gray-300">
          AI-powered predictions and live betting insights
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative">
          <GlowingEffect 
            spread={60}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <Button
            onClick={handleFetchPredictions}
            disabled={isLoading}
            className="relative z-10 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            {isLoading ? 'Loading predictions...' : 'Get Predictions'}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {predictions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <StatsCard
            title="Total Games"
            value={predictions.totalGames.toString()}
            change="+12%"
            icon={<Target className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="Predictions Made"
            value={predictions.successfulPredictions.toString()}
            change="+8.4%"
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="Active Bettors"
            value="24.8K"
            change="+15.2%"
            icon={<Users className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="Live Games"
            value="3"
            change="-1"
            icon={<Clock className="w-5 h-5" />}
            trend="down"
          />
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200"
        >
          {error}
        </motion.div>
      )}

      {predictions && (
        <div className="space-y-4">
          {predictions.predictions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl mb-2">No games found for {predictions.date}</p>
              <p className="text-sm">Try selecting a different date during NFL season.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {predictions.predictions.map((pred, index) => {
                const cardPrediction = transformPredictionToCardFormat(pred);
                
                return (
                  <motion.div
                    key={pred.gameId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <PredictionCard
                      prediction={cardPrediction}
                      onBetHome={() => handleSavePrediction(pred)}
                      onBetAway={() => handleSavePrediction(pred)}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedTodaysGames;