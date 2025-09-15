import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';
import { useBackendConnection } from '@/hooks/usePredictions';
import { useState, useEffect } from 'react';

interface ModelPerformance {
  accuracyRate: number;
  totalPredictions: number;
  liveGames: number;
  activeUsers: number;
  lastUpdated: string;
}

export function RealStatsCard() {
  const [stats, setStats] = useState<ModelPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useBackendConnection();

  useEffect(() => {
    const fetchModelStats = async () => {
      if (!isConnected) {
        setError('Flask server not connected');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://127.0.0.1:5001/model_performance');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        console.error('Failed to fetch model performance:', err);
        setError(err.message || 'Failed to fetch model performance');
      } finally {
        setLoading(false);
      }
    };

    fetchModelStats();

    // Only refresh when component mounts - no polling needed
    // Model performance doesn't change that frequently
  }, [isConnected]);

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Model Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Model Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-destructive text-sm mb-2">Flask Connection Error</div>
            <div className="text-muted-foreground text-xs">
              {error || 'Unable to fetch model performance'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const lastUpdateDate = new Date(stats.lastUpdated);
  const timeAgo = Math.floor((Date.now() - lastUpdateDate.getTime()) / (1000 * 60));

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          ML Model Performance
          <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
            {isConnected ? "Live" : "Offline"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Accuracy Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-chart-1" />
            <span className="text-sm text-foreground">Model Accuracy</span>
          </div>
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            {stats.accuracyRate.toFixed(1)}%
          </Badge>
        </div>

        <Separator className="bg-border" />

        {/* Total Predictions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-chart-2" />
            <span className="text-sm text-foreground">Total Predictions</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {stats.totalPredictions.toLocaleString()}
          </span>
        </div>

        {/* Live Games */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-chart-3 flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${stats.liveGames > 0 ? 'bg-background animate-pulse' : 'bg-muted'}`} />
            </div>
            <span className="text-sm text-foreground">Live Games</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {stats.liveGames}
          </span>
        </div>

        {/* Active Users */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-chart-4" />
            <span className="text-sm text-foreground">Active Users</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {stats.activeUsers}
          </span>
        </div>

        <Separator className="bg-border" />

        {/* Last Updated */}
        <div className="text-center text-xs text-muted-foreground">
          Updated {timeAgo < 1 ? 'just now' : `${timeAgo}m ago`}
        </div>
      </CardContent>
    </Card>
  );
}