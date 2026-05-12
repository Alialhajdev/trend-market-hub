import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function useCounter(target, inView, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

const statsData = [
  { raw: 50000, label: 'بائع نشط', suffix: '+', prefix: '', color: 'from-blue-400 to-cyan-400', icon: '🧑‍💼' },
  { raw: 2000000, label: 'منتج معروض', suffix: '+', prefix: '', color: 'from-purple-400 to-pink-400', icon: '📦' },
  { raw: 500000, label: 'عميل راضٍ', suffix: '+', prefix: '', color: 'from-green-400 to-emerald-400', icon: '😊' },
  { raw: 120000000, label: 'إجمالي الأرباح', suffix: '+', prefix: '', color: 'from-yellow-400 to-orange-400', icon: '💰' },
];

function StatItem({ stat, inView }) {
  const count = useCounter(stat.raw, inView);
  const display = count >= 1000000
    ? (count / 1000000).toFixed(1) + 'M'
    : count >= 1000
    ? (count / 1000).toFixed(0) + 'K'
    : count;

  return (
    <div className="relative group text-center p-8 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/20 transition-all duration-300 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
      <div className="text-4xl mb-3">{stat.icon}</div>
      <div className={`text-4xl sm:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
        {display}{stat.suffix}
      </div>
      <div className="text-slate-400 font-medium">{stat.label}</div>
    </div>
  );
}

export default function LandingStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6" ref={ref}>
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium mb-4"
          >
            📊 أرقام حقيقية
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white"
          >
            نمو{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              مستمر ولا يتوقف
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <StatItem stat={stat} inView={inView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}