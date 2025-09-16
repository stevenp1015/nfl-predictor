import React, { useState } from 'react';
import { Game, Prediction, Notification, SimulatedBet } from '../../types';
import ShimmerButton from '../ShimmerButton';
import GamePredictionCard from '../GamePredictionCard';
import { API_BASE_URL, createFallbackGames, formatDateLabel, normalizePrediction } from '../../utils';
import { Bot } from 'lucide-react';

interface BulkViewProps {
    theme: 'dark' | 'light';
    prefersReducedMotion: boolean;
    selectedDate: string;
    games: Game[];
    bulkPredictions: Record<string, Prediction>;
    setBulkPredictions: (predictions: Record<string, Prediction>) => void;
    setToast: (toast: Notification) => void;
    handleSavePrediction: (prediction: Prediction) => void;
    onPlaceBet: (bet: Omit<SimulatedBet, "id" | "result" | "settledAt">) => void;
}

const BulkView = ({
    theme,
    prefersReducedMotion,
    selectedDate,
    games,
    bulkPredictions,
    setBulkPredictions,
    setToast,
    handleSavePrediction,
    onPlaceBet
}: BulkViewProps) => {
    const [requestInFlight, setRequestInFlight] = useState(false);

    const handleBulkPredict = async () => {
        setRequestInFlight(true);
        try {
          const response = await fetch(`${API_BASE_URL}/bulk_predictions`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date: selectedDate }),
          });
          if (!response.ok) throw new Error(`Bulk predictions failed (${response.status})`);
          const payload = await response.json();
          const raw = Array.isArray(payload?.predictions) ? payload.predictions : [];
          const nextMap: Record<string, Prediction> = {};
          raw.map((item: any) => normalizePrediction(item)).forEach((p) => {
            if (p.gameId) nextMap[p.gameId] = p;
          });
          setBulkPredictions(nextMap);
          setToast({ title: "Bulk Predictions Ready", message: "Batch insights mapped across the selected slate.", tone: "success" });
        } catch (error) {
          console.error(error);
          const fallbackGames = createFallbackGames(selectedDate);
          const nextMap: Record<string, Prediction> = {};
          fallbackGames.forEach((game, index) => {
            const base = Math.min(0.55 + index * 0.07, 0.78);
            nextMap[game.id] = { id: `${game.id}-cached`, gameId: game.id, homeTeam: game.homeTeam, awayTeam: game.awayTeam,
              predictedWinner: base >= 0.5 ? game.homeTeam : game.awayTeam, winProbability: base, confidence: base + 0.05,
              pointSpread: (game.pointSpread ?? 0) - 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: game.status,
              probabilities: { [game.homeTeam]: base, [game.awayTeam]: 1 - base }
            };
          });
          setBulkPredictions(nextMap);
          setToast({ title: "Bulk Predictions Cached", message: "Harnessing synthetic data while live service reconnects.", tone: "info" });
        } finally {
          setRequestInFlight(false);
        }
      };

    return (
        <section className="space-y-6">
            <div className="glass-pane flex flex-col md:flex-row items-center justify-between gap-4 p-6">
                <div>
                    <h2 className="text-xl font-bold">Bulk Prediction Engine</h2>
                    <p className="text-sm text-gray-400">
                        Deploy the model across every matchup on {formatDateLabel(selectedDate)}.
                    </p>
                </div>
                <ShimmerButton
                    theme={theme}
                    variant="secondary"
                    onClick={handleBulkPredict}
                    disabled={requestInFlight || games.length === 0}
                >
                    <Bot className="w-4 h-4" />
                    <span>{requestInFlight ? "Analyzing..." : "Run Bulk Analysis"}</span>
                </ShimmerButton>
            </div>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {games.length ? games.map((game) => {
                    const prediction = bulkPredictions[game.id] ?? bulkPredictions[`${game.homeTeam}-${game.awayTeam}`];
                    return <GamePredictionCard
                        key={game.id}
                        game={game}
                        prediction={prediction}
                        theme={theme}
                        prefersReducedMotion={prefersReducedMotion}
                        onPlaceBet={onPlaceBet}
                        options={{
                            onSave: prediction ? () => handleSavePrediction(prediction) : undefined,
                            contextLabel: prediction ? "Bulk Model" : "Awaiting Bulk Run",
                        }}
                    />
                }) : (
                    <div className="glass-pane md:col-span-2 xl:col-span-3 text-center p-12">
                        <h3 className="text-lg font-bold">No Games Loaded</h3>
                        <p className="text-gray-400">Navigate to a date with scheduled games in the Navigator to populate this view.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BulkView;
