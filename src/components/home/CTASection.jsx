import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import { Store, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function CTASection() {
  const { t, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const features = isRTL
    ? ['إنشاء متجر مجاني', 'بدون عمولة أول شهر', 'دعم فني 24/7', 'أدوات تسويق مدمجة']
    : ['Free store creation', 'No commission first month', '24/7 Support', 'Built-in marketing tools'];

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-95" />
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">{t('startYourStore')}</h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">{t('startStoreDesc')}</p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-white/80" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <Link to="/create-store">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2 rounded-xl h-12 px-8 font-bold">
              {t('createStore')}
              <Arrow className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}