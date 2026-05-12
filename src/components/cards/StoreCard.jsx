import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import { Star, ShoppingBag, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function StoreCard({ store }) {
  const { t, isRTL } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link to={`/store/${store.id}`} className="block bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
        {/* Banner */}
        <div className="relative h-24 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
          {store.banner_url && (
            <img src={store.banner_url} alt="" className="w-full h-full object-cover" loading="lazy" />
          )}
          {store.is_featured && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px]">
              {t('featured')}
            </Badge>
          )}
        </div>

        {/* Logo */}
        <div className="relative px-4 -mt-8">
          <div className="w-16 h-16 rounded-2xl border-4 border-card bg-muted overflow-hidden shadow-lg">
            <img
              src={store.logo_url || `https://ui-avatars.com/api/?name=${store.name}&background=2563EB&color=fff&size=128`}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="p-4 pt-2">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="font-bold text-sm">{isRTL ? store.name : (store.name_en || store.name)}</h3>
            {store.is_verified && <CheckCircle className="w-4 h-4 text-primary fill-primary/20" />}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{store.description}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{store.rating?.toFixed(1) || '0.0'}</span>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{store.total_products || 0} {t('products')}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}