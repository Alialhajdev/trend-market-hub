import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CreditCard, Check, Zap, Crown, Gift, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const plans = [
  {
    key: 'free', name: 'مجاني', nameEn: 'Free', price: 0,
    icon: Gift, color: 'white',
    features: ['5 منتجات', 'دعم بريد إلكتروني', 'تقارير أساسية', 'نطاق فرعي'],
    limits: { products: 5, commission: 15 },
  },
  {
    key: 'pro', name: 'احترافي', nameEn: 'Pro', price: 199,
    icon: Zap, color: 'blue',
    features: ['100 منتج', 'دعم أولوية', 'تقارير متقدمة', 'نطاق مخصص', 'كوبونات'],
    limits: { products: 100, commission: 10 },
    popular: true,
  },
  {
    key: 'business', name: 'أعمال', nameEn: 'Business', price: 499,
    icon: Crown, color: 'purple',
    features: ['500 منتج', 'دعم 24/7', 'API متقدم', 'تكاملات', 'تحليلات AI', 'مدير حساب'],
    limits: { products: 500, commission: 7 },
  },
  {
    key: 'vip', name: 'VIP', nameEn: 'VIP', price: 999,
    icon: Crown, color: 'amber',
    features: ['منتجات غير محدودة', 'دعم فوري', 'لوحة تحكم حصرية', 'عمولة صفر', 'أولوية الظهور', 'تدريب خاص'],
    limits: { products: -1, commission: 0 },
  },
];

export default function AdminSubscriptions() {
  const qc = useQueryClient();
  const { data: stores = [] } = useQuery({ queryKey: ['admin-stores'], queryFn: () => base44.entities.Store.list() });

  const updateMutation = useMutation({
    mutationFn: ({ id, plan }) => base44.entities.Store.update(id, { subscription_plan: plan }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-stores'] }); toast.success('تم تحديث الاشتراك'); },
  });

  const colorMap = {
    white: { gradient: 'from-white/5 to-white/2', border: 'border-white/10', icon: 'bg-white/10 text-white', btn: 'bg-white/10 text-white hover:bg-white/20' },
    blue: { gradient: 'from-blue-600/20 to-blue-500/5', border: 'border-blue-500/40', icon: 'bg-blue-500/20 text-blue-400', btn: 'bg-blue-600 text-white hover:bg-blue-500' },
    purple: { gradient: 'from-purple-600/20 to-purple-500/5', border: 'border-purple-500/30', icon: 'bg-purple-500/20 text-purple-400', btn: 'bg-purple-600 text-white hover:bg-purple-500' },
    amber: { gradient: 'from-amber-600/20 to-amber-500/5', border: 'border-amber-500/30', icon: 'bg-amber-500/20 text-amber-400', btn: 'bg-amber-500 text-white hover:bg-amber-400' },
  };

  const planCounts = plans.reduce((acc, p) => {
    acc[p.key] = stores.filter(s => s.subscription_plan === p.key || (!s.subscription_plan && p.key === 'free')).length;
    return acc;
  }, {});

  return (
    <div style={{ direction: 'rtl' }} className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white">نظام الاشتراكات</h1>
        <p className="text-white/40 text-sm">إدارة خطط الاشتراك والتسعير</p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {plans.map((plan, i) => {
          const c = colorMap[plan.color];
          const count = planCounts[plan.key] || 0;
          const Icon = plan.icon;
          return (
            <motion.div key={plan.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-b ${c.gradient} border ${c.border} rounded-2xl p-5 relative overflow-hidden`}>
              {plan.popular && (
                <div className="absolute top-3 start-3 text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">الأكثر شعبية</div>
              )}
              <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center mb-4`}>
                <Icon style={{ width: 20, height: 20 }} />
              </div>
              <p className="text-white font-black text-lg">{plan.name}</p>
              <p className="text-white/40 text-xs mb-3">{plan.nameEn}</p>
              <p className="text-white text-2xl font-black mb-1">
                {plan.price === 0 ? 'مجاني' : `${plan.price} ر.س`}
              </p>
              {plan.price > 0 && <p className="text-white/30 text-xs mb-4">/شهر</p>}
              <div className="space-y-2 mb-5">
                {plan.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-2 text-xs">
                    <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    <span className="text-white/60">{f}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-3 mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-xs text-white/40">مشتركون</span>
                </div>
                <span className="text-white font-black">{count}</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 text-xs text-white/40">
                <span>عمولة المنصة</span>
                <span className="text-white font-bold">{plan.limits.commission}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stores subscription management */}
      <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-bold text-white">إدارة اشتراكات المتاجر</h3>
          <p className="text-white/40 text-sm">تعديل خطة الاشتراك لكل متجر</p>
        </div>
        <div className="divide-y divide-white/5">
          {stores.slice(0, 10).map((store, i) => (
            <motion.div key={store.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 px-4 py-3 hover:bg-white/3 transition-colors">
              <img src={store.logo_url || `https://ui-avatars.com/api/?name=${store.name}&background=2563EB&color=fff&size=40`}
                className="w-9 h-9 rounded-xl object-cover flex-shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{store.name}</p>
                <p className="text-xs text-white/30 truncate">{store.owner_email}</p>
              </div>
              <select
                defaultValue={store.subscription_plan || 'free'}
                onChange={e => updateMutation.mutate({ id: store.id, plan: e.target.value })}
                className="bg-[#0F172A] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500/50"
              >
                {plans.map(p => <option key={p.key} value={p.key}>{p.name}</option>)}
              </select>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}