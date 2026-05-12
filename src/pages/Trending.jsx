import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import ProductCard from '@/components/cards/ProductCard';
import CategoryFilter from '@/components/shared/CategoryFilter';
import { TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Trending() {
  const { t, isRTL } = useLang();
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['trending-products'],
    queryFn: () => base44.entities.Product.list('-sales_count', 50),
  });

  const filtered = categoryFilter === 'all' ? products : products.filter(p => p.category === categoryFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-black">{t('trendingProducts')}</h1>
          <p className="text-sm text-muted-foreground">{isRTL ? 'المنتجات الأكثر مبيعاً ورواجاً' : 'Best selling and most popular products'}</p>
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter selected={categoryFilter} onChange={setCategoryFilter} />

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <Skeleton className="aspect-square" />
              <div className="p-3 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-5 w-24" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}