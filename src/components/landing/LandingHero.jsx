import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, TrendingUp, ShoppingBag, Star, Zap, ChevronDown } from 'lucide-react';

const floatingCards = [
  { icon: '🛍️', label: 'طلب جديد', sub: '+240 ر.س', color: 'from-blue-500/20 to-cyan-500/20', delay: 0 },
  { icon: '⭐', label: 'تقييم ممتاز', sub: '4.9 نجمة', color: 'from-yellow-500/20 to-orange-500/20', delay: 0.3 },
  { icon: '📈', label: 'مبيعات اليوم', sub: '+12,400 ر.س', color: 'from-green-500/20 to-emerald-500/20', delay: 0.6 },
];

const stats = [
  { value: '50K+', label: 'بائع نشط' },
  { value: '2M+', label: 'منتج' },
  { value: '99.9%', label: 'وقت التشغيل' },
];

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
      {/* Animated BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563EB]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#06B6D4]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px]" />
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-right">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2563EB]/20 to-[#06B6D4]/20 border border-[#2563EB]/30 text-blue-300 text-sm font-medium mb-6"
            >
              <Zap className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>منصة التجارة الإلكترونية الأولى عربياً</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-black leading-tight mb-4"
            >
              <span className="text-white">ابدأ تجارتك</span>
              <br />
              <span className="bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#2563EB] bg-clip-text text-transparent bg-[size:200%] animate-[shimmer_3s_linear_infinite]">
                الإلكترونية اليوم
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              أنشئ متجرك الاحترافي خلال دقائق، بيع منتجاتك لآلاف العملاء، وأدر كل شيء من لوحة تحكم واحدة ذكية.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end"
            >
              <Link
                to="/create-store"
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-black text-base shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  أنشئ متجرك الآن
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <a
                href="#features"
                className="px-8 py-4 rounded-2xl border border-white/10 text-white font-bold text-base hover:bg-white/5 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <Play className="w-4 h-4 text-[#06B6D4]" />
                شاهد المميزات
              </a>
            </motion.div>

            {/* Mini Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center lg:justify-end gap-8 mt-10"
            >
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main Mockup */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10 bg-[#111827]">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#1E293B] border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="flex-1 mx-4 h-6 rounded-md bg-white/5 flex items-center px-3">
                  <span className="text-xs text-slate-500">trendmarket.com/dashboard</span>
                </div>
              </div>
              {/* Dashboard UI */}
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'المبيعات', val: '24,800', color: 'text-blue-400' },
                    { label: 'الطلبات', val: '384', color: 'text-cyan-400' },
                    { label: 'العملاء', val: '1,240', color: 'text-green-400' },
                  ].map((c, i) => (
                    <div key={i} className="rounded-xl bg-white/5 border border-white/5 p-3">
                      <div className="text-xs text-slate-500 mb-1">{c.label}</div>
                      <div className={`text-xl font-black ${c.color}`}>{c.val}</div>
                    </div>
                  ))}
                </div>
                {/* Chart bar mockup */}
                <div className="rounded-xl bg-white/5 border border-white/5 p-4 mb-3">
                  <div className="text-xs text-slate-400 mb-3 font-semibold">إيرادات هذا الشهر</div>
                  <div className="flex items-end gap-1.5 h-20">
                    {[40, 65, 45, 80, 60, 90, 70, 95, 75, 85, 60, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-gradient-to-t from-[#2563EB] to-[#06B6D4] opacity-80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                {/* Recent orders */}
                <div className="space-y-2">
                  {[
                    { name: 'طلب #1042', store: 'متجر الأناقة', amount: '240 ر.س', status: 'مكتمل' },
                    { name: 'طلب #1041', store: 'إلكترونيات برو', amount: '890 ر.س', status: 'قيد التوصيل' },
                  ].map((o, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                      <div>
                        <div className="text-xs font-semibold text-white">{o.name}</div>
                        <div className="text-[10px] text-slate-500">{o.store}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-green-400">{o.amount}</div>
                        <div className="text-[10px] text-slate-500">{o.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating notification cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                transition={{ delay: 0.8 + card.delay, duration: 0.5, y: { repeat: Infinity, duration: 3 + i, ease: 'easeInOut' } }}
                className={`absolute ${i === 0 ? '-top-6 -right-8' : i === 1 ? 'top-1/2 -right-12' : '-bottom-6 -left-8'} bg-gradient-to-br ${card.color} backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{card.label}</div>
                    <div className="text-xs text-slate-400">{card.sub}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.5, y: { repeat: Infinity, duration: 2 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500"
      >
        <span className="text-xs">اسحب للأسفل</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </section>
  );
}