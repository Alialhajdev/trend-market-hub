import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  'المنصة': [
    { label: 'كيف يعمل', href: '#how' },
    { label: 'المميزات', href: '#features' },
    { label: 'الأسعار والخطط', href: '#pricing' },
    { label: 'المتاجر', href: '#stores' },
  ],
  'للبائعين': [
    { label: 'أنشئ متجرك', href: '/create-store' },
    { label: 'لوحة التحكم', href: '/vendor-dashboard' },
    { label: 'إضافة منتج', href: '/add-product' },
    { label: 'مركز المساعدة', href: '#' },
  ],
  'الشركة': [
    { label: 'من نحن', href: '#' },
    { label: 'المدونة', href: '#' },
    { label: 'الشراكات', href: '#' },
    { label: 'تواصل معنا', href: '#' },
  ],
  'قانوني': [
    { label: 'سياسة الخصوصية', href: '#' },
    { label: 'الشروط والأحكام', href: '#' },
    { label: 'سياسة الاسترجاع', href: '#' },
    { label: 'الاستخدام المقبول', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a1020]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Trend Market
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              منصة التجارة الإلكترونية الأولى عربياً — ابنِ متجرك، وبع منتجاتك، واحقق أحلامك.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.07] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="text-slate-500 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="flex flex-wrap gap-6 mb-8 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>support@trendmarket.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-cyan-400" />
            <span dir="ltr">+966 50 000 0000</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-400" />
            <span>الرياض، المملكة العربية السعودية</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© 2024 Trend Market Hub. جميع الحقوق محفوظة.</p>
          <p>صُنع بـ ❤️ في المملكة العربية السعودية</p>
        </div>
      </div>
    </footer>
  );
}