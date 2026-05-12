import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Zap, Crown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'مجاني',
    price: '0',
    period: 'للأبد',
    desc: 'ابدأ مجاناً بدون بطاقة ائتمانية',
    icon: Star,
    gradient: 'from-slate-500 to-slate-600',
    features: [
      'حتى 20 منتج',
      'لوحة تحكم أساسية',
      'دعم عبر البريد',
      'استقبال الطلبات',
      'عمولة 10%',
    ],
    missing: ['تحليلات متقدمة', 'دعم فوري', 'نطاق مخصص'],
    cta: 'ابدأ مجاناً',
    highlight: false,
  },
  {
    name: 'احترافي',
    price: '149',
    period: 'شهرياً',
    desc: 'للبائعين الجادين الراغبين في النمو',
    icon: Zap,
    gradient: 'from-[#2563EB] to-[#06B6D4]',
    features: [
      'منتجات غير محدودة',
      'تحليلات وتقارير متقدمة',
      'دعم فوري 24/7',
      'كوبونات وعروض خاصة',
      'عمولة 5% فقط',
      'نطاق مخصص',
    ],
    missing: [],
    cta: 'ابدأ تجربتك',
    highlight: true,
  },
  {
    name: 'VIP',
    price: '399',
    period: 'شهرياً',
    desc: 'للمتاجر الكبرى والعلامات التجارية',
    icon: Crown,
    gradient: 'from-yellow-500 to-orange-500',
    features: [
      'كل مميزات الاحترافي',
      'مدير حساب مخصص',
      'تخصيص كامل للمتجر',
      'API خاص',
      'عمولة 2% فقط',
      'أولوية في النتائج',
      'تقارير ذكاء اصطناعي',
    ],
    missing: [],
    cta: 'تواصل معنا',
    highlight: false,
  },
];

export default function LandingPricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6" ref={ref}>
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4"
          >
            💎 خطط مرنة
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4"
          >
            اختر الخطة{' '}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] bg-clip-text text-transparent">
              المناسبة لك
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg"
          >
            ابدأ مجاناً وارتقِ عند الحاجة — لا التزامات
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.highlight
                  ? 'bg-gradient-to-b from-blue-500/10 to-cyan-500/5 border-2 border-[#2563EB]/50'
                  : 'bg-white/[0.03] border border-white/[0.07]'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-xs font-bold whitespace-nowrap">
                  ⭐ الأكثر شيوعاً
                </div>
              )}

              {/* Icon + Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                  <plan.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-black">{plan.name}</div>
                  <div className="text-slate-500 text-xs">{plan.desc}</div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm mb-1.5">ر.س / {plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.missing.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-sm text-slate-600 line-through">
                    <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to="/create-store"
                className={`block text-center py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}