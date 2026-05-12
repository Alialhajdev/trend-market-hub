import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import { Store, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const REQUIRED_STEP1 = ['name', 'name_en', 'description', 'category'];
const REQUIRED_STEP2 = ['phone', 'whatsapp', 'email', 'city'];

export default function CreateStore() {
  const { isRTL } = useLang();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '', name_en: '', description: '', category: '',
    phone: '', whatsapp: '', email: '', city: '',
    theme_color: '#2563EB',
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.Store.create({
        ...data,
        owner_email: user.email,
        slug: data.name_en?.toLowerCase().replace(/\s+/g, '-') || data.name.replace(/\s+/g, '-'),
        status: 'active',
      });
    },
    onSuccess: () => {
      toast.success(isRTL ? 'تم إنشاء متجرك بنجاح! 🎉' : 'Your store has been created! 🎉');
      navigate('/seller');
    },
  });

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: false }));
  };

  const validateStep = (s) => {
    const required = s === 1 ? REQUIRED_STEP1 : s === 2 ? REQUIRED_STEP2 : [];
    const newErrors = {};
    required.forEach(f => { if (!form[f]) newErrors[f] = true; });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) setStep(s => s + 1); };

  const errClass = (field) => errors[field] ? 'border-destructive ring-1 ring-destructive' : '';
  const requiredLabel = (label) => (
    <label className="text-sm font-medium mb-1 block">
      {label} <span className="text-destructive">*</span>
    </label>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 pb-24 lg:pb-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black">{isRTL ? 'إنشاء متجر' : 'Create Store'}</h1>
          <p className="text-muted-foreground mt-2">{isRTL ? 'أنشئ متجرك وابدأ البيع في دقائق' : 'Create your store and start selling in minutes'}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 max-w-xs mx-auto">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 rounded-full ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-2xl border border-border/50 p-6"
        >
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg mb-4">{isRTL ? 'معلومات المتجر' : 'Store Information'}</h2>
              <div>
                {requiredLabel(isRTL ? 'اسم المتجر (عربي)' : 'Store Name (Arabic)')}
                <Input value={form.name} onChange={e => update('name', e.target.value)}
                  className={`rounded-xl h-11 ${errClass('name')}`}
                  placeholder={isRTL ? 'مثال: متجر الإبداع' : 'e.g. Creative Store'} />
                {errors.name && <p className="text-destructive text-xs mt-1">{isRTL ? 'هذا الحقل مطلوب' : 'This field is required'}</p>}
              </div>
              <div>
                {requiredLabel(isRTL ? 'اسم المتجر (إنجليزي)' : 'Store Name (English)')}
                <Input value={form.name_en} onChange={e => update('name_en', e.target.value)}
                  className={`rounded-xl h-11 ${errClass('name_en')}`}
                  placeholder="e.g. Creative Store" />
                {errors.name_en && <p className="text-destructive text-xs mt-1">{isRTL ? 'هذا الحقل مطلوب' : 'This field is required'}</p>}
              </div>
              <div>
                {requiredLabel(isRTL ? 'وصف المتجر' : 'Description')}
                <Textarea value={form.description} onChange={e => update('description', e.target.value)}
                  className={`rounded-xl min-h-[100px] ${errClass('description')}`}
                  placeholder={isRTL ? 'وصف مختصر لمتجرك...' : 'Brief description of your store...'} />
                {errors.description && <p className="text-destructive text-xs mt-1">{isRTL ? 'هذا الحقل مطلوب' : 'This field is required'}</p>}
              </div>
              <div>
                {requiredLabel(isRTL ? 'التصنيف' : 'Category')}
                <Select value={form.category} onValueChange={v => update('category', v)}>
                  <SelectTrigger className={`rounded-xl h-11 ${errClass('category')}`}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">{isRTL ? 'إلكترونيات' : 'Electronics'}</SelectItem>
                    <SelectItem value="fashion">{isRTL ? 'أزياء' : 'Fashion'}</SelectItem>
                    <SelectItem value="home">{isRTL ? 'المنزل' : 'Home'}</SelectItem>
                    <SelectItem value="beauty">{isRTL ? 'تجميل' : 'Beauty'}</SelectItem>
                    <SelectItem value="sports">{isRTL ? 'رياضة' : 'Sports'}</SelectItem>
                    <SelectItem value="food">{isRTL ? 'طعام' : 'Food'}</SelectItem>
                    <SelectItem value="digital">{isRTL ? 'رقمي' : 'Digital'}</SelectItem>
                    <SelectItem value="other">{isRTL ? 'أخرى' : 'Other'}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-destructive text-xs mt-1">{isRTL ? 'هذا الحقل مطلوب' : 'This field is required'}</p>}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg mb-4">{isRTL ? 'معلومات التواصل' : 'Contact Info'}</h2>
              <div>
                {requiredLabel(isRTL ? 'البريد الإلكتروني' : 'Email')}
                <Input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  className={`rounded-xl h-11 ${errClass('email')}`}
                  placeholder="store@example.com" />
                {errors.email && <p className="text-destructive text-xs mt-1">{isRTL ? 'هذا الحقل مطلوب' : 'This field is required'}</p>}
              </div>
              <div>
                {requiredLabel(isRTL ? 'رقم الهاتف' : 'Phone')}
                <Input value={form.phone} onChange={e => update('phone', e.target.value)}
                  className={`rounded-xl h-11 ${errClass('phone')}`}
                  placeholder="+966 50 000 0000" />
                {errors.phone && <p className="text-destructive text-xs mt-1">{isRTL ? 'هذا الحقل مطلوب' : 'This field is required'}</p>}
              </div>
              <div>
                {requiredLabel(isRTL ? 'واتساب' : 'WhatsApp')}
                <Input value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)}
                  className={`rounded-xl h-11 ${errClass('whatsapp')}`}
                  placeholder="+966 50 000 0000" />
                {errors.whatsapp && <p className="text-destructive text-xs mt-1">{isRTL ? 'هذا الحقل مطلوب' : 'This field is required'}</p>}
              </div>
              <div>
                {requiredLabel(isRTL ? 'المدينة' : 'City')}
                <Input value={form.city} onChange={e => update('city', e.target.value)}
                  className={`rounded-xl h-11 ${errClass('city')}`} />
                {errors.city && <p className="text-destructive text-xs mt-1">{isRTL ? 'هذا الحقل مطلوب' : 'This field is required'}</p>}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg mb-4">{isRTL ? 'تخصيص المتجر' : 'Customize Store'}</h2>
              <div>
                <label className="text-sm font-medium mb-1 block">{isRTL ? 'لون المتجر' : 'Store Color'}</label>
                <div className="flex gap-2">
                  {['#2563EB', '#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'].map(color => (
                    <button key={color} onClick={() => update('theme_color', color)}
                      className={`w-10 h-10 rounded-xl transition-all ${form.theme_color === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                      style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 mt-4">
                <h3 className="font-bold mb-3">{isRTL ? 'ملخص المتجر' : 'Store Summary'}</h3>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p>{isRTL ? 'الاسم:' : 'Name:'} <span className="text-foreground font-medium">{form.name}</span></p>
                  <p>{isRTL ? 'التصنيف:' : 'Category:'} <span className="text-foreground font-medium">{form.category}</span></p>
                  <p>{isRTL ? 'البريد:' : 'Email:'} <span className="text-foreground font-medium">{form.email}</span></p>
                  <p>{isRTL ? 'الهاتف:' : 'Phone:'} <span className="text-foreground font-medium">{form.phone}</span></p>
                  <p>{isRTL ? 'المدينة:' : 'City:'} <span className="text-foreground font-medium">{form.city}</span></p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="rounded-xl gap-1">
                {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {isRTL ? 'السابق' : 'Previous'}
              </Button>
            ) : <div />}
            {step < 3 ? (
              <Button onClick={nextStep} className="rounded-xl gap-1 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                {isRTL ? 'التالي' : 'Next'}
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            ) : (
              <Button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending}
                className="rounded-xl gap-1 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                {createMutation.isPending ? (isRTL ? 'جاري الإنشاء...' : 'Creating...') : (isRTL ? 'إنشاء المتجر' : 'Create Store')}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}