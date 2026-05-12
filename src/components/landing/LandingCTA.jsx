import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function LandingCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      {/* Animated BG shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-[#2563EB]/20 to-[#06B6D4]/20 rounded-full blur-[100px] animate-pulse" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-blue-500/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-cyan-500/5 rounded-full"
        />
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}
            className="absolute w-1.5 h-1.5 rounded-full bg-blue-400"
            style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 20}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            ابدأ اليوم — لا تأجيل
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            جاهز لبدء{' '}
            <span className="bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#2563EB] bg-clip-text text-transparent bg-[size:200%] animate-[shimmer_3s_linear_infinite]">
              متجرك الإلكتروني؟
            </span>
          </h2>

          <p className="text-slate-400 text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            انضم لأكثر من <strong className="text-white">50,000 بائع</strong> يبنون مستقبلهم على منصتنا. ابدأ مجاناً اليوم ولا تتردد.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-store"
              className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-black text-lg shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                ابدأ الآن مجاناً
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              to="/"
              className="px-10 py-5 rounded-2xl border border-white/10 text-white font-bold text-lg hover:bg-white/5 hover:border-white/25 transition-all duration-300"
            >
              استكشف المتاجر
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-slate-500">
            {['✅ بدون بطاقة ائتمانية', '✅ مجاني للأبد', '✅ إلغاء في أي وقت', '✅ دعم عربي 24/7'].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </section>
  );
}