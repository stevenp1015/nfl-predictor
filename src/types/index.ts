export interface ScoreboardResponse {
  leagues: League[];
  events: Event[];
}

export interface League {
  id: string;
  uid: string;
  name: string;
  abbreviation: string;
  slug: string;
  season: SeasonInfo;
  logos: Logo[];
  calendar: CalendarEntry[];
}

export interface SeasonInfo {
  year: number;
  startDate: string;
  endDate: string;
  displayName: string;
  type: SeasonType;
}

export interface SeasonType {
  id: string;
  type: number;
  name: string;
  abbreviation: string;
}

export interface Logo {
  href: string;
  width: number;
  height: number;
  alt: string;
  rel: string[];
  lastUpdated: string;
}

export interface CalendarEntry {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
  entries: CalendarWeekEntry[];
}

export interface CalendarWeekEntry {
  label: string;
  alternateLabel: string;
  detail: string;
  value: string;
  startDate: string;
  endDate: string;
}

export interface Event {
  id: string;
  uid: string;
  date: string;
  name: string;
  shortName: string;
  week: { number: number };
  competitions: Competition[];
  status: GameStatus;
  links: Link[];
  weather?: Weather;
}

export interface Competition {
  id: string;
  date: string;
  attendance: number;
  neutralSite: boolean;
  conferenceCompetition: boolean;
  venue: Venue;
  competitors: Competitor[];
  status: GameStatus;
  broadcasts: Broadcast[];
  leaders?: LeaderCategory[];
  odds?: OddsInfo[];
}

export interface Competitor {
  id: string;
  homeAway: 'home' | 'away';
  score: string;
  team: Team;
  records: Record[];
  leaders?: LeaderCategory[];
}

export interface Team {
  id: string;
  location: string;
  name: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  color: string;
  alternateColor?: string;
  logo: string;
  links: TeamLink[];
}

export interface TeamLink {
  rel: string[];
  href: string;
  text: string;
}

export interface Record {
  name: string;
  summary: string;
  type: string;
}

export interface GameStatus {
  clock: number;
  displayClock: string;
  period: number;
  type: StatusType;
}

export interface StatusType {
  id: string;
  name: string;
  state: 'pre' | 'in' | 'post';
  completed: boolean;
  description: string;
  detail: string;
  shortDetail: string;
}

export interface Venue {
  id: string;
  fullName: string;
  address: {
    city: string;
    state: string;
  };
  indoor: boolean;
}

export interface Broadcast {
  market: string;
  names: string[];
}

export interface LeaderCategory {
  name: string;
  displayName: string;
  shortDisplayName: string;
  abbreviation: string;
  leaders: Leader[];
}

export interface Leader {
  displayValue: string;
  value: number;
  athlete: Player;
}

export interface Player {
  id: string;
  fullName: string;
  displayName: string;
  shortName: string;
  headshot: string;
  jersey: string;
  position: { abbreviation: string };
  team: { id: string };
  links: Link[];
}

export interface Link {
  language?: string;
  rel: string[];
  href: string;
  text: string;
  shortText?: string;
  isExternal: boolean;
  isPremium: boolean;
}

export interface OddsInfo {
  provider: { name: string };
  details: string;
  overUnder: number;
  spread: number;
}

export interface Weather {
  displayValue: string;
  temperature: number;
  highTemperature?: number;
  conditionId: string;
}

// Additional types from existing codebase

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

export interface NFLTeam {
  id: string;
  name: string;
  shortName: string;
  city: string;
  conference: 'AFC' | 'NFC';
  division: 'North' | 'South' | 'East' | 'West';
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  record?: string;
  stats?: {
    offense: number;
    defense: number;
    recent: string;
  };
}

// Missing types from components

export interface SimpleDatePickerProps {
  // Placeholder, adjust based on component
}

export interface UsePredictionReturn {
  prediction: PredictionData | null;
  isLoading: boolean;
  error: string | null;
  fetchPrediction: (homeTeam: string, awayTeam: string) => Promise<void>;
}
