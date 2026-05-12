import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import StoreCard from '@/components/cards/StoreCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StoresSection({ stores, title }) {
  const { t, isRTL } = useLang();

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black">{title}</h2>
          <Link to="/stores">
            <Button variant="ghost" className="gap-1 text-sm">
              {t('viewAll')}
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stores.slice(0, 4).map(store => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
}