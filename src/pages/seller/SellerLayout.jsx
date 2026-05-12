import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Users, DollarSign,
  Megaphone, Bell, BarChart3, Settings, HelpCircle, Store,
  Menu, X, ChevronRight, Zap, LogOut, Boxes
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';

const navItems = [
  { icon: LayoutDashboard, label: 'الرئيسية', path: '/seller' },
  { icon: Store, label: 'المتجر', path: '/seller/store' },
  { icon: Package, label: 'المنتجات', path: '/seller/products' },
  { icon: ShoppingBag, label: 'الطلبات', path: '/seller/orders' },
  { icon: Boxes, label: 'المخزون', path: '/seller/inventory' },
  { icon: Users, label: 'العملاء', path: '/seller/customers' },
  { icon: DollarSign, label: 'الأرباح', path: '/seller/finance' },
  { icon: Megaphone, label: 'التسويق', path: '/seller/marketing' },
  { icon: BarChart3, label: 'التحليلات', path: '/seller/analytics' },
  { icon: Bell, label: 'الإشعارات', path: '/seller/notifications' },
  { icon: Settings, label: 'الإعدادات', path: '/seller/settings' },
  { icon: HelpCircle, label: 'الدعم', path: '/seller/support' },
];

export default function SellerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const { isRTL } = useLang();

  useEffect(() => {
    base44.auth.isAuthenticated().then(authed => {
      if (!authed) {
        base44.auth.redirectToLogin(window.location.href);
      } else {
        setAuthChecked(true);
      }
    });
  }, []);

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#2563EB]/30 border-t-[#2563EB] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex" dir="rtl">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-64 bg-[#111827] border-l border-white/[0.06] z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-black text-white">Trend Market</div>
              <div className="text-[10px] text-slate-500">مركز البائع</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/seller'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2563EB]/20 to-[#06B6D4]/10 text-white border border-[#2563EB]/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-[#06B6D4]' : 'text-slate-500 group-hover:text-slate-300'}`} style={{width:'18px',height:'18px'}} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 mr-auto text-[#06B6D4]" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:mr-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0F172A]/90 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block text-sm text-slate-500">مرحباً، ابدأ يومك بإنجاز 🚀</div>
          <div className="flex items-center gap-3 mr-auto lg:mr-0">
            <button
              onClick={() => navigate('/seller/notifications')}
              className="relative w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <Bell className="w-4.5 h-4.5" style={{width:'18px',height:'18px'}} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#06B6D4]" />
            </button>
            <button
              onClick={() => navigate('/seller/settings')}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center font-bold text-sm"
            >
              ب
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#111827]/95 backdrop-blur-xl border-t border-white/[0.06] flex items-center justify-around px-2 py-2">
        {navItems.slice(0, 5).map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/seller'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive ? 'text-[#06B6D4]' : 'text-slate-500'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-medium">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-slate-500"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[9px] font-medium">المزيد</span>
        </button>
      </nav>
    </div>
  );
}