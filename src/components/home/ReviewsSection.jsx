import React from 'react';
import { useLang } from '@/lib/i18n';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const demoReviews = [
  { name: 'أحمد محمد', name_en: 'Ahmed Mohammed', rating: 5, text: 'تجربة شراء رائعة! المنتجات عالية الجودة والشحن سريع جداً.', text_en: 'Amazing shopping experience! High quality products and super fast shipping.' },
  { name: 'سارة علي', name_en: 'Sara Ali', rating: 5, text: 'منصة مذهلة للبائعين والمشترين. أنشأت متجري وبدأت البيع خلال دقائق.', text_en: 'Amazing platform for sellers and buyers. Created my store and started selling in minutes.' },
  { name: 'محمد خالد', name_en: 'Mohammed Khalid', rating: 4, text: 'أسعار تنافسية ومنتجات متنوعة. أنصح بها بشدة.', text_en: 'Competitive prices and diverse products. Highly recommended.' },
];

export default function ReviewsSection() {
  const { t, isRTL } = useLang();

  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-black mb-8 text-center">{t('customerReviews')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demoReviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border/50 p-6"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-sm leading-relaxed mb-4 text-muted-foreground">
                {isRTL ? review.text : review.text_en}
              </p>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                ))}
              </div>
              <div className="font-semibold text-sm">{isRTL ? review.name : review.name_en}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}