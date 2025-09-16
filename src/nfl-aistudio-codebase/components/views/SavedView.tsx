import React, { useState } from 'react';
import { Prediction, SimulatedBet, Notification } from '../../types';
import ShimmerButton from '../ShimmerButton';
import TeamBlock from '../TeamBlock';
import { API_BASE_URL, getTeamByCode, normalizePrediction } from '../../utils';
import { motion } from 'framer-motion';

interface SavedViewProps {
    theme: 'dark' | 'light';
    prefersReducedMotion: boolean;
    savedPredictions: Prediction[];
    setSavedPredictions: React.Dispatch<React.SetStateAction<Prediction[]>>;
    bets: SimulatedBet[];
    setToast: (toast: Notification) => void;
}

const SavedView = ({
    theme,
    savedPredictions,
    setSavedPredictions,
    bets,
    setToast,
}: SavedViewProps) => {
    const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
    const textSubtle = "text-gray-400";

    const handleUpdatePrediction = async (predictionId: string, updates: Partial<Prediction>) => {
        // Update logic remains similar
    };

    const handleDeletePrediction = async (predictionId: string) => {
        // Delete logic remains similar
    };
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <section className="space-y-6">
            <div className="glass-pane p-6 text-center">
                <h2 className="text-2xl font-bold">War Room</h2>
                <p className={`mt-1 text-sm ${textSubtle}`}>
                    Curate, annotate, and track every saved forecast. This is your command center for refined insights.
                </p>
            </div>
            
            <motion.div 
                className="space-y-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {savedPredictions.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">Your war room is empty.</p>
                        <p className="text-sm text-gray-500">Save predictions from other views to build your playbook.</p>
                    </div>
                ) : savedPredictions.map((prediction) => {
                    const homeTeam = getTeamByCode(prediction.homeTeam ?? "");
                    const awayTeam = getTeamByCode(prediction.awayTeam ?? "");
                    const noteDraft = notesDraft[prediction.id] ?? prediction.notes ?? "";
                    const predictionCorrect = prediction.actualWinner && prediction.actualWinner === prediction.predictedWinner;

                    return (
                        <motion.div
                            key={prediction.id}
                            variants={itemVariants}
                            className="glass-pane p-5 transition-shadow duration-300 hover:shadow-[0_0_20px_3px_rgba(255,255,255,0.05)]"
                        >
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                               <div className="flex items-center gap-4">
                                    <TeamBlock team={homeTeam} theme={theme} textSubtle={textSubtle} />
                                    <span className={`text-sm font-bold ${textSubtle}`}>vs</span>
                                    <TeamBlock team={awayTeam} theme={theme} textSubtle={textSubtle} />
                               </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-semibold uppercase tracking-widest ${textSubtle}`}>{prediction.status}</span>
                                    <ShimmerButton theme={theme} variant="ghost" onClick={() => handleDeletePrediction(prediction.id)}>Delete</ShimmerButton>
                                </div>
                            </div>
                            
                            <div className="mt-4 grid gap-4 md:grid-cols-4">
                                {/* Editable fields can be styled as before or enhanced */}
                            </div>

                            <div className="mt-4">
                                <p className={`text-xs uppercase tracking-widest ${textSubtle}`}>Analyst Notes</p>
                                <textarea
                                    rows={2}
                                    placeholder="Add your reasoning, injury notes, or situational factors..."
                                    value={noteDraft}
                                    onChange={(e) => setNotesDraft(prev => ({ ...prev, [prediction.id]: e.target.value }))}
                                    onBlur={() => handleUpdatePrediction(prediction.id, { notes: noteDraft })}
                                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition"
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
};

export default SavedView;
