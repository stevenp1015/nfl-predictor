import React from 'react';
import { Game, Prediction, SimulatedBet } from '../../types';
import GamePredictionCard from '../GamePredictionCard';
import TimelineScrubber from '../TimelineScrubber';

interface BrowseViewProps {
    theme: 'dark' | 'light';
    prefersReducedMotion: boolean;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    games: Game[];
    gamesLoading: boolean;
    gamesError: string | null;
    fetchGames: (date: string) => void;
    bulkPredictions: Record<string, Prediction>;
    handleSavePrediction: (prediction: Prediction) => void;
    onPlaceBet: (bet: Omit<SimulatedBet, "id" | "result" | "settledAt">) => void;
}

const BrowseView = ({
    theme,
    prefersReducedMotion,
    selectedDate,
    setSelectedDate,
    games,
    gamesLoading,
    gamesError,
    bulkPredictions,
    handleSavePrediction,
    onPlaceBet
}: BrowseViewProps) => {

    return (
        <section className="space-y-8">
            <TimelineScrubber selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            {gamesError && <p className="text-center text-sm text-rose-400">{gamesError}</p>}
            
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {gamesLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="glass-pane h-[450px] animate-pulse p-6">
                           <div className="w-full h-full bg-white/5 rounded-2xl" />
                        </div>
                    ))
                ) : games.length ? (
                    games.map((game) => {
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
                                contextLabel: prediction ? "Model Insight" : "Awaiting Model",
                                highlight: Boolean(prediction && game.status === "Live"),
                            }}
                        />;
                    })
                ) : (
                    <p className="text-center text-gray-400 md:col-span-2 xl:col-span-3">
                        No games scheduled for this date. Use the timeline to navigate.
                    </p>
                )}
            </div>
        </section>
    );
};

export default BrowseView;
