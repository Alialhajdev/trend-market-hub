import React, { useState } from 'react';
import { Settings, Globe, Palette, DollarSign, Truck, Mail, Shield, Save, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const tabs = [
  { key: 'general', label: 'عام', icon: Settings },
  { key: 'finance', label: 'مالية', icon: DollarSign },
  { key: 'shipping', label: 'الشحن', icon: Truck },
  { key: 'email', label: 'البريد', icon: Mail },
  { key: 'payment', label: 'الدفع', icon: CreditCard },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    platformName: 'Trend Market Hub',
    platformNameAr: 'تريند ماركت هاب',
    supportEmail: 'support@trendmarket.com',
    currency: 'SAR',
    defaultCommission: 10,
    minPayout: 500,
    taxRate: 15,
    freeShippingMin: 200,
    shippingCost: 25,
    maintenanceMode: false,
    registrationOpen: true,
    emailNotifications: true,
    autoApproveStores: false,
  });

  const set = (key, value) => setSettings(s => ({ ...s, [key]: value }));

  const handleSave = () => {
    toast.success('تم حفظ الإعدادات بنجاح!');
  };

  return (
    <div style={{ direction: 'rtl' }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">إعدادات المنصة</h1>
          <p className="text-white/40 text-sm">تحكم في جميع جوانب منصتك</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors">
          <Save className="w-4 h-4" />حفظ التغييرات
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-[#1E293B]/80 border border-white/10 text-white/50 hover:text-white hover:border-white/20'}`}>
              <Icon style={{ width: 16, height: 16 }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#1E293B]/80 border border-white/5 rounded-2xl p-6">

        {activeTab === 'general' && (
          <div className="space-y-5">
            <h3 className="font-bold text-white flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" />الإعدادات العامة</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <SettingInput label="اسم المنصة (عربي)" value={settings.platformNameAr} onChange={v => set('platformNameAr', v)} />
              <SettingInput label="Platform Name (English)" value={settings.platformName} onChange={v => set('platformName', v)} />
              <SettingInput label="بريد الدعم" value={settings.supportEmail} onChange={v => set('supportEmail', v)} type="email" />
              <SettingInput label="العملة الافتراضية" value={settings.currency} onChange={v => set('currency', v)} />
            </div>
            <div className="space-y-3 mt-4">
              <SettingToggle label="وضع الصيانة" desc="إيقاف المنصة للصيانة" value={settings.maintenanceMode} onChange={v => set('maintenanceMode', v)} />
              <SettingToggle label="فتح التسجيل" desc="السماح للبائعين الجدد بالتسجيل" value={settings.registrationOpen} onChange={v => set('registrationOpen', v)} />
              <SettingToggle label="قبول تلقائي للمتاجر" desc="قبول المتاجر بدون مراجعة يدوية" value={settings.autoApproveStores} onChange={v => set('autoApproveStores', v)} />
              <SettingToggle label="إشعارات البريد" desc="إرسال إشعارات بريدية تلقائياً" value={settings.emailNotifications} onChange={v => set('emailNotifications', v)} />
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="space-y-5">
            <h3 className="font-bold text-white flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-400" />الإعدادات المالية</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <SettingInput label="نسبة العمولة الافتراضية (%)" value={settings.defaultCommission} onChange={v => set('defaultCommission', parseFloat(v))} type="number" />
              <SettingInput label="الحد الأدنى للسحب (ر.س)" value={settings.minPayout} onChange={v => set('minPayout', parseFloat(v))} type="number" />
              <SettingInput label="نسبة الضريبة (%)" value={settings.taxRate} onChange={v => set('taxRate', parseFloat(v))} type="number" />
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-4">
              <p className="text-amber-400 text-sm font-medium">⚠️ تنبيه مهم</p>
              <p className="text-white/50 text-xs mt-1">تعديل نسبة العمولة سيؤثر على جميع المتاجر الجديدة فقط. المتاجر الحالية تحتفظ بنسبها.</p>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-5">
            <h3 className="font-bold text-white flex items-center gap-2"><Truck className="w-4 h-4 text-cyan-400" />إعدادات الشحن</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <SettingInput label="تكلفة الشحن الافتراضية (ر.س)" value={settings.shippingCost} onChange={v => set('shippingCost', parseFloat(v))} type="number" />
              <SettingInput label="الحد الأدنى للشحن المجاني (ر.س)" value={settings.freeShippingMin} onChange={v => set('freeShippingMin', parseFloat(v))} type="number" />
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-5">
            <h3 className="font-bold text-white flex items-center gap-2"><Mail className="w-4 h-4 text-purple-400" />إعدادات البريد الإلكتروني</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <SettingInput label="بريد المرسل" value="noreply@trendmarket.com" onChange={() => {}} />
              <SettingInput label="اسم المرسل" value="Trend Market Hub" onChange={() => {}} />
            </div>
            <div className="space-y-3 mt-2">
              <SettingToggle label="تأكيد الطلب" desc="إرسال بريد تأكيد عند إنشاء طلب جديد" value={true} onChange={() => {}} />
              <SettingToggle label="تحديث حالة الطلب" desc="إشعار العميل عند تغيير حالة الطلب" value={true} onChange={() => {}} />
              <SettingToggle label="ترحيب بالبائعين" desc="بريد ترحيب عند قبول متجر جديد" value={false} onChange={() => {}} />
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-5">
            <h3 className="font-bold text-white flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-400" />بوابات الدفع</h3>
            <div className="space-y-3">
              {[
                { name: 'Stripe', desc: 'بطاقات ائتمانية دولية', enabled: true },
                { name: 'PayPal', desc: 'دفع عبر PayPal', enabled: false },
                { name: 'الدفع عند الاستلام', desc: 'COD', enabled: true },
                { name: 'تحويل بنكي', desc: 'تحويل بنكي مباشر', enabled: true },
              ].map((gw, i) => (
                <div key={i} className="flex items-center justify-between bg-white/3 border border-white/5 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{gw.name}</p>
                    <p className="text-xs text-white/40">{gw.desc}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${gw.enabled ? 'bg-blue-600' : 'bg-white/10'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${gw.enabled ? 'start-6' : 'start-0.5'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function SettingInput({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="text-xs text-white/50 mb-1.5 block">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" />
    </div>
  );
}

function SettingToggle({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between bg-white/3 border border-white/5 rounded-xl px-4 py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-white/40 mt-0.5">{desc}</p>}
      </div>
      <button onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full relative transition-colors ${value ? 'bg-blue-600' : 'bg-white/10'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${value ? 'start-6' : 'start-0.5'}`} />
      </button>
    </div>
  );
}