import React, { useState, useEffect } from 'react';
import { getSavedPredictions, deletePrediction, getTodaysGames, updatePrediction, getPrediction } from '../api/predictions';

const SavedPredictions = ({ refreshTrigger }) => {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [gamesData, setGamesData] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedPredictions, setExpandedPredictions] = useState(new Set());
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchPredictions();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  const fetchPredictions = async () => {
    setIsLoading(true);
    try {
      const data = await getSavedPredictions();
      setPredictions(data);
      
      // Fetch today's games to get live scores and status
      const games = await getTodaysGames();
      setGamesData(games);
    } catch (err) {
      setError('Failed to load predictions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (predictionId) => {
    try {
      await deletePrediction(predictionId);
      setPredictions(predictions.filter(p => p.id !== predictionId));
    } catch (err) {
      setError('Failed to delete prediction');
    }
  };

  const findGameData = (prediction) => {
    return gamesData.find(game => 
      // First try exact match on team abbreviations
      (game.homeTeam === prediction.homeTeam && game.awayTeam === prediction.awayTeam) ||
      // Then try exact match on full team names
      (game.homeTeamName === prediction.homeTeam && game.awayTeamName === prediction.awayTeam) ||
      // Finally, try more precise matching - team name must END with prediction team (to avoid NY matching both NYG and NYJ)
      (game.homeTeamName && game.awayTeamName && 
        game.homeTeamName.endsWith(prediction.homeTeam) && 
        game.awayTeamName.endsWith(prediction.awayTeam))
    );
  };

  const isPredictionCorrect = (prediction, gameData) => {
    if (!gameData || !gameData.isFinished || gameData.homeScore === null || gameData.awayScore === null) {
      return null;
    }
    
    const actualMargin = gameData.homeScore - gameData.awayScore;
    const predictedMargin = prediction.prediction.predictedMargin;
    
    return (predictedMargin > 0 && actualMargin > 0) || (predictedMargin < 0 && actualMargin < 0);
  };

  const filteredPredictions = predictions.filter(prediction => {
    if (!searchFilter.trim()) return true;
    
    const searchTerm = searchFilter.toLowerCase();
    return (
      prediction.homeTeam?.toLowerCase().includes(searchTerm) ||
      prediction.awayTeam?.toLowerCase().includes(searchTerm) ||
      prediction.matchup?.toLowerCase().includes(searchTerm)
    );
  });

  const toggleExpanded = (predictionId) => {
    const newExpanded = new Set(expandedPredictions);
    if (newExpanded.has(predictionId)) {
      newExpanded.delete(predictionId);
    } else {
      newExpanded.add(predictionId);
    }
    setExpandedPredictions(newExpanded);
  };

  const canEditPrediction = (prediction, gameData) => {
    // Can edit if game hasn't finished yet
    return !gameData || !gameData.isFinished;
  };

  const handleEditPrediction = async (predictionToEdit) => {
    try {
      setIsUpdating(true);
      // Get fresh prediction data
      const newPrediction = await getPrediction(predictionToEdit.homeTeam, predictionToEdit.awayTeam);
      
      const updatedPredictionData = {
        homeTeam: predictionToEdit.homeTeam,
        awayTeam: predictionToEdit.awayTeam,
        prediction: newPrediction,
        matchup: predictionToEdit.matchup
      };
      
      await updatePrediction(predictionToEdit.id, updatedPredictionData);
      
      // Update local state
      setPredictions(predictions.map(p => 
        p.id === predictionToEdit.id 
          ? { ...p, prediction: newPrediction, updatedAt: new Date().toISOString() }
          : p
      ));
      
      setError('');
    } catch (err) {
      setError('Failed to update prediction');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="text-center gr-py-13 gr-text-base">Loading saved predictions...</div>;
  }

  if (predictions.length === 0) {
    return (
      <div className="text-center gr-py-34 text-gray-500">
        <p className="gr-text-base">No saved predictions yet.</p>
        <p className="gr-text-sm">Make a prediction and save it to see it here!</p>
      </div>
    );
  }

  return (
    <div className="gr-gap-13 flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="gr-text-xl font-medium text-gray-900">
          Saved Predictions ({filteredPredictions.length}{filteredPredictions.length !== predictions.length ? ` of ${predictions.length}` : ''})
        </h3>
        <div className="flex-1 max-w-sm ml-4">
          <input
            type="text"
            placeholder="Search by team or matchup..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full gr-px-13 gr-py-8 border border-gray-300 gr-rounded-8 gr-text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      {error && (
        <div className="gr-message gr-message-error gr-text-sm">
          {error}
        </div>
      )}
      <div className="gr-gap-8 flex flex-col">
        {filteredPredictions.map((pred) => {
          const gameData = findGameData(pred);
          const predictionCorrect = isPredictionCorrect(pred, gameData);
          const isExpanded = expandedPredictions.has(pred.id);
          
          // Get predicted winner for collapsed view
          const predictedMargin = pred.prediction.predictedMargin;
          const predictedWinner = predictedMargin > 0 ? pred.homeTeam : pred.awayTeam;
          const winMargin = Math.abs(predictedMargin);
          
          return (
            <div key={pred.id} className="bg-gray-50 gr-p-13 gr-rounded-8 border">
              <div className="flex justify-between items-start gr-mb-8">
                <div className="flex items-center gr-gap-8">
                  <button
                    onClick={() => toggleExpanded(pred.id)}
                    className="text-gray-400 hover:text-gray-600 gr-p-3"
                  >
                    {isExpanded ? '▼' : '▶'}
                  </button>
                  <div className="font-medium text-gray-900 gr-text-base">
                    {pred.matchup}
                  </div>
                  {gameData && gameData.week && (
                    <div className="gr-text-xs text-gray-500 bg-gray-200 gr-px-8 gr-py-3 gr-rounded-5">
                      Week {gameData.week}
                    </div>
                  )}
                  {gameData && (
                    <div className="gr-text-sm text-gray-500">
                      {gameData.time} EST • {gameData.venue}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {/* Prediction accuracy indicator */}
                  {predictionCorrect !== null && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      predictionCorrect 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {predictionCorrect ? '✓ Correct' : '✗ Wrong'}
                    </div>
                  )}
                  {/* Game status */}
                  {gameData && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      gameData.isFinished ? 'bg-green-100 text-green-800' :
                      gameData.isLive ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {gameData.status}
                    </div>
                  )}
                  {canEditPrediction(pred, gameData) && (
                    <button
                      onClick={() => handleEditPrediction(pred)}
                      disabled={isUpdating}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
                    >
                      {isUpdating ? 'Updating...' : 'Update'}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(pred.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Collapsed view - key info only */}
              {!isExpanded && (
                <div className="pl-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Predicted Winner: </span>
                      <span className={`font-semibold ${predictedMargin > 0 ? 'text-blue-600' : 'text-purple-600'}`}>
                        {predictedWinner} by {winMargin}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(pred.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Expanded view - detailed information */}
              {isExpanded && (
                <div>
                  {/* Live/Final Scores */}
              {gameData && (gameData.isFinished || gameData.isLive) && gameData.homeScore !== null && gameData.awayScore !== null && (
                <div className="mb-3 p-3 bg-white rounded-lg border">
                  <div className="flex items-center justify-center space-x-6">
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-600">{pred.awayTeam}</div>
                      <div className="text-2xl font-bold text-gray-900">{gameData.awayScore}</div>
                    </div>
                    <div className="text-xl font-bold text-gray-400">-</div>
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-600">{pred.homeTeam}</div>
                      <div className="text-2xl font-bold text-gray-900">{gameData.homeScore}</div>
                    </div>
                  </div>
                  <div className="text-center mt-1 text-xs text-gray-500">
                    {gameData.isFinished ? 'FINAL SCORE' : 'CURRENT SCORE'}
                  </div>
                </div>
              )}

                  {/* Prediction details */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Margin:</span>
                      <span className="ml-1 font-medium">
                        {pred.prediction.predictedMargin > 0 ? `+${pred.prediction.predictedMargin}` : pred.prediction.predictedMargin}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Win %:</span>
                      <span className="ml-1 font-medium">
                        {(pred.prediction.winProbability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Confidence:</span>
                      <span className="ml-1 font-medium">
                        {(pred.prediction.confidenceScore * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Saved: {new Date(pred.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedPredictions;