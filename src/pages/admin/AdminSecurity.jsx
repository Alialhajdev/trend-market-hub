import React, { useState } from 'react';
import { Shield, Lock, Eye, Activity, AlertTriangle, CheckCircle, Globe, Smartphone, Monitor, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const loginHistory = [
  { id: 1, user: 'admin@trendmarket.com', ip: '185.234.56.78', device: 'Chrome / Windows', location: 'الرياض، السعودية', time: '2026-05-07 10:30', status: 'success' },
  { id: 2, user: 'admin@trendmarket.com', ip: '192.168.1.1', device: 'Safari / macOS', location: 'جدة، السعودية', time: '2026-05-06 08:15', status: 'success' },
  { id: 3, user: 'admin@trendmarket.com', ip: '46.122.33.91', device: 'Firefox / Ubuntu', location: 'دبي، الإمارات', time: '2026-05-05 22:40', status: 'failed' },
  { id: 4, user: 'admin@trendmarket.com', ip: '185.234.56.78', device: 'Mobile / Android', location: 'الرياض، السعودية', time: '2026-05-04 16:00', status: 'success' },
];

const activityLog = [
  { id: 1, action: 'قبول متجر', target: 'متجر التقنية', admin: 'admin', time: 'منذ 10 دقائق', type: 'store' },
  { id: 2, action: 'إيقاف بائع', target: 'متجر مجهول', admin: 'admin', time: 'منذ 45 دقيقة', type: 'ban' },
  { id: 3, action: 'تحديث منتج', target: 'سماعات بلوتوث', admin: 'admin', time: 'منذ 2 ساعة', type: 'product' },
  { id: 4, action: 'إرسال إشعار جماعي', target: 'جميع البائعين', admin: 'admin', time: 'منذ 4 ساعات', type: 'notification' },
  { id: 5, action: 'تغيير خطة اشتراك', target: 'بيت الجمال → VIP', admin: 'admin', time: 'منذ يوم', type: 'subscription' },
];

const roles = [
  { name: 'Super Admin', desc: 'صلاحيات كاملة', perms: ['إدارة المتاجر', 'إدارة المالية', 'الإعدادات', 'الأمان', 'التقارير'] },
  { name: 'Store Manager', desc: 'إدارة المتاجر والمنتجات', perms: ['إدارة المتاجر', 'إدارة المنتجات', 'الطلبات'] },
  { name: 'Finance Admin', desc: 'إدارة المالية فقط', perms: ['التقارير المالية', 'الدفعات', 'العمولات'] },
  { name: 'Support Agent', desc: 'دعم العملاء', perms: ['تذاكر الدعم', 'مشاهدة الطلبات', 'التواصل'] },
];

export default function AdminSecurity() {
  const [twoFaEnabled, setTwoFaEnabled] = useState(true);

  return (
    <div style={{ direction: 'rtl' }} className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-white">الأمان والتحكم</h1>
        <p className="text-white/40 text-sm">إدارة الصلاحيات وسجل الأنشطة</p>
      </div>

      {/* Security status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'حالة الأمان', value: 'ممتازة', icon: Shield, color: 'green', sub: '98/100' },
          { label: 'تسجيلات دخول اليوم', value: '4', icon: Key, color: 'blue', sub: '1 فاشل' },
          { label: '2FA', value: twoFaEnabled ? 'مفعّل' : 'معطّل', icon: Smartphone, color: twoFaEnabled ? 'green' : 'red', sub: 'للحساب الرئيسي' },
          { label: 'الجلسات النشطة', value: '2', icon: Monitor, color: 'purple', sub: 'جهازان' },
        ].map((item, i) => {
          const colors = {
            green: 'from-green-500/20 border-green-500/20 text-green-400',
            blue: 'from-blue-500/20 border-blue-500/20 text-blue-400',
            red: 'from-red-500/20 border-red-500/20 text-red-400',
            purple: 'from-purple-500/20 border-purple-500/20 text-purple-400',
          };
          const Icon = item.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className={`bg-gradient-to-br ${colors[item.color]} border rounded-2xl p-4`}>
              <Icon style={{ width: 20, height: 20 }} className="mb-3" />
              <p className="text-white text-xl font-black">{item.value}</p>
              <p className="text-white/40 text-xs mt-0.5">{item.label}</p>
              <p className="text-xs mt-1">{item.sub}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Login history */}
        <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-white">سجل تسجيل الدخول</h3>
          </div>
          <div className="divide-y divide-white/5">
            {loginHistory.map((log, i) => (
              <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 hover:bg-white/3 transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${log.status === 'success' ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                  {log.status === 'success' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">{log.device}</p>
                    <span className={`text-[10px] font-medium ${log.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                      {log.status === 'success' ? 'ناجح' : 'فاشل'}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">{log.location} • {log.ip}</p>
                  <p className="text-[10px] text-white/25 mt-0.5">{log.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity log */}
        <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white">سجل الأنشطة</h3>
          </div>
          <div className="divide-y divide-white/5">
            {activityLog.map((log, i) => (
              <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 hover:bg-white/3 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{log.action}</p>
                  <p className="text-xs text-white/40 mt-0.5">{log.target}</p>
                  <p className="text-[10px] text-white/25 mt-0.5">{log.admin} • {log.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Roles */}
      <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-bold text-white">نظام الصلاحيات</h3>
          <p className="text-white/40 text-sm">تحكم بصلاحيات المديرين</p>
        </div>
        <div className="p-4 grid md:grid-cols-2 gap-3">
          {roles.map((role, i) => (
            <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-4 hover:border-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{role.name}</p>
                  <p className="text-xs text-white/40">{role.desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {role.perms.map((perm, pi) => (
                  <span key={pi} className="text-[10px] bg-white/5 text-white/50 px-2 py-0.5 rounded-full">{perm}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}