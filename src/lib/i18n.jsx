import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  ar: {
    // Nav
    home: 'الرئيسية',
    stores: 'المتاجر',
    categories: 'التصنيفات',
    trending: 'الترند',
    deals: 'العروض',
    cart: 'السلة',
    wishlist: 'المفضلة',
    search: 'بحث عن منتجات...',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل خروج',
    myStore: 'متجري',
    dashboard: 'لوحة التحكم',
    adminPanel: 'لوحة المدير',
    createStore: 'أنشئ متجرك',
    profile: 'الملف الشخصي',
    orders: 'الطلبات',
    // Hero
    heroTitle: 'تسوّق من آلاف المتاجر',
    heroSubtitle: 'منصة التجارة الإلكترونية الأولى عربياً',
    heroDesc: 'اكتشف منتجات مميزة من أفضل البائعين، أو أنشئ متجرك وابدأ البيع اليوم',
    shopNow: 'تسوّق الآن',
    startSelling: 'ابدأ البيع',
    // Sections
    trendingProducts: 'منتجات ترند 🔥',
    bestStores: 'أفضل المتاجر',
    newStores: 'متاجر جديدة',
    byCategory: 'تسوّق حسب التصنيف',
    couponsSection: 'كوبونات وعروض',
    customerReviews: 'آراء العملاء',
    startYourStore: 'ابدأ متجرك الآن',
    startStoreDesc: 'انضم لآلاف البائعين الناجحين وابدأ رحلتك في التجارة الإلكترونية',
    liveOrders: 'طلبات مباشرة',
    // Product
    addToCart: 'أضف للسلة',
    buyNow: 'اشتري الآن',
    shareProduct: 'مشاركة',
    addToWishlist: 'أضف للمفضلة',
    similarProducts: 'منتجات مشابهة',
    reviews: 'التقييمات',
    description: 'الوصف',
    inStock: 'متوفر',
    outOfStock: 'نفد المخزون',
    sold: 'مبيع',
    views: 'مشاهدة',
    sar: 'ر.س',
    // Cart
    cartEmpty: 'السلة فارغة',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    total: 'الإجمالي',
    checkout: 'إتمام الشراء',
    continueShopping: 'متابعة التسوق',
    // Store
    storeName: 'اسم المتجر',
    storeDesc: 'وصف المتجر',
    products: 'المنتجات',
    followers: 'المتابعين',
    // Footer
    aboutUs: 'من نحن',
    contactUs: 'اتصل بنا',
    privacyPolicy: 'سياسة الخصوصية',
    terms: 'الشروط والأحكام',
    support: 'الدعم',
    allRights: 'جميع الحقوق محفوظة',
    // Status
    pending: 'قيد الانتظار',
    processing: 'قيد المعالجة',
    shipped: 'تم الشحن',
    delivered: 'مكتمل',
    cancelled: 'ملغي',
    // Dashboard
    totalSales: 'إجمالي المبيعات',
    totalOrders: 'إجمالي الطلبات',
    totalProducts: 'إجمالي المنتجات',
    revenue: 'الإيرادات',
    manageProducts: 'إدارة المنتجات',
    manageOrders: 'إدارة الطلبات',
    analytics: 'الإحصائيات',
    settings: 'الإعدادات',
    // Misc
    viewAll: 'عرض الكل',
    free: 'مجاني',
    off: 'خصم',
    new: 'جديد',
    verified: 'موثّق',
    featured: 'مميز',
    noResults: 'لا توجد نتائج',
    loading: 'جاري التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    filter: 'تصفية',
    sort: 'ترتيب',
    price: 'السعر',
    rating: 'التقييم',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    language: 'اللغة',
  },
  en: {
    home: 'Home',
    stores: 'Stores',
    categories: 'Categories',
    trending: 'Trending',
    deals: 'Deals',
    cart: 'Cart',
    wishlist: 'Wishlist',
    search: 'Search products...',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    myStore: 'My Store',
    dashboard: 'Dashboard',
    adminPanel: 'Admin Panel',
    createStore: 'Create Store',
    profile: 'Profile',
    orders: 'Orders',
    heroTitle: 'Shop from thousands of stores',
    heroSubtitle: 'The #1 Arabic E-commerce Platform',
    heroDesc: 'Discover unique products from top sellers, or create your store and start selling today',
    shopNow: 'Shop Now',
    startSelling: 'Start Selling',
    trendingProducts: 'Trending Products 🔥',
    bestStores: 'Best Stores',
    newStores: 'New Stores',
    byCategory: 'Shop by Category',
    couponsSection: 'Coupons & Deals',
    customerReviews: 'Customer Reviews',
    startYourStore: 'Start Your Store Now',
    startStoreDesc: 'Join thousands of successful sellers and start your e-commerce journey',
    liveOrders: 'Live Orders',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    shareProduct: 'Share',
    addToWishlist: 'Add to Wishlist',
    similarProducts: 'Similar Products',
    reviews: 'Reviews',
    description: 'Description',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    sold: 'Sold',
    views: 'Views',
    sar: 'SAR',
    cartEmpty: 'Cart is empty',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    total: 'Total',
    checkout: 'Checkout',
    continueShopping: 'Continue Shopping',
    storeName: 'Store Name',
    storeDesc: 'Store Description',
    products: 'Products',
    followers: 'Followers',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    support: 'Support',
    allRights: 'All rights reserved',
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    totalSales: 'Total Sales',
    totalOrders: 'Total Orders',
    totalProducts: 'Total Products',
    revenue: 'Revenue',
    manageProducts: 'Manage Products',
    manageOrders: 'Manage Orders',
    analytics: 'Analytics',
    settings: 'Settings',
    viewAll: 'View All',
    free: 'Free',
    off: 'OFF',
    new: 'New',
    verified: 'Verified',
    featured: 'Featured',
    noResults: 'No results found',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    filter: 'Filter',
    sort: 'Sort',
    price: 'Price',
    rating: 'Rating',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
  }
};

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('tmh_lang') || 'ar');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('tmh_dark') === 'true');

  useEffect(() => {
    localStorage.setItem('tmh_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('tmh_dark', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;
  const isRTL = lang === 'ar';
  const toggleLang = () => setLang(l => l === 'ar' ? 'en' : 'ar');
  const toggleDark = () => setDarkMode(d => !d);

  return (
    <LangContext.Provider value={{ lang, t, isRTL, toggleLang, darkMode, toggleDark }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);