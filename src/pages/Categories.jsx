import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import ProductCard from '@/components/cards/ProductCard';
import CategoryFilter from '@/components/shared/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';

export default function Categories() {
  const { t } = useLang();
  const urlParams = new URLSearchParams(window.location.search);
  const [activeCat, setActiveCat] = useState(urlParams.get('cat') || 'all');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products-categories', activeCat],
    queryFn: () => activeCat === 'all'
      ? base44.entities.Product.list('-created_date', 50)
      : base44.entities.Product.filter({ category: activeCat }, '-created_date', 50),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      <h1 className="text-3xl font-black mb-6">{t('categories')}</h1>

      <CategoryFilter selected={activeCat} onChange={setActiveCat} />

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <Skeleton className="aspect-square" />
              <div className="p-3 space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-4 w-full" /><Skeleton className="h-5 w-24" /></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">{t('noResults')}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}