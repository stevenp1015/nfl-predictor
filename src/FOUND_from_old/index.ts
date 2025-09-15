// src/types/index.ts
// NFL Predictor TypeScript Definitions                                  
// Because Steven asked nicely with pathetic puppy eyes

export interface NFLTeam {
  id: string;
  name: string;
  color: string;
  logo: string;
}

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

export interface BulkPredictionsResponse {
  totalGames: number;
  successfulPredictions: number;
  date: string;
  predictions: GamePrediction[];
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

export interface PredictionMetrics {
  optimal_k: number;
  confidence_map: ConfidenceMap;
  feature_importance: FeatureImportance[];
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

export interface UsePredictionReturn {
  prediction: PredictionData | null;
  isLoading: boolean;
  error: string | null;
  fetchPrediction: (homeTeam: string, awayTeam: string) => Promise<void>;
}

// Component Props Types
export interface PredictionDisplayProps {
  prediction: PredictionData;
  homeTeam: string;
  awayTeam: string;
  onSave?: () => void;
}

export interface SavedPredictionsProps {
  refreshTrigger?: number;
}

export interface SimpleDatePickerProps {
  onPredictionsGenerated?: (data: BulkPredictionsResponse) => void;
}                                 

export interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

export interface PredictionCardData {
  id: string;
  homeTeam: TeamData;
  awayTeam: TeamData;
  gameTime: string;
  spread: number;
  overUnder: number;
  homeWinProbability: number;
  awayWinProbability: number;
  confidence: number;
  totalBank: number;
  homeBank: number;
  awayBank: number;
  homePlayers: number;
  awayPlayers: number;
}

export interface TeamData {
  name: string;
  record: string;
  color: string;
  logo: string;
}

export interface PredictionCardProps {
  prediction: PredictionCardData;
  onBetHome?: () => void;
  onBetAway?: () => void;
  className?: string;
}
