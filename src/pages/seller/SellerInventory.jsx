import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Boxes, AlertTriangle, TrendingDown, CheckCircle, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function SellerInventory() {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState('');
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
    queryFn: () => store ? base44.entities.Product.filter({ store_id: store.id }) : [],
    enabled: !!store?.id,
  });

  const updateStock = useMutation({
    mutationFn: ({ id, stock }) => base44.entities.Product.update(id, { stock }),
    onSuccess: () => { qc.invalidateQueries(['seller-products']); toast.success('تم تحديث المخزون'); setEditingId(null); },
  });

  const filtered = products.filter(p => !search || p.name?.includes(search) || p.sku?.includes(search));
  const lowStock = products.filter(p => (p.stock || 0) <= 5 && (p.stock || 0) > 0);
  const outOfStock = products.filter(p => !p.stock || p.stock === 0);

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-white">إدارة المخزون</h1>
        <p className="text-slate-500 text-sm mt-1">تتبع وأدر مخزون منتجاتك</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'منتج متاح', value: products.filter(p => (p.stock||0) > 5).length, icon: CheckCircle, color: 'from-green-500 to-emerald-500', text: 'text-green-400' },
          { label: 'مخزون منخفض', value: lowStock.length, icon: AlertTriangle, color: 'from-yellow-500 to-orange-500', text: 'text-yellow-400' },
          { label: 'نفد المخزون', value: outOfStock.length, icon: TrendingDown, color: 'from-red-500 to-rose-500', text: 'text-red-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-2xl bg-[#111827] border border-white/[0.07] p-4"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <div className={`text-2xl font-black ${s.text}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-4 mb-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-yellow-400 font-bold text-sm mb-1">تنبيه: مخزون منخفض</div>
            <div className="text-slate-400 text-xs">{lowStock.map(p => p.name).join(' • ')} — يوشك على النفاد</div>
          </div>
        </div>
      )}

      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن منتج..."
          className="w-full bg-[#111827] border border-white/[0.07] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#2563EB]/50"
        />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl bg-[#111827] border border-white/[0.07] overflow-hidden"
      >
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">جاري التحميل...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.05] text-slate-500 text-xs">
                  {['المنتج', 'SKU', 'المخزون الحالي', 'الحالة', 'المبيعات', 'تحديث'].map(h => (
                    <th key={h} className="text-right px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.map(p => {
                  const stock = p.stock || 0;
                  const stockStatus = stock === 0 ? { label: 'نفد', cls: 'bg-red-500/10 text-red-400' } : stock <= 5 ? { label: 'منخفض', cls: 'bg-yellow-500/10 text-yellow-400' } : { label: 'متوفر', cls: 'bg-green-500/10 text-green-400' };
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#1E293B] flex-shrink-0">
                            <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80'} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-white text-xs font-medium truncate max-w-[150px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400 text-xs">{p.sku || '—'}</td>
                      <td className="px-4 py-3">
                        {editingId === p.id ? (
                          <div className="flex items-center gap-2">
                            <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)}
                              className="w-20 bg-[#1E293B] border border-[#2563EB]/50 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
                            />
                            <button onClick={() => updateStock.mutate({ id: p.id, stock: Number(editStock) })}
                              className="text-green-400 text-xs hover:text-green-300">✓</button>
                            <button onClick={() => setEditingId(null)} className="text-slate-400 text-xs">✕</button>
                          </div>
                        ) : (
                          <span className="font-bold text-white">{stock}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${stockStatus.cls}`}>{stockStatus.label}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{p.sales_count || 0}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => { setEditingId(p.id); setEditStock(String(p.stock || 0)); }}
                          className="text-[10px] text-[#06B6D4] hover:underline"
                        >تعديل</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}