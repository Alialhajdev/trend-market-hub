import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  DollarSign, ShoppingBag, Package, Users, TrendingUp,
  ArrowUpRight, Eye, Star, Clock, CheckCircle, Truck
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const revenueData = [
  { day: 'السبت', revenue: 4200 }, { day: 'الأحد', revenue: 6800 },
  { day: 'الاثنين', revenue: 5100 }, { day: 'الثلاثاء', revenue: 9200 },
  { day: 'الأربعاء', revenue: 7400 }, { day: 'الخميس', revenue: 11000 },
  { day: 'الجمعة', revenue: 8600 },
];

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};
const statusLabels = { pending: 'جديد', processing: 'معالجة', shipped: 'مشحون', delivered: 'مكتمل', cancelled: 'ملغي' };

function StatCard({ icon: Icon, label, value, change, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative group rounded-2xl p-5 bg-[#111827] border border-white/[0.07] hover:border-white/20 transition-all duration-300 overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {change !== undefined && (
          <span className="flex items-center gap-1 text-green-400 text-xs font-bold">
            <ArrowUpRight className="w-3 h-3" />{change}%
          </span>
        )}
      </div>
      <div className="text-2xl font-black text-white mb-1">{value}</div>
      <div className="text-slate-500 text-xs">{label}</div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2.5 text-sm">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-white font-bold">{payload[0].value?.toLocaleString()} ر.س</p>
      </div>
    );
  }
  return null;
};

export default function SellerHome() {
  const { data: store } = useQuery({
    queryKey: ['my-store'],
    queryFn: async () => {
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

  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const uniqueCustomers = new Set(orders.map(o => o.customer_email)).size;

  const stats = [
    { icon: DollarSign, label: 'إجمالي الإيرادات', value: `${revenue.toLocaleString()} ر.س`, change: 24, color: 'from-blue-500 to-cyan-500', delay: 0 },
    { icon: ShoppingBag, label: 'الطلبات', value: orders.length, change: 12, color: 'from-purple-500 to-violet-500', delay: 0.07 },
    { icon: Package, label: 'المنتجات النشطة', value: products.filter(p => p.status === 'active').length, change: 8, color: 'from-green-500 to-emerald-500', delay: 0.14 },
    { icon: Users, label: 'العملاء', value: uniqueCustomers, change: 18, color: 'from-orange-500 to-red-500', delay: 0.21 },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-white">
          مرحباً{store ? `، ${store.name}` : ''} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">إليك نظرة عامة على أداء متجرك اليوم</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl bg-[#111827] border border-white/[0.07] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white">الإيرادات الأسبوعية</h3>
              <p className="text-slate-500 text-xs">آخر 7 أيام</p>
            </div>
            <span className="flex items-center gap-1 text-green-400 text-sm font-bold">
              <TrendingUp className="w-4 h-4" />+24%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#rev)" dot={{ r: 4, fill: '#2563EB' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl bg-[#111827] border border-white/[0.07] p-5 space-y-4"
        >
          <h3 className="font-bold text-white">إحصائيات سريعة</h3>
          {[
            { label: 'معدل التحويل', value: '3.2%', icon: TrendingUp, color: 'text-green-400' },
            { label: 'متوسط قيمة الطلب', value: `${revenue ? Math.round(revenue / (orders.length || 1)) : 0} ر.س`, icon: DollarSign, color: 'text-blue-400' },
            { label: 'المنتجات الأكثر مبيعاً', value: products.sort((a,b) => (b.sales_count||0)-(a.sales_count||0))[0]?.name?.substring(0,20) || '—', icon: Star, color: 'text-yellow-400' },
            { label: 'الزوار اليوم', value: '1,240', icon: Eye, color: 'text-purple-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500">{item.label}</div>
                <div className="text-sm font-bold text-white truncate">{item.value}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl bg-[#111827] border border-white/[0.07] p-5 mb-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">آخر الطلبات</h3>
          <Link to="/seller/orders" className="text-xs text-[#06B6D4] hover:underline">عرض الكل</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">لا توجد طلبات بعد</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.05] text-slate-500 text-xs">
                  <th className="text-right pb-3 font-medium">رقم الطلب</th>
                  <th className="text-right pb-3 font-medium">العميل</th>
                  <th className="text-right pb-3 font-medium">الإجمالي</th>
                  <th className="text-right pb-3 font-medium">الحالة</th>
                  <th className="text-right pb-3 font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-mono text-blue-400 text-xs">#{order.order_number || order.id?.slice(-6)}</td>
                    <td className="py-3 text-slate-300">{order.customer_name || '—'}</td>
                    <td className="py-3 font-bold text-white">{order.total} ر.س</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColors[order.status] || statusColors.pending}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 text-xs">{order.created_date ? new Date(order.created_date).toLocaleDateString('ar') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="rounded-2xl bg-[#111827] border border-white/[0.07] p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">أفضل المنتجات</h3>
          <Link to="/seller/products" className="text-xs text-[#06B6D4] hover:underline">إدارة المنتجات</Link>
        </div>
        <div className="space-y-3">
          {products.sort((a,b) => (b.sales_count||0)-(a.sales_count||0)).slice(0,5).map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
              <span className="text-slate-600 text-sm font-bold w-5">{i+1}</span>
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#1E293B] flex-shrink-0">
                <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80'} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{p.name}</div>
                <div className="text-xs text-slate-500">{p.sales_count || 0} مبيعة</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white">{p.price} ر.س</div>
                <div className="text-[10px] text-green-400">+{Math.round(Math.random()*20+5)}%</div>
              </div>
            </div>
          ))}
          {products.length === 0 && <div className="text-center py-6 text-slate-500 text-sm">أضف منتجاتك الأولى</div>}
        </div>
      </motion.div>
    </div>
  );
}