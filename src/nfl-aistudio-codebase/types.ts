export type GameStatus = "Scheduled" | "Live" | "Final";

export interface TeamInfo {
  code: string;
  name: string;
  city: string;
  primaryColor: string;
  secondaryColor: string;
  record: string;
  recentForm: string;
  logo: string;
}

export interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  venue: string;
  status: GameStatus;
  homeScore?: number;
  awayScore?: number;
  pointSpread?: number;
  predictedWinner?: string;
}

export interface Prediction {
  id: string;
  gameId?: string;
  homeTeam?: string;
  awayTeam?: string;
  predictedWinner: string;
  winProbability: number;
  confidence: number;
  pointSpread: number;
  createdAt: string;
  updatedAt: string;
  status: GameStatus;
  actualWinner?: string;
  game?: Game;
  probabilities?: Record<string, number>;
  notes?: string;
}

export interface Performance {
  accuracy: number;
  totalPredictions: number;
  correctPredictions: number;
  lastUpdated: string;
}

export interface PerformanceHistoryPoint {
  timestamp: string;
  accuracy: number;
}

export interface SimulatedBet {
  id: string;
  predictionId: string;
  amount: number;
  selectedWinner: string;
  potentialPayout: number;
  result: "Pending" | "Won" | "Lost";
  settledAt?: string;
}

export interface Notification {
  title: string;
  message: string;
  tone: "success" | "error" | "info";
}

export type ViewKey = "browse" | "single" | "bulk" | "saved" | "performance";
