import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import {
  Store, Package, ShoppingCart, Users, DollarSign, TrendingUp,
  CheckCircle, Ban, Clock, ArrowUpRight, Activity, Star, Eye
} from 'lucide-react';
import StatCard from './components/StatCard';
import AdminRevenueChart from './components/AdminRevenueChart';
import AdminOrdersChart from './components/AdminOrdersChart';
import { motion } from 'framer-motion';

const statusColors = {
  active: 'bg-green-500/15 text-green-400 border-green-500/20',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  suspended: 'bg-red-500/15 text-red-400 border-red-500/20',
  processing: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  shipped: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  delivered: 'bg-green-500/15 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
};
const statusLabels = {
  active: 'نشط', pending: 'معلق', suspended: 'موقوف',
  processing: 'يعالج', shipped: 'مشحون', delivered: 'مكتمل', cancelled: 'ملغي',
};

export default function AdminHome() {
  const { data: stores = [] } = useQuery({ queryKey: ['admin-stores'], queryFn: () => base44.entities.Store.list('-created_date', 100) });
  const { data: products = [] } = useQuery({ queryKey: ['admin-products'], queryFn: () => base44.entities.Product.list('-created_date', 100) });
  const { data: orders = [] } = useQuery({ queryKey: ['admin-orders'], queryFn: () => base44.entities.Order.list('-created_date', 50) });

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const commission = orders.reduce((s, o) => s + (o.commission_amount || o.total * 0.1 || 0), 0);
  const activeStores = stores.filter(s => s.status === 'active').length;
  const pendingStores = stores.filter(s => s.status === 'pending').length;

  const stats = [
    { icon: DollarSign, label: 'إجمالي الإيرادات', value: `${(totalRevenue / 1000).toFixed(1)}K`, sub: 'ريال سعودي', change: 18, color: 'green' },
    { icon: TrendingUp, label: 'أرباح المنصة', value: `${(commission / 1000).toFixed(1)}K`, sub: 'عمولات وإشتراكات', change: 12, color: 'blue' },
    { icon: ShoppingCart, label: 'الطلبات', value: orders.length, sub: `${orders.filter(o=>o.status==='pending').length} معلق`, change: 8, color: 'cyan' },
    { icon: Store, label: 'المتاجر النشطة', value: activeStores, sub: `${pendingStores} تنتظر موافقة`, change: 5, color: 'purple' },
    { icon: Package, label: 'المنتجات', value: products.length, sub: `${products.filter(p=>p.is_featured).length} مميزة`, change: 22, color: 'amber' },
    { icon: Users, label: 'إجمالي المتاجر', value: stores.length, sub: `${stores.filter(s=>s.is_verified).length} موثّقة`, change: 15, color: 'rose' },
  ];

  const recentOrders = orders.slice(0, 8);
  const topStores = [...stores].sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0)).slice(0, 5);
  const topProducts = [...products].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0)).slice(0, 5);

  return (
    <div style={{ direction: 'rtl' }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">لوحة التحكم الرئيسية</h1>
          <p className="text-white/40 text-sm mt-0.5">مرحباً بك في مركز إدارة منصة Trend Market Hub</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">مباشر</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} delay={i * 0.07} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AdminRevenueChart />
        </div>
        <AdminOrdersChart orders={orders} />
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-[#1E293B]/80 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">أحدث الطلبات</h3>
            <Link to="/admin/orders" className="text-blue-400 text-xs hover:text-blue-300 flex items-center gap-1">
              عرض الكل <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentOrders.length === 0 && (
              <p className="text-white/30 text-sm text-center py-8">لا توجد طلبات حتى الآن</p>
            )}
            {recentOrders.map((order, i) => (
              <motion.div key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{order.order_number || `#${order.id?.slice(-6)}`}</p>
                  <p className="text-xs text-white/40 truncate">{order.store_name} • {order.customer_name || order.customer_email}</p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-bold text-white">{order.total?.toFixed(0)} ر.س</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusColors[order.status] || 'bg-white/10 text-white/50'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Stores & Products */}
        <div className="space-y-4">
          <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">أفضل المتاجر</h3>
              <Link to="/admin/stores" className="text-blue-400 text-xs hover:text-blue-300">عرض الكل</Link>
            </div>
            <div className="space-y-3">
              {topStores.length === 0 && <p className="text-white/30 text-xs text-center py-4">لا توجد بيانات</p>}
              {topStores.map((store, i) => (
                <div key={store.id} className="flex items-center gap-3">
                  <span className="text-white/20 text-xs w-4 font-black">{i + 1}</span>
                  <img src={store.logo_url || `https://ui-avatars.com/api/?name=${store.name}&background=2563EB&color=fff&size=40`}
                    className="w-8 h-8 rounded-lg object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{store.name}</p>
                    <p className="text-[10px] text-white/30">{store.total_sales || 0} ر.س</p>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${statusColors[store.status] || 'bg-white/5 text-white/30'}`}>
                    {statusLabels[store.status] || store.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1E293B]/80 border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">أعلى المبيعات</h3>
              <Link to="/admin/products" className="text-blue-400 text-xs hover:text-blue-300">عرض الكل</Link>
            </div>
            <div className="space-y-3">
              {topProducts.length === 0 && <p className="text-white/30 text-xs text-center py-4">لا توجد بيانات</p>}
              {topProducts.map((product, i) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="text-white/20 text-xs w-4 font-black">{i + 1}</span>
                  <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80'}
                    className="w-8 h-8 rounded-lg object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{product.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] text-white/30">{product.rating || 0}</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-white">{product.sales_count || 0}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}