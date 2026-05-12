import React from 'react';
import { useLang } from '@/lib/i18n';
import { Smartphone, Shirt, Home, Sparkles, Dumbbell, UtensilsCrossed, BookOpen, Download, LayoutGrid } from 'lucide-react';

export const CATEGORIES = [
  { value: 'all', ar: 'الكل', en: 'All', icon: LayoutGrid },
  { value: 'electronics', ar: 'إلكترونيات', en: 'Electronics', icon: Smartphone },
  { value: 'fashion', ar: 'أزياء', en: 'Fashion', icon: Shirt },
  { value: 'home', ar: 'المنزل', en: 'Home', icon: Home },
  { value: 'beauty', ar: 'تجميل', en: 'Beauty', icon: Sparkles },
  { value: 'sports', ar: 'رياضة', en: 'Sports', icon: Dumbbell },
  { value: 'food', ar: 'طعام', en: 'Food', icon: UtensilsCrossed },
  { value: 'books', ar: 'كتب', en: 'Books', icon: BookOpen },
  { value: 'digital', ar: 'رقمي', en: 'Digital', icon: Download },
];

export default function CategoryFilter({ selected, onChange }) {
  const { isRTL } = useLang();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar mb-6">
      {CATEGORIES.map(cat => {
        const Icon = cat.icon;
        const active = selected === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border shrink-0 ${
              active
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{isRTL ? cat.ar : cat.en}</span>
          </button>
        );
      })}
    </div>
  );
}