import React, { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { Game, Prediction, SimulatedBet, TeamInfo } from '../types';
import { formatDateTime, formatPointSpread, getConfidenceTone, getStatusBadgeClasses, getTeamByCode, formatCurrency } from '../utils';
import ShimmerButton from './ShimmerButton';
import TeamBlock from './TeamBlock';

interface GamePredictionCardProps {
    game: Game;
    prediction?: Prediction;
    theme: 'dark' | 'light';
    prefersReducedMotion: boolean;
    onPlaceBet: (bet: Omit<SimulatedBet, "id" | "result" | "settledAt">) => void;
    options?: {
        onSave?: () => void;
        contextLabel?: string;
        highlight?: boolean;
    }
}

const GamePredictionCard: React.FC<GamePredictionCardProps> = ({ 
    game, prediction, theme, prefersReducedMotion, onPlaceBet, options 
}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [betAmount, setBetAmount] = useState<number>(100);
    const [betSelectedWinner, setBetSelectedWinner] = useState<string | undefined>(prediction?.predictedWinner);

    const homeTeam = getTeamByCode(game.homeTeam ?? "");
    const awayTeam = getTeamByCode(game.awayTeam ?? "");

    const handleFlip = () => {
        if (prediction) {
            setBetSelectedWinner(prediction.predictedWinner);
            setIsFlipped(!isFlipped);
        }
    };
    
    const handleSubmitBet = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!prediction || !betSelectedWinner) return;
        
        const potentialPayout = Number((betAmount * (betSelectedWinner === prediction.predictedWinner ? 1.9 : 2.1)).toFixed(2));
        onPlaceBet({
            predictionId: prediction.id,
            amount: betAmount,
            selectedWinner: betSelectedWinner,
            potentialPayout,
        });
        setIsFlipped(false);
    };
    
    const cardVariants = {
        initial: { y: 20, opacity: 0, scale: 0.95 },
        animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    };

    const cardMotion = prefersReducedMotion ? {} : { whileHover: { y: -8, scale: 1.03, transition: { duration: 0.3 } } };

    return (
        <motion.div {...cardVariants} {...cardMotion} className="relative preserve-3d" style={{ minHeight: '450px' }}>
            <motion.div 
                className="absolute w-full h-full preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            >
                <CardFront 
                    game={game} 
                    prediction={prediction} 
                    theme={theme} 
                    prefersReducedMotion={prefersReducedMotion} 
                    options={options} 
                    homeTeam={homeTeam}
                    awayTeam={awayTeam}
                    onBetClick={handleFlip} 
                />
                <CardBack 
                    prediction={prediction} 
                    theme={theme}
                    betAmount={betAmount}
                    setBetAmount={setBetAmount}
                    betSelectedWinner={betSelectedWinner}
                    setBetSelectedWinner={setBetSelectedWinner}
                    onCancel={handleFlip}
                    onSubmitBet={handleSubmitBet}
                />
            </motion.div>
        </motion.div>
    );
};

// ... CardFront and CardBack components defined below ...

const CardFront: React.FC<any> = ({ game, prediction, theme, prefersReducedMotion, options, homeTeam, awayTeam, onBetClick }) => {
    const textSubtle = "text-gray-400";
    const gradientStyle = homeTeam && awayTeam ? { background: `linear-gradient(135deg, ${homeTeam.primaryColor}20 0%, ${awayTeam.primaryColor}20 100%)` } : {};
    const homeProbability = prediction ? (prediction.predictedWinner === game.homeTeam ? prediction.winProbability : 1 - prediction.winProbability) : 0.5;
    const confidentTone = getConfidenceTone(prediction?.confidence ?? prediction?.winProbability ?? 0.5, theme);
    const cardGlow = options?.highlight ? "shadow-[0_0_30px_5px_var(--glow-cyan)]" : "";

    return (
      <div className={`glass-pane absolute h-full w-full backface-hidden flex flex-col p-6 ${cardGlow}`}>
        <div className="absolute inset-0 opacity-30" style={gradientStyle} />
        <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start">
                <div className="space-y-4">
                    <TeamBlock team={homeTeam} theme={theme} textSubtle={textSubtle} />
                    <TeamBlock team={awayTeam} theme={theme} textSubtle={textSubtle} />
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                    <span className={getStatusBadgeClasses(game.status, theme)}>
                        {game.status}
                        {game.status === "Live" && !prefersReducedMotion && <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />}
                    </span>
                    <p className="text-xs text-gray-400">{formatDateTime(game.kickoff)}</p>
                </div>
            </div>

            <div className="mt-4 flex-grow space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-200">
                        <span>{game.homeTeam} Probability</span>
                        <span>{Math.round(homeProbability * 100)}%</span>
                    </div>
                    <ProbabilityStream color={homeTeam?.primaryColor} percentage={homeProbability * 100} />
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-200">
                        <span>{game.awayTeam} Probability</span>
                        <span>{Math.round((1 - homeProbability) * 100)}%</span>
                    </div>
                    <ProbabilityStream color={awayTeam?.primaryColor} percentage={(1 - homeProbability) * 100} />
                </div>
            </div>

            <div className="mt-auto grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Favored</p>
                    <p className="text-lg font-bold">{prediction?.predictedWinner ?? '-'}</p>
                </div>
                <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Confidence</p>
                    <p className={`text-lg font-bold ${confidentTone}`}>{Math.round((prediction?.confidence ?? 0) * 100)}%</p>
                </div>
                <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Spread</p>
                    <p className="text-lg font-bold">{formatPointSpread(prediction?.pointSpread ?? game.pointSpread)}</p>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
                {options?.onSave && prediction && <ShimmerButton theme={theme} variant="primary" onClick={options.onSave}>Save Insight</ShimmerButton>}
                {prediction && <ShimmerButton theme={theme} variant="secondary" onClick={onBetClick}>Simulate Bet</ShimmerButton>}
            </div>
        </div>
      </div>
    );
};

const CardBack: React.FC<any> = ({ prediction, theme, betAmount, setBetAmount, betSelectedWinner, setBetSelectedWinner, onCancel, onSubmitBet }) => {
    if (!prediction) return null;
    const textSubtle = "text-gray-400";
    const potentialPayout = Number((betAmount * (betSelectedWinner === prediction.predictedWinner ? 1.9 : 2.1)).toFixed(2));
    
    return (
        <div className="glass-pane absolute h-full w-full backface-hidden [transform:rotateY(180deg)] p-6 flex flex-col">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-bold">Simulate Wager</h3>
                    <p className={`text-sm ${textSubtle}`}>Favored: {prediction.predictedWinner} ({Math.round(prediction.winProbability * 100)}%)</p>
                </div>
                <button type="button" onClick={onCancel} className={`text-2xl leading-none ${textSubtle}`} aria-label="Cancel bet">×</button>
            </div>
            <form onSubmit={onSubmitBet} className="mt-4 flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                    <div>
                        <label className={`text-xs font-semibold uppercase tracking-widest ${textSubtle}`}>Pick Your Winner</label>
                        <div className="mt-2 grid grid-cols-2 gap-3">
                            {[prediction.homeTeam, prediction.awayTeam].map(teamCode => (
                                <button key={teamCode} type="button" onClick={() => teamCode && setBetSelectedWinner(teamCode)}
                                    className={`rounded-xl border-2 p-3 text-sm font-semibold transition-all duration-200 ${betSelectedWinner === teamCode ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                                    {teamCode}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className={`text-xs font-semibold uppercase tracking-widest ${textSubtle}`}>Stake Amount</label>
                        <input type="number" min={1} step={1} value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value) || 0)}
                            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition"
                        />
                    </div>
                </div>
                <div className="mt-4 space-y-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                        <p className={`text-xs uppercase tracking-widest ${textSubtle}`}>Potential Payout</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-300">{formatCurrency(potentialPayout)}</p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <ShimmerButton theme={theme} variant="ghost" onClick={onCancel}>Cancel</ShimmerButton>
                        <ShimmerButton theme={theme} variant="secondary" type="submit">Commit Bet</ShimmerButton>
                    </div>
                </div>
            </form>
        </div>
    );
};

const ProbabilityStream = ({ color = '#4ade80', percentage = 50 }) => (
    <div className="h-3 w-full rounded-full bg-gray-500/20 overflow-hidden relative">
        <motion.div
            className="h-full rounded-full"
            style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${color}99, ${color}FF)`,
            }}
        />
        <div 
            className="absolute top-0 left-0 h-full rounded-full opacity-50" 
            style={{ 
                width: `${percentage}%`,
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                animation: `probability-stream 3s linear infinite`,
            }} 
        />
    </div>
);

export default GamePredictionCard;
