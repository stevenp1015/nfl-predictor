import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function StatsCard({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'up', 
  className 
}) {
  return (
    <motion.div
      className={cn("relative", className)}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400">{icon}</div>
            <div className={cn("text-xs font-medium", trend === 'up' ? 'text-green-400' : 'text-red-400')}>
              {change}
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{value}</div>
          <div className="text-sm text-gray-400">{title}</div>
        </div>
      </div>
    </motion.div>
  );
}

export { StatsCard };