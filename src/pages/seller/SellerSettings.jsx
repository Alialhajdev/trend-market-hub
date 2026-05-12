import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { User, Lock, CreditCard, Bell, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SellerSettings() {
  const [activeTab, setActiveTab] = useState('account');
  const [form, setForm] = useState({});
  const qc = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['current-user'], queryFn: () => base44.auth.me()
  });

  useEffect(() => { if (user) setForm({ full_name: user.full_name, email: user.email }); }, [user]);

  const updateUser = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => { qc.invalidateQueries(['current-user']); toast.success('تم تحديث البيانات'); },
  });

  const tabs = [
    { key: 'account', label: 'الحساب', icon: User },
    { key: 'security', label: 'الأمان', icon: Lock },
    { key: 'payment', label: 'طرق الدفع', icon: CreditCard },
    { key: 'notifications', label: 'الإشعارات', icon: Bell },
  ];

  const [notifSettings, setNotifSettings] = useState({
    new_orders: true, order_status: true, low_stock: true, payments: true, marketing: false, system: true,
  });

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-white">إعدادات الحساب</h1>
        <p className="text-slate-500 text-sm mt-1">أدر معلوماتك وتفضيلاتك</p>
      </motion.div>

      <div className="flex gap-1 bg-[#111827] border border-white/[0.07] rounded-xl p-1 mb-5 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === t.key ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-[#111827] border border-white/[0.07] p-5 space-y-4"
      >
        {activeTab === 'account' && (
          <>
            <div className="flex items-center gap-4 pb-4 border-b border-white/[0.05]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white text-2xl font-black">
                {user?.full_name?.[0] || '?'}
              </div>
              <div>
                <div className="text-white font-bold">{user?.full_name}</div>
                <div className="text-slate-400 text-sm">{user?.email}</div>
                <div className="text-xs text-[#06B6D4] mt-1">بائع نشط</div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">الاسم الكامل</label>
              <input value={form.full_name || ''} onChange={e => setForm(f => ({...f, full_name: e.target.value}))}
                className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2563EB]/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">البريد الإلكتروني</label>
              <input value={form.email || ''} disabled
                className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <button onClick={() => updateUser.mutate({ full_name: form.full_name })} disabled={updateUser.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50"
            >
              <Save className="w-4 h-4" />حفظ التغييرات
            </button>
          </>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <Shield className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-white text-sm font-medium">حسابك آمن</div>
                <div className="text-slate-400 text-xs">آخر تسجيل دخول: اليوم</div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">كلمة المرور الحالية</label>
              <input type="password" placeholder="••••••••"
                className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2563EB]/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">كلمة المرور الجديدة</label>
              <input type="password" placeholder="••••••••"
                className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2563EB]/50"
              />
            </div>
            <div className="flex items-center justify-between py-3 border-t border-white/[0.05]">
              <div>
                <div className="text-sm font-medium text-white">التحقق الثنائي (2FA)</div>
                <div className="text-xs text-slate-500">أضافة طبقة حماية إضافية</div>
              </div>
              <div className="w-11 h-6 rounded-full bg-slate-600 relative cursor-pointer">
                <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow" />
              </div>
            </div>
            <button onClick={() => toast.info('قريباً: تغيير كلمة المرور')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-bold text-sm"
            >
              <Lock className="w-4 h-4" />تحديث كلمة المرور
            </button>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white font-medium text-sm">تحويل بنكي</div>
                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">نشط</span>
              </div>
              <div className="text-slate-400 text-xs">البنك الراجحي — IBAN: SA••••••••••</div>
            </div>
            <button onClick={() => toast.info('قريباً: إضافة حساب بنكي جديد')}
              className="w-full py-3 rounded-xl border border-dashed border-white/20 text-slate-400 hover:text-white hover:border-white/40 text-sm transition-all"
            >
              + إضافة طريقة دفع جديدة
            </button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-3">
            {Object.entries({
              new_orders: 'إشعارات الطلبات الجديدة',
              order_status: 'تحديثات حالة الطلب',
              low_stock: 'تنبيهات المخزون المنخفض',
              payments: 'إشعارات المدفوعات',
              marketing: 'النشرة التسويقية',
              system: 'إشعارات النظام',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
                <span className="text-sm text-slate-300">{label}</span>
                <button
                  onClick={() => setNotifSettings(s => ({ ...s, [key]: !s[key] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${notifSettings[key] ? 'bg-[#2563EB]' : 'bg-slate-600'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notifSettings[key] ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}