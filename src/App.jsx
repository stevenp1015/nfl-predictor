import React, { useState } from 'react';
import TeamSelector from './components/TeamSelector';
import PredictionDisplay from './components/PredictionDisplay';
import ModelStats from './components/ModelStats';
import SavedPredictions from './components/SavedPredictions';
import TodaysGames from './components/TodaysGames';
import { usePrediction } from './hooks/usePrediction';
import { cn } from "@/lib/utils";
import { GlowingEffect } from '@/components/ui/glowing-effect';

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
        <div className="min-h-screen bg-gray-100 gr-py-55 gr-px-13 sm:gr-px-21 lg:gr-px-34">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white gr-rounded-13 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 radial-gradient 
               gr-px-21 gr-py-21">
                <h1 className="gr-text-3xl font-bold text-white">NFL Game Predictor</h1>
                <p className="gr-text-base text-blue-100">
                  Powered by Machine Learning • 89.1% Accuracy Rate
                </p>
              </div>

              <div className="flex items-center gr-gap-21 gr-p-21">
                <div className="flex-1">
                  <TeamSelector
                    label="Away Team"
                    value={selectedTeams.away}
                    onChange={(team) => setSelectedTeams(prev => ({...prev, away: team}))}
                  />
                </div>
                <div className="flex items-center justify-center gr-text-2xl font-bold text-gray-400 gr-mt-21">
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

              <div className="gr-px-21 gr-py-21">
                <div className="relative gr-rounded-13 inset-gr-2">
                  <GlowingEffect 
                    spread={100}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={1}
                  />
                  <button
                    onClick={handleGetPrediction}
                    disabled={!selectedTeams.home || !selectedTeams.away || isLoading}
                    className="w-full gr-btn gr-btn-primary gr-btn-md gr-text-base relative z-10"
                  >
                    {isLoading ? 'Analyzing game data...' : 'Get Prediction'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="gr-px-21 gr-pb-21">
                  <div className="gr-message gr-message-error">
                    {error}
                  </div>
                </div>
              )}

              {prediction && (
                <PredictionDisplay 
                  prediction={prediction} 
                  homeTeam={selectedTeams.home} 
                  awayTeam={selectedTeams.away}
                  onSave={triggerSavedPredictionsRefresh}
                />
              )}
            </div>
            
            <div className="gr-mt-34 bg-white gr-rounded-13 shadow-xl overflow-hidden">
              <div className="gr-p-21">
                <TodaysGames onSave={triggerSavedPredictionsRefresh} />
              </div>
            </div>
            
            <div className="gr-mt-34 bg-white gr-rounded-13 shadow-xl overflow-hidden">
              <div className="gr-p-21">
                <SavedPredictions refreshTrigger={refreshSavedPredictions} />
              </div>
            </div>
            
            <ModelStats />
            <div> 
              <div className="gr-mt-34 bg-white gr-rounded-13 shadow-xl overflow-hidden">
                <div className="gr-p-21">
                  <h3 className="gr-text-2xl font-semibold text-gray-900 gr-mb-13">Code Playground</h3>
                  <textarea
                    className="w-full h-64 p-4 font-mono text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Start coding here, you magnificent bastard..."
                  ></textarea>
                  <p className="gr-mt-8 gr-text-sm text-gray-500">
                    Just a little something to scratch that coding itch, Steven. Don't go breaking anything important now, you hear.
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
  );
}

export default App;