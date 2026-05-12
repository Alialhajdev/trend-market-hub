import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, ChevronDown, ShoppingCart, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const STATUS_STYLES = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  processing: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  shipped: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  delivered: 'bg-green-500/15 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
  refunded: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};
const STATUS_LABELS = {
  pending: 'معلق', processing: 'يعالج', shipped: 'مشحون',
  delivered: 'مكتمل', cancelled: 'ملغي', refunded: 'مسترجع',
};
const ALL_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrders() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 200),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-orders'] }); toast.success('تم تحديث الطلب'); },
  });

  const filtered = orders.filter(o => {
    const matchSearch = !search
      || o.order_number?.toLowerCase().includes(search.toLowerCase())
      || o.customer_email?.toLowerCase().includes(search.toLowerCase())
      || o.store_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = ALL_STATUSES.map(s => ({ key: s, label: STATUS_LABELS[s], count: orders.filter(o => o.status === s).length }));

  return (
    <div style={{ direction: 'rtl' }} className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-white">إدارة الطلبات</h1>
        <p className="text-white/40 text-sm">{orders.length} طلب في المنصة</p>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button onClick={() => setStatusFilter('all')}
          className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-[#1E293B]/80 border border-white/10 text-white/50 hover:border-white/20'}`}>
          الكل ({orders.length})
        </button>
        {stats.map(stat => (
          <button key={stat.key} onClick={() => setStatusFilter(stat.key)}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${statusFilter === stat.key ? 'bg-blue-600 text-white' : 'bg-[#1E293B]/80 border border-white/10 text-white/50 hover:border-white/20'}`}>
            {stat.label} ({stat.count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث برقم الطلب أو العميل..."
          className="w-full bg-[#1E293B]/80 border border-white/10 rounded-xl h-10 ps-9 pe-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all" />
      </div>

      {/* Table */}
      <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-xs text-white/30 font-medium px-4 py-3 text-start">رقم الطلب</th>
                <th className="text-xs text-white/30 font-medium px-4 py-3 text-start hidden md:table-cell">العميل</th>
                <th className="text-xs text-white/30 font-medium px-4 py-3 text-start hidden lg:table-cell">المتجر</th>
                <th className="text-xs text-white/30 font-medium px-4 py-3 text-start">الإجمالي</th>
                <th className="text-xs text-white/30 font-medium px-4 py-3 text-start">الحالة</th>
                <th className="text-xs text-white/30 font-medium px-4 py-3 text-start hidden xl:table-cell">الدفع</th>
                <th className="text-xs text-white/30 font-medium px-4 py-3 text-center">تغيير الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-4">
                  <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
                </td></tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-16">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-white/10" />
                  <p className="text-white/30 text-sm">لا توجد طلبات</p>
                </td></tr>
              )}
              {filtered.map((order, i) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold text-white font-mono">{order.order_number || `#${order.id?.slice(-8)}`}</p>
                    <p className="text-[10px] text-white/30">{order.items?.length || 0} عنصر</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-white/70">{order.customer_name || '—'}</p>
                    <p className="text-[10px] text-white/30 truncate max-w-[140px]">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-sm text-white/70">{order.store_name || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-black text-white">{order.total?.toFixed(0)} ر.س</p>
                    <p className="text-[10px] text-white/30">عمولة: {order.commission_amount?.toFixed(0) || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_STYLES[order.status] || 'bg-white/5 text-white/30'}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.payment_status === 'paid' ? 'bg-green-500/15 text-green-400' : 'bg-amber-500/15 text-amber-400'}`}>
                      {order.payment_status === 'paid' ? 'مدفوع' : 'معلق'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={order.status}
                      onChange={e => updateMutation.mutate({ id: order.id, data: { status: e.target.value } })}
                      className="bg-[#0F172A] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500/50 w-28"
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
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