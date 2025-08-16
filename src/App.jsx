import React, { useState } from 'react';
import TeamSelector from './components/TeamSelector';
import PredictionDisplay from './components/PredictionDisplay';
import ModelStats from './components/ModelStats';
import { usePrediction } from './hooks/usePrediction';

function App() {
  const [selectedTeams, setSelectedTeams] = useState({
    home: '',
    away: ''
  });

  const { prediction, isLoading, error, fetchPrediction } = usePrediction();

  const handleGetPrediction = () => {
    if (selectedTeams.home && selectedTeams.away) {
      fetchPrediction(selectedTeams.home, selectedTeams.away);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">NFL Game Predictor</h1>
            <p className="text-blue-100">
              Powered by Machine Learning • 89.1% Accuracy Rate
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 p-6">
            <TeamSelector
              label="Home Team"
              value={selectedTeams.home}
              onChange={(team) => setSelectedTeams(prev => ({...prev, home: team}))}
            />
            <TeamSelector
              label="Away Team"
              value={selectedTeams.away}
              onChange={(team) => setSelectedTeams(prev => ({...prev, away: team}))}
            />
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={handleGetPrediction}
              disabled={!selectedTeams.home || !selectedTeams.away || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md disabled:opacity-50"
            >
              {isLoading ? 'Analyzing Game...' : 'Get Prediction'}
            </button>
          </div>

          {error && (
            <div className="px-6 pb-6">
              <div className="bg-red-50 text-red-700 p-4 rounded-md">
                {error}
              </div>
            </div>
          )}

          {prediction && <PredictionDisplay prediction={prediction} />}
        </div>

        <ModelStats />
      </div>
    </div>
  );
}

export default App;