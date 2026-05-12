import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'أحمد الشمري', role: 'صاحب متجر إلكترونيات', avatar: 'أ', color: 'from-blue-500 to-cyan-500', rating: 5, text: 'بدأت متجري من الصفر على المنصة وخلال 3 أشهر وصلت مبيعاتي لـ 45,000 ريال شهرياً! لوحة التحكم سهلة ومدهشة.' },
  { name: 'سارة القحطاني', role: 'مصممة أزياء', avatar: 'س', color: 'from-pink-500 to-rose-500', rating: 5, text: 'كنت أبيع من الإنستقرام بصعوبة، والآن متجري الاحترافي يستقبل طلبات تلقائياً والدفع يصلني مباشرة. رائع جداً!' },
  { name: 'محمد العتيبي', role: 'بائع عطور ومستلزمات', avatar: 'م', color: 'from-green-500 to-emerald-500', rating: 5, text: 'الدعم الفني لا يُصدق! يردون خلال دقائق ويساعدونك بكل شيء. المنصة الأفضل في السوق العربي بلا منافس.' },
  { name: 'نورا الدوسري', role: 'متجر مستحضرات تجميل', avatar: 'ن', color: 'from-purple-500 to-violet-500', rating: 5, text: 'التحليلات والإحصائيات ساعدتني أفهم عملائي أكثر وأزيد مبيعاتي بنسبة 300% في 6 أشهر فقط!' },
  { name: 'خالد المطيري', role: 'متجر رياضة ولياقة', avatar: 'خ', color: 'from-orange-500 to-red-500', rating: 5, text: 'أسهل منصة استخدمتها في حياتي. في أقل من ساعة كان متجري جاهزاً وأستقبل أول طلب. مو طبيعي!' },
  { name: 'هند الرشيد', role: 'بائعة منتجات طبيعية', avatar: 'ه', color: 'from-teal-500 to-cyan-500', rating: 5, text: 'العمولات منخفضة جداً مقارنة بالمنصات الأخرى، والمبيعات ضعفت خلال 4 أشهر. استثمار ممتاز!' },
];

export default function LandingTestimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6" ref={ref}>
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4"
          >
            💬 قصص نجاح
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4"
          >
            بائعون يشاركون{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              قصص نجاحهم
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl p-6 bg-white/[0.03] border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-white/10 mb-4" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array(t.rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-slate-300 leading-relaxed mb-6 text-sm">{t.text}</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-black text-sm`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}