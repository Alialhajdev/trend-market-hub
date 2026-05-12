import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const visitData = [
  { day: 'السبت', visits: 320, sales: 12 }, { day: 'الأحد', visits: 480, sales: 18 },
  { day: 'الاثنين', visits: 290, sales: 9 }, { day: 'الثلاثاء', visits: 650, sales: 24 },
  { day: 'الأربعاء', visits: 420, sales: 15 }, { day: 'الخميس', visits: 780, sales: 31 },
  { day: 'الجمعة', visits: 560, sales: 22 },
];

const sourceData = [
  { name: 'مباشر', value: 35, color: '#2563EB' },
  { name: 'بحث', value: 28, color: '#06B6D4' },
  { name: 'تواصل اجتماعي', value: 22, color: '#8B5CF6' },
  { name: 'إحالة', value: 15, color: '#10B981' },
];

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  return <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11}>{`${(percent * 100).toFixed(0)}%`}</text>;
};

export default function SellerAnalytics() {
  const { data: store } = useQuery({
    queryKey: ['my-store'], queryFn: async () => {
      const user = await base44.auth.me();
      const stores = await base44.entities.Store.filter({ owner_email: user.email });
      return stores[0] || null;
    }
  });

  const { data: products = [] } = useQuery({
    queryKey: ['seller-products', store?.id],
    queryFn: () => store ? base44.entities.Product.filter({ store_id: store.id }) : [],
    enabled: !!store?.id,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['seller-orders', store?.id],
    queryFn: () => store ? base44.entities.Order.filter({ store_id: store.id }) : [],
    enabled: !!store?.id,
  });

  const topProducts = [...products].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0)).slice(0, 5);
  const conversionRate = visitData.reduce((s, d) => s + d.sales, 0) / visitData.reduce((s, d) => s + d.visits, 0) * 100;

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-white">التحليلات</h1>
        <p className="text-slate-500 text-sm mt-1">تحليل أداء متجرك وفهم سلوك العملاء</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'الزوار الأسبوعيون', value: '3,500', change: '+12%', color: 'text-blue-400' },
          { label: 'معدل التحويل', value: `${conversionRate.toFixed(1)}%`, change: '+0.4%', color: 'text-green-400' },
          { label: 'الطلبات', value: orders.length, change: '+18%', color: 'text-purple-400' },
          { label: 'متوسط قيمة الطلب', value: `${orders.length ? Math.round(orders.reduce((s,o) => s+o.total,0) / orders.length) : 0} ر.س`, change: '+8%', color: 'text-cyan-400' },
        ].map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-2xl bg-[#111827] border border-white/[0.07] p-4"
          >
            <div className={`text-2xl font-black mb-1 ${k.color}`}>{k.value}</div>
            <div className="text-slate-500 text-xs mb-1">{k.label}</div>
            <div className="text-green-400 text-xs font-bold">{k.change}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Visit + Conversion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl bg-[#111827] border border-white/[0.07] p-5"
        >
          <h3 className="font-bold text-white mb-4">الزيارات مقابل المبيعات</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={visitData}>
              <defs>
                <linearGradient id="vis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="visits" stroke="#2563EB" strokeWidth={2} fill="url(#vis)" name="الزيارات" />
              <Area type="monotone" dataKey="sales" stroke="#06B6D4" strokeWidth={2} fill="url(#sal)" name="المبيعات" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Source Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl bg-[#111827] border border-white/[0.07] p-5"
        >
          <h3 className="font-bold text-white mb-4">مصادر الزيارات</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" outerRadius={70} dataKey="value" labelLine={false} label={renderLabel}>
                {sourceData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {sourceData.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-slate-400">{s.name}</span>
                </div>
                <span className="text-white font-bold">{s.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="rounded-2xl bg-[#111827] border border-white/[0.07] p-5"
      >
        <h3 className="font-bold text-white mb-4">أفضل المنتجات أداءً</h3>
        <div className="space-y-3">
          {topProducts.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">لا توجد بيانات كافية بعد</div>
          ) : topProducts.map((p, i) => {
            const maxSales = topProducts[0]?.sales_count || 1;
            const pct = Math.round(((p.sales_count || 0) / maxSales) * 100);
            return (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-slate-600 text-sm font-bold w-5 flex-shrink-0">{i+1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white font-medium truncate">{p.name}</span>
                    <span className="text-slate-400 flex-shrink-0">{p.sales_count || 0} مبيعة</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
                    />
                  </div>
                </div>
                <span className="text-[#06B6D4] font-bold text-xs w-16 text-left flex-shrink-0">{p.price} ر.س</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}