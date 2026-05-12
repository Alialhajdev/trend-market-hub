import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Users, Search, Crown, ShoppingBag, DollarSign } from 'lucide-react';

export default function SellerCustomers() {
  const [search, setSearch] = useState('');

  const { data: store } = useQuery({
    queryKey: ['my-store'], queryFn: async () => {
      const user = await base44.auth.me();
      const stores = await base44.entities.Store.filter({ owner_email: user.email });
      return stores[0] || null;
    }
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['seller-orders', store?.id],
    queryFn: () => store ? base44.entities.Order.filter({ store_id: store.id }) : [],
    enabled: !!store?.id,
  });

  // Aggregate customers from orders
  const customers = Object.values(
    orders.reduce((acc, order) => {
      const email = order.customer_email;
      if (!acc[email]) {
        acc[email] = { email, name: order.customer_name || email, orders: 0, total: 0, lastOrder: order.created_date };
      }
      acc[email].orders++;
      acc[email].total += order.total || 0;
      if (order.created_date > acc[email].lastOrder) acc[email].lastOrder = order.created_date;
      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total);

  const filtered = customers.filter(c =>
    !search || c.name?.includes(search) || c.email?.includes(search)
  );

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-white">إدارة العملاء</h1>
        <p className="text-slate-500 text-sm mt-1">{customers.length} عميل في متجرك</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'إجمالي العملاء', value: customers.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
          { label: 'العملاء النشطون', value: customers.filter(c => c.orders > 1).length, icon: Crown, color: 'from-yellow-500 to-orange-500' },
          { label: 'متوسط الإنفاق', value: `${customers.length ? Math.round(customers.reduce((s,c)=>s+c.total,0)/customers.length) : 0} ر.س`, icon: DollarSign, color: 'from-green-500 to-emerald-500' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-2xl bg-[#111827] border border-white/[0.07] p-4"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ابحث باسم العميل أو البريد..."
          className="w-full bg-[#111827] border border-white/[0.07] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#2563EB]/50"
        />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl bg-[#111827] border border-white/[0.07] overflow-hidden"
      >
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-500 text-sm">لا توجد بيانات عملاء بعد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.05] text-slate-500 text-xs">
                  {['العميل', 'عدد الطلبات', 'إجمالي الإنفاق', 'آخر طلب', 'المستوى'].map(h => (
                    <th key={h} className="text-right px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.map((c, i) => (
                  <motion.tr key={c.email} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.name?.[0] || '?'}
                        </div>
                        <div>
                          <div className="text-white font-medium text-xs">{c.name}</div>
                          <div className="text-slate-500 text-[10px]">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <ShoppingBag className="w-3 h-3 text-slate-500" />{c.orders}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-white">{c.total.toFixed(0)} ر.س</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{c.lastOrder ? new Date(c.lastOrder).toLocaleDateString('ar') : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.total >= 1000 ? 'bg-yellow-500/10 text-yellow-400' :
                        c.orders >= 3 ? 'bg-blue-500/10 text-blue-400' :
                        'bg-slate-500/10 text-slate-400'
                      }`}>
                        {c.total >= 1000 ? '👑 VIP' : c.orders >= 3 ? '⭐ مخلص' : '🆕 جديد'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}