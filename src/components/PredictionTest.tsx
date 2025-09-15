import React, { useState } from 'react';
import { usePrediction } from '@/hooks/usePredictions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllTeams } from '@/data/nflTeams';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export function PredictionTest() {
  const [homeTeam, setHomeTeam] = useState<string>('');
  const [awayTeam, setAwayTeam] = useState<string>('');
  const { prediction, isLoading, error, fetchPrediction } = usePrediction();

  const teams = getAllTeams();

  const handlePredict = async () => {
    if (!homeTeam || !awayTeam || homeTeam === awayTeam) {
      return;
    }

    await fetchPrediction(homeTeam, awayTeam);
  };

  const getHomeTeamData = () => teams.find(t => t.shortName === homeTeam);
  const getAwayTeamData = () => teams.find(t => t.shortName === awayTeam);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Flask Prediction Test
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {prediction && !error && <CheckCircle className="w-4 h-4 text-green-500" />}
            {error && <XCircle className="w-4 h-4 text-red-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Team Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Away Team</label>
              <Select value={awayTeam} onValueChange={setAwayTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select away team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.shortName}>
                      {team.city} {team.name} ({team.shortName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Home Team</label>
              <Select value={homeTeam} onValueChange={setHomeTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select home team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.shortName}>
                      {team.city} {team.name} ({team.shortName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Predict Button */}
          <Button
            onClick={handlePredict}
            disabled={!homeTeam || !awayTeam || homeTeam === awayTeam || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating ML Prediction...
              </>
            ) : (
              'Get Flask Prediction'
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800">Flask Connection Error</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <p className="text-red-500 text-xs mt-2">
                Make sure your Flask server is running on http://127.0.0.1:5001
              </p>
            </div>
          )}

          {/* Prediction Results */}
          {prediction && !error && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700">✅ Flask Prediction Success!</h3>

              {/* Matchup Display */}
              <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-semibold">{getAwayTeamData()?.name || awayTeam}</div>
                  <div className="text-sm text-gray-600">@ Away</div>
                </div>
                <div className="text-2xl font-bold">VS</div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{getHomeTeamData()?.name || homeTeam}</div>
                  <div className="text-sm text-gray-600">Home</div>
                </div>
              </div>

              {/* ML Prediction Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {prediction.predictedMargin > 0 ? '+' : ''}{prediction.predictedMargin.toFixed(1)}
                  </div>
                  <div className="text-sm text-blue-800">Predicted Margin</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {prediction.predictedMargin > 0 ? 'Home favored' : 'Away favored'}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(prediction.winProbability * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-green-800">Win Probability</div>
                  <div className="text-xs text-green-600 mt-1">
                    Favored team chance
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {(prediction.confidenceScore * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-purple-800">ML Confidence</div>
                  <div className="text-xs text-purple-600 mt-1">
                    Model certainty
                  </div>
                </div>
              </div>

              {/* Key Factors */}
              {prediction.keyFactors && prediction.keyFactors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">🔍 Key ML Factors:</h4>
                  <div className="space-y-2">
                    {prediction.keyFactors.map((factor, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm">{factor.factor}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          factor.impact === 'High' ? 'bg-red-100 text-red-700' :
                          factor.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {factor.impact} Impact
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 text-center pt-4 border-t">
                Real ML prediction from Flask server • Model-generated confidence scores • Feature importance analysis
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}