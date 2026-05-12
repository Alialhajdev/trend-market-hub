import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import { BarChart3, Package, ShoppingCart, DollarSign, Plus, TrendingUp, Eye, Star, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'يناير', sales: 4000 }, { name: 'فبراير', sales: 3000 },
  { name: 'مارس', sales: 5000 }, { name: 'أبريل', sales: 4500 },
  { name: 'مايو', sales: 6000 }, { name: 'يونيو', sales: 5500 },
];

export default function VendorDashboard() {
  const { t, isRTL } = useLang();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: store } = useQuery({
    queryKey: ['my-store'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const stores = await base44.entities.Store.filter({ owner_email: user.email });
      return stores[0];
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ['vendor-products', store?.id],
    queryFn: () => base44.entities.Product.filter({ store_id: store.id }),
    enabled: !!store?.id,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['vendor-orders', store?.id],
    queryFn: () => base44.entities.Order.filter({ store_id: store.id }),
    enabled: !!store?.id,
  });

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  if (!store) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-2xl font-black mb-2">{isRTL ? 'لا يوجد متجر' : 'No Store Found'}</h2>
        <p className="text-muted-foreground mb-6">{isRTL ? 'أنشئ متجرك الأول وابدأ البيع' : 'Create your first store and start selling'}</p>
        <Link to="/create-store">
          <Button className="rounded-xl bg-gradient-to-r from-primary to-accent">{t('createStore')}</Button>
        </Link>
      </div>
    );
  }

  const stats = [
    { label: t('revenue'), value: `${totalRevenue.toFixed(0)} ${t('sar')}`, icon: DollarSign, color: 'text-green-500 bg-green-500/10' },
    { label: t('totalOrders'), value: orders.length, icon: ShoppingCart, color: 'text-primary bg-primary/10' },
    { label: t('totalProducts'), value: products.length, icon: Package, color: 'text-accent bg-accent/10' },
    { label: isRTL ? 'طلبات معلقة' : 'Pending', value: pendingOrders, icon: Bell, color: 'text-amber-500 bg-amber-500/10' },
  ];

  const tabs = [
    { key: 'overview', label: isRTL ? 'نظرة عامة' : 'Overview' },
    { key: 'products', label: t('products') },
    { key: 'orders', label: t('orders') },
  ];

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black">{isRTL ? 'لوحة التحكم' : 'Dashboard'}</h1>
          <p className="text-muted-foreground text-sm">{store.name}</p>
        </div>
        <Link to="/add-product">
          <Button className="rounded-xl gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <Plus className="w-4 h-4" />
            {isRTL ? 'إضافة منتج' : 'Add Product'}
          </Button>
        </Link>
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

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 rounded-2xl border-border/50">
            <h3 className="font-bold mb-4">{isRTL ? 'المبيعات الشهرية' : 'Monthly Sales'}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-6 rounded-2xl border-border/50">
            <h3 className="font-bold mb-4">{isRTL ? 'أحدث الطلبات' : 'Recent Orders'}</h3>
            {orders.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">{isRTL ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">{order.order_number || `#${order.id?.slice(-6)}`}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_name}</p>
                    </div>
                    <div className="text-end">
                      <p className="font-bold text-sm">{order.total} {t('sar')}</p>
                      <Badge className={`text-[10px] ${statusColors[order.status] || ''}`}>
                        {t(order.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-3">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">{isRTL ? 'لا توجد منتجات بعد' : 'No products yet'}</p>
              <Link to="/add-product"><Button className="mt-3 rounded-xl">{isRTL ? 'إضافة منتج' : 'Add Product'}</Button></Link>
            </div>
          ) : (
            products.map(product => (
              <Card key={product.id} className="p-4 rounded-2xl border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0">
                    <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'المخزون:' : 'Stock:'} {product.stock}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-bold text-primary">{product.price} {t('sar')}</p>
                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">{product.status}</Badge>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">{isRTL ? 'لا توجد طلبات' : 'No orders yet'}</div>
          ) : (
            orders.map(order => (
              <Card key={order.id} className="p-4 rounded-2xl border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">{order.order_number || `#${order.id?.slice(-6)}`}</p>
                    <p className="text-xs text-muted-foreground">{order.customer_name} • {order.items?.length || 0} {isRTL ? 'منتجات' : 'items'}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-bold text-primary">{order.total} {t('sar')}</p>
                    <Badge className={`text-[10px] ${statusColors[order.status] || ''}`}>{t(order.status)}</Badge>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}