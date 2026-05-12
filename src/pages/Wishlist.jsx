import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { t, isRTL } = useLang();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Wishlist.filter({ customer_email: user.email });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id) => base44.entities.Wishlist.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(isRTL ? 'تم الحذف من المفضلة' : 'Removed from wishlist');
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-6 h-6 text-destructive" />
        <h1 className="text-2xl font-black">{t('wishlist')} ({items.length})</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">{isRTL ? 'المفضلة فارغة' : 'Wishlist is empty'}</h2>
          <Link to="/"><Button className="mt-4 rounded-xl">{t('continueShopping')}</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map(item => (
            <div key={item.id} className="bg-card rounded-2xl border border-border/50 p-4 flex gap-4">
              <Link to={`/product/${item.product_id}`} className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                <img src={item.product_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'} alt="" className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{item.store_name}</p>
                <h3 className="font-semibold text-sm truncate">{item.product_name}</h3>
                <p className="font-bold text-primary mt-1">{item.product_price} {t('sar')}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={() => removeMutation.mutate(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}