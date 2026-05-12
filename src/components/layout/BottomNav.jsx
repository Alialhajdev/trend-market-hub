import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, LayoutDashboard } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'الرئيسية', path: '/' },
  { icon: Search, label: 'التصنيفات', path: '/categories' },

  { icon: LayoutDashboard, label: 'متجري', path: '/seller' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border/50 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map(item => {
          const active = location.pathname === item.path || (item.path === '/seller' && location.pathname.startsWith('/seller'));
          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center gap-0.5 py-1">
              <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}