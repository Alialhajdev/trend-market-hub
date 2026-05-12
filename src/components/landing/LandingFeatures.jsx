import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Zap, ShoppingBag, BarChart3, CreditCard, Package, Smartphone,
  Megaphone, Percent, Globe, HeadphonesIcon
} from 'lucide-react';

const features = [
  { icon: Zap, title: 'إنشاء متجر خلال دقائق', desc: 'واجهة سهلة الاستخدام تتيح لك إنشاء متجرك الاحترافي بخطوات بسيطة', gradient: 'from-blue-500 to-cyan-500' },
  { icon: ShoppingBag, title: 'إدارة الطلبات', desc: 'تتبع وإدارة جميع طلباتك من مكان واحد مع إشعارات فورية', gradient: 'from-purple-500 to-pink-500' },
  { icon: BarChart3, title: 'تحليلات ذكية', desc: 'احصل على رؤى عميقة حول مبيعاتك وسلوك العملاء بتقارير متقدمة', gradient: 'from-green-500 to-emerald-500' },
  { icon: CreditCard, title: 'دعم الدفع الإلكتروني', desc: 'قبول المدفوعات بأمان عبر جميع طرق الدفع المحلية والدولية', gradient: 'from-orange-500 to-red-500' },
  { icon: Package, title: 'إدارة المنتجات', desc: 'أضف وعدّل منتجاتك بسهولة مع صور عالية الجودة ومتغيرات متعددة', gradient: 'from-cyan-500 to-blue-500' },
  { icon: Smartphone, title: 'تصميم متجاوب', desc: 'متجرك يبدو مذهلاً على جميع الأجهزة: جوال، تابلت، وحاسوب', gradient: 'from-pink-500 to-rose-500' },
  { icon: Megaphone, title: 'تسويق المنتجات', desc: 'أدوات تسويقية متكاملة: كوبونات، عروض خاصة، وربط بمنصات التواصل', gradient: 'from-yellow-500 to-orange-500' },
  { icon: Percent, title: 'نظام عمولات شفاف', desc: 'عمولات منخفضة وشفافة كاملة، كسب أكثر مع دفع أقل', gradient: 'from-teal-500 to-cyan-500' },
  { icon: Globe, title: 'وصول عالمي', desc: 'بع منتجاتك لعملاء في أي مكان بدعم متعدد العملات واللغات', gradient: 'from-violet-500 to-purple-500' },
  { icon: HeadphonesIcon, title: 'دعم فني 24/7', desc: 'فريق دعم متخصص متاح على مدار الساعة لمساعدتك في أي وقت', gradient: 'from-blue-500 to-indigo-500' },
];

function FeatureCard({ feature, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
      className="group relative rounded-2xl p-6 bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
      
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <feature.icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-white font-bold text-base mb-2">{feature.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

export default function LandingFeatures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4"
          >
            ✨ مميزات لا تُقاوم
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4"
          >
            كل ما تحتاجه{' '}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] bg-clip-text text-transparent">
              في مكان واحد
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            منصة متكاملة تمنحك أدوات احترافية لبناء تجارتك الإلكترونية وتنميتها بسرعة
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {features.map((f, i) => <FeatureCard key={i} feature={f} i={i} />)}
        </div>
      </div>
    </section>
  );
}