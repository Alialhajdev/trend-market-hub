import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Cart() {
  const { t, isRTL } = useLang();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.CartItem.filter({ customer_email: user.email });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }) => base44.entities.CartItem.update(id, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CartItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(isRTL ? 'تم الحذف من السلة' : 'Removed from cart');
    },
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 200 ? 0 : 25;
  const total = subtotal + shipping;
  const Arrow = isRTL ? ArrowRight : ArrowLeft;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Arrow className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-black">{t('cart')} ({cartItems.length})</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">{t('cartEmpty')}</h2>
          <Link to="/">
            <Button className="mt-4 rounded-xl">{t('continueShopping')}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="bg-card rounded-2xl border border-border/50 p-4 flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                  <img src={item.product_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{item.store_name}</p>
                  <h3 className="font-semibold text-sm truncate">{item.product_name}</h3>
                  <p className="font-bold text-primary mt-1">{item.price} {t('sar')}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-border rounded-lg">
                      <button onClick={() => item.quantity > 1 && updateMutation.mutate({ id: item.id, quantity: item.quantity - 1 })}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors rounded-s-lg">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors rounded-e-lg">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 h-fit sticky top-20">
            <h3 className="font-bold text-lg mb-4">{isRTL ? 'ملخص الطلب' : 'Order Summary'}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('subtotal')}</span>
                <span className="font-medium">{subtotal.toFixed(2)} {t('sar')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('shipping')}</span>
                <span className="font-medium">{shipping === 0 ? t('free') : `${shipping} ${t('sar')}`}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-lg font-black">
                <span>{t('total')}</span>
                <span className="text-primary">{total.toFixed(2)} {t('sar')}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="w-full h-12 rounded-xl font-bold mt-6 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                {t('checkout')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}