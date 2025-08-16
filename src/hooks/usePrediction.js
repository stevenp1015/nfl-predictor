import { useState } from 'react';
import { getPrediction } from '../api/predictions';

export const usePrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrediction = async (homeTeam, awayTeam) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getPrediction(homeTeam, awayTeam);
      setPrediction(result);
    } catch (err) {
      setError(err.message);
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
};