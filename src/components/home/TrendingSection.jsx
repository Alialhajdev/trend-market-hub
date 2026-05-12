import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import ProductCard from '@/components/cards/ProductCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TrendingSection({ products }) {
  const { t, isRTL } = useLang();

  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black">{t('trendingProducts')}</h2>
          <Link to="/trending">
            <Button variant="ghost" className="gap-1 text-sm">
              {t('viewAll')}
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {products.slice(0, 10).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}