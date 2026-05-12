import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, ArrowRight, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function AddProduct() {
  const { t, isRTL } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', name_en: '', description: '', price: '', sale_price: '', category: '', stock: '10',
    product_type: 'physical', sku: '', is_trending: false, is_featured: false,
  });

  const { data: store } = useQuery({
    queryKey: ['my-store'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const stores = await base44.entities.Store.filter({ owner_email: user.email });
      return stores[0];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Product.create({
      ...data,
      price: parseFloat(data.price),
      sale_price: data.sale_price ? parseFloat(data.sale_price) : undefined,
      stock: parseInt(data.stock),
      store_id: store.id,
      store_name: store.name,
      slug: data.name_en?.toLowerCase().replace(/\s+/g, '-') || data.name.replace(/\s+/g, '-'),
      status: 'active',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    }),
    onSuccess: () => {
      toast.success(isRTL ? 'تمت إضافة المنتج بنجاح!' : 'Product added successfully!');
      navigate('/vendor-dashboard');
    },
  });

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate(-1)}>
          {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        </Button>
        <h1 className="text-2xl font-black">{isRTL ? 'إضافة منتج' : 'Add Product'}</h1>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{isRTL ? 'اسم المنتج (عربي)' : 'Product Name (Arabic)'}</label>
            <Input value={form.name} onChange={e => update('name', e.target.value)} className="rounded-xl h-11" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{isRTL ? 'اسم المنتج (إنجليزي)' : 'Product Name (English)'}</label>
            <Input value={form.name_en} onChange={e => update('name_en', e.target.value)} className="rounded-xl h-11" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">{t('description')}</label>
          <Textarea value={form.description} onChange={e => update('description', e.target.value)} className="rounded-xl min-h-[100px]" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{t('price')} ({t('sar')})</label>
            <Input type="number" value={form.price} onChange={e => update('price', e.target.value)} className="rounded-xl h-11" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{isRTL ? 'سعر التخفيض' : 'Sale Price'}</label>
            <Input type="number" value={form.sale_price} onChange={e => update('sale_price', e.target.value)} className="rounded-xl h-11" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{isRTL ? 'المخزون' : 'Stock'}</label>
            <Input type="number" value={form.stock} onChange={e => update('stock', e.target.value)} className="rounded-xl h-11" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{isRTL ? 'التصنيف' : 'Category'}</label>
            <Select value={form.category} onValueChange={v => update('category', v)}>
              <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">{isRTL ? 'إلكترونيات' : 'Electronics'}</SelectItem>
                <SelectItem value="fashion">{isRTL ? 'أزياء' : 'Fashion'}</SelectItem>
                <SelectItem value="home">{isRTL ? 'المنزل' : 'Home'}</SelectItem>
                <SelectItem value="beauty">{isRTL ? 'تجميل' : 'Beauty'}</SelectItem>
                <SelectItem value="sports">{isRTL ? 'رياضة' : 'Sports'}</SelectItem>
                <SelectItem value="food">{isRTL ? 'طعام' : 'Food'}</SelectItem>
                <SelectItem value="digital">{isRTL ? 'رقمي' : 'Digital'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">SKU</label>
            <Input value={form.sku} onChange={e => update('sku', e.target.value)} className="rounded-xl h-11" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">{isRTL ? 'نوع المنتج' : 'Product Type'}</label>
          <Select value={form.product_type} onValueChange={v => update('product_type', v)}>
            <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="physical">{isRTL ? 'مادي' : 'Physical'}</SelectItem>
              <SelectItem value="digital">{isRTL ? 'رقمي' : 'Digital'}</SelectItem>
              <SelectItem value="bookable">{isRTL ? 'قابل للحجز' : 'Bookable'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{isRTL ? 'منتج ترند' : 'Trending Product'}</span>
          <Switch checked={form.is_trending} onCheckedChange={v => update('is_trending', v)} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{isRTL ? 'منتج مميز' : 'Featured Product'}</span>
          <Switch checked={form.is_featured} onCheckedChange={v => update('is_featured', v)} />
        </div>

        <Button onClick={() => createMutation.mutate(form)} disabled={!form.name || !form.price || createMutation.isPending}
          className="w-full h-12 rounded-xl font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90">
          {createMutation.isPending ? t('loading') : (isRTL ? 'إضافة المنتج' : 'Add Product')}
        </Button>
      </div>
    </div>
  );
}