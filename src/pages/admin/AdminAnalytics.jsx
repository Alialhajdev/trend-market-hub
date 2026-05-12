import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { TrendingUp, Users, ShoppingCart, Package, Eye, Star } from 'lucide-react';
import StatCard from './components/StatCard';

const visitorsData = [
  { day: 'الأحد', visitors: 1200, orders: 45 },
  { day: 'الاثنين', visitors: 1800, orders: 62 },
  { day: 'الثلاثاء', visitors: 2200, orders: 78 },
  { day: 'الأربعاء', visitors: 1600, orders: 55 },
  { day: 'الخميس', visitors: 2800, orders: 95 },
  { day: 'الجمعة', visitors: 3500, orders: 128 },
  { day: 'السبت', visitors: 2900, orders: 105 },
];

const categoryData = [
  { cat: 'إلكترونيات', sales: 450, revenue: 180000 },
  { cat: 'أزياء', sales: 320, revenue: 64000 },
  { cat: 'جمال', sales: 280, revenue: 98000 },
  { cat: 'رياضة', sales: 150, revenue: 75000 },
  { cat: 'منزل', sales: 180, revenue: 36000 },
  { cat: 'كتب', sales: 90, revenue: 5400 },
];

const radarData = [
  { subject: 'المبيعات', A: 85 }, { subject: 'الزيارات', A: 72 },
  { subject: 'التحويل', A: 45 }, { subject: 'الرضا', A: 90 },
  { subject: 'الاحتفاظ', A: 65 }, { subject: 'النمو', A: 78 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0F172A] border border-white/10 rounded-xl p-3 text-xs">
        <p className="text-white/60 mb-1">{label}</p>
        {payload.map((e, i) => (
          <p key={i} style={{ color: e.color }} className="font-bold">{e.name}: {e.value?.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminAnalytics() {
  const { data: stores = [] } = useQuery({ queryKey: ['admin-stores'], queryFn: () => base44.entities.Store.list() });
  const { data: products = [] } = useQuery({ queryKey: ['admin-products'], queryFn: () => base44.entities.Product.list() });
  const { data: orders = [] } = useQuery({ queryKey: ['admin-orders'], queryFn: () => base44.entities.Order.list() });

  const totalViews = products.reduce((s, p) => s + (p.views_count || 0), 0);
  const avgRating = products.reduce((s, p, _, a) => s + (p.rating || 0) / a.length, 0);

  const stats = [
    { icon: Users, label: 'إجمالي الزيارات', value: `${(totalViews / 1000).toFixed(1)}K`, change: 24, color: 'blue' },
    { icon: ShoppingCart, label: 'معدل التحويل', value: '3.8%', change: 8, color: 'green' },
    { icon: Eye, label: 'مشاهدات المنتجات', value: `${(totalViews / 1000).toFixed(0)}K`, change: 15, color: 'cyan' },
    { icon: Star, label: 'متوسط التقييم', value: avgRating.toFixed(1), change: 2, color: 'amber' },
  ];

  return (
    <div style={{ direction: 'rtl' }} className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-white">التحليلات المتقدمة</h1>
        <p className="text-white/40 text-sm">رؤى شاملة حول أداء المنصة</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 0.07} />)}
      </div>

      {/* Visitors Chart */}
      <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-1">الزيارات والطلبات (أسبوعي)</h3>
        <p className="text-white/40 text-xs mb-4">مقارنة الزيارات بالطلبات اليومية</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={visitorsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="oGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="visitors" name="visitors" stroke="#3B82F6" strokeWidth={2} fill="url(#vGrad)" dot={false} />
            <Area type="monotone" dataKey="orders" name="orders" stroke="#22C55E" strokeWidth={2} fill="url(#oGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Category Sales */}
        <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-1">المبيعات حسب التصنيف</h3>
          <p className="text-white/40 text-xs mb-4">أداء كل فئة من المنتجات</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="cat" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-1">مؤشرات الأداء الرئيسية</h3>
          <p className="text-white/40 text-xs mb-4">نظرة شاملة على صحة المنصة</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
              <Radar name="KPIs" dataKey="A" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top performing */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">أفضل المتاجر أداءً</h3>
          <div className="space-y-3">
            {stores.slice(0, 5).map((store, i) => (
              <div key={store.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-black text-xs">{i + 1}</div>
                <img src={store.logo_url || `https://ui-avatars.com/api/?name=${store.name}&background=2563EB&color=fff&size=40`}
                  className="w-8 h-8 rounded-lg object-cover" alt="" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{store.name}</p>
                  <div className="w-full bg-white/5 rounded-full h-1 mt-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${Math.random() * 60 + 40}%` }} />
                  </div>
                </div>
                <p className="text-sm font-bold text-white">{((store.total_sales || 0) / 1000).toFixed(1)}K</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">أكثر المنتجات مشاهدةً</h3>
          <div className="space-y-3">
            {products.sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5).map((product, i) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-xs">{i + 1}</div>
                <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60'}
                  className="w-8 h-8 rounded-lg object-cover" alt="" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white truncate">{product.name}</p>
                  <div className="w-full bg-white/5 rounded-full h-1 mt-1">
                    <div className="bg-cyan-500 h-1 rounded-full" style={{ width: `${Math.min(100, ((product.views_count || 0) / 100))}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <Eye className="w-3 h-3 text-white/30" />
                  <p className="text-sm font-bold text-white">{(product.views_count || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}