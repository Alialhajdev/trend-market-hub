import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  const { t, isRTL } = useLang();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold">TM</span>
              </div>
              <span className="font-bold text-xl text-white">Trend Market Hub</span>
            </div>
            <p className="text-sm text-secondary-foreground/70 leading-relaxed mb-4">
              {isRTL ? 'منصة التجارة الإلكترونية الرائدة في العالم العربي. نربط البائعين بالمشترين في بيئة آمنة وموثوقة.' : 'The leading e-commerce platform in the Arab world. We connect sellers with buyers in a safe and trusted environment.'}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">{isRTL ? 'روابط سريعة' : 'Quick Links'}</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/stores" className="hover:text-white transition-colors">{t('stores')}</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">{t('categories')}</Link></li>
              <li><Link to="/trending" className="hover:text-white transition-colors">{t('trending')}</Link></li>
              <li><Link to="/deals" className="hover:text-white transition-colors">{t('deals')}</Link></li>
              <li><Link to="/create-store" className="hover:text-white transition-colors">{t('createStore')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white mb-4">{t('support')}</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/about" className="hover:text-white transition-colors">{t('aboutUs')}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t('contactUs')}</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">{t('privacyPolicy')}</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">{t('terms')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">{t('contactUs')}</h3>
            <div className="space-y-3 text-sm text-secondary-foreground/70">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@trendmarket.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+966 50 000 0000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{isRTL ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary-foreground/50">
          <span>© 2025 Trend Market Hub. {t('allRights')}</span>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/120px-Stripe_Logo%2C_revised_2016.svg.png" alt="Stripe" className="h-5 opacity-50" />
            <span className="text-secondary-foreground/30">|</span>
            <span>{isRTL ? 'دفع آمن 🔒' : 'Secure Payment 🔒'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}