import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Search, Filter, Printer, Eye, ChevronDown, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const statusConfig = {
  pending: { label: 'جديد', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: Clock },
  processing: { label: 'معالجة', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Package },
  shipped: { label: 'مشحون', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: Truck },
  delivered: { label: 'مكتمل', color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: CheckCircle },
  cancelled: { label: 'ملغي', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle },
};

export default function SellerOrders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const qc = useQueryClient();

  const { data: store } = useQuery({
    queryKey: ['my-store'], queryFn: async () => {
      const user = await base44.auth.me();
      const stores = await base44.entities.Store.filter({ owner_email: user.email });
      return stores[0] || null;
    }
  });

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['seller-orders', store?.id],
    queryFn: () => store ? base44.entities.Order.filter({ store_id: store.id }, '-created_date') : [],
    enabled: !!store?.id,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Order.update(id, { status }),
    onSuccess: () => { qc.invalidateQueries(['seller-orders']); toast.success('تم تحديث حالة الطلب'); },
  });

  const filtered = orders.filter(o => {
    const matchSearch = !search || (o.order_number || o.id)?.toLowerCase().includes(search.toLowerCase()) || o.customer_name?.includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const tabs = ['all', ...Object.keys(statusConfig)];
  const tabLabels = { all: 'الكل', ...Object.fromEntries(Object.entries(statusConfig).map(([k,v]) => [k, v.label])) };

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-white">إدارة الطلبات</h1>
        <p className="text-slate-500 text-sm mt-1">تابع وأدر جميع طلبات متجرك</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {Object.entries(statusConfig).map(([k, v]) => {
          const count = orders.filter(o => o.status === k).length;
          const Icon = v.icon;
          return (
            <button key={k} onClick={() => setStatusFilter(k)}
              className={`rounded-xl p-3 border text-right transition-all ${statusFilter === k ? v.color + ' border-current' : 'bg-[#111827] border-white/[0.07] hover:border-white/20'}`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <div className="text-lg font-black text-white">{count}</div>
              <div className="text-xs text-slate-400">{v.label}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ابحث برقم الطلب أو اسم العميل..."
            className="w-full bg-[#111827] border border-white/[0.07] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#2563EB]/50"
          />
        </div>
        <div className="flex gap-1 bg-[#111827] border border-white/[0.07] rounded-xl p-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t} onClick={() => setStatusFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${statusFilter === t ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {tabLabels[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl bg-[#111827] border border-white/[0.07] overflow-hidden"
      >
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">لا توجد طلبات</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.05] text-slate-500 text-xs">
                  {['رقم الطلب', 'العميل', 'المنتجات', 'الإجمالي', 'الحالة', 'التاريخ', 'إجراءات'].map(h => (
                    <th key={h} className="text-right px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.map(order => {
                  const sc = statusConfig[order.status] || statusConfig.pending;
                  const Icon = sc.icon;
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 py-3 font-mono text-blue-400 text-xs">#{order.order_number || order.id?.slice(-6)}</td>
                      <td className="px-4 py-3">
                        <div className="text-white font-medium">{order.customer_name || '—'}</div>
                        <div className="text-slate-500 text-xs">{order.customer_email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{order.items?.length || 0} منتج</td>
                      <td className="px-4 py-3 font-bold text-white">{order.total} ر.س</td>
                      <td className="px-4 py-3">
                        <div className="relative group/status inline-block">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer ${sc.color}`}>
                            <Icon className="w-3 h-3" />
                            {sc.label}
                            <ChevronDown className="w-2.5 h-2.5" />
                          </span>
                          <div className="absolute z-20 top-full right-0 mt-1 bg-[#1E293B] border border-white/10 rounded-xl shadow-xl opacity-0 group-hover/status:opacity-100 pointer-events-none group-hover/status:pointer-events-auto transition-all min-w-[110px]">
                            {Object.entries(statusConfig).map(([k, v]) => (
                              <button key={k} onClick={() => updateStatus.mutate({ id: order.id, status: k })}
                                className="flex items-center gap-2 w-full text-right px-3 py-2 text-xs hover:bg-white/5 transition-colors first:rounded-t-xl last:rounded-b-xl"
                              >
                                <span className={`w-2 h-2 rounded-full ${k === 'delivered' ? 'bg-green-400' : k === 'cancelled' ? 'bg-red-400' : k === 'shipped' ? 'bg-purple-400' : k === 'processing' ? 'bg-blue-400' : 'bg-yellow-400'}`} />
                                <span className="text-slate-300">{v.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{order.created_date ? new Date(order.created_date).toLocaleDateString('ar') : '—'}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">تفاصيل الطلب #{selectedOrder.order_number || selectedOrder.id?.slice(-6)}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">العميل</span>
                <span className="text-white font-medium">{selectedOrder.customer_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">الإجمالي</span>
                <span className="text-white font-bold">{selectedOrder.total} ر.س</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">طريقة الدفع</span>
                <span className="text-white">{selectedOrder.payment_method || '—'}</span>
              </div>
              {selectedOrder.shipping_address && (
                <div className="py-2 border-b border-white/5">
                  <div className="text-slate-400 mb-1">عنوان الشحن</div>
                  <div className="text-white text-xs">{selectedOrder.shipping_address?.address}, {selectedOrder.shipping_address?.city}</div>
                </div>
              )}
              {selectedOrder.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-[#1E293B] flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-white text-xs font-medium">{item.product_name}</div>
                    <div className="text-slate-500 text-xs">x{item.quantity}</div>
                  </div>
                  <div className="text-white font-bold text-xs">{item.price} ر.س</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}