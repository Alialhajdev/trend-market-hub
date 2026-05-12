import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'يناير', revenue: 42000, commission: 4200 },
  { month: 'فبراير', revenue: 58000, commission: 5800 },
  { month: 'مارس', revenue: 75000, commission: 7500 },
  { month: 'أبريل', revenue: 62000, commission: 6200 },
  { month: 'مايو', revenue: 89000, commission: 8900 },
  { month: 'يونيو', revenue: 115000, commission: 11500 },
  { month: 'يوليو', revenue: 98000, commission: 9800 },
  { month: 'أغسطس', revenue: 134000, commission: 13400 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0F172A] border border-white/10 rounded-xl p-3 shadow-2xl">
        <p className="text-white/60 text-xs mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-white/60">{entry.name === 'revenue' ? 'الإيرادات' : 'العمولات'}:</span>
            <span className="text-white font-bold">{entry.value?.toLocaleString()} ر.س</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminRevenueChart() {
  return (
    <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-white">إيرادات المنصة</h3>
          <p className="text-white/40 text-xs">مقارنة الإيرادات والعمولات</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-white/50">إيرادات</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-cyan-400" />
            <span className="text-white/50">عمولات</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="comGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}K`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
          <Area type="monotone" dataKey="commission" stroke="#06B6D4" strokeWidth={2} fill="url(#comGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}