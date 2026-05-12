import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, Tag, Percent, Copy, Trash2, Gift } from 'lucide-react';
import { toast } from 'sonner';

export default function SellerMarketing() {
  const [form, setForm] = useState({ code: '', discount_type: 'percentage', discount_value: '', min_order: '', max_uses: '', is_active: true, scope: 'all', product_ids: [] });
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: store } = useQuery({
    queryKey: ['my-store'], queryFn: async () => {
      const user = await base44.auth.me();
      const stores = await base44.entities.Store.filter({ owner_email: user.email });
      return stores[0] || null;
    }
  });

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['coupons', store?.id],
    queryFn: () => store ? base44.entities.Coupon.filter({ store_id: store.id }) : [],
    enabled: !!store?.id,
  });

  const createCoupon = useMutation({
    mutationFn: (data) => base44.entities.Coupon.create({ ...data, store_id: store.id }),
    onSuccess: () => { qc.invalidateQueries(['coupons']); toast.success('تم إنشاء الكوبون'); setShowForm(false); setForm({ code: '', discount_type: 'percentage', discount_value: '', min_order: '', max_uses: '', is_active: true }); },
  });

  const deleteCoupon = useMutation({
    mutationFn: (id) => base44.entities.Coupon.delete(id),
    onSuccess: () => { qc.invalidateQueries(['coupons']); toast.success('تم حذف الكوبون'); },
  });

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const code = Array(8).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    setForm(f => ({ ...f, code }));
  };

  const copyCode = (code) => { navigator.clipboard.writeText(code); toast.success('تم نسخ الكود'); };

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">التسويق والكوبونات</h1>
          <p className="text-slate-500 text-sm mt-1">أنشئ عروضاً تسويقية لجذب العملاء</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-bold text-sm hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />كوبون جديد
        </button>
      </motion.div>

      {/* Tips */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[
          { icon: Tag, title: 'كوبونات الخصم', desc: 'أنشئ أكواد خصم لعملائك', color: 'from-blue-500 to-cyan-500' },
          { icon: Percent, title: 'عروض موسمية', desc: 'استخدم المواسم لزيادة المبيعات', color: 'from-purple-500 to-pink-500' },
          { icon: Gift, title: 'ولاء العملاء', desc: 'كافئ عملاءك المميزين', color: 'from-green-500 to-emerald-500' },
        ].map((t, i) => (
          <div key={i} className="rounded-2xl bg-[#111827] border border-white/[0.07] p-4 flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
              <t.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">{t.title}</div>
              <div className="text-slate-500 text-xs">{t.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupons List */}
      <div className="rounded-2xl bg-[#111827] border border-white/[0.07] overflow-hidden">
        <div className="p-4 border-b border-white/[0.05]">
          <h3 className="font-bold text-white">الكوبونات النشطة</h3>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">جاري التحميل...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-500 text-sm">لا توجد كوبونات — أنشئ كوبونك الأول!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {coupons.map(c => (
              <div key={c.id} className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-white text-sm tracking-widest">{c.code}</span>
                    <button onClick={() => copyCode(c.code)} className="p-1 rounded-md hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.is_active ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}`}>
                      {c.is_active ? 'نشط' : 'متوقف'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {c.discount_type === 'percentage' ? `خصم ${c.discount_value}%` : `خصم ${c.discount_value} ر.س ثابت`}
                    {c.min_order > 0 && ` • حد أدنى ${c.min_order} ر.س`}
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div>الاستخدام: {c.used_count || 0}/{c.max_uses || '∞'}</div>
                  {c.expires_at && <div>ينتهي: {new Date(c.expires_at).toLocaleDateString('ar')}</div>}
                </div>
                <button onClick={() => { if(confirm('حذف الكوبون؟')) deleteCoupon.mutate(c.id) }}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-md p-6"
          >
            <h3 className="font-black text-white text-lg mb-4">إنشاء كوبون جديد</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">كود الكوبون</label>
                <div className="flex gap-2">
                  <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="SALE2024"
                    className="flex-1 bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-2.5 text-white font-mono uppercase text-sm focus:outline-none focus:border-[#2563EB]/50"
                  />
                  <button onClick={generateCode} className="px-3 py-2.5 rounded-xl bg-[#1E293B] border border-white/[0.07] text-slate-400 hover:text-white text-xs transition-colors">توليد</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">نوع الخصم</label>
                  <select value={form.discount_type} onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))}
                    className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="percentage">نسبة مئوية</option>
                    <option value="fixed">مبلغ ثابت</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">قيمة الخصم</label>
                  <input type="number" value={form.discount_value} onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))}
                    placeholder={form.discount_type === 'percentage' ? '10' : '50'}
                    className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">حد أدنى للطلب</label>
                  <input type="number" value={form.min_order} onChange={e => setForm(f => ({ ...f, min_order: e.target.value }))}
                    placeholder="0"
                    className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">عدد الاستخدامات</label>
                  <input type="number" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                    placeholder="غير محدود"
                    className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">نطاق الكوبون</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ value: 'all', label: 'كل المنتجات' }, { value: 'specific', label: 'منتجات محددة' }].map(opt => (
                    <button key={opt.value} onClick={() => setForm(f => ({ ...f, scope: opt.value }))}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${form.scope === opt.value ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'bg-[#1E293B] border-white/[0.07] text-slate-400'}`}
                    >{opt.label}</button>
                  ))}
                </div>
                {form.scope === 'specific' && (
                  <p className="text-xs text-slate-500 mt-2 bg-[#1E293B] rounded-xl px-3 py-2">
                    ⚠️ سيتم تحديد المنتجات المحددة من صفحة المنتجات بعد إنشاء الكوبون
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 text-sm transition-colors">إلغاء</button>
                <button
                  onClick={() => createCoupon.mutate({ ...form, discount_value: Number(form.discount_value), min_order: Number(form.min_order) || 0, max_uses: Number(form.max_uses) || null })}
                  disabled={!form.code || !form.discount_value}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-bold text-sm disabled:opacity-50"
                >
                  إنشاء الكوبون
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}