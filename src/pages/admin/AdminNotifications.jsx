import React, { useState } from 'react';
import { Bell, Send, BellRing, Info, CheckCircle, AlertTriangle, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const mockNotifications = [
  { id: 1, type: 'order', title: 'طلب جديد', message: 'طلب جديد #ORD-001 من متجر التقنية', time: 'منذ 5 دقائق', read: false },
  { id: 2, type: 'store', title: 'متجر جديد', message: 'تقدّم متجر جديد "أزياء فاخرة" للانضمام', time: 'منذ 15 دقيقة', read: false },
  { id: 3, type: 'alert', title: 'تنبيه نظام', message: 'معدل استخدام الخادم وصل 85%', time: 'منذ ساعة', read: true },
  { id: 4, type: 'success', title: 'دفعة ناجحة', message: 'تمت معالجة دفعة بائعين بنجاح - 45,000 ر.س', time: 'منذ ساعتين', read: true },
  { id: 5, type: 'info', title: 'تقرير أسبوعي', message: 'تقرير الأسبوع الثالث من مايو متاح للمراجعة', time: 'منذ 3 ساعات', read: true },
];

const typeConfig = {
  order: { icon: Bell, color: 'bg-blue-500/15 text-blue-400', dot: 'bg-blue-400' },
  store: { icon: Megaphone, color: 'bg-purple-500/15 text-purple-400', dot: 'bg-purple-400' },
  alert: { icon: AlertTriangle, color: 'bg-red-500/15 text-red-400', dot: 'bg-red-400' },
  success: { icon: CheckCircle, color: 'bg-green-500/15 text-green-400', dot: 'bg-green-400' },
  info: { icon: Info, color: 'bg-cyan-500/15 text-cyan-400', dot: 'bg-cyan-400' },
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [form, setForm] = useState({ title: '', message: '', type: 'info', target: 'all' });
  const [sending, setSending] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (id) => {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const markAllRead = () => {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  };

  const handleSend = async () => {
    if (!form.title || !form.message) return toast.error('يرجى ملء جميع الحقول');
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    const newN = { id: Date.now(), type: form.type, title: form.title, message: form.message, time: 'الآن', read: false };
    setNotifications(ns => [newN, ...ns]);
    setForm({ title: '', message: '', type: 'info', target: 'all' });
    setSending(false);
    toast.success('تم إرسال الإشعار بنجاح!');
  };

  return (
    <div style={{ direction: 'rtl' }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">مركز الإشعارات</h1>
          <p className="text-white/40 text-sm">{unreadCount} إشعار غير مقروء</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Notification list */}
        <div className="lg:col-span-3 bg-[#1E293B]/80 border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white">الإشعارات الأخيرة</h3>
            </div>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </div>
          <div className="divide-y divide-white/5">
            {notifications.map((n, i) => {
              const cfg = typeConfig[n.type] || typeConfig.info;
              const Icon = cfg.icon;
              return (
                <motion.div key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className={`flex items-start gap-3 p-4 hover:bg-white/3 transition-colors cursor-pointer ${!n.read ? 'bg-blue-500/3' : ''}`}
                  onClick={() => markRead(n.id)}>
                  <div className={`w-9 h-9 rounded-xl ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon style={{ width: 16, height: 16 }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{n.title}</p>
                      {!n.read && <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />}
                    </div>
                    <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-white/25 mt-1">{n.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Send notification form */}
        <div className="lg:col-span-2 bg-[#1E293B]/80 border border-white/5 rounded-2xl p-5 h-fit">
          <div className="flex items-center gap-2 mb-5">
            <Send className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-white">إرسال إشعار</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">الاستهداف</label>
              <select value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50">
                <option value="all">جميع البائعين</option>
                <option value="active">البائعون النشطون</option>
                <option value="pending">المتاجر المعلقة</option>
                <option value="vip">البائعون VIP</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">نوع الإشعار</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50">
                <option value="info">معلومة</option>
                <option value="success">نجاح</option>
                <option value="alert">تنبيه</option>
                <option value="order">طلب</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">العنوان</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="عنوان الإشعار"
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">الرسالة</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="محتوى الإشعار..." rows={3}
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all resize-none" />
            </div>
            <button onClick={handleSend} disabled={sending}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors">
              <Send className="w-4 h-4" />
              {sending ? 'جاري الإرسال...' : 'إرسال الإشعار'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}