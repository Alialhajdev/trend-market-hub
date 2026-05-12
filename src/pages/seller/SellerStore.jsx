import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Save, Upload, Eye, Store, Palette, Phone, Globe, CheckCircle, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function SellerStore() {
  const qc = useQueryClient();
  const [form, setForm] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  const { data: store, isLoading } = useQuery({
    queryKey: ['my-store'], queryFn: async () => {
      const user = await base44.auth.me();
      const stores = await base44.entities.Store.filter({ owner_email: user.email });
      return stores[0] || null;
    }
  });

  useEffect(() => { if (store) setForm(store); }, [store]);

  const update = useMutation({
    mutationFn: (data) => base44.entities.Store.update(store.id, data),
    onSuccess: () => { qc.invalidateQueries(['my-store']); toast.success('تم حفظ التغييرات'); },
  });

  const handleSave = () => update.mutate(form);
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const tabs = [
    { key: 'basic', label: 'المعلومات الأساسية', icon: Store },
    { key: 'contact', label: 'التواصل', icon: Phone },
    { key: 'design', label: 'التصميم', icon: Palette },
    { key: 'policy', label: 'السياسات', icon: Globe },
  ];

  if (isLoading) return <div className="p-6 text-slate-500">جاري التحميل...</div>;

  if (!store) return (
    <div className="p-6 text-center">
      <Store className="w-16 h-16 mx-auto mb-4 text-slate-600" />
      <p className="text-slate-400 text-lg font-bold mb-2">لا يوجد متجر</p>
      <p className="text-slate-500 text-sm mb-4">أنشئ متجرك الآن لتتمكن من البيع</p>
      <a href="/create-store" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-bold">إنشاء متجر</a>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-white">إدارة المتجر</h1>
        <p className="text-slate-500 text-sm mt-1">خصّص وأدر متجرك الإلكتروني</p>
      </motion.div>

      {/* Store Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl overflow-hidden border border-white/[0.07] mb-6"
      >
        <div className="h-32 relative" style={{ background: `linear-gradient(135deg, ${store.theme_color || '#2563EB'}, #06B6D4)` }}>
          {store.banner_url && <img src={store.banner_url} alt="" className="w-full h-full object-cover absolute inset-0" />}
          <div className="absolute inset-0 bg-black/30" />
          <a href={`/store/${store.id}`} target="_blank" rel="noreferrer"
            className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/30 text-white text-xs font-medium hover:bg-black/50 transition-all backdrop-blur-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            معاينة المتجر
          </a>
        </div>
        <div className="bg-[#111827] px-5 pb-4">
          <div className="flex items-end gap-4 -mt-8 mb-3">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#0F172A] bg-[#1E293B] flex-shrink-0">
              {store.logo_url ? (
                <img src={store.logo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white">
                  {store.name?.[0]}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-black">{store.name}</h3>
                {store.is_verified && <CheckCircle className="w-4 h-4 text-blue-400" />}
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${store.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                {store.status === 'active' ? 'نشط' : store.status}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#111827] border border-white/[0.07] rounded-xl p-1 mb-5 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === t.key ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-[#111827] border border-white/[0.07] p-5 space-y-4"
      >
        {activeTab === 'basic' && (
          <>
            <Field label="اسم المتجر (عربي)" value={form.name || ''} onChange={v => set('name', v)} />
            <Field label="اسم المتجر (إنجليزي)" value={form.name_en || ''} onChange={v => set('name_en', v)} />
            <Field label="وصف المتجر" value={form.description || ''} onChange={v => set('description', v)} multiline />
            <ImageUploadField label="شعار المتجر" value={form.logo_url || ''} onChange={v => set('logo_url', v)} />
            <ImageUploadField label="بانر المتجر" value={form.banner_url || ''} onChange={v => set('banner_url', v)} banner />
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">التصنيف</label>
              <select value={form.category || ''} onChange={e => set('category', e.target.value)}
                className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2563EB]/50"
              >
                {['electronics','fashion','home','beauty','sports','food','books','digital','other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-white/[0.05]">
              <div>
                <div className="text-sm font-medium text-white">تفعيل المتجر</div>
                <div className="text-xs text-slate-500">جعل المتجر مرئياً للعملاء</div>
              </div>
              <button
                onClick={() => set('status', form.status === 'active' ? 'suspended' : 'active')}
                className={`relative w-12 h-6 rounded-full transition-colors ${form.status === 'active' ? 'bg-green-500' : 'bg-slate-600'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.status === 'active' ? 'left-[26px]' : 'left-0.5'}`} />
              </button>
            </div>
          </>
        )}

        {activeTab === 'contact' && (
          <>
            <Field label="رقم الهاتف" value={form.phone || ''} onChange={v => set('phone', v)} />
            <Field label="واتساب" value={form.whatsapp || ''} onChange={v => set('whatsapp', v)} />
            <Field label="المدينة" value={form.city || ''} onChange={v => set('city', v)} />
            <Field label="الدولة" value={form.country || ''} onChange={v => set('country', v)} />
            <Field label="البريد الإلكتروني" value={form.owner_email || ''} onChange={v => set('owner_email', v)} />
          </>
        )}

        {activeTab === 'design' && (
          <>
            <div>
              <label className="block text-xs text-slate-400 mb-2">لون المتجر الرئيسي</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.theme_color || '#2563EB'} onChange={e => set('theme_color', e.target.value)}
                  className="w-14 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer"
                />
                <span className="text-sm text-slate-300 font-mono">{form.theme_color || '#2563EB'}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">معاينة مباشرة</label>
              <div className="rounded-xl p-4 text-center text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${form.theme_color || '#2563EB'}, #06B6D4)` }}>
                {form.name || 'اسم متجرك'}
              </div>
            </div>
          </>
        )}

        {activeTab === 'policy' && (
          <>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">سياسة المتجر</label>
              <textarea rows={4} value={form.return_policy || ''} onChange={e => set('return_policy', e.target.value)}
                placeholder="اكتب سياسة متجرك..."
                className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#2563EB]/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">سياسة الإرجاع</label>
              <textarea rows={4} value={form.shipping_info || ''} onChange={e => set('shipping_info', e.target.value)}
                placeholder="شروط الإرجاع والاستبدال..."
                className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#2563EB]/50 resize-none"
              />
            </div>
          </>
        )}

        <button
          onClick={handleSave}
          disabled={update.isPending}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
        >
          <Save className="w-4 h-4" />
          {update.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </motion.div>
    </div>
  );
}

function ImageUploadField({ label, value, onChange, banner }) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange(file_url);
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
      <input type="file" ref={inputRef} accept="image/*" onChange={handleFile} className="hidden" />
      {value ? (
        <div className="relative group">
          <img src={value} alt="" className={`w-full object-cover rounded-xl border border-white/10 ${banner ? 'h-28' : 'h-24 w-24 rounded-2xl'}`} />
          <button onClick={() => inputRef.current.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl text-white text-xs font-bold gap-1.5"
          >
            <Upload className="w-4 h-4" /> تغيير الصورة
          </button>
        </div>
      ) : (
        <button onClick={() => inputRef.current.click()}
          disabled={uploading}
          className={`flex items-center justify-center gap-2 border-2 border-dashed border-white/10 rounded-xl text-slate-500 hover:border-[#2563EB]/50 hover:text-slate-300 transition-all ${banner ? 'w-full h-28' : 'w-24 h-24'}`}
        >
          {uploading ? <div className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" /> : (
            <><ImageIcon className="w-5 h-5" /><span className="text-xs">{uploading ? 'جاري الرفع...' : 'رفع صورة'}</span></>
          )}
        </button>
      )}
    </div>
  );
}

function Field({ label, value, onChange, multiline, placeholder }) {
  const cls = "w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#2563EB]/50";
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
      {multiline ? (
        <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls + ' resize-none'} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}