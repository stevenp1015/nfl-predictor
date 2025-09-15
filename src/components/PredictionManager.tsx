import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Trash2,
  Clock
} from 'lucide-react';

// Real Flask prediction data structure
interface FlaskPrediction {
  predictedMargin: number;
  winProbability: number;
  confidenceScore: number;
  keyFactors: Array<{
    factor: string;
    impact: string;
  }>;
}

interface SavedPrediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchup: string;
  prediction: FlaskPrediction;
  timestamp: string;
}

interface PredictionManagerProps {
  predictions: SavedPrediction[];
  onDeletePrediction: (id: string) => void;
}

function PredictionCard({
  prediction,
  onDelete
}: {
  prediction: SavedPrediction;
  onDelete: (id: string) => void;
}) {
  // ML predictions are immutable - no editing needed

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="border rounded-lg p-4 bg-card hover:bg-card/80 transition-colors"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">
              {prediction.matchup}
            </h4>
            <Badge variant="outline" className="text-xs">
              ML PREDICTION
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(prediction.id)}
              className="p-1 h-auto text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-3 h-3" />
          {new Date(prediction.timestamp).toLocaleString()}
        </div>

        {/* ML Prediction Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Predicted Margin</p>
            <p className="font-medium text-lg">
              {prediction.prediction.predictedMargin > 0 ? '+' : ''}{prediction.prediction.predictedMargin.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">
              {prediction.prediction.predictedMargin > 0 ? 'Home favored' : 'Away favored'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Win Probability</p>
            <div className="flex items-center gap-2">
              <Progress value={prediction.prediction.winProbability * 100} className="h-2 flex-1" />
              <span className="text-sm font-mono">{(prediction.prediction.winProbability * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* ML Confidence */}
        <div>
          <p className="text-xs text-muted-foreground">ML Confidence Score</p>
          <div className="flex items-center gap-2">
            <Progress value={prediction.prediction.confidenceScore * 100} className="h-2 flex-1" />
            <span className="text-sm font-mono">{(prediction.prediction.confidenceScore * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Key ML Factors */}
        {prediction.prediction.keyFactors && prediction.prediction.keyFactors.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-2">Key ML Factors</p>
              <div className="space-y-1">
                {prediction.prediction.keyFactors.slice(0, 3).map((factor, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="text-foreground">{factor.factor}</span>
                    <Badge variant="outline" className={`text-xs px-1 py-0 ${
                      factor.impact === 'High' ? 'border-red-500 text-red-700' :
                      factor.impact === 'Medium' ? 'border-yellow-500 text-yellow-700' :
                      'border-green-500 text-green-700'
                    }`}>
                      {factor.impact}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* No actions needed - ML predictions are immutable */}
      </div>
    </motion.div>
  );
}

function PredictionStats({ predictions }: { predictions: SavedPrediction[] }) {
  const totalPredictions = predictions.length;
  const completedPredictions = predictions.filter(p => p.result && p.result !== 'pending');
  const winningPredictions = predictions.filter(p => p.result === 'win');
  const winRate = completedPredictions.length > 0 ? (winningPredictions.length / completedPredictions.length) * 100 : 0;
  
  const totalStake = predictions.reduce((sum, p) => sum + (p.stake || 0), 0);
  const totalReturn = predictions
    .filter(p => p.result === 'win')
    .reduce((sum, p) => sum + (p.stake || 0) * (1 + Math.abs(p.odds || 100) / 100), 0);
  const roi = totalStake > 0 ? ((totalReturn - totalStake) / totalStake) * 100 : 0;

  const currentStreak = calculateStreak(predictions);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Prediction Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalPredictions}</div>
            <div className="text-xs text-muted-foreground">Total Predictions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{winRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Win Rate</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">ROI</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500 flex items-center justify-center gap-1">
              {currentStreak.count}
              {currentStreak.type === 'win' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Current Streak ({currentStreak.type === 'win' ? 'W' : 'L'})
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateStreak(predictions: SavedPrediction[]): { count: number; type: 'win' | 'loss' } {
  const completed = predictions
    .filter(p => p.result && p.result !== 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  if (completed.length === 0) return { count: 0, type: 'win' };
  
  let streak = 1;
  const latestResult = completed[0].result;
  
  for (let i = 1; i < completed.length; i++) {
    if (completed[i].result === latestResult) {
      streak++;
    } else {
      break;
    }
  }
  
  return { count: streak, type: latestResult as 'win' | 'loss' };
}

export default function PredictionManager({
  predictions,
  onDeletePrediction
}: PredictionManagerProps) {
  // No filtering needed - just show all ML predictions
  const filteredPredictions = predictions;

  return (
    <div className="space-y-6">
      <PredictionStats predictions={predictions} />
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Prediction History</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({predictions.length})
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pending ({predictions.filter(p => !p.result || p.result === 'pending').length})
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed ({predictions.filter(p => p.result && p.result !== 'pending').length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPredictions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No predictions found for the selected filter.
              </div>
            ) : (
              filteredPredictions.map((prediction) => (
                <PredictionCard
                  key={prediction.id}
                  prediction={prediction}
                  onDelete={onDeletePrediction}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}