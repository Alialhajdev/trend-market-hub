import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import ProductCard from '@/components/cards/ProductCard';
import { Star, ShoppingBag, CheckCircle, MapPin, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function StoreDetail() {
  const storeId = window.location.pathname.split('/store/')[1];
  const { t, isRTL } = useLang();

  const { data: store, isLoading: loadingStore } = useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      const stores = await base44.entities.Store.list();
      return stores.find(s => s.id === storeId);
    },
    enabled: !!storeId,
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['store-products', storeId],
    queryFn: () => base44.entities.Product.filter({ store_id: storeId }),
    enabled: !!storeId,
  });

  if (loadingStore) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-40 rounded-2xl mb-6" />
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
      </div>
    );
  }

  if (!store) return <div className="text-center py-20 text-muted-foreground">{t('noResults')}</div>;

  return (
    <div className="pb-24 lg:pb-0">
      {/* Banner */}
      <div className="relative h-40 md:h-56 bg-gradient-to-br from-primary/20 to-accent/20">
        {store.banner_url && <img src={store.banner_url} alt="" className="w-full h-full object-cover" />}
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Store Info */}
        <div className="relative -mt-10 mb-8">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-background bg-muted overflow-hidden shadow-xl">
              <img src={store.logo_url || `https://ui-avatars.com/api/?name=${store.name}&background=2563EB&color=fff&size=160`}
                alt={store.name} className="w-full h-full object-cover" />
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black">{isRTL ? store.name : (store.name_en || store.name)}</h1>
                {store.is_verified && <CheckCircle className="w-5 h-5 text-primary fill-primary/20" />}
              </div>
              <p className="text-sm text-muted-foreground">{store.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{store.rating?.toFixed(1) || '0.0'}</span>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingBag className="w-4 h-4" />
              {products.length} {t('products')}
            </div>
            {store.city && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {store.city}
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        <h2 className="text-xl font-black mb-6">{t('products')}</h2>
        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border overflow-hidden">
                <Skeleton className="aspect-square" />
                <div className="p-3 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-5 w-24" /></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">{isRTL ? 'لا توجد منتجات بعد' : 'No products yet'}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}