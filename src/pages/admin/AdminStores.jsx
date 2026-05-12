import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, Filter, CheckCircle, Ban, Trash2, Edit2, Eye, Star, Package, MoreVertical, ShieldCheck, Clock, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_STYLES = {
  active: 'bg-green-500/15 text-green-400 border-green-500/30',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  suspended: 'bg-red-500/15 text-red-400 border-red-500/30',
  closed: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
};
const STATUS_LABELS = { active: 'نشط', pending: 'معلق', suspended: 'موقوف', closed: 'مغلق' };
const PLAN_STYLES = {
  free: 'bg-white/5 text-white/40', pro: 'bg-blue-500/15 text-blue-400',
  vip: 'bg-amber-500/15 text-amber-400'
};

export default function AdminStores() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openMenu, setOpenMenu] = useState(null);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: () => base44.entities.Store.list('-created_date', 200),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Store.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-stores'] }); toast.success('تم التحديث بنجاح'); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Store.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-stores'] }); toast.success('تم الحذف'); },
  });

  const filtered = stores.filter(s => {
    const matchSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.owner_email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: 'الكل', value: stores.length, key: 'all' },
    { label: 'نشط', value: stores.filter(s => s.status === 'active').length, key: 'active' },
    { label: 'معلق', value: stores.filter(s => s.status === 'pending').length, key: 'pending' },
    { label: 'موقوف', value: stores.filter(s => s.status === 'suspended').length, key: 'suspended' },
  ];

  return (
    <div style={{ direction: 'rtl' }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">إدارة المتاجر</h1>
          <p className="text-white/40 text-sm">{stores.length} متجر مسجل في المنصة</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map(stat => (
          <button key={stat.key} onClick={() => setStatusFilter(stat.key)}
            className={`p-3 rounded-xl border transition-all text-center ${statusFilter === stat.key ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#1E293B]/80 border-white/5 text-white/60 hover:border-white/20'}`}>
            <p className="text-xl font-black text-inherit">{stat.value}</p>
            <p className="text-xs mt-0.5 opacity-70">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو البريد..."
            className="w-full bg-[#1E293B]/80 border border-white/10 rounded-xl h-10 ps-9 pe-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#1E293B]/80 border border-white/10 rounded-xl h-10 px-3 text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none pr-8">
          <option value="all">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="pending">معلق</option>
          <option value="suspended">موقوف</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-xs text-white/30 font-medium px-4 py-3 text-start">المتجر</th>
                <th className="text-xs text-white/30 font-medium px-4 py-3 text-start hidden md:table-cell">المالك</th>
                <th className="text-xs text-white/30 font-medium px-4 py-3 text-start hidden lg:table-cell">الاشتراك</th>
                <th className="text-xs text-white/30 font-medium px-4 py-3 text-start hidden lg:table-cell">المنتجات</th>
                <th className="text-xs text-white/30 font-medium px-4 py-3 text-start hidden xl:table-cell">الأرباح</th>
                <th className="text-xs text-white/30 font-medium px-4 py-3 text-start">الحالة</th>
                <th className="text-xs text-white/30 font-medium px-4 py-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-4">
                  <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
                </td></tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-16 text-white/30 text-sm">لا توجد متاجر</td></tr>
              )}
              {filtered.map((store, i) => (
                <motion.tr key={store.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={store.logo_url || `https://ui-avatars.com/api/?name=${store.name}&background=2563EB&color=fff&size=64`}
                        className="w-9 h-9 rounded-xl object-cover flex-shrink-0" alt="" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-white truncate">{store.name}</p>
                          {store.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
                        </div>
                        <p className="text-[10px] text-white/30">{store.city || 'غير محدد'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-white/70 truncate max-w-[140px]">{store.owner_email}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase ${PLAN_STYLES[store.subscription_plan] || PLAN_STYLES.free}`}>
                      {store.subscription_plan || 'free'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-white/60">
                      <Package className="w-3.5 h-3.5" />
                      <span className="text-sm">{store.total_products || 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <p className="text-sm font-bold text-white">{(store.total_sales || 0).toLocaleString()} ر.س</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_STYLES[store.status] || STATUS_STYLES.pending}`}>
                      {STATUS_LABELS[store.status] || store.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative flex justify-center">
                      <button onClick={() => setOpenMenu(openMenu === store.id ? null : store.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {openMenu === store.id && (
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute top-full end-0 mt-1 w-44 bg-[#0F172A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                            {store.status !== 'active' && (
                              <button onClick={() => { updateMutation.mutate({ id: store.id, data: { status: 'active' } }); setOpenMenu(null); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-green-400 hover:bg-green-500/10 transition-colors">
                                <CheckCircle className="w-4 h-4" />قبول المتجر
                              </button>
                            )}
                            {store.status !== 'suspended' && (
                              <button onClick={() => { updateMutation.mutate({ id: store.id, data: { status: 'suspended' } }); setOpenMenu(null); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                <Ban className="w-4 h-4" />إيقاف المتجر
                              </button>
                            )}
                            <button onClick={() => { updateMutation.mutate({ id: store.id, data: { is_verified: !store.is_verified } }); setOpenMenu(null); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-blue-400 hover:bg-blue-500/10 transition-colors">
                              <ShieldCheck className="w-4 h-4" />{store.is_verified ? 'إلغاء التوثيق' : 'توثيق المتجر'}
                            </button>
                            <button onClick={() => { updateMutation.mutate({ id: store.id, data: { is_featured: !store.is_featured } }); setOpenMenu(null); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10 transition-colors">
                              <Star className="w-4 h-4" />{store.is_featured ? 'إلغاء التمييز' : 'تمييز المتجر'}
                            </button>
                            <div className="h-px bg-white/5 my-1" />
                            <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذا المتجر؟')) { deleteMutation.mutate(store.id); setOpenMenu(null); } }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                              <Trash2 className="w-4 h-4" />حذف المتجر
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}