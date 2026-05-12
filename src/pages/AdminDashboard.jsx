import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import { Store, Package, ShoppingCart, Users, DollarSign, TrendingUp, Shield, Ban, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 12000 }, { month: 'Feb', revenue: 18000 },
  { month: 'Mar', revenue: 25000 }, { month: 'Apr', revenue: 22000 },
  { month: 'May', revenue: 30000 }, { month: 'Jun', revenue: 35000 },
];

export default function AdminDashboard() {
  const { t, isRTL } = useLang();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: stores = [] } = useQuery({ queryKey: ['admin-stores'], queryFn: () => base44.entities.Store.list('-created_date', 100) });
  const { data: products = [] } = useQuery({ queryKey: ['admin-products'], queryFn: () => base44.entities.Product.list('-created_date', 100) });
  const { data: orders = [] } = useQuery({ queryKey: ['admin-orders'], queryFn: () => base44.entities.Order.list('-created_date', 100) });

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const commission = orders.reduce((s, o) => s + (o.commission_amount || 0), 0);

  const stats = [
    { label: isRTL ? 'المتاجر' : 'Stores', value: stores.length, icon: Store, color: 'text-primary bg-primary/10' },
    { label: isRTL ? 'المنتجات' : 'Products', value: products.length, icon: Package, color: 'text-accent bg-accent/10' },
    { label: isRTL ? 'الطلبات' : 'Orders', value: orders.length, icon: ShoppingCart, color: 'text-purple-500 bg-purple-500/10' },
    { label: isRTL ? 'الإيرادات' : 'Revenue', value: `${totalRevenue.toFixed(0)} ${t('sar')}`, icon: DollarSign, color: 'text-green-500 bg-green-500/10' },
  ];

  const tabs = [
    { key: 'overview', label: isRTL ? 'نظرة عامة' : 'Overview' },
    { key: 'stores', label: isRTL ? 'المتاجر' : 'Stores' },
    { key: 'orders', label: isRTL ? 'الطلبات' : 'Orders' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 lg:pb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black">{isRTL ? 'لوحة المدير' : 'Admin Dashboard'}</h1>
          <p className="text-xs text-muted-foreground">{isRTL ? 'إدارة كاملة للمنصة' : 'Full platform management'}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-4 rounded-2xl border-border/50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-black">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted/50 rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.key ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <Card className="p-6 rounded-2xl border-border/50">
          <h3 className="font-bold mb-4">{isRTL ? 'إيرادات المنصة' : 'Platform Revenue'}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {activeTab === 'stores' && (
        <div className="space-y-3">
          {stores.map(store => (
            <Card key={store.id} className="p-4 rounded-2xl border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted">
                  <img src={store.logo_url || `https://ui-avatars.com/api/?name=${store.name}&background=2563EB&color=fff`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm">{store.name}</h4>
                    {store.is_verified && <CheckCircle className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{store.owner_email}</p>
                </div>
                <Badge className={store.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}>
                  {store.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders.map(order => (
            <Card key={order.id} className="p-4 rounded-2xl border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{order.order_number || `#${order.id?.slice(-6)}`}</p>
                  <p className="text-xs text-muted-foreground">{order.store_name} • {order.customer_name}</p>
                </div>
                <div className="text-end">
                  <p className="font-bold">{order.total} {t('sar')}</p>
                  <Badge variant="secondary" className="text-[10px]">{t(order.status)}</Badge>
                </div>
              </div>
            </Card>
          ))}
          {orders.length === 0 && <div className="text-center py-12 text-muted-foreground">{isRTL ? 'لا توجد طلبات' : 'No orders'}</div>}
        </div>
      )}
    </div>
  );
}