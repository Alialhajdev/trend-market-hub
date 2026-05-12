import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown, Shield, Settings, LogOut, Home } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const breadcrumbMap = {
  '/admin': ['لوحة التحكم'],
  '/admin/stores': ['لوحة التحكم', 'المتاجر'],
  '/admin/products': ['لوحة التحكم', 'المنتجات'],
  '/admin/orders': ['لوحة التحكم', 'الطلبات'],
  '/admin/vendors': ['لوحة التحكم', 'البائعون'],
  '/admin/finance': ['لوحة التحكم', 'المالية'],
  '/admin/subscriptions': ['لوحة التحكم', 'الاشتراكات'],
  '/admin/analytics': ['لوحة التحكم', 'التحليلات'],
  '/admin/notifications': ['لوحة التحكم', 'الإشعارات'],
  '/admin/support': ['لوحة التحكم', 'الدعم'],
  '/admin/security': ['لوحة التحكم', 'الأمان'],
  '/admin/settings': ['لوحة التحكم', 'الإعدادات'],
};

export default function AdminTopbar({ onMenuClick }) {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const breadcrumbs = breadcrumbMap[location.pathname] || ['لوحة التحكم'];

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  return (
    <header className="h-16 bg-[#111827]/80 backdrop-blur-xl border-b border-white/5 flex items-center gap-4 px-4 lg:px-6 flex-shrink-0 sticky top-0 z-30"
      style={{ direction: 'rtl' }}>

      {/* Menu button (mobile) */}
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors">
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 flex-1">
        <Link to="/" className="text-white/40 hover:text-white transition-colors">
          <Home className="w-4 h-4" />
        </Link>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            <span className="text-white/20">/</span>
            <span className={`text-sm font-medium ${i === breadcrumbs.length - 1 ? 'text-white' : 'text-white/40'}`}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div className="flex-1 md:flex-none" />

      {/* Search */}
      <div className="relative hidden sm:block">
        <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-white/30" />
        <input
          placeholder="بحث سريع..."
          className="bg-white/5 border border-white/10 rounded-xl h-9 ps-9 pe-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 w-52 transition-all"
        />
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#111827]" />
      </button>

      {/* User */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(o => !o)}
          className="flex items-center gap-2 p-1.5 pe-3 rounded-xl hover:bg-white/10 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
            {user?.full_name?.[0] || 'A'}
          </div>
          <div className="hidden sm:block text-start">
            <p className="text-xs font-semibold text-white leading-tight">{user?.full_name || 'Admin'}</p>
            <p className="text-[10px] text-blue-400">Super Admin</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-white/40" />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full end-0 mt-2 w-48 bg-[#1E293B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
            <div className="p-3 border-b border-white/5">
              <p className="text-xs font-semibold text-white">{user?.full_name || 'Admin'}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
            </div>
            <div className="p-2 space-y-0.5">
              <Link to="/admin/settings" onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/8 transition-colors">
                <Settings className="w-4 h-4" />الإعدادات
              </Link>
              <button onClick={() => base44.auth.logout()}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                <LogOut className="w-4 h-4" />تسجيل الخروج
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}