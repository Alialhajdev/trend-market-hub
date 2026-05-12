import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminOrdersChart({ orders = [] }) {
  const statusCount = {
    pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0
  };
  orders.forEach(o => {
    if (statusCount[o.status] !== undefined) statusCount[o.status]++;
    else statusCount.pending++;
  });

  const data = [
    { name: 'معلق', value: statusCount.pending, color: '#F59E0B' },
    { name: 'يعالج', value: statusCount.processing, color: '#3B82F6' },
    { name: 'مشحون', value: statusCount.shipped, color: '#06B6D4' },
    { name: 'مكتمل', value: statusCount.delivered, color: '#22C55E' },
    { name: 'ملغي', value: statusCount.cancelled, color: '#EF4444' },
  ].filter(d => d.value > 0);

  const empty = data.length === 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-[#0F172A] border border-white/10 rounded-xl p-2.5 text-xs">
          <p style={{ color: payload[0].payload.color }} className="font-bold">{payload[0].name}</p>
          <p className="text-white">{payload[0].value} طلب</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl p-5">
      <h3 className="font-bold text-white mb-1">حالات الطلبات</h3>
      <p className="text-white/40 text-xs mb-4">توزيع الطلبات حسب الحالة</p>
      {empty ? (
        <div className="flex flex-col items-center justify-center h-48 text-white/20">
          <p className="text-sm">لا توجد طلبات</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {data.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-white/50">{d.name}</span>
                </div>
                <span className="text-white font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}