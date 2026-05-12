import React from 'react';
import { motion } from 'framer-motion';
import { Bell, ShoppingBag, DollarSign, Package, AlertTriangle, CheckCircle } from 'lucide-react';

const mockNotifications = [
  { id: 1, type: 'order', icon: ShoppingBag, title: 'طلب جديد!', desc: 'استلمت طلباً جديداً بقيمة 450 ر.س', time: 'منذ 5 دقائق', color: 'from-blue-500 to-cyan-500', unread: true },
  { id: 2, type: 'payment', icon: DollarSign, title: 'تم استلام الدفعة', desc: 'تم إيداع 2,400 ر.س في محفظتك', time: 'منذ ساعة', color: 'from-green-500 to-emerald-500', unread: true },
  { id: 3, type: 'stock', icon: AlertTriangle, title: 'تنبيه مخزون', desc: 'منتج "حقيبة جلدية" أوشك على النفاد (3 قطع)', time: 'منذ 3 ساعات', color: 'from-yellow-500 to-orange-500', unread: true },
  { id: 4, type: 'order', icon: CheckCircle, title: 'اكتمل الطلب', desc: 'الطلب #1038 تم التسليم بنجاح', time: 'أمس', color: 'from-teal-500 to-cyan-500', unread: false },
  { id: 5, type: 'system', icon: Bell, title: 'تحديث النظام', desc: 'تم تحديث منصة البيع بمميزات جديدة', time: 'منذ يومين', color: 'from-purple-500 to-violet-500', unread: false },
  { id: 6, type: 'order', icon: ShoppingBag, title: 'طلب جديد', desc: 'استلمت طلباً بقيمة 180 ر.س من سارة ق.', time: 'منذ 3 أيام', color: 'from-blue-500 to-cyan-500', unread: false },
  { id: 7, type: 'payment', icon: DollarSign, title: 'تم السحب', desc: 'تم تحويل 1,800 ر.س إلى حسابك البنكي', time: 'منذ 5 أيام', color: 'from-green-500 to-emerald-500', unread: false },
];

export default function SellerNotifications() {
  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">الإشعارات</h1>
          <p className="text-slate-500 text-sm mt-1">{unreadCount} إشعار غير مقروء</p>
        </div>
        <button className="text-xs text-[#06B6D4] hover:underline">تحديد الكل كمقروء</button>
      </motion.div>

      <div className="space-y-2">
        {mockNotifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:bg-white/[0.04] ${
              n.unread ? 'bg-white/[0.03] border-white/[0.1]' : 'bg-transparent border-white/[0.04]'
            }`}
          >
            {n.unread && <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-[#06B6D4]" />}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${n.color} flex items-center justify-center flex-shrink-0`}>
              <n.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className={`text-sm font-bold ${n.unread ? 'text-white' : 'text-slate-300'}`}>{n.title}</div>
                <span className="text-slate-600 text-[10px] whitespace-nowrap flex-shrink-0">{n.time}</span>
              </div>
              <div className="text-slate-500 text-xs mt-0.5">{n.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}