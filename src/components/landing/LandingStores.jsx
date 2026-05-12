import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Package, CheckCircle } from 'lucide-react';

const mockStores = [
  { name: 'متجر الأناقة', category: 'أزياء وملابس', rating: 4.9, products: 340, color: 'from-pink-500 to-rose-600', emoji: '👗', sales: '12,400 ر.س' },
  { name: 'إلكترونيات برو', category: 'إلكترونيات وأجهزة', rating: 4.8, products: 215, color: 'from-blue-500 to-indigo-600', emoji: '📱', sales: '89,200 ر.س' },
  { name: 'بيتي الجميل', category: 'ديكور وأثاث', rating: 4.7, products: 128, color: 'from-amber-500 to-orange-600', emoji: '🏠', sales: '34,600 ر.س' },
  { name: 'عالم الرياضة', category: 'رياضة ولياقة', rating: 4.9, products: 95, color: 'from-green-500 to-emerald-600', emoji: '⚽', sales: '21,800 ر.س' },
  { name: 'ميك أب كوين', category: 'تجميل وعناية', rating: 5.0, products: 176, color: 'from-purple-500 to-violet-600', emoji: '💄', sales: '56,100 ر.س' },
  { name: 'كتب العالم', category: 'كتب وثقافة', rating: 4.6, products: 512, color: 'from-teal-500 to-cyan-600', emoji: '📚', sales: '9,300 ر.س' },
];

function StoreCard({ store, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.07 }}
      className="group relative rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer flex-shrink-0 w-64"
    >
      {/* Banner */}
      <div className={`h-28 bg-gradient-to-br ${store.color} relative flex items-center justify-center`}>
        <span className="text-5xl filter drop-shadow-lg">{store.emoji}</span>
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Logo */}
      <div className="absolute top-16 right-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${store.color} border-2 border-[#0F172A] flex items-center justify-center text-2xl shadow-lg`}>
          {store.emoji}
        </div>
      </div>

      <div className="p-4 pt-10">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3 className="font-black text-white">{store.name}</h3>
          <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <p className="text-xs text-slate-500 mb-3">{store.category}</p>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-3 h-3 fill-yellow-400" />
            <span className="font-bold text-white">{store.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <Package className="w-3 h-3" />
            <span>{store.products} منتج</span>
          </div>
          <div className="text-green-400 font-bold">{store.sales}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingStores() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="stores" className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6" ref={ref}>
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4"
          >
            🏪 متاجر ناجحة
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4"
          >
            آلاف المتاجر{' '}
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              تزدهر يومياً
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg"
          >
            انضم لمجتمع البائعين الناجحين وابدأ قصة نجاحك
          </motion.p>
        </div>

        {/* Scrolling carousel */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0F172A] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0F172A] to-transparent z-10 pointer-events-none" />
          
          <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-4">
            {mockStores.map((store, i) => (
              <StoreCard key={i} store={store} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}