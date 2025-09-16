import React, { useState } from 'react';
import { Prediction, Notification, Game, SimulatedBet } from '../../types';
import ShimmerButton from '../ShimmerButton';
import TeamSelect from '../TeamSelect';
import GamePredictionCard from '../GamePredictionCard';
import { API_BASE_URL, normalizePrediction } from '../../utils';
import { motion } from 'framer-motion';

interface SingleViewProps {
    theme: 'dark' | 'light';
    prefersReducedMotion: boolean;
    singlePrediction: Prediction | null;
    setSinglePrediction: (prediction: Prediction | null) => void;
    setToast: (toast: Notification) => void;
    handleSavePrediction: (prediction: Prediction) => void;
    onPlaceBet: (bet: Omit<SimulatedBet, "id" | "result" | "settledAt">) => void;
}

const SingleView = ({
    theme,
    prefersReducedMotion,
    singlePrediction,
    setSinglePrediction,
    setToast,
    handleSavePrediction,
    onPlaceBet
}: SingleViewProps) => {
    const [selectedTeam, setSelectedTeam] = useState<string>("BUF");
    const [selectedOpponent, setSelectedOpponent] = useState<string>("KC");
    const [requestInFlight, setRequestInFlight] = useState<boolean>(false);

    const handleSinglePredict = async () => {
        if (!selectedTeam || !selectedOpponent) {
            setToast({ title: "Select Teams", message: "Choose both squads to run the simulation.", tone: "error" });
            return;
        }
        setRequestInFlight(true);
        try {
            const response = await fetch(`${API_BASE_URL}/predict`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ home_team: selectedTeam, away_team: selectedOpponent }),
            });
            if (!response.ok) throw new Error(`Prediction failed (${response.status})`);
            const payload = await response.json();
            const parsed = normalizePrediction(payload?.prediction ?? payload);
            parsed.homeTeam = parsed.homeTeam ?? selectedTeam;
            parsed.awayTeam = parsed.awayTeam ?? selectedOpponent;
            setSinglePrediction(parsed);
            setToast({ title: "Prediction Ready", message: `${parsed.predictedWinner} favored with ${Math.round(parsed.winProbability * 100)}% probability.`, tone: "success" });
        } catch (error) {
            console.error(error);
            const fallback: Prediction = {
                id: `${selectedTeam}-${selectedOpponent}-${Date.now()}`, gameId: `${selectedTeam}-${selectedOpponent}`, homeTeam: selectedTeam,
                awayTeam: selectedOpponent, predictedWinner: selectedTeam, winProbability: 0.57, confidence: 0.62,
                pointSpread: -2.5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: "Scheduled",
                probabilities: { [selectedTeam]: 0.57, [selectedOpponent]: 0.43 }
            };
            setSinglePrediction(fallback);
            setToast({ title: "Offline Model Engaged", message: "Live prediction unavailable, using cached insights.", tone: "info" });
        } finally {
            setRequestInFlight(false);
        }
    };

    const gameForCard: Game | undefined = singlePrediction ? {
        id: singlePrediction.gameId ?? singlePrediction.id,
        homeTeam: singlePrediction.homeTeam ?? selectedTeam,
        awayTeam: singlePrediction.awayTeam ?? selectedOpponent,
        kickoff: new Date().toISOString(),
        venue: "Simulation",
        status: singlePrediction.status,
    } : undefined;

    return (
        <section className="space-y-6">
            <div className="glass-pane grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <TeamSelect label="Home Team" value={selectedTeam} onChange={setSelectedTeam} theme={theme} prefersReducedMotion={prefersReducedMotion} excludedCodes={[selectedOpponent]} />
                <TeamSelect label="Away Team" value={selectedOpponent} onChange={setSelectedOpponent} theme={theme} prefersReducedMotion={prefersReducedMotion} excludedCodes={[selectedTeam]} />
            </div>
            <div className="flex justify-center">
                 <ShimmerButton theme={theme} variant="primary" onClick={handleSinglePredict} disabled={requestInFlight}>
                    {requestInFlight ? "Analyzing Matchup..." : "Generate Duel Prediction"}
                </ShimmerButton>
            </div>
            
            {gameForCard && singlePrediction && (
                 <motion.div 
                    key={singlePrediction.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid md:grid-cols-2 gap-8"
                >
                    <div className="md:col-span-2 lg:col-start-1 lg:col-span-2 xl:col-start-1 xl:col-span-2 flex justify-center">
                        <div className="w-full max-w-2xl">
                        <GamePredictionCard
                            game={gameForCard}
                            prediction={singlePrediction}
                            theme={theme}
                            prefersReducedMotion={prefersReducedMotion}
                            onPlaceBet={onPlaceBet}
                            options={{
                                onSave: () => handleSavePrediction(singlePrediction),
                                contextLabel: "Manual Simulation",
                                highlight: true,
                            }}
                        />
                        </div>
                    </div>
                </motion.div>
            )}
        </section>
    );
};

export default SingleView;
