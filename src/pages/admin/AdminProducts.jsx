import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, Trash2, Star, TrendingUp, Eye, MoreVertical, Package, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const CAT_LABELS = {
  electronics: 'إلكترونيات', fashion: 'أزياء', home: 'منزل',
  beauty: 'جمال', sports: 'رياضة', food: 'غذاء', books: 'كتب', digital: 'رقمي', other: 'أخرى',
};

export default function AdminProducts() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [openMenu, setOpenMenu] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => base44.entities.Product.list('-created_date', 200),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Product.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('تم التحديث'); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('تم الحذف'); },
  });

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.store_name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const cats = ['all', ...Object.keys(CAT_LABELS)];

  return (
    <div style={{ direction: 'rtl' }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">إدارة المنتجات</h1>
          <p className="text-white/40 text-sm">{products.length} منتج في المنصة</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو المتجر..."
            className="w-full bg-[#1E293B]/80 border border-white/10 rounded-xl h-10 ps-9 pe-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {cats.map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${catFilter === cat ? 'bg-blue-600 text-white' : 'bg-[#1E293B]/80 border border-white/10 text-white/50 hover:border-white/20'}`}>
              {cat === 'all' ? 'الكل' : CAT_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading && Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[#1E293B]/80 rounded-2xl h-64 animate-pulse" />
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="col-span-full text-center py-20 text-white/30">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>لا توجد منتجات</p>
          </div>
        )}
        {filtered.map((product, i) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-[#1E293B]/80 border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all group">
            <div className="relative aspect-video overflow-hidden bg-white/5">
              <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-2 start-2 flex gap-1">
                {product.is_featured && <span className="text-[9px] bg-amber-500/80 text-white px-1.5 py-0.5 rounded-full font-bold">مميز</span>}
                {product.is_trending && <span className="text-[9px] bg-blue-500/80 text-white px-1.5 py-0.5 rounded-full font-bold">ترند</span>}
              </div>
              <div className="absolute top-2 end-2">
                <div className="relative">
                  <button onClick={() => setOpenMenu(openMenu === product.id ? null : product.id)}
                    className="w-7 h-7 rounded-lg bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                  <AnimatePresence>
                    {openMenu === product.id && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-full end-0 mt-1 w-44 bg-[#0F172A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                        <button onClick={() => { updateMutation.mutate({ id: product.id, data: { is_trending: !product.is_trending } }); setOpenMenu(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-blue-400 hover:bg-blue-500/10 transition-colors">
                          <TrendingUp className="w-3.5 h-3.5" />{product.is_trending ? 'إزالة من الترند' : 'إضافة للترند'}
                        </button>
                        <button onClick={() => { updateMutation.mutate({ id: product.id, data: { is_featured: !product.is_featured } }); setOpenMenu(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors">
                          <Star className="w-3.5 h-3.5" />{product.is_featured ? 'إزالة التمييز' : 'تمييز المنتج'}
                        </button>
                        <button onClick={() => { updateMutation.mutate({ id: product.id, data: { status: 'archived' } }); setOpenMenu(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-orange-400 hover:bg-orange-500/10 transition-colors">
                          <XCircle className="w-3.5 h-3.5" />أرشفة المنتج
                        </button>
                        <div className="h-px bg-white/5" />
                        <button onClick={() => { if (confirm('حذف المنتج؟')) { deleteMutation.mutate(product.id); setOpenMenu(null); } }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />حذف المنتج
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs text-white/30 mb-1">{product.store_name}</p>
              <p className="text-sm font-semibold text-white line-clamp-1 mb-2">{product.name}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-white">{product.sale_price || product.price} ر.س</p>
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{product.rating || 0}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Eye className="w-3 h-3" />
                    <span>{product.views_count || 0}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[9px] bg-white/5 text-white/30 px-2 py-0.5 rounded-full">
                  {CAT_LABELS[product.category] || product.category}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${product.status === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-white/30'}`}>
                  {product.status === 'active' ? 'نشط' : product.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}