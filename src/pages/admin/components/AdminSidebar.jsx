import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Store, Package, ShoppingCart, Users, DollarSign,
  BarChart3, Settings, Bell, Shield, MessageSquare, Tag, X, ChevronRight,
  Zap, CreditCard, Activity, Globe
} from 'lucide-react';

const navItems = [
  { label: 'لوحة التحكم', labelEn: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'المتاجر', labelEn: 'Stores', icon: Store, path: '/admin/stores', badge: null },
  { label: 'المنتجات', labelEn: 'Products', icon: Package, path: '/admin/products' },
  { label: 'الطلبات', labelEn: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'البائعون', labelEn: 'Vendors', icon: Users, path: '/admin/vendors' },
  { label: 'المالية', labelEn: 'Finance', icon: DollarSign, path: '/admin/finance' },
  { label: 'الاشتراكات', labelEn: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions' },
  { label: 'التحليلات', labelEn: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { label: 'الإشعارات', labelEn: 'Notifications', icon: Bell, path: '/admin/notifications' },
  { label: 'الدعم', labelEn: 'Support', icon: MessageSquare, path: '/admin/support' },
  { label: 'الأمان', labelEn: 'Security', icon: Shield, path: '/admin/security' },
  { label: 'الإعدادات', labelEn: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <aside className={`
      fixed lg:static inset-y-0 start-0 z-50 w-64 flex-shrink-0
      bg-[#111827] border-e border-white/5 flex flex-col
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}
      style={{ direction: 'rtl' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-black text-sm text-white">Trend Market</p>
            <p className="text-[10px] text-blue-400 font-medium">Super Admin</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
                }
              `}
            >
              <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white'}`} style={{ width: 18, height: 18 }} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-500/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400 font-medium">النظام يعمل بكفاءة</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[10px] text-white/40">v2.0 • Trend Market Hub</span>
          </div>
        </div>
      </div>
    </aside>
  );
}