// Real NFL Predictor API Client - Recovered from the ashes
// Connects to Flask ML server at port 5001
const API_URL = "http://127.0.0.1:5001";

// Real types that match your Flask server responses
export interface PredictionData {
  predictedMargin: number;
  winProbability: number;
  confidenceScore: number;
  keyFactors?: KeyFactor[];
}

export interface KeyFactor {
  factor: string;
  impact: string;
}

export interface ConfidenceMap {
  '0-2': number;
  '2-4': number;
  '4-6': number;
  '6-8': number;
  '8-10': number;
  '10-14': number;
  '14+': number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface PredictionMetrics {
  optimal_k: number;
  confidence_map: ConfidenceMap;
  feature_importance: FeatureImportance[];
}

export interface GamePrediction {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamName: string;
  awayTeamName: string;
  predictedMargin: number;
  venue: string;
  date: string;
  time: string;
  isFinished: boolean;
  isLive: boolean;
  homeScore?: number | null;
  awayScore?: number | null;
  metrics: PredictionMetrics;
}

export interface BulkPredictionsResponse {
  totalGames: number;
  successfulPredictions: number;
  date: string;
  predictions: GamePrediction[];
}

export interface SavedPredictionData {
  homeTeam: string;
  awayTeam: string;
  prediction: PredictionData;
  matchup: string;
  gameId: string;
  venue: string;
  date: string;
  time: string;
}

// Real utility functions for ML calculations
function convertMarginToWinProbability(margin: number, k: number): number {
  return 1 / (1 + Math.exp(-k * margin));
}

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

class NFLApiClient {
  // Real prediction generation with ML model
  async getPrediction(homeTeam: string, awayTeam: string): Promise<PredictionData> {
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
        factor: f.feature
          .replace(/_/g, ' ')
          .replace(' home', ' (Home)')
          .replace(' away', ' (Away)')
          .replace(/\b\w/g, l => l.toUpperCase()),
        impact: getImpactLevel(f.importance)
      }));

    return {
      predictedMargin: predictedMargin,
      winProbability: winProbabilityForDisplay,
      confidenceScore: confidenceScore,
      keyFactors: keyFactors
    };
  }

  // Real prediction saving to Flask backend
  async savePrediction(predictionData: SavedPredictionData): Promise<any> {
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
  }

  // Get real saved predictions from Flask
  async getSavedPredictions() {
    const response = await fetch(`${API_URL}/predictions`);

    if (!response.ok) {
      throw new Error('Failed to fetch saved predictions');
    }

    return await response.json();
  }

  // Delete prediction from Flask backend
  async deletePrediction(predictionId: string): Promise<any> {
    const response = await fetch(`${API_URL}/predictions/${predictionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete prediction');
    }

    return await response.json();
  }

  // Get real games from Flask
  async getTodaysGames(date?: string): Promise<any> {
    const url = date ? `${API_URL}/games?date=${date}` : `${API_URL}/games`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch today\'s games');
    }

    return await response.json();
  }

  // Get bulk predictions for a specific date
  async getBulkPredictions(date: string): Promise<BulkPredictionsResponse> {
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
  }

  // Real model performance metrics
  async getModelPerformance(): Promise<{
    totalPredictions: number;
    accuracyRate: number;
    activeUsers: number;
    liveGames: number;
    lastUpdated: string;
  }> {
    const response = await fetch(`${API_URL}/model_performance`);

    if (!response.ok) {
      throw new Error('Failed to fetch model performance metrics');
    }

    return await response.json();
  }

  // Update existing prediction
  async updatePrediction(predictionId: string, predictionData: SavedPredictionData): Promise<any> {
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
  }

  // Save prediction with duplicate check
  async savePredictionWithDuplicateCheck(predictionData: SavedPredictionData): Promise<any> {
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
  }

  // Health check using model_performance endpoint
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_URL}/model_performance`);
    if (!response.ok) throw new Error(`Health check failed: ${response.status}`);
    const data = await response.json();
    return {
      status: 'ok',
      timestamp: data.lastUpdated || new Date().toISOString()
    };
  }
}

export const apiClient = new NFLApiClient();