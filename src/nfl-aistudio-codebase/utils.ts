import { nflTeams } from "./constants";
import { Game, GameStatus, PerformanceHistoryPoint, Prediction, TeamInfo } from "./types";

export const API_BASE_URL = "http://localhost:5001";

export const getTeamByCode = (code: string): TeamInfo | undefined =>
  nflTeams.find((team) => team.code === code);

export const formatCurrency = (value: number): string =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const formatDateTime = (iso: string): string => {
  if (!iso) {
    return "TBD";
  }
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return iso;
  }
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatDateLabel = (iso: string): string => {
  if (!iso) {
    return "TBD";
  }
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return iso;
  }
  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export const formatPointSpread = (value?: number | null): string => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "N/A";
  }
  const precise = Math.abs(value) >= 10 ? value.toFixed(0) : value.toFixed(1);
  return value > 0 ? `+${precise}` : precise;
};

export const createFallbackGames = (date: string): Game[] => {
  const baseDate = new Date(date);
  const safeDate = Number.isNaN(baseDate.getTime())
    ? new Date()
    : baseDate;
  const isoDay = safeDate.toISOString().split("T")[0];
  return [
    {
      id: `${isoDay}-BUF-KC`,
      homeTeam: "KC",
      awayTeam: "BUF",
      kickoff: `${isoDay}T20:15:00Z`,
      venue: "GEHA Field at Arrowhead Stadium",
      status: "Scheduled",
      pointSpread: -2.5,
      predictedWinner: "KC",
    },
    {
      id: `${isoDay}-SF-PHI`,
      homeTeam: "PHI",
      awayTeam: "SF",
      kickoff: `${isoDay}T17:25:00Z`,
      venue: "Lincoln Financial Field",
      status: "Live",
      homeScore: 17,
      awayScore: 20,
      pointSpread: 1.5,
      predictedWinner: "SF",
    },
    {
      id: `${isoDay}-DAL-DET`,
      homeTeam: "DAL",
      awayTeam: "DET",
      kickoff: `${isoDay}T01:20:00Z`,
      venue: "AT&T Stadium",
      status: "Final",
      homeScore: 31,
      awayScore: 27,
      pointSpread: -3.0,
      predictedWinner: "DAL",
    },
    {
      id: `${isoDay}-MIA-NYJ`,
      homeTeam: "MIA",
      awayTeam: "NYJ",
      kickoff: `${isoDay}T18:05:00Z`,
      venue: "Hard Rock Stadium",
      status: "Scheduled",
      pointSpread: -5.5,
      predictedWinner: "MIA",
    },
  ];
};

export const generateSyntheticHistory = (): PerformanceHistoryPoint[] => {
  const now = Date.now();
  return Array.from({ length: 10 }).map((_, index) => {
    const timestamp = new Date(now - (9 - index) * 86400000).toISOString();
    const base = 0.58 + Math.random() * 0.32;
    return {
      timestamp,
      accuracy: Number(Math.min(0.95, base).toFixed(2)),
    };
  });
};

export const normalizePrediction = (raw: any): Prediction => {
  const createdAt = raw?.createdAt ?? raw?.created_at ?? new Date().toISOString();
  const gameId = raw?.gameId ?? raw?.game_id ?? raw?.game?.id;
  const homeTeam = raw?.homeTeam ?? raw?.home_team ?? raw?.game?.homeTeam;
  const awayTeam = raw?.awayTeam ?? raw?.away_team ?? raw?.game?.awayTeam;
  const winProbabilityRaw = raw?.winProbability ?? raw?.win_probability ?? 0.5;

  const normaliseRatio = (value: number) => {
    if (!Number.isFinite(value)) return 0.5;
    return value > 1.2 ? value / 100 : Math.max(0, value);
  };

  const prediction: Prediction = {
    id: String(raw?.id ?? gameId ?? `${createdAt}-${Math.random()}`),
    gameId,
    homeTeam,
    awayTeam,
    predictedWinner: raw?.predictedWinner ?? raw?.winner ?? homeTeam ?? "",
    winProbability: Number(normaliseRatio(Number(winProbabilityRaw)).toFixed(2)),
    confidence: Number(normaliseRatio(Number(raw?.confidence ?? winProbabilityRaw)).toFixed(2)),
    pointSpread: Number(raw?.pointSpread ?? 0),
    createdAt,
    updatedAt: raw?.updatedAt ?? createdAt,
    status: (raw?.status as GameStatus) ?? "Scheduled",
    actualWinner: raw?.actualWinner,
    game: raw?.game ? { id: raw.game.id, homeTeam: raw.game.homeTeam, awayTeam: raw.game.awayTeam, kickoff: raw.game.kickoff, venue: raw.game.venue, status: raw.game.status } : undefined,
    probabilities: raw?.probabilities,
    notes: raw?.notes,
  };

  if (prediction.winProbability <= 0) prediction.winProbability = 0.5;
  if (prediction.confidence <= 0) prediction.confidence = prediction.winProbability;

  return prediction;
};

export const getStatusBadgeClasses = (status: GameStatus, theme: "dark" | "light"): string => {
  const base = "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest";
  if (status === "Live") return `${base} bg-emerald-500/20 text-emerald-200`;
  if (status === "Final") return `${base} bg-indigo-500/20 text-indigo-200`;
  return `${base} bg-sky-500/20 text-sky-200`;
};

export const getConfidenceTone = (value: number, theme: "dark" | "light"): string => {
  const ratio = value > 1 ? value / 100 : value;
  if (ratio >= 0.8) return "text-emerald-300";
  if (ratio >= 0.65) return "text-sky-300";
  if (ratio >= 0.55) return "text-amber-300";
  return "text-rose-300";
};

export const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(num, min), max);
