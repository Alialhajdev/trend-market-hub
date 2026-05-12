import React, { useState } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Search, ChevronDown, User, Store } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const mockTickets = [
  { id: 'TKT-001', subject: 'مشكلة في الدفع', store: 'متجر التقنية', type: 'vendor', status: 'open', priority: 'high', time: '2026-05-07 10:30', desc: 'لم يصلني الدفع منذ أسبوعين رغم اكتمال الطلبات.' },
  { id: 'TKT-002', subject: 'منتج لم يصل', store: 'أزياء عصرية', type: 'customer', status: 'in_progress', priority: 'medium', time: '2026-05-06 15:00', desc: 'طلبت منتج قبل 10 أيام ولم يصل بعد.' },
  { id: 'TKT-003', subject: 'طلب رفع الاشتراك', store: 'بيت الجمال', type: 'vendor', status: 'closed', priority: 'low', time: '2026-05-05 09:15', desc: 'أريد الترقية إلى خطة البيزنس.' },
  { id: 'TKT-004', subject: 'بلاغ عن منتج مزور', store: 'عميل', type: 'customer', status: 'open', priority: 'high', time: '2026-05-07 08:00', desc: 'المنتج الذي وصلني مختلف عن الصورة المعروضة.' },
  { id: 'TKT-005', subject: 'استرجاع مبلغ', store: 'رياضة وحركة', type: 'customer', status: 'in_progress', priority: 'medium', time: '2026-05-04 14:20', desc: 'أريد استرجاع مبلغ الطلب الملغي.' },
];

const STATUS_CONFIG = {
  open: { label: 'مفتوح', style: 'bg-red-500/15 text-red-400 border-red-500/30', icon: AlertCircle },
  in_progress: { label: 'جاري المعالجة', style: 'bg-amber-500/15 text-amber-400 border-amber-500/30', icon: Clock },
  closed: { label: 'مغلق', style: 'bg-green-500/15 text-green-400 border-green-500/30', icon: CheckCircle },
};
const PRIORITY_CONFIG = {
  high: { label: 'عالية', style: 'text-red-400' },
  medium: { label: 'متوسطة', style: 'text-amber-400' },
  low: { label: 'منخفضة', style: 'text-green-400' },
};

export default function AdminSupport() {
  const [tickets, setTickets] = useState(mockTickets);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [reply, setReply] = useState('');

  const filtered = tickets.filter(t => filter === 'all' || t.status === filter);
  const selectedTicket = tickets.find(t => t.id === selected);

  const updateStatus = (id, status) => {
    setTickets(ts => ts.map(t => t.id === id ? { ...t, status } : t));
  };

  return (
    <div style={{ direction: 'rtl' }} className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-white">مركز الدعم</h1>
        <p className="text-white/40 text-sm">{tickets.filter(t => t.status === 'open').length} تذكرة مفتوحة</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'مفتوحة', count: tickets.filter(t => t.status === 'open').length, color: 'red' },
          { label: 'جاري المعالجة', count: tickets.filter(t => t.status === 'in_progress').length, color: 'amber' },
          { label: 'مغلقة', count: tickets.filter(t => t.status === 'closed').length, color: 'green' },
        ].map((item, i) => {
          const cls = { red: 'bg-red-500/15 border-red-500/20 text-red-400', amber: 'bg-amber-500/15 border-amber-500/20 text-amber-400', green: 'bg-green-500/15 border-green-500/20 text-green-400' };
          return (
            <div key={i} className={`${cls[item.color]} border rounded-2xl p-4 text-center`}>
              <p className="text-2xl font-black text-white">{item.count}</p>
              <p className="text-xs mt-1">{item.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Tickets list */}
        <div className="lg:col-span-2 bg-[#1E293B]/80 border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-3 border-b border-white/5 flex items-center gap-2">
            {['all', 'open', 'in_progress', 'closed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white'}`}>
                {f === 'all' ? 'الكل' : STATUS_CONFIG[f]?.label}
              </button>
            ))}
          </div>
          <div className="divide-y divide-white/5">
            {filtered.map((ticket, i) => {
              const sc = STATUS_CONFIG[ticket.status];
              const Icon = sc.icon;
              return (
                <motion.div key={ticket.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  onClick={() => setSelected(ticket.id)}
                  className={`p-4 cursor-pointer transition-colors ${selected === ticket.id ? 'bg-blue-600/10 border-e-2 border-blue-500' : 'hover:bg-white/3'}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold text-white leading-tight">{ticket.subject}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border whitespace-nowrap ${sc.style}`}>{sc.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    {ticket.type === 'vendor' ? <Store className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    <span>{ticket.store}</span>
                    <span>•</span>
                    <span className={PRIORITY_CONFIG[ticket.priority]?.style}>{PRIORITY_CONFIG[ticket.priority]?.label}</span>
                  </div>
                  <p className="text-[10px] text-white/25 mt-1">{ticket.id} • {ticket.time}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Ticket detail */}
        <div className="lg:col-span-3 bg-[#1E293B]/80 border border-white/5 rounded-2xl overflow-hidden">
          {!selectedTicket ? (
            <div className="flex flex-col items-center justify-center h-80 text-white/20">
              <MessageSquare className="w-12 h-12 mb-3" />
              <p className="text-sm">اختر تذكرة لعرض التفاصيل</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-white/5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-white">{selectedTicket.subject}</p>
                    <p className="text-xs text-white/40 mt-0.5">{selectedTicket.id} • {selectedTicket.store} • {selectedTicket.time}</p>
                  </div>
                  <select value={selectedTicket.status} onChange={e => updateStatus(selectedTicket.id, e.target.value)}
                    className="bg-[#0F172A] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none">
                    <option value="open">مفتوح</option>
                    <option value="in_progress">جاري المعالجة</option>
                    <option value="closed">مغلق</option>
                  </select>
                </div>
              </div>
              <div className="flex-1 p-4">
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center">
                      {selectedTicket.type === 'vendor' ? <Store className="w-3.5 h-3.5 text-blue-400" /> : <User className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <span className="text-xs font-medium text-white">{selectedTicket.store}</span>
                    <span className="text-[10px] text-white/30">• {selectedTicket.time}</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{selectedTicket.desc}</p>
                </div>
              </div>
              <div className="p-4 border-t border-white/5">
                <div className="flex items-end gap-3">
                  <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="اكتب ردك هنا..." rows={2}
                    className="flex-1 bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 resize-none transition-all" />
                  <button onClick={() => { toast.success('تم إرسال الرد'); setReply(''); }}
                    disabled={!reply.trim()}
                    className="h-10 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />إرسال
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}