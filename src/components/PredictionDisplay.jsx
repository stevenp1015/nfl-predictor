// src/components/PredictionDisplay.jsx

import React, { useState } from 'react';
import { savePredictionWithDuplicateCheck, replacePrediction, isPredictionCorrect } from '../api/predictions';

const PredictionDisplay = ({ prediction, homeTeam, awayTeam, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [gameData, setGameData] = useState(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState(null);
  
  // Try to fetch game data to get scores and status
  React.useEffect(() => {
    // Clear previous game data immediately when teams change
    setGameData(null);
    
    const fetchGameData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5001/games`);
        const games = await response.json();
        
        // Find matching game with more precise matching (same logic as SavedPredictions fix)
        const matchingGame = games.find(game => 
          // First try exact match on team abbreviations
          (game.homeTeam === homeTeam && game.awayTeam === awayTeam) ||
          // Then try exact match on full team names
          (game.homeTeamName === homeTeam && game.awayTeamName === awayTeam) ||
          // Finally, try more precise matching - team name must END with prediction team
          (game.homeTeamName && game.awayTeamName && 
            game.homeTeamName.endsWith(homeTeam) && 
            game.awayTeamName.endsWith(awayTeam))
        );
        
        if (matchingGame) {
          setGameData(matchingGame);
        }
      } catch (error) {
        console.log('Could not fetch live game data');
      }
    };

    if (homeTeam && awayTeam && prediction) {
      fetchGameData();
    }
  }, [homeTeam, awayTeam, prediction]);

  // Early return after all hooks
  if (!prediction) return null;

  const handleSavePrediction = async () => {
    setIsSaving(true);
    try {
      const predictionData = {
        homeTeam,
        awayTeam,
        prediction,
        matchup: `${awayTeam} @ ${homeTeam}`
      };
      
      const result = await savePredictionWithDuplicateCheck(predictionData);
      
      if (result.duplicate) {
        setDuplicateInfo(result);
        setShowDuplicateDialog(true);
        setSaveMessage('A prediction for this matchup already exists');
      } else {
        setSaveMessage('Prediction saved successfully!');
        if (onSave) onSave(); // Trigger refresh of saved predictions
      }
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save prediction');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReplacePrediction = async () => {
    setIsSaving(true);
    try {
      const predictionData = {
        homeTeam,
        awayTeam,
        prediction,
        matchup: `${awayTeam} @ ${homeTeam}`
      };
      
      await replacePrediction(duplicateInfo.existingId, predictionData);
      setSaveMessage('Prediction replaced successfully!');
      setShowDuplicateDialog(false);
      setTimeout(() => setSaveMessage(''), 3000);
      if (onSave) onSave(); // Trigger refresh of saved predictions
    } catch (error) {
      setSaveMessage('Failed to replace prediction');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const getPredictedWinner = () => {
    const { predictedMargin } = prediction;
    // Use team abbreviations for display
    const predictedWinner = predictedMargin > 0 ? homeTeam : awayTeam;
    const isHomeFavored = predictedMargin > 0;
    
    return { predictedWinner, isHomeFavored };
  };

  // Remove local implementation - now using shared utility from predictions.js

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const { predictedWinner, isHomeFavored } = getPredictedWinner();
  const predictionCorrect = isPredictionCorrect(
    prediction.predictedMargin,
    gameData?.homeScore,
    gameData?.awayScore,
    gameData?.isFinished
  );

  return (
    <div className="border-t border-gray-200 gr-px-21 gr-py-34">
      <div className="bg-white border border-gray-200 gr-rounded-13 gr-p-21 shadow-sm">
        {/* Header with team names and save button */}
        <div className="flex items-center justify-between gr-mb-13">
          <div className="flex items-center gr-gap-8">
            <div className="gr-text-xl font-semibold">
              {awayTeam} @ {homeTeam}
            </div>
            {gameData && (
              <div className="gr-text-sm text-gray-500">
                {gameData.time} EST • {gameData.venue}
              </div>
            )}
          </div>
          <div className="flex items-center gr-gap-8">
            {saveMessage && (
              <span className={`gr-text-sm font-medium ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {saveMessage}
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
            {gameData && (
              <div className={`gr-px-13 gr-py-5 gr-rounded-8 gr-text-sm font-medium ${
                gameData.isFinished ? 'bg-green-100 text-green-800' :
                gameData.isLive ? 'bg-yellow-100 text-yellow-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {gameData.status}
              </div>
            )}
            <button
              onClick={handleSavePrediction}
              disabled={isSaving}
              className="gr-btn gr-btn-success gr-btn-sm gr-text-sm"
            >
              {isSaving ? 'Saving prediction...' : 'Save Prediction'}
            </button>
          </div>
        </div>

        {/* Live/Final Scores */}
        {gameData && (gameData.isFinished || gameData.isLive) && gameData.homeScore !== null && gameData.awayScore !== null && (
          <div className="gr-mb-13 gr-p-13 bg-gray-50 gr-rounded-8">
            <div className="flex items-center justify-center gr-gap-34">
              <div className="text-center">
                <div className="gr-text-sm font-medium text-gray-600">{awayTeam}</div>
                <div className="gr-text-4xl font-bold text-gray-900">{gameData.awayScore}</div>
              </div>
              <div className="gr-text-3xl font-bold text-gray-400">-</div>
              <div className="text-center">
                <div className="gr-text-sm font-medium text-gray-600">{homeTeam}</div>
                <div className="gr-text-4xl font-bold text-gray-900">{gameData.homeScore}</div>
              </div>
            </div>
            <div className="text-center gr-mt-8 gr-text-sm text-gray-500">
              {gameData.isFinished ? 'FINAL SCORE' : 'CURRENT SCORE'}
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
              by {Math.abs(prediction.predictedMargin)}
            </span>
          </div>
        </div>

        {/* Prediction stats */}
        <div className="grid grid-cols-3 gr-gap-21 text-center gr-mb-21">
          <div>
            <div className="gr-text-sm font-medium text-gray-500">
              Predicted Margin
            </div>
            <div className="gr-mt-5 gr-text-2xl font-semibold text-gray-900">
              {prediction.predictedMargin > 0 ? `+${prediction.predictedMargin}` : `${prediction.predictedMargin}`}
            </div>
          </div>
          <div>
            <div className="gr-text-sm font-medium text-gray-500">
              Win Probability
            </div>
            <div className="gr-mt-5 gr-text-2xl font-semibold text-gray-900">
              {(prediction.winProbability * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="gr-text-sm font-medium text-gray-500">
              Confidence Score
            </div>
            <div className="gr-mt-5 gr-text-2xl font-semibold text-gray-900">
              {(prediction.confidenceScore * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Key Factors */}
        <div className="gr-mt-21">
          <h3 className="gr-text-xl font-medium text-gray-900 gr-mb-13">Key Factors</h3>
          <div className="gr-gap-8 flex flex-col">
            {prediction.keyFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{factor.factor}</span>
                <span className={`gr-px-13 gr-py-5 gr-rounded-8 gr-text-sm font-medium ${getImpactColor(factor.impact)}`}>
                  {factor.impact} Impact
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Duplicate confirmation dialog */}
      {showDuplicateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Duplicate Prediction Found
            </h3>
            <p className="text-gray-600 mb-6">
              You already have a prediction saved for this matchup. Would you like to replace it with the new prediction?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleReplacePrediction}
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
              >
                {isSaving ? 'Replacing...' : 'Replace Existing'}
              </button>
              <button
                onClick={() => {
                  setShowDuplicateDialog(false);
                  setDuplicateInfo(null);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionDisplay;