import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DollarSign, TrendingUp, CreditCard, ArrowDownCircle, ArrowUpCircle, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import StatCard from './components/StatCard';

const monthlyData = [
  { month: 'يناير', revenue: 42000, commission: 4200, payouts: 37800 },
  { month: 'فبراير', revenue: 58000, commission: 5800, payouts: 52200 },
  { month: 'مارس', revenue: 75000, commission: 7500, payouts: 67500 },
  { month: 'أبريل', revenue: 62000, commission: 6200, payouts: 55800 },
  { month: 'مايو', revenue: 89000, commission: 8900, payouts: 80100 },
  { month: 'يونيو', revenue: 115000, commission: 11500, payouts: 103500 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0F172A] border border-white/10 rounded-xl p-3 shadow-2xl text-xs">
        <p className="text-white/60 mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex justify-between gap-4">
            <span style={{ color: entry.color }}>{entry.name === 'revenue' ? 'الإيرادات' : entry.name === 'commission' ? 'العمولات' : 'المدفوعات'}</span>
            <span className="text-white font-bold">{entry.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const txns = [
  { id: 1, type: 'commission', store: 'متجر التقنية', amount: 850, date: '2026-05-06', status: 'completed' },
  { id: 2, type: 'subscription', store: 'أزياء عصرية', amount: 299, date: '2026-05-05', status: 'completed' },
  { id: 3, type: 'payout', store: 'بيت الجمال', amount: -4200, date: '2026-05-04', status: 'pending' },
  { id: 4, type: 'commission', store: 'رياضة وحركة', amount: 320, date: '2026-05-03', status: 'completed' },
  { id: 5, type: 'refund', store: 'كتب ومعرفة', amount: -120, date: '2026-05-02', status: 'completed' },
  { id: 6, type: 'subscription', store: 'متجر المنزل', amount: 99, date: '2026-05-01', status: 'completed' },
];

export default function AdminFinance() {
  const { data: orders = [] } = useQuery({ queryKey: ['admin-orders'], queryFn: () => base44.entities.Order.list('-created_date', 200) });
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalCommission = orders.reduce((s, o) => s + (o.commission_amount || o.total * 0.1 || 0), 0);

  const stats = [
    { icon: DollarSign, label: 'إجمالي الإيرادات', value: `${(totalRevenue / 1000).toFixed(1)}K ر.س`, change: 18, color: 'green' },
    { icon: Percent, label: 'العمولات المحصّلة', value: `${(totalCommission / 1000).toFixed(1)}K ر.س`, change: 12, color: 'blue' },
    { icon: CreditCard, label: 'إيرادات الاشتراكات', value: '24.5K ر.س', change: 30, color: 'purple' },
    { icon: ArrowDownCircle, label: 'مدفوعات البائعين', value: `${((totalRevenue - totalCommission) / 1000).toFixed(1)}K ر.س`, change: -5, color: 'amber' },
  ];

  return (
    <div style={{ direction: 'rtl' }} className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-white">النظام المالي</h1>
        <p className="text-white/40 text-sm">إدارة الإيرادات والعمولات والمدفوعات</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 0.07} />)}
      </div>

      {/* Chart */}
      <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-1">التقرير المالي الشهري</h3>
        <p className="text-white/40 text-xs mb-4">مقارنة الإيرادات والعمولات والمدفوعات</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="commission" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="payouts" fill="#22C55E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3 justify-center text-xs">
          {[['#3B82F6', 'الإيرادات'], ['#06B6D4', 'العمولات'], ['#22C55E', 'المدفوعات']].map(([color, label]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              <span className="text-white/40">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-bold text-white">آخر المعاملات</h3>
        </div>
        <div className="divide-y divide-white/5">
          {txns.map((txn, i) => (
            <motion.div key={txn.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 px-4 py-3 hover:bg-white/3 transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${txn.amount > 0 ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                {txn.amount > 0 ? <ArrowUpCircle className="w-4 h-4 text-green-400" /> : <ArrowDownCircle className="w-4 h-4 text-red-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{txn.store}</p>
                <p className="text-xs text-white/30">{txn.type === 'commission' ? 'عمولة' : txn.type === 'subscription' ? 'اشتراك' : txn.type === 'payout' ? 'دفعة بائع' : 'استرجاع'} • {txn.date}</p>
              </div>
              <div className="text-end">
                <p className={`text-sm font-black ${txn.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()} ر.س
                </p>
                <span className={`text-[10px] ${txn.status === 'completed' ? 'text-green-400' : 'text-amber-400'}`}>
                  {txn.status === 'completed' ? 'مكتمل' : 'معلق'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}