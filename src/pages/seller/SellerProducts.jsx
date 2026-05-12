import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, TrendingUp, Star, Package, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';

const statusColors = {
  active: 'bg-green-500/10 text-green-400 border-green-500/20',
  draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  out_of_stock: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  archived: 'bg-red-500/10 text-red-400 border-red-500/20',
};
const statusLabels = { active: 'نشط', draft: 'مسودة', out_of_stock: 'نفد', archived: 'مؤرشف' };

export default function SellerProducts() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const qc = useQueryClient();

  const { data: store } = useQuery({
    queryKey: ['my-store'], queryFn: async () => {
      const user = await base44.auth.me();
      const stores = await base44.entities.Store.filter({ owner_email: user.email });
      return stores[0] || null;
    }
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['seller-products', store?.id],
    queryFn: () => store ? base44.entities.Product.filter({ store_id: store.id }, '-created_date') : [],
    enabled: !!store?.id,
  });

  const deleteProduct = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => { qc.invalidateQueries(['seller-products']); toast.success('تم حذف المنتج'); },
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Product.update(id, { status }),
    onSuccess: () => { qc.invalidateQueries(['seller-products']); toast.success('تم تحديث حالة المنتج'); },
  });

  const filtered = products.filter(p => {
    const matchS = !search || p.name?.includes(search) || p.name_en?.toLowerCase().includes(search.toLowerCase());
    const matchSt = statusFilter === 'all' || p.status === statusFilter;
    return matchS && matchSt;
  });

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">إدارة المنتجات</h1>
          <p className="text-slate-500 text-sm mt-1">{products.length} منتج في متجرك</p>
        </div>
        <Link
          to="/add-product"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          منتج جديد
        </Link>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {Object.entries(statusLabels).map(([k, label]) => {
          const count = products.filter(p => p.status === k).length;
          return (
            <button key={k} onClick={() => setStatusFilter(k)}
              className={`rounded-xl p-3 border text-right transition-all ${statusFilter === k ? statusColors[k] + ' border-current' : 'bg-[#111827] border-white/[0.07] hover:border-white/20'}`}
            >
              <div className="text-2xl font-black text-white">{count}</div>
              <div className="text-xs text-slate-400">{label}</div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full bg-[#111827] border border-white/[0.07] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#2563EB]/50"
          />
        </div>
        <button onClick={() => setStatusFilter('all')}
          className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${statusFilter === 'all' ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'bg-[#111827] border-white/[0.07] text-slate-400 hover:text-white'}`}
        >
          الكل ({products.length})
        </button>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <div key={i} className="rounded-2xl bg-[#111827] h-64 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>لا توجد منتجات{search ? ' مطابقة للبحث' : ' — أضف منتجاتك الأولى!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
                className="group rounded-2xl bg-[#111827] border border-white/[0.07] hover:border-white/20 transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-[#1E293B]">
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {p.is_trending && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <TrendingUp className="w-2.5 h-2.5" />ترند
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[p.status] || statusColors.active}`}>
                    {statusLabels[p.status] || p.status}
                  </span>
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Link to="/add-product" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => toggleStatus.mutate({ id: p.id, status: p.status === 'active' ? 'archived' : 'active' })}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                    >
                      {p.status === 'active' ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                    </button>
                    <button
                      onClick={() => { if(confirm('حذف المنتج؟')) deleteProduct.mutate(p.id) }}
                      className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-white text-xs font-semibold line-clamp-1 mb-1">{p.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-[#06B6D4] font-black text-sm">{p.price} ر.س</span>
                    <span className="text-slate-500 text-[10px] flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5" />{p.rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[10px] mt-0.5">مخزون: {p.stock || 0} • مبيعات: {p.sales_count || 0}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}