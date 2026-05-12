import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import { Star, Heart, Share2, ShoppingCart, Minus, Plus, Eye, TrendingUp, MessageCircle, ChevronLeft, ChevronRight, Store, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/cards/ProductCard';

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = window.location.pathname.split('/product/')[1];
  const { t, isRTL } = useLang();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const products = await base44.entities.Product.list();
      return products.find(p => p.id === productId);
    },
    enabled: !!productId,
  });

  const { data: similarProducts = [] } = useQuery({
    queryKey: ['similar-products', product?.category],
    queryFn: () => base44.entities.Product.filter({ category: product.category }, '-created_date', 5),
    enabled: !!product?.category,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.CartItem.create({
        customer_email: user.email,
        product_id: product.id,
        product_name: product.name,
        product_image: product.images?.[0] || '',
        store_id: product.store_id,
        store_name: product.store_name,
        price: product.sale_price || product.price,
        quantity: qty,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(isRTL ? 'تمت الإضافة للسلة' : 'Added to cart');
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-muted rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-8 w-3/4 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-10 w-40 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-muted-foreground">{t('noResults')}</div>;
  }

  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'];
  const discount = product.sale_price ? Math.round((1 - product.sale_price / product.price) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 lg:pb-8">
      <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-3">
            <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button onClick={() => setActiveImg(i => i > 0 ? i - 1 : images.length - 1)}
                  className="absolute top-1/2 left-3 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setActiveImg(i => i < images.length - 1 ? i + 1 : 0)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            {discount > 0 && (
              <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                -{discount}%
              </Badge>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-primary' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <Link to={`/store/${product.store_id}`} className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-2">
            <Store className="w-4 h-4" />
            {product.store_name}
          </Link>

          <h1 className="text-2xl md:text-3xl font-black mb-3">
            {isRTL ? product.name : (product.name_en || product.name)}
          </h1>

          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{product.rating?.toFixed(1) || '0.0'}</span>
              <span className="text-muted-foreground">({product.review_count || 0} {t('reviews')})</span>
            </div>
            <span className="text-muted-foreground flex items-center gap-1">
              <Eye className="w-4 h-4" />{product.views_count || 0} {t('views')}
            </span>
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />{product.sales_count || 0} {t('sold')}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-black text-primary">
              {product.sale_price || product.price} {t('sar')}
            </span>
            {product.sale_price && (
              <span className="text-lg text-muted-foreground line-through">{product.price} {t('sar')}</span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">{product.stock > 0 ? t('inStock') : t('outOfStock')}</span>
            {product.stock > 0 && <span className="text-xs text-muted-foreground">({product.stock})</span>}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium">{isRTL ? 'الكمية:' : 'Quantity:'}</span>
            <div className="flex items-center border border-border rounded-xl">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors rounded-s-xl">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors rounded-e-xl">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <Button size="lg" className="flex-1 h-12 rounded-xl font-bold gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              onClick={() => addToCartMutation.mutate()}>
              <ShoppingCart className="w-5 h-5" />
              {t('addToCart')}
            </Button>
            <Button size="lg" variant="outline" className="h-12 w-12 rounded-xl p-0">
              <Heart className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 w-12 rounded-xl p-0">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Shipping */}
          <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
            <Truck className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">{isRTL ? 'شحن سريع' : 'Fast Shipping'}</p>
              <p className="text-xs text-muted-foreground">{isRTL ? 'التوصيل خلال 2-5 أيام عمل' : 'Delivery in 2-5 business days'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="mt-10">
        <TabsList className="bg-muted/50 rounded-xl">
          <TabsTrigger value="description" className="rounded-lg">{t('description')}</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-lg">{t('reviews')}</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {product.description || (isRTL ? 'لا يوجد وصف متاح لهذا المنتج' : 'No description available for this product')}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4">
          <div className="bg-card rounded-2xl border border-border/50 p-6 text-center text-muted-foreground">
            {isRTL ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
          </div>
        </TabsContent>
      </Tabs>

      {/* Similar Products */}
      {similarProducts.length > 1 && (
        <div className="mt-12">
          <h2 className="text-xl font-black mb-6">{t('similarProducts')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {similarProducts.filter(p => p.id !== product.id).slice(0, 5).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}