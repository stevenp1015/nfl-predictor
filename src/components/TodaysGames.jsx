import React, { useState } from 'react';
import { getBulkPredictions, savePrediction, isPredictionCorrect } from '../api/predictions';
import { GlowingEffect } from './ui/glowing-effect';
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
                
                return (
                  <div key={pred.gameId} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    {/* Header with team names, time, and status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-semibold">
                          {pred.awayTeamName} @ {pred.homeTeamName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {pred.time} EST • {pred.venue}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {saveMessages[pred.gameId] && (
                          <span className={`text-sm font-medium ${
                            saveMessages[pred.gameId].includes('Saved') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {saveMessages[pred.gameId]}
                          </span>
                        )}
                        {/* Prediction accuracy indicator */}
                        {predictionCorrect !== null && (
                          <div className={`gr-px-8 gr-py-3 gr-rounded-8 gr-text-xs font-medium ${
                            predictionCorrect 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {predictionCorrect ? '✓ Correct' : '✗ Wrong'}
                          </div>
                        )}
                        {/* Game status */}
                        <div className={`gr-px-13 gr-py-5 gr-rounded-8 gr-text-sm font-medium ${
                          pred.isFinished ? 'bg-green-100 text-green-800' :
                          pred.isLive ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pred.status}
                        </div>
                        {/* Save button */}
                        <button
                          onClick={() => handleSavePrediction(pred)}
                          disabled={savingStates[pred.gameId]}
                          className="gr-btn gr-btn-success gr-btn-sm gr-text-sm"
                        >
                          {savingStates[pred.gameId] ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>

                    {/* Scores for finished/live games */}
                    {(pred.isFinished || pred.isLive) && pred.homeScore !== null && pred.awayScore !== null && (
                      <div className="gr-mb-13 gr-p-13 bg-gray-50 gr-rounded-8">
                        <div className="flex items-center justify-center gr-gap-34">
                          <div className="text-center">
                            <div className="gr-text-sm font-medium text-gray-600">{pred.awayTeamName}</div>
                            <div className="gr-text-4xl font-bold text-gray-900">{pred.awayScore}</div>
                          </div>
                          <div className="gr-text-3xl font-bold text-gray-400">-</div>
                          <div className="text-center">
                            <div className="gr-text-sm font-medium text-gray-600">{pred.homeTeamName}</div>
                            <div className="gr-text-4xl font-bold text-gray-900">{pred.homeScore}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Predicted winner indicator */}
                    <div className="gr-mb-13 text-center">
                      <div className="gr-text-sm font-medium text-gray-500 gr-mb-5">Predicted Winner</div>
                      <div className={`inline-flex items-center gr-px-21 gr-py-8 gr-rounded-13 gr-text-xl font-semibold ${
                        isHomeFavored 
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' 
                          : 'bg-purple-100 text-purple-800 border-2 border-purple-300'
                      }`}>
                        <span className="mr-2">{isHomeFavored ? '🏠' : '✈️'}</span>
                        {predictedWinner}
                        <span className="gr-ml-8 gr-text-sm">
                          by {Math.abs(formattedPred.predictedMargin)}
                        </span>
                      </div>
                    </div>

                    {/* Prediction stats */}
                    <div className="grid grid-cols-3 gr-gap-21 text-center">
                      <div>
                        <div className="gr-text-sm font-medium text-gray-500">
                          Predicted Margin
                        </div>
                        <div className="gr-mt-5 gr-text-2xl font-semibold text-gray-900">
                          {formattedPred.predictedMargin > 0 ? 
                            `+${formattedPred.predictedMargin}` : 
                            `${formattedPred.predictedMargin}`}
                        </div>
                      </div>
                      <div>
                        <div className="gr-text-sm font-medium text-gray-500">
                          Win Probability
                        </div>
                        <div className="gr-mt-5 gr-text-2xl font-semibold text-gray-900">
                          {(formattedPred.winProbability * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="gr-text-sm font-medium text-gray-500">
                          Confidence Score
                        </div>
                        <div className="gr-mt-5 gr-text-2xl font-semibold text-gray-900">
                          {(formattedPred.confidenceScore * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
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