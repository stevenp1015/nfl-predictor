import React from 'react';
import { Performance, PerformanceHistoryPoint } from '../../types';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PerformanceViewProps {
    theme: 'dark' | 'light';
    prefersReducedMotion: boolean;
    performance: Performance | null;
    performanceHistory: PerformanceHistoryPoint[];
}

const PerformanceView = ({
    performance,
    performanceHistory
}: PerformanceViewProps) => {
    
    const chartData = performanceHistory.map(p => ({
        date: new Date(p.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        accuracy: Math.round(p.accuracy * 100)
    }));
    
    const accuracyPercent = performance ? Math.round(performance.accuracy * 100) : 0;

    return (
        <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Overall Accuracy" value={`${accuracyPercent}%`} isPrimary={true} />
                <StatCard label="Total Predictions" value={performance?.totalPredictions?.toLocaleString() ?? '-'} />
                <StatCard label="Correct Predictions" value={performance?.correctPredictions?.toLocaleString() ?? '-'} />
            </div>

            <motion.div 
                className="glass-pane h-[500px] w-full p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <h3 className="font-display text-lg font-bold text-gray-200">Model Accuracy Heartbeat</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 40, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--glow-cyan)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--glow-cyan)" stopOpacity={0}/>
                            </linearGradient>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                               <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                               <feMerge>
                                   <feMergeNode in="coloredBlur" />
                                   <feMergeNode in="SourceGraphic" />
                               </feMerge>
                           </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" domain={[50, 100]} unit="%" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(3, 7, 18, 0.8)',
                            borderColor: 'var(--dark-border)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(4px)',
                          }}
                          labelStyle={{ color: '#d1d5db' }}
                          itemStyle={{ color: 'var(--glow-cyan)' }}
                        />
                        <Area type="monotone" dataKey="accuracy" stroke="var(--glow-cyan)" fillOpacity={1} fill="url(#colorAccuracy)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8, style: { filter: 'url(#glow)' } }} style={{ filter: 'url(#glow)' }}/>
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>
        </section>
    );
};

const StatCard = ({ label, value, isPrimary = false }: { label: string, value: string | number, isPrimary?: boolean }) => (
    <motion.div 
        className={`glass-pane p-6 rounded-3xl text-center ${isPrimary ? 'md:col-span-3' : ''}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
    >
        <p className="text-sm uppercase tracking-widest text-gray-400">{label}</p>
        <p className={`font-black text-transparent bg-clip-text bg-gradient-to-br ${isPrimary ? 'text-7xl from-cyan-300 to-sky-500' : 'text-5xl from-gray-200 to-gray-400'}`}>
            {value}
        </p>
    </motion.div>
);

export default PerformanceView;
