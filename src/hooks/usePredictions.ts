import { useState, useEffect, useCallback } from 'react';
import { apiClient, PredictionData, SavedPredictionData, BulkPredictionsResponse, GamePrediction } from '@/lib/api';

// Real types that match your Flask server
interface UsePredictionReturn {
  prediction: PredictionData | null;
  isLoading: boolean;
  error: string | null;
  fetchPrediction: (homeTeam: string, awayTeam: string) => Promise<void>;
}

interface SavedPrediction {
  id: string;
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  prediction: PredictionData;
  predictionType: 'spread' | 'moneyline' | 'total';
  confidence: number;
  stake?: number;
  odds?: number;
  result?: 'win' | 'loss' | 'pending' | 'push';
  actualScore?: { home: number; away: number };
  createdAt: string;
  gameTime: string;
  matchup: string;
  venue: string;
  date: string;
  time: string;
}

interface UsePredictionsState {
  predictions: GamePrediction[];
  todaysGames: GamePrediction[];
  savedPredictions: SavedPrediction[];
  bulkPredictions: BulkPredictionsResponse | null;
  loading: boolean;
  error: string | null;
}

interface UsePredictionsActions {
  refreshPredictions: () => Promise<void>;
  getTodaysGames: (date?: string) => Promise<void>;
  getBulkPredictions: (date: string) => Promise<void>;
  deletePrediction: (id: string) => Promise<void>;
  editPrediction: (id: string, updates: Partial<SavedPrediction>) => Promise<void>;
  savePrediction: (prediction: SavedPredictionData) => Promise<void>;
  loadSavedPredictions: () => Promise<void>;
}

// Real prediction hook for single predictions
export function usePrediction(): UsePredictionReturn {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async (homeTeam: string, awayTeam: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiClient.getPrediction(homeTeam, awayTeam);
      setPrediction(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    prediction,
    isLoading,
    error,
    fetchPrediction
  };
}

// Comprehensive predictions management hook
export function usePredictions(): UsePredictionsState & UsePredictionsActions {
  const [state, setState] = useState<UsePredictionsState>({
    predictions: [],
    todaysGames: [],
    savedPredictions: [],
    bulkPredictions: null,
    loading: false,
    error: null,
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  // Load saved predictions from Flask backend
  const loadSavedPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const predictions = await apiClient.getSavedPredictions();
      setState(prev => ({
        ...prev,
        savedPredictions: predictions,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to load saved predictions:', error);
      setError(error instanceof Error ? error.message : 'Failed to load saved predictions');
      setLoading(false);
    }
  }, []);

  const refreshPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await loadSavedPredictions();
    } catch (error) {
      console.error('Failed to refresh predictions:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh predictions');
      setLoading(false);
    }
  }, [loadSavedPredictions]);

  const getTodaysGames = useCallback(async (date?: string) => {
    try {
      setLoading(true);
      setError(null);
      const games = await apiClient.getTodaysGames(date);
      setState(prev => ({
        ...prev,
        todaysGames: games,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to fetch today\'s games:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch games');
      setLoading(false);
    }
  }, []);

  const getBulkPredictions = useCallback(async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      const bulkData = await apiClient.getBulkPredictions(date);
      setState(prev => ({
        ...prev,
        bulkPredictions: bulkData,
        predictions: bulkData.predictions,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to fetch bulk predictions:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch bulk predictions');
      setLoading(false);
    }
  }, []);

  const savePrediction = useCallback(async (predictionData: SavedPredictionData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.savePredictionWithDuplicateCheck(predictionData);

      if (result.duplicate) {
        // Handle duplicate prediction case
        setError('Prediction already exists for this matchup');
        return;
      }

      // Refresh saved predictions after successful save
      await loadSavedPredictions();
    } catch (error) {
      console.error('Failed to save prediction:', error);
      setError(error instanceof Error ? error.message : 'Failed to save prediction');
      setLoading(false);
    }
  }, [loadSavedPredictions]);

  const deletePrediction = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.deletePrediction(id);

      // Remove from local state
      setState(prev => ({
        ...prev,
        savedPredictions: prev.savedPredictions.filter(p => p.id !== id),
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to delete prediction:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete prediction');
      setLoading(false);
    }
  }, []);

  const editPrediction = useCallback(async (id: string, updates: Partial<SavedPrediction>) => {
    try {
      setLoading(true);
      setError(null);

      // Create the updated prediction data
      const existingPrediction = state.savedPredictions.find(p => p.id === id);
      if (!existingPrediction) {
        throw new Error('Prediction not found');
      }

      const updatedPredictionData: SavedPredictionData = {
        homeTeam: updates.homeTeam || existingPrediction.homeTeam,
        awayTeam: updates.awayTeam || existingPrediction.awayTeam,
        prediction: updates.prediction || existingPrediction.prediction,
        matchup: updates.matchup || existingPrediction.matchup,
        gameId: updates.gameId || existingPrediction.gameId,
        venue: updates.venue || existingPrediction.venue,
        date: updates.date || existingPrediction.date,
        time: updates.time || existingPrediction.time,
      };

      await apiClient.updatePrediction(id, updatedPredictionData);

      // Update local state
      setState(prev => ({
        ...prev,
        savedPredictions: prev.savedPredictions.map(p =>
          p.id === id ? { ...p, ...updates } : p
        ),
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to update prediction:', error);
      setError(error instanceof Error ? error.message : 'Failed to update prediction');
      setLoading(false);
    }
  }, [state.savedPredictions]);

  // Load initial data on mount
  useEffect(() => {
    loadSavedPredictions();
    getTodaysGames();
  }, [loadSavedPredictions, getTodaysGames]);

  return {
    ...state,
    refreshPredictions,
    getTodaysGames,
    getBulkPredictions,
    deletePrediction,
    editPrediction,
    savePrediction,
    loadSavedPredictions,
  };
}

// Hook for managing connection to Flask backend
export function useBackendConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = useCallback(async () => {
    try {
      await apiClient.healthCheck();
      setIsConnected(true);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Backend connection failed:', error);
      setIsConnected(false);
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    checkConnection();
    // NO MORE POLLING - it burns through API rate limits
  }, [checkConnection]);

  return {
    isConnected,
    lastChecked,
    checkConnection,
  };
}