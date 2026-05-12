import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, ShieldCheck, Ban, MoreVertical, Store, Package, DollarSign, Star, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminVendors() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState(null);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: () => base44.entities.Store.list('-created_date', 200),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Store.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-stores'] }); toast.success('تم التحديث'); },
  });

  const filtered = stores.filter(s =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.owner_email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ direction: 'rtl' }} className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-white">إدارة البائعين</h1>
        <p className="text-white/40 text-sm">{stores.length} بائع مسجل في المنصة</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي البائعين', value: stores.length, color: 'blue' },
          { label: 'موثّقون', value: stores.filter(s => s.is_verified).length, color: 'green' },
          { label: 'نشطون', value: stores.filter(s => s.status === 'active').length, color: 'cyan' },
          { label: 'موقوفون', value: stores.filter(s => s.status === 'suspended').length, color: 'red' },
        ].map((item, i) => {
          const colorMap = {
            blue: 'from-blue-500/20 border-blue-500/20 text-blue-400',
            green: 'from-green-500/20 border-green-500/20 text-green-400',
            cyan: 'from-cyan-500/20 border-cyan-500/20 text-cyan-400',
            red: 'from-red-500/20 border-red-500/20 text-red-400',
          };
          return (
            <div key={i} className={`bg-gradient-to-br ${colorMap[item.color]} border rounded-2xl p-4`}>
              <p className="text-2xl font-black text-white">{item.value}</p>
              <p className="text-xs text-white/40 mt-1">{item.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث باسم البائع أو البريد..."
          className="w-full bg-[#1E293B]/80 border border-white/10 rounded-xl h-10 ps-9 pe-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all" />
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[#1E293B]/80 rounded-2xl h-48 animate-pulse" />
        ))}
        {filtered.map((store, i) => (
          <motion.div key={store.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-[#1E293B]/80 border border-white/5 rounded-2xl p-5 hover:border-white/15 transition-all">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={store.logo_url || `https://ui-avatars.com/api/?name=${store.name}&background=2563EB&color=fff&size=64`}
                  className="w-12 h-12 rounded-xl object-cover" alt="" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm text-white">{store.name}</p>
                    {store.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                  <p className="text-xs text-white/40 truncate max-w-[140px]">{store.owner_email}</p>
                </div>
              </div>
              <div className="relative">
                <button onClick={() => setOpenMenu(openMenu === store.id ? null : store.id)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {openMenu === store.id && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute top-full end-0 mt-1 w-44 bg-[#0F172A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <button onClick={() => { updateMutation.mutate({ id: store.id, data: { is_verified: !store.is_verified } }); setOpenMenu(null); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-blue-400 hover:bg-blue-500/10 transition-colors">
                        <ShieldCheck className="w-4 h-4" />{store.is_verified ? 'إلغاء التوثيق' : 'توثيق البائع'}
                      </button>
                      <button onClick={() => { updateMutation.mutate({ id: store.id, data: { status: store.status === 'active' ? 'suspended' : 'active' } }); setOpenMenu(null); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-red-500/10 transition-colors ${store.status === 'active' ? 'text-red-400' : 'text-green-400'}`}>
                        {store.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {store.status === 'active' ? 'إيقاف البائع' : 'تفعيل البائع'}
                      </button>
                      <button onClick={() => { updateMutation.mutate({ id: store.id, data: { subscription_plan: 'vip' } }); setOpenMenu(null); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10 transition-colors">
                        <Star className="w-4 h-4" />ترقية إلى VIP
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${store.status === 'active' ? 'bg-green-500/15 text-green-400 border-green-500/30' : 'bg-red-500/15 text-red-400 border-red-500/30'}`}>
                {store.status === 'active' ? 'نشط' : 'موقوف'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase ${store.subscription_plan === 'vip' ? 'bg-amber-500/15 text-amber-400' : store.subscription_plan === 'pro' ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-white/30'}`}>
                {store.subscription_plan || 'free'}
              </span>
              {store.is_featured && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-medium">مميز</span>}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 bg-white/3 rounded-xl p-3">
              <div className="text-center">
                <p className="text-sm font-black text-white">{store.total_products || 0}</p>
                <p className="text-[10px] text-white/30">منتج</p>
              </div>
              <div className="text-center border-x border-white/5">
                <p className="text-sm font-black text-white">{store.commission_rate || 10}%</p>
                <p className="text-[10px] text-white/30">عمولة</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-white">{((store.total_sales || 0) / 1000).toFixed(1)}K</p>
                <p className="text-[10px] text-white/30">مبيعات</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}