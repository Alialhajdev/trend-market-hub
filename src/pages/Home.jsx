import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import TrendingSection from '@/components/home/TrendingSection';
import StoresSection from '@/components/home/StoresSection';
import CTASection from '@/components/home/CTASection';
import ReviewsSection from '@/components/home/ReviewsSection';
import { Skeleton } from '@/components/ui/skeleton';

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 max-w-7xl mx-auto">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border/50">
          <Skeleton className="aspect-square" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { t } = useLang();

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products-home'],
    queryFn: () => base44.entities.Product.list('-created_date', 20),
  });

  const { data: stores = [], isLoading: loadingStores } = useQuery({
    queryKey: ['stores-home'],
    queryFn: () => base44.entities.Store.list('-created_date', 10),
  });

  const trendingProducts = products.filter(p => p.is_trending);
  const featuredStores = stores.filter(s => s.is_featured);

  return (
    <div className="pb-20 lg:pb-0">
      <HeroSection />
      <CategorySection />

      {loadingProducts ? (
        <div className="py-12"><ProductSkeleton /></div>
      ) : (
        <TrendingSection products={trendingProducts.length > 0 ? trendingProducts : products} />
      )}

      {!loadingStores && stores.length > 0 && (
        <StoresSection stores={featuredStores.length > 0 ? featuredStores : stores} title={t('bestStores')} />
      )}

      <CTASection />
      <ReviewsSection />
    </div>
  );
}