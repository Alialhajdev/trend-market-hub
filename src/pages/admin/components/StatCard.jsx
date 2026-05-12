import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, sub, change, color = 'blue', delay = 0 }) {
  const Icon = icon;
  const colorMap = {
    blue: { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20', icon: 'bg-blue-500/20 text-blue-400', glow: 'shadow-blue-500/10' },
    cyan: { bg: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/20', icon: 'bg-cyan-500/20 text-cyan-400', glow: 'shadow-cyan-500/10' },
    green: { bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/20', icon: 'bg-green-500/20 text-green-400', glow: 'shadow-green-500/10' },
    purple: { bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20', icon: 'bg-purple-500/20 text-purple-400', glow: 'shadow-purple-500/10' },
    amber: { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20', icon: 'bg-amber-500/20 text-amber-400', glow: 'shadow-amber-500/10' },
    rose: { bg: 'from-rose-500/20 to-rose-600/10', border: 'border-rose-500/20', icon: 'bg-rose-500/20 text-rose-400', glow: 'shadow-rose-500/10' },
  };
  const c = colorMap[color] || colorMap.blue;
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-5 shadow-xl ${c.glow} hover:scale-[1.02] transition-transform duration-200 cursor-default`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center`}>
          <Icon style={{ width: 22, height: 22 }} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-white/50 text-xs mb-1 font-medium">{label}</p>
      <p className="text-white text-2xl font-black tracking-tight">{value}</p>
      {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
    </motion.div>
  );
}