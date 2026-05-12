import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { LangProvider } from '@/lib/i18n';
import MainLayout from '@/components/layout/MainLayout';

// Pages
import Home from '@/pages/Home';
import Stores from '@/pages/Stores';
import StoreDetail from '@/pages/StoreDetail';
import Categories from '@/pages/Categories';
import Trending from '@/pages/Trending';
import Deals from '@/pages/Deals';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Wishlist from '@/pages/Wishlist';
import CreateStore from '@/pages/CreateStore';
import AddProduct from '@/pages/AddProduct';
import VendorDashboard from '@/pages/VendorDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminHome from '@/pages/admin/AdminHome';
import AdminStores from '@/pages/admin/AdminStores';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminVendors from '@/pages/admin/AdminVendors';
import AdminFinance from '@/pages/admin/AdminFinance';
import AdminSubscriptions from '@/pages/admin/AdminSubscriptions';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminSupport from '@/pages/admin/AdminSupport';
import AdminSecurity from '@/pages/admin/AdminSecurity';
import AdminSettings from '@/pages/admin/AdminSettings';
import Landing from '@/pages/Landing';
import SellerLayout from '@/pages/seller/SellerLayout';
import SellerHome from '@/pages/seller/SellerHome';
import SellerStore from '@/pages/seller/SellerStore';
import SellerProducts from '@/pages/seller/SellerProducts';
import SellerOrders from '@/pages/seller/SellerOrders';
import SellerInventory from '@/pages/seller/SellerInventory';
import SellerCustomers from '@/pages/seller/SellerCustomers';
import SellerFinance from '@/pages/seller/SellerFinance';
import SellerMarketing from '@/pages/seller/SellerMarketing';
import SellerAnalytics from '@/pages/seller/SellerAnalytics';
import SellerNotifications from '@/pages/seller/SellerNotifications';
import SellerSettings from '@/pages/seller/SellerSettings';
import SellerSupport from '@/pages/seller/SellerSupport';


const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-lg">TM</span>
          </div>
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/store/:id" element={<StoreDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/create-store" element={<CreateStore />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/admin-old" element={<AdminDashboard />} />
        <Route path="/landing" element={<Landing />} />

      </Route>
      {/* Seller Dashboard */}
      <Route path="/seller" element={<SellerLayout />}>
        <Route index element={<SellerHome />} />
        <Route path="store" element={<SellerStore />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="inventory" element={<SellerInventory />} />
        <Route path="customers" element={<SellerCustomers />} />
        <Route path="finance" element={<SellerFinance />} />
        <Route path="marketing" element={<SellerMarketing />} />
        <Route path="analytics" element={<SellerAnalytics />} />
        <Route path="notifications" element={<SellerNotifications />} />
        <Route path="settings" element={<SellerSettings />} />
        <Route path="support" element={<SellerSupport />} />
      </Route>

      {/* Super Admin Panel */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="stores" element={<AdminStores />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="vendors" element={<AdminVendors />} />
        <Route path="finance" element={<AdminFinance />} />
        <Route path="subscriptions" element={<AdminSubscriptions />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="security" element={<AdminSecurity />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <LangProvider>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </LangProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App