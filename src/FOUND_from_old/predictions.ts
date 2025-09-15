// src/api/predictions.ts
import type { PredictionData, ConfidenceMap, FeatureImportance, BulkPredictionsResponse, SavedPredictionData } from '../types';

const API_URL = "http://127.0.0.1:5001";

// This function is now a pure utility. Its 'k' value comes from our server.
function convertMarginToWinProbability(margin: number, k: number): number {
  return 1 / (1 + Math.exp(-k * margin));
}

// This function now uses the real confidence map from our server.
function calculateConfidence(margin: number, confidenceMap: ConfidenceMap): number {
  const absMargin = Math.abs(margin);
  if (absMargin < 2) return confidenceMap['0-2'] / 100;
  if (absMargin < 4) return confidenceMap['2-4'] / 100;
  if (absMargin < 6) return confidenceMap['4-6'] / 100;
  if (absMargin < 8) return confidenceMap['6-8'] / 100;
  if (absMargin < 10) return confidenceMap['8-10'] / 100;
  if (absMargin < 14) return confidenceMap['10-14'] / 100;
  return confidenceMap['14+'] / 100;
}

function getImpactLevel(importance: number): string {
    if (importance > 0.15) return 'High';
    if (importance > 0.08) return 'Medium';
    return 'Low';
}

export const getPrediction = async (homeTeam: string, awayTeam: string): Promise<PredictionData> => {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ homeTeam, awayTeam }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Server error');
  }

  const data = await response.json();
  const { predictedMargin, metrics } = data;

  const homeWinProbability = convertMarginToWinProbability(predictedMargin, metrics.optimal_k);
  const confidenceScore = calculateConfidence(predictedMargin, metrics.confidence_map);
  const winProbabilityForDisplay = predictedMargin > 0 ? homeWinProbability : 1 - homeWinProbability;

  const keyFactors = metrics.feature_importance
    .slice(0, 3)
    .map(f => ({
      // THE FIX: More intelligent string replacement to create unique, readable labels.
      factor: f.feature
        .replace(/_/g, ' ')
        .replace(' home', ' (Home)')
        .replace(' away', ' (Away)')
        .replace(/\b\w/g, l => l.toUpperCase()),
      impact: getImpactLevel(f.importance)
    }));

  // THE FIX: Return pure, raw numbers. NO formatting.
  return {
    predictedMargin: predictedMargin,
    winProbability: winProbabilityForDisplay, // e.g., 0.66
    confidenceScore: confidenceScore,       // e.g., 0.648
    keyFactors: keyFactors
  };
};

export const savePrediction = async (predictionData: SavedPredictionData): Promise<any> => {
  const response = await fetch(`${API_URL}/save_prediction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(predictionData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save prediction');
  }

  return await response.json();
};

export const getSavedPredictions = async () => {
  const response = await fetch(`${API_URL}/predictions`);

  if (!response.ok) {
    throw new Error('Failed to fetch saved predictions');
  }

  return await response.json();
};

export const deletePrediction = async (predictionId: string): Promise<any> => {
  const response = await fetch(`${API_URL}/predictions/${predictionId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete prediction');
  }

  return await response.json();
};

export const getTodaysGames = async (date?: string): Promise<any> => {
  const url = date ? `${API_URL}/games?date=${date}` : `${API_URL}/games`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch today\'s games');
  }

  return await response.json();
};

export const getBulkPredictions = async (date: string): Promise<BulkPredictionsResponse> => {
  const response = await fetch(`${API_URL}/bulk_predictions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch bulk predictions');
  }

  return await response.json();
};

// Standardized prediction accuracy calculation
export const isPredictionCorrect = (predictedMargin: number, actualHomeScore: number | null, actualAwayScore: number | null, isGameFinished: boolean): boolean | null => {
  if (!isGameFinished || actualHomeScore === null || actualAwayScore === null) {
    return null; // Can't determine accuracy
  }
  
  const actualMargin = actualHomeScore - actualAwayScore;
  
  // Both predicted home win and actual home win, or both predicted away win and actual away win
  return (predictedMargin > 0 && actualMargin > 0) || (predictedMargin < 0 && actualMargin < 0);
};

export const savePredictionWithDuplicateCheck = async (predictionData: SavedPredictionData): Promise<any> => {
  const response = await fetch(`${API_URL}/save_prediction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(predictionData),
  });

  if (response.status === 409) {
    // Handle duplicate case
    const duplicateData = await response.json();
    return { duplicate: true, ...duplicateData };
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save prediction');
  }

  return await response.json();
};

export const replacePrediction = async (predictionId: string, predictionData: SavedPredictionData): Promise<any> => {
  const response = await fetch(`${API_URL}/save_prediction/replace/${predictionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(predictionData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to replace prediction');
  }

  return await response.json();
};

export const updatePrediction = async (predictionId: string, predictionData: SavedPredictionData): Promise<any> => {
  const response = await fetch(`${API_URL}/predictions/${predictionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(predictionData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update prediction');
  }

  return await response.json();
};

export const getModelPerformance = async (): Promise<{
  totalPredictions: number;
  accuracyRate: number;
  activeUsers: number;
  liveGames: number;
  lastUpdated: string;
}> => {
  const response = await fetch(`${API_URL}/model_performance`);

  if (!response.ok) {
    throw new Error('Failed to fetch model performance metrics');
  }

  return await response.json();
};