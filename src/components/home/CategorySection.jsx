import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import { Smartphone, Shirt, Home, Sparkles, Dumbbell, UtensilsCrossed, BookOpen, Download, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { key: 'electronics', icon: Smartphone, color: 'from-blue-500 to-blue-600', ar: 'إلكترونيات', en: 'Electronics' },
  { key: 'fashion', icon: Shirt, color: 'from-pink-500 to-rose-500', ar: 'أزياء', en: 'Fashion' },
  { key: 'home', icon: Home, color: 'from-amber-500 to-orange-500', ar: 'المنزل', en: 'Home' },
  { key: 'beauty', icon: Sparkles, color: 'from-purple-500 to-violet-500', ar: 'تجميل', en: 'Beauty' },
  { key: 'sports', icon: Dumbbell, color: 'from-green-500 to-emerald-500', ar: 'رياضة', en: 'Sports' },
  { key: 'food', icon: UtensilsCrossed, color: 'from-red-500 to-rose-500', ar: 'طعام', en: 'Food' },
  { key: 'books', icon: BookOpen, color: 'from-cyan-500 to-teal-500', ar: 'كتب', en: 'Books' },
  { key: 'digital', icon: Download, color: 'from-indigo-500 to-blue-600', ar: 'رقمي', en: 'Digital' },
];

export default function CategorySection() {
  const { t, isRTL } = useLang();

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-black mb-8">{t('byCategory')}</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/categories?cat=${cat.key}`} className="flex flex-col items-center gap-2 group">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  <cat.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <span className="text-xs font-medium text-center">{isRTL ? cat.ar : cat.en}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}