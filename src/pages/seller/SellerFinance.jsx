import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, ArrowDownCircle, Clock, Wallet, AlertCircle, CreditCard, Plus, Trash2 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const monthlyData = [
  { month: 'يناير', revenue: 12400, commission: 1240 },
  { month: 'فبراير', revenue: 18200, commission: 1820 },
  { month: 'مارس', revenue: 23600, commission: 2360 },
  { month: 'أبريل', revenue: 19800, commission: 1980 },
  { month: 'مايو', revenue: 31200, commission: 3120 },
  { month: 'يونيو', revenue: 28400, commission: 2840 },
];

export default function SellerFinance() {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showAddBank, setShowAddBank] = useState(false);
  const [bankForm, setBankForm] = useState({ full_name: '', account_number: '', account_type: 'iban' });
  const qc = useQueryClient();

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

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalCommission = orders.reduce((s, o) => s + (o.commission_amount || o.total * 0.05 || 0), 0);
  const netRevenue = totalRevenue - totalCommission;
  const availableBalance = netRevenue * 0.7;
  const pendingBalance = netRevenue * 0.3;

  const updateStore = useMutation({
    mutationFn: (data) => base44.entities.Store.update(store.id, data),
    onSuccess: () => { qc.invalidateQueries(['my-store']); toast.success('تم حفظ الحساب البنكي'); setShowAddBank(false); setBankForm({ full_name: '', account_number: '', account_type: 'iban' }); },
  });

  const handleAddBank = () => {
    if (!bankForm.full_name || !bankForm.account_number) { toast.error('يرجى تعبئة جميع الحقول'); return; }
    const accounts = store?.banking_accounts || [];
    if (accounts.length >= 3) { toast.error('لا يمكن إضافة أكثر من 3 حسابات'); return; }
    updateStore.mutate({ banking_accounts: [...accounts, bankForm] });
  };

  const handleDeleteBank = (idx) => {
    const accounts = [...(store?.banking_accounts || [])];
    accounts.splice(idx, 1);
    updateStore.mutate({ banking_accounts: accounts });
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || isNaN(withdrawAmount)) { toast.error('أدخل مبلغاً صحيحاً'); return; }
    if (Number(withdrawAmount) > availableBalance) { toast.error('المبلغ أكبر من الرصيد المتاح'); return; }
    toast.success(`تم طلب سحب ${withdrawAmount} ر.س بنجاح`);
    setShowWithdraw(false);
    setWithdrawAmount('');
  };

  const stats = [
    { label: 'إجمالي الإيرادات', value: `${totalRevenue.toFixed(0)} ر.س`, icon: DollarSign, color: 'from-blue-500 to-cyan-500', change: '+24%' },
    { label: 'الصافي بعد العمولة', value: `${netRevenue.toFixed(0)} ر.س`, icon: TrendingUp, color: 'from-green-500 to-emerald-500', change: '+18%' },
    { label: 'الرصيد المتاح للسحب', value: `${availableBalance.toFixed(0)} ر.س`, icon: Wallet, color: 'from-purple-500 to-violet-500', change: '' },
    { label: 'رصيد قيد التسوية', value: `${pendingBalance.toFixed(0)} ر.س`, icon: Clock, color: 'from-orange-500 to-amber-500', change: '' },
  ];

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">الأرباح والمحفظة</h1>
          <p className="text-slate-500 text-sm mt-1">تتبع إيراداتك وأدر عمليات السحب</p>
        </div>
        <button
          onClick={() => setShowWithdraw(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm shadow-lg hover:scale-105 transition-transform"
        >
          <ArrowDownCircle className="w-4 h-4" />
          طلب سحب
        </button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-2xl bg-[#111827] border border-white/[0.07] p-4"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} />
            </div>
            <div className="text-xl font-black text-white mb-1">{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
            {s.change && <div className="text-xs text-green-400 mt-1 font-bold">{s.change}</div>}
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl bg-[#111827] border border-white/[0.07] p-5"
        >
          <h3 className="font-bold text-white mb-4">الإيرادات الشهرية</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} fill="url(#revenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl bg-[#111827] border border-white/[0.07] p-5"
        >
          <h3 className="font-bold text-white mb-4">مقارنة الإيرادات والعمولات</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} name="الإيرادات" />
              <Bar dataKey="commission" fill="#06B6D4" radius={[4, 4, 0, 0]} name="العمولة" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Banking Accounts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
        className="rounded-2xl bg-[#111827] border border-white/[0.07] p-5 mb-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-white">حسابات الدفع البنكية</h3>
            <span className="text-xs text-slate-500">({(store?.banking_accounts || []).length}/3)</span>
          </div>
          {(store?.banking_accounts || []).length < 3 && (
            <button onClick={() => setShowAddBank(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E293B] text-slate-300 text-xs font-medium hover:bg-[#2563EB]/20 hover:text-white transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> إضافة حساب
            </button>
          )}
        </div>
        {(store?.banking_accounts || []).length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">لا توجد حسابات بنكية — أضف حسابك الأول</div>
        ) : (
          <div className="space-y-2">
            {(store?.banking_accounts || []).map((acc, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-[#1E293B] rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white text-xs font-black">{idx + 1}</div>
                <div className="flex-1">
                  <div className="text-white text-sm font-semibold">{acc.full_name}</div>
                  <div className="text-slate-500 text-xs">{acc.account_number} • {acc.account_type === 'iban' ? 'آيبان' : acc.account_type === 'checking' ? 'جاري' : 'توفير'}</div>
                </div>
                <button onClick={() => handleDeleteBank(idx)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Commission Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl bg-yellow-500/5 border border-yellow-500/20 p-4 flex items-start gap-3"
      >
        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-yellow-400 font-bold text-sm mb-1">معلومة عن العمولة</div>
          <div className="text-slate-400 text-xs leading-relaxed">
            العمولة الحالية لخطتك: <strong className="text-white">{store?.commission_rate || 10}%</strong> من كل عملية بيع.
            قم بالترقية إلى الخطة الاحترافية لتخفيض العمولة إلى 5% وتوفير المزيد من أرباحك.
          </div>
        </div>
      </motion.div>

      {/* Add Bank Modal */}
      {showAddBank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddBank(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-md p-6"
          >
            <h3 className="font-black text-white text-lg mb-4">إضافة حساب بنكي</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">الاسم الكامل (صاحب الحساب)</label>
                <input value={bankForm.full_name} onChange={e => setBankForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="محمد أحمد العلي"
                  className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2563EB]/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">رقم الحساب / الآيبان</label>
                <input value={bankForm.account_number} onChange={e => setBankForm(f => ({ ...f, account_number: e.target.value }))}
                  placeholder="SA00 0000 0000 0000 0000 0000"
                  className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-[#2563EB]/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">نوع الحساب</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ value: 'iban', label: 'آيبان' }, { value: 'checking', label: 'جاري' }, { value: 'savings', label: 'توفير' }].map(opt => (
                    <button key={opt.value} onClick={() => setBankForm(f => ({ ...f, account_type: opt.value }))}
                      className={`py-2 rounded-xl text-xs font-medium transition-all border ${bankForm.account_type === opt.value ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'bg-[#1E293B] border-white/[0.07] text-slate-400'}`}
                    >{opt.label}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddBank(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 text-sm transition-colors">إلغاء</button>
                <button onClick={handleAddBank} disabled={updateStore.isPending} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-bold text-sm disabled:opacity-50">
                  {updateStore.isPending ? 'جاري الحفظ...' : 'إضافة الحساب'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowWithdraw(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-md p-6"
          >
            <h3 className="font-black text-white text-lg mb-2">طلب سحب الأرباح</h3>
            <p className="text-slate-400 text-sm mb-5">الرصيد المتاح: <strong className="text-green-400">{availableBalance.toFixed(0)} ر.س</strong></p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">مبلغ السحب (ر.س)</label>
                <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">طريقة الاستلام</label>
                <select className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-3 text-white focus:outline-none">
                  <option>تحويل بنكي</option>
                  <option>STCPay</option>
                  <option>إيداع عبر بنك الراجحي</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowWithdraw(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm font-medium transition-colors">إلغاء</button>
                <button onClick={handleWithdraw} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm hover:scale-105 transition-transform">تأكيد السحب</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}