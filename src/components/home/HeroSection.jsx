import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import { ArrowLeft, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const { t, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-primary/20 text-white">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>{t('heroSubtitle')}</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
              {t('heroTitle')}
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-2">
                Trend Market Hub
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-lg mb-8 leading-relaxed">
              {t('heroDesc')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/stores">
                <Button size="lg" className="bg-white text-secondary hover:bg-white/90 gap-2 rounded-xl h-12 px-6 font-bold">
                  <ShoppingBag className="w-5 h-5" />
                  {t('shopNow')}
                </Button>
              </Link>
              <Link to="/create-store">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 rounded-xl h-12 px-6 font-bold">
                  {t('startSelling')}
                  <Arrow className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-10">
              {[
                { value: '10K+', label: isRTL ? 'منتج' : 'Products' },
                { value: '2K+', label: isRTL ? 'متجر' : 'Stores' },
                { value: '50K+', label: isRTL ? 'عميل' : 'Customers' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl rotate-6 scale-95" />
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop"
                alt="Shopping"
                className="relative w-full rounded-3xl shadow-2xl"
              />
              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 bg-white/90 dark:bg-card backdrop-blur-xl rounded-2xl p-3 shadow-xl"
              >
                <div className="text-xs text-muted-foreground">{isRTL ? 'طلبات اليوم' : "Today's Orders"}</div>
                <div className="text-xl font-black text-primary">1,247</div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white/90 dark:bg-card backdrop-blur-xl rounded-2xl p-3 shadow-xl"
              >
                <div className="text-xs text-muted-foreground">{isRTL ? 'نمو المبيعات' : 'Sales Growth'}</div>
                <div className="text-xl font-black text-green-500">+34%</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}