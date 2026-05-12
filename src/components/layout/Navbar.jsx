import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import { base44 } from '@/api/base44Client';
import { Search, Menu, X, Moon, Sun, Globe, Store, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ cartCount = 0 }) {
  const { t, isRTL, toggleLang, darkMode, toggleDark } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);


  const navLinks = [
    { label: t('home'), path: '/' },
    { label: t('stores'), path: '/stores' },
    { label: t('categories'), path: '/categories' },
    { label: t('trending'), path: '/trending' },
    { label: t('deals'), path: '/deals' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">TM</span>
              </div>
              <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Trend Market
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" style={{ [isRTL ? 'right' : 'left']: '12px' }} />
                <input
                  type="text"
                  placeholder={t('search')}
                  className="w-full h-10 rounded-xl bg-muted/50 border border-border/50 text-sm pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  style={isRTL ? { paddingRight: '40px', paddingLeft: '12px' } : {}}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden" onClick={() => setSearchOpen(!searchOpen)}>
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleDark}>
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleLang}>
                <Globe className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="sm" className="h-9 hidden sm:flex gap-1" onClick={() => base44.auth.redirectToLogin()}>
                <LogIn className="w-3.5 h-3.5" />
                {isRTL ? 'تسجيل الدخول' : 'Login'}
              </Button>

              <Link to="/create-store" className="hidden sm:block">
                <Button size="sm" className="h-9 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-sm gap-1">
                  <Store className="w-3.5 h-3.5" />
                  {t('createStore')}
                </Button>
              </Link>

              <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" onClick={() => setMobileOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden md:hidden border-t border-border/50">
              <div className="p-3">
                <input type="text" placeholder={t('search')}
                  className="w-full h-10 rounded-xl bg-muted/50 border border-border/50 text-sm px-4 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: isRTL ? -300 : 300 }} animate={{ x: 0 }} exit={{ x: isRTL ? -300 : 300 }}
              className="fixed top-0 bottom-0 w-72 bg-background z-50 shadow-2xl"
              style={{ [isRTL ? 'left' : 'right']: 0 }}
            >
              <div className="p-4 flex items-center justify-between border-b border-border">
                <span className="font-bold">Trend Market</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-4 space-y-1">
                {navLinks.map(link => (
                  <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                    {link.label}
                  </Link>
                ))}
                <hr className="my-3 border-border" />
                <button onClick={() => { setMobileOpen(false); base44.auth.redirectToLogin(); }}
                  className="block w-full text-right px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                  تسجيل الدخول
                </button>
                <Link to="/create-store" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                  {t('createStore')}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


    </>
  );
}