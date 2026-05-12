import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import ProductCard from '@/components/cards/ProductCard';
import CategoryFilter from '@/components/shared/CategoryFilter';
import { Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Deals() {
  const { t, isRTL } = useLang();
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['deals-products'],
    queryFn: async () => {
      const all = await base44.entities.Product.list('-created_date', 50);
      return all.filter(p => p.sale_price && p.sale_price < p.price);
    },
  });

  const filtered = categoryFilter === 'all' ? products : products.filter(p => p.category === categoryFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
          <Tag className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h1 className="text-3xl font-black">{t('deals')}</h1>
          <p className="text-sm text-muted-foreground">{isRTL ? 'أفضل العروض والخصومات' : 'Best deals and discounts'}</p>
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter selected={categoryFilter} onChange={setCategoryFilter} />

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border overflow-hidden">
              <Skeleton className="aspect-square" />
              <div className="p-3 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-5 w-24" /></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">{isRTL ? 'لا توجد عروض في هذا التصنيف' : 'No deals in this category'}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}