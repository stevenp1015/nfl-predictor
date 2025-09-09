import React, { useState } from 'react';
import { getBulkPredictions, savePrediction, isPredictionCorrect } from '../api/predictions';
import { GlowingEffect } from './ui/glowing-effect';
import { GameCard, StatCard } from './ui/animated-card';
import { cn } from "@/lib/utils";


const TodaysGames = ({ onSave }) => {
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [savingStates, setSavingStates] = useState({});
  const [saveMessages, setSaveMessages] = useState({});

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
      if (onSave) onSave(); // Trigger refresh of saved predictions
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

  const getPredictedWinner = (pred) => {
    const { predictedMargin, homeTeamName, awayTeamName } = pred;
    const predictedWinner = predictedMargin > 0 ? homeTeamName : awayTeamName;
    const isHomeFavored = predictedMargin > 0;
    
    return { predictedWinner, isHomeFavored };
  };

  // Remove local implementation - now using shared utility from predictions.js

  return (
    <div className="gr-gap-21 flex flex-col">
      <div className="flex items-center gr-gap-13">
        <h3 className="gr-text-2xl font-semibold text-gray-900">Today's Games</h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="gr-px-13 gr-py-8 border border-gray-300 gr-rounded-8 focus:outline-none focus:ring-2 focus:ring-blue-500 gr-text-base"
        />
        <div className="relative gr-rounded-13">
          <GlowingEffect 
            spread={100}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={1}
          />
          <button
            onClick={handleFetchPredictions}
            disabled={isLoading}
            className="gr-btn gr-btn-sm gr-text-base relative z-30"
          >
            {isLoading ? 'Loading game predictions...' : 'Get Predictions'}
          </button>
        </div>
      </div>

      {error && (
        <div className="gr-message gr-message-error">
          {error}
        </div>
      )}

      {predictions && (
        <div className="gr-gap-13 flex flex-col">
          <div className="gr-text-sm text-gray-600">
            Found {predictions.totalGames} games on {predictions.date} • {predictions.successfulPredictions} predictions generated
          </div>

          {predictions.predictions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No games found for {predictions.date}</p>
              <p className="text-sm">Try selecting a different date during NFL season.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.predictions.map((pred) => {
                  // Pre-calculate these values to avoid race conditions in render
                  const formattedPred = formatPredictionData(pred);
                  const { predictedWinner, isHomeFavored } = getPredictedWinner(pred);
                  const predictionCorrect = isPredictionCorrect(
                    pred.predictedMargin,
                    pred.homeScore,
                    pred.awayScore,
                    pred.isFinished
                  );
                
                const gameStatus = pred.isFinished ? 'finished' : pred.isLive ? 'live' : 'upcoming';
                
                return (
                  <GameCard 
                    key={pred.gameId}
                    homeTeam={pred.homeTeamName}
                    awayTeam={pred.awayTeamName}
                    status={gameStatus}
                    className="mb-4"
                  >
                    {/* Header with time, venue, and controls */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-sm text-gray-300">
                        {pred.time} EST • {pred.venue}
                      </div>
                      <div className="flex items-center space-x-2">
                        {saveMessages[pred.gameId] && (
                          <span className={`text-sm font-medium ${
                            saveMessages[pred.gameId].includes('Saved') ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {saveMessages[pred.gameId]}
                          </span>
                        )}
                        {/* Prediction accuracy indicator */}
                        {predictionCorrect !== null && (
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            predictionCorrect 
                              ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-400/30'
                          }`}>
                            {predictionCorrect ? '✓ Correct' : '✗ Wrong'}
                          </div>
                        )}
                        {/* Save button */}
                        <div className="relative">
                          <GlowingEffect 
                            spread={40}
                            glow={true}
                            disabled={false}
                            proximity={50}
                            inactiveZone={0.1}
                            borderWidth={1}
                          />
                          <button
                            onClick={() => handleSavePrediction(pred)}
                            disabled={savingStates[pred.gameId]}
                            className="relative z-10 px-3 py-1 text-sm font-medium bg-green-500/20 text-green-400 border border-green-400/30 rounded hover:bg-green-500/30 transition-colors disabled:opacity-50"
                          >
                            {savingStates[pred.gameId] ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Scores for finished/live games */}
                    {(pred.isFinished || pred.isLive) && pred.homeScore !== null && pred.awayScore !== null && (
                      <div className="mb-6 p-4 bg-black/30 rounded-lg border border-white/10">
                        <div className="flex items-center justify-center gap-8">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-400">{pred.awayTeamName}</div>
                            <div className="text-4xl font-bold text-white mt-1">{pred.awayScore}</div>
                          </div>
                          <div className="text-3xl font-bold text-gray-500">-</div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-400">{pred.homeTeamName}</div>
                            <div className="text-4xl font-bold text-white mt-1">{pred.homeScore}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Predicted winner indicator */}
                    <div className="mb-6 text-center">
                      <div className="text-sm font-medium text-gray-400 mb-3">Predicted Winner</div>
                      <div className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-semibold ${
                        isHomeFavored 
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
                          : 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                      }`}>
                        <span className="mr-2 text-xl">{isHomeFavored ? '🏠' : '✈️'}</span>
                        {predictedWinner}
                        <span className="ml-2 text-sm opacity-75">
                          by {Math.abs(formattedPred.predictedMargin)}
                        </span>
                      </div>
                    </div>

                    {/* Prediction stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <StatCard 
                        value={formattedPred.predictedMargin > 0 ? `+${formattedPred.predictedMargin}` : `${formattedPred.predictedMargin}`}
                        label="Margin"
                      />
                      <StatCard 
                        value={`${(formattedPred.winProbability * 100).toFixed(1)}%`}
                        label="Win Probability"
                      />
                      <StatCard 
                        value={`${(formattedPred.confidenceScore * 100).toFixed(1)}%`}
                        label="Confidence"
                      />
                    </div>
                  </GameCard>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TodaysGames;