import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import StoreCard from '@/components/cards/StoreCard';
import CategoryFilter from '@/components/shared/CategoryFilter';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function Stores() {
  const { t, isRTL } = useLang();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: () => base44.entities.Store.list('-created_date', 50),
  });

  const filtered = stores.filter(s => {
    const matchName = s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || s.name_en?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'all' || s.category === categoryFilter;
    return matchName && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      <h1 className="text-3xl font-black mb-6">{t('stores')}</h1>

      {/* Category Filter */}
      <CategoryFilter selected={categoryFilter} onChange={setCategoryFilter} />

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" style={{ [isRTL ? 'right' : 'left']: '12px' }} />
        <Input
          placeholder={isRTL ? 'ابحث عن متجر...' : 'Search stores...'}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="rounded-xl h-11"
          style={isRTL ? { paddingRight: '40px' } : { paddingLeft: '40px' }}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <Skeleton className="h-24" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">{t('noResults')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(store => <StoreCard key={store.id} store={store} />)}
        </div>
      )}
    </div>
  );
}