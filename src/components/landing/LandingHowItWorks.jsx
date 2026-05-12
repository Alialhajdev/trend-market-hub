import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { UserPlus, Store, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    num: '01',
    title: 'أنشئ حسابك',
    desc: 'سجّل بريدك الإلكتروني وأنشئ حسابك مجاناً في ثوانٍ معدودة',
    color: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/30',
  },
  {
    icon: Store,
    num: '02',
    title: 'أنشئ متجرك',
    desc: 'خصّص متجرك باسمك وشعارك وألوانك، وأضف منتجاتك بسهولة تامة',
    color: 'from-cyan-500 to-teal-500',
    glow: 'shadow-cyan-500/30',
  },
  {
    icon: TrendingUp,
    num: '03',
    title: 'ابدأ البيع وحقق الأرباح',
    desc: 'انطلق في البيع فوراً، واستقبل الطلبات والمدفوعات إلى حسابك مباشرة',
    color: 'from-green-500 to-emerald-500',
    glow: 'shadow-green-500/30',
  },
];

export default function LandingHowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6" ref={ref}>
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4"
          >
            🚀 بسيط وسريع
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4"
          >
            ابدأ في{' '}
            <span className="bg-gradient-to-r from-[#06B6D4] to-[#2563EB] bg-clip-text text-transparent">
              3 خطوات فقط
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg"
          >
            لا تحتاج خبرة تقنية — كل شيء مصمم ليكون سهلاً للجميع
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-20 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="group relative text-center"
              >
                {/* Number badge */}
                <div className="absolute -top-3 right-1/2 translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-xs font-black text-slate-400">
                  {step.num}
                </div>

                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-8 pt-10 hover:border-white/20 transition-all duration-300 group-hover:bg-white/[0.06] h-full">
                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 shadow-2xl ${step.glow} group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-xl font-black text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                </div>

                {/* Arrow between steps */}
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: i * 0.2 + 0.5 }}
                    className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M8 6L4 2M8 6L4 10" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <a
            href="/create-store"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-black text-lg shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
          >
            ابدأ الآن مجاناً
          </a>
        </motion.div>
      </div>
    </section>
  );
}