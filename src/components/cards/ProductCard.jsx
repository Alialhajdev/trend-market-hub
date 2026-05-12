import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import { Heart, Star, ShoppingCart, Eye, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const { t, isRTL } = useLang();
  const discount = product.sale_price ? Math.round((1 - product.sale_price / product.price) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="flex flex-col gap-1">
              {discount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground text-[10px] px-2 py-0.5">
                  {discount}% {t('off')}
                </Badge>
              )}
              {product.is_trending && (
                <Badge className="bg-accent text-accent-foreground text-[10px] px-2 py-0.5">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {t('trending')}
                </Badge>
              )}
            </div>
            <button className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-destructive">
              <Heart className="w-4 h-4" />
            </button>
          </div>
          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-full h-9 rounded-xl bg-white text-black text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary hover:text-white transition-colors">
              <ShoppingCart className="w-3.5 h-3.5" />
              {t('addToCart')}
            </button>
          </div>
        </div>
      </Link>

      <div className="p-3">
        <p className="text-[11px] text-muted-foreground mb-1">{product.store_name}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 hover:text-primary transition-colors mb-2">
            {isRTL ? product.name : (product.name_en || product.name)}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{product.rating?.toFixed(1) || '0.0'}</span>
          </div>
          <span className="text-muted-foreground text-[10px]">({product.review_count || 0})</span>
          <span className="text-muted-foreground text-[10px]">•</span>
          <span className="text-muted-foreground text-[10px] flex items-center gap-0.5">
            <Eye className="w-3 h-3" />{product.sales_count || 0} {t('sold')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary text-base">
            {product.sale_price || product.price} {t('sar')}
          </span>
          {product.sale_price && (
            <span className="text-xs text-muted-foreground line-through">
              {product.price} {t('sar')}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}