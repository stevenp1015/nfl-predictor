// src/hooks/usePrediction.ts
import { useState } from 'react';                                                       
import { getPrediction } from '../api/predictions';
import type { PredictionData, UsePredictionReturn } from '../types';

export const usePrediction = (): UsePredictionReturn => {
       const [prediction, setPrediction] = useState<PredictionData | null>(null);
       const [isLoading, setIsLoading] = useState<boolean>(false);
       const [error, setError] = useState<string | null>(null);

       const fetchPrediction = async (homeTeam: string, awayTeam: string): Promise<void> => {
         setIsLoading(true);
         setError(null);
         try {
           const result = await getPrediction(homeTeam, awayTeam);
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
     };