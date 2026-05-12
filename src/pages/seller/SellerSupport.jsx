import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare, FileText, ChevronDown, ChevronUp, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const faqs = [
  { q: 'كيف أضيف منتجاً جديداً؟', a: 'اذهب إلى قسم "المنتجات" ثم اضغط "منتج جديد" وأدخل بيانات المنتج.' },
  { q: 'متى يتم تحويل الأرباح؟', a: 'يتم تحويل الأرباح خلال 3-5 أيام عمل بعد اكتمال الطلب وتأكيد الاستلام.' },
  { q: 'كيف أغير لون وشعار المتجر؟', a: 'اذهب إلى "إدارة المتجر" ثم تبويب "التصميم" وقم بتعديل الألوان والشعار.' },
  { q: 'هل يمكنني تعطيل متجري مؤقتاً؟', a: 'نعم، في قسم "إدارة المتجر" يمكنك إيقاف تشغيل المتجر مؤقتاً دون حذفه.' },
  { q: 'ما هي نسبة العمولة؟', a: 'تتراوح العمولة بين 2% (خطة VIP) و10% (الخطة المجانية) حسب الاشتراك.' },
  { q: 'كيف أتعامل مع مرتجعات العملاء؟', a: 'تلقى إشعاراً بطلب الإرجاع ويمكنك قبوله أو رفضه من قسم الطلبات.' },
];

export default function SellerSupport() {
  const [openFaq, setOpenFaq] = useState(null);
  const [ticket, setTicket] = useState({ subject: '', message: '', category: 'orders' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!ticket.subject || !ticket.message) { toast.error('أكمل جميع الحقول'); return; }
    setSubmitted(true);
    toast.success('تم إرسال التذكرة بنجاح — سنرد خلال 24 ساعة');
  };

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-white">الدعم والمساعدة</h1>
        <p className="text-slate-500 text-sm mt-1">نحن هنا لمساعدتك في أي وقت</p>
      </motion.div>

      {/* Quick Cards */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[
          { icon: MessageSquare, title: 'دردشة مباشرة', desc: 'تحدث مع فريق الدعم فوراً', color: 'from-blue-500 to-cyan-500', action: () => toast.info('قريباً: الدردشة المباشرة') },
          { icon: FileText, title: 'إنشاء تذكرة', desc: 'أرسل طلب دعم مفصّل', color: 'from-purple-500 to-violet-500', action: () => document.getElementById('ticket-form')?.scrollIntoView({ behavior: 'smooth' }) },
          { icon: HelpCircle, title: 'مركز المساعدة', desc: 'أجوبة لأكثر الأسئلة شيوعاً', color: 'from-green-500 to-emerald-500', action: () => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' }) },
        ].map((c, i) => (
          <motion.button key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            onClick={c.action}
            className="rounded-2xl bg-[#111827] border border-white/[0.07] p-4 text-right hover:border-white/20 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <c.icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-bold text-white text-sm">{c.title}</div>
            <div className="text-slate-500 text-xs mt-0.5">{c.desc}</div>
          </motion.button>
        ))}
      </div>

      {/* FAQs */}
      <motion.div id="faq-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl bg-[#111827] border border-white/[0.07] overflow-hidden mb-5"
      >
        <div className="p-4 border-b border-white/[0.05]">
          <h3 className="font-bold text-white">الأسئلة الشائعة</h3>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-right hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm font-medium text-slate-200">{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 text-sm text-slate-400 leading-relaxed"
                >
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Ticket Form */}
      <motion.div id="ticket-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl bg-[#111827] border border-white/[0.07] p-5"
      >
        <h3 className="font-bold text-white mb-4">إنشاء تذكرة دعم</h3>
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <div className="text-white font-bold mb-1">تم إرسال تذكرتك بنجاح!</div>
            <div className="text-slate-400 text-sm">سيرد فريقنا خلال 24 ساعة على بريدك الإلكتروني</div>
            <button onClick={() => setSubmitted(false)} className="mt-4 text-[#06B6D4] text-sm hover:underline">إنشاء تذكرة جديدة</button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">التصنيف</label>
              <select value={ticket.category} onChange={e => setTicket(t => ({ ...t, category: e.target.value }))}
                className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              >
                <option value="orders">مشكلة في الطلبات</option>
                <option value="payment">مشكلة في الدفع</option>
                <option value="products">مشكلة في المنتجات</option>
                <option value="account">مشكلة في الحساب</option>
                <option value="other">أخرى</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">الموضوع</label>
              <input value={ticket.subject} onChange={e => setTicket(t => ({ ...t, subject: e.target.value }))}
                placeholder="وصف مختصر للمشكلة"
                className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#2563EB]/50"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">تفاصيل المشكلة</label>
              <textarea rows={4} value={ticket.message} onChange={e => setTicket(t => ({ ...t, message: e.target.value }))}
                placeholder="اشرح مشكلتك بالتفصيل..."
                className="w-full bg-[#1E293B] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#2563EB]/50 resize-none"
              />
            </div>
            <button onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-bold text-sm hover:scale-105 transition-transform"
            >
              <Send className="w-4 h-4" />إرسال التذكرة
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}