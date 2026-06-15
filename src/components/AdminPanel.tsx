import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Product, Category, Order } from '../types';
import { 
  Users, ShoppingBag, TrendingUp, AlertTriangle, Package, Check, ClipboardList,
  Edit2, Trash2, Plus, ArrowUpRight, Search, FileText, CheckCircle2, RefreshCw, XCircle,
  Lock, Mail, ShieldAlert, LogIn, LogOut, Loader2
} from 'lucide-react';

const tabVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } }
};

export default function AdminPanel() {
  const { 
    isAdmin, 
    products, 
    categories, 
    orders, 
    allUsers,
    adminAddProduct,
    adminEditProduct,
    adminDeleteProduct,
    adminAddCategory,
    adminDeleteCategory,
    adminUpdateOrderStatus,
    adminDeleteOrder,
    user,
    authLoading,
    loginWithEmail,
    loginWithGoogle,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'inventory' | 'categories' | 'users'>('analytics');
  
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => prev?.text === text ? null : prev);
    }, 4000);
  };
  
  // Admin Login specific states
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSubmitting, setAdminSubmitting] = useState(false);

  const handleAdminEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      setAdminError('Please provide both administrative email and password.');
      return;
    }
    setAdminSubmitting(true);
    setAdminError(null);
    try {
      await loginWithEmail(adminEmail, adminPassword);
    } catch (err: any) {
      console.error('Admin password login failed', err);
      setAdminError(err.message || 'Incorrect credentials. Please verify your admin credentials.');
    } finally {
      setAdminSubmitting(false);
    }
  };

  const handleAdminGoogleLogin = async () => {
    setAdminSubmitting(true);
    setAdminError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Admin Google sign in error', err);
      if (err.code === 'auth/popup-closed-by-user' || err.message?.includes('popup-closed-by-user')) {
        setAdminError("Google popup window was closed. Inside sandboxed previews, popup blockers can interrupt. Please try using Admin Email/Password directly or click 'Open in new window' to run outside the iframe sandbox.");
      } else {
        setAdminError(err.message || 'Google Auth is cancelled or conflict exists.');
      }
    } finally {
      setAdminSubmitting(false);
    }
  };
  
  // Search and Filters
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Product forms
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    description: '',
    price: 0,
    salePrice: '' as string | number,
    category: '',
    imageUrl: '',
    stockQuantity: 0,
    sku: '',
    status: 'active' as 'active' | 'draft' | 'out_of_stock'
  });

  // Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImg, setNewCatImg] = useState('');

  // Quick Inline updates
  const [inlinePriceId, setInlinePriceId] = useState<string | null>(null);
  const [inlinePriceVal, setInlinePriceVal] = useState<number>(0);
  const [inlineStockId, setInlineStockId] = useState<string | null>(null);
  const [inlineStockVal, setInlineStockVal] = useState<number>(0);

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center font-sans">
        <RefreshCw className="h-10 w-10 text-brand-900 animate-spin mb-4" />
        <p className="text-sm font-medium text-brand-600">Verifying security credentials...</p>
      </div>
    );
  }

  if (!isAdmin) {
    if (!user) {
      return (
        <div className="max-w-md mx-auto px-4 py-16 font-sans">
          <div className="bg-white border border-brand-100 rounded-3xl p-8 shadow-xl flex flex-col gap-6">
            
            {/* Header Lock Icon area */}
            <div className="text-center">
              <div className="h-14 w-14 bg-brand-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-brand-900/10">
                <Lock className="h-6 w-6" id="admin_login_lock_icon" />
              </div>
              <h2 className="text-2xl font-bold text-brand-950 tracking-tight" id="admin_login_title">Admin Portal</h2>
              <p className="text-brand-500 text-xs mt-1.5 leading-relaxed">
                Provide certified credentials to enter the Smart Kitchen management system.
              </p>
            </div>

            {adminError && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600 flex items-start gap-2.5 leading-relaxed" id="admin_error_box">
                <ShieldAlert className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>{adminError}</span>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleAdminEmailLogin} className="flex flex-col gap-4 text-xs" id="admin_login_form">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-brand-800" htmlFor="admin_email_input">Security Email</label>
                <div className="relative">
                  <input
                    id="admin_email_input"
                    type="email"
                    required
                    placeholder="admin@smartkitchen.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    disabled={adminSubmitting}
                    className="w-full bg-[#fdfdfb] border border-brand-150 rounded-xl py-3 pl-9 pr-4 focus:outline-hidden focus:border-brand-600 focus:bg-white text-brand-950 font-sans transition-all text-xs"
                  />
                  <Mail className="absolute left-3.2 top-3.5 h-4 w-4 text-brand-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-brand-800" htmlFor="admin_password_input">Security Password</label>
                <div className="relative">
                  <input
                    id="admin_password_input"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    disabled={adminSubmitting}
                    className="w-full bg-[#fdfdfb] border border-brand-150 rounded-xl py-3 pl-9 pr-4 focus:outline-hidden focus:border-brand-600 focus:bg-white text-brand-950 font-sans transition-all text-xs"
                  />
                  <Lock className="absolute left-3.2 top-3.5 h-4 w-4 text-brand-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={adminSubmitting}
                id="admin_login_submit_btn"
                className="bg-brand-900 hover:bg-brand-850 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg hover:shadow-brand-900/5 cursor-pointer flex items-center justify-center gap-2 transition-all text-xs border border-brand-950/20 disabled:opacity-75"
              >
                {adminSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>Authenticate Admin</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative flex items-center justify-center my-1 select-none">
              <div className="absolute inset-x-0 border-t border-brand-100"></div>
              <span className="relative bg-white px-3 text-[10px] uppercase font-bold tracking-wider text-brand-400">or use single sign-on</span>
            </div>

            {/* Google Authentication Option */}
            <button
              type="button"
              onClick={handleAdminGoogleLogin}
              disabled={adminSubmitting}
              id="admin_login_google_btn"
              className="bg-[#fcfcfa] hover:bg-brand-50 border border-brand-200 text-brand-800 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer transition-all text-xs disabled:opacity-50"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.81-2.43-.81-4.19-.03-5.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Verify with Google Admin</span>
            </button>

            <div className="bg-brand-50/70 border border-brand-100 rounded-2xl p-4 text-[11px] leading-relaxed text-brand-600">
              <span className="font-bold text-brand-900 block mb-0.5 font-sans">ℹ️ Admin Setup Guide</span>
              To claim full administrative control, please sign in with the whitelisted master account email: <strong className="font-mono text-brand-950 font-bold">ahemadkh832@gmail.com</strong>
            </div>

          </div>
        </div>
      );
    } else {
      // User is logged in but has standard customer privilege
      return (
        <div className="max-w-md mx-auto px-4 py-20 font-sans">
          <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-8 shadow-md text-center flex flex-col gap-5">
            <div className="h-14 w-14 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <ShieldAlert className="h-6 w-6" id="admin_clearance_unauth_icon" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-950">Awaiting clearance</h2>
              <p className="text-brand-500 text-xs mt-1 font-mono">Current Account: {user.email}</p>
            </div>
            
            <p className="text-xs text-brand-700 leading-relaxed max-w-sm mx-auto">
              Your registered user profile does not hold administrative clearance. To access the management console, please logout and switch to an authorized administrative email (such as <strong className="font-mono">ahemadkh832@gmail.com</strong>).
            </p>

            <button
              onClick={() => logout()}
              id="admin_unauth_signout_btn"
              className="bg-brand-900 hover:bg-brand-850 text-white font-bold py-3 px-6 rounded-xl cursor-pointer flex items-center justify-center gap-2 text-xs shadow-sm transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out & Switch Account</span>
            </button>
          </div>
        </div>
      );
    }
  }

  // Analytics helper arithmetic
  const totalSales = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const depletedProducts = products.filter(p => p.stockQuantity <= 5);

  const totalOrdersCount = orders.length;
  const confirmedOrdersCount = orders.filter(o => o.status === 'confirmed').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'cancelled').length;

  const salesByCategory = products.reduce((acc, p) => {
    const productOrders = orders.filter(o => o.status !== 'cancelled');
    let categorySalesAmount = 0;
    productOrders.forEach(o => {
      o.items.forEach(item => {
        if (item.productId === p.productId) {
          categorySalesAmount += item.price * item.quantity;
        }
      });
    });
    acc[p.category] = (acc[p.category] || 0) + categorySalesAmount;
    return acc;
  }, {} as Record<string, number>);

  // Handle Product Form Submit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.category || !prodForm.sku) {
      triggerToast('Missing required fields', 'error');
      return;
    }

    const payload = {
      name: prodForm.name,
      description: prodForm.description,
      price: Number(prodForm.price),
      salePrice: prodForm.salePrice !== '' ? Number(prodForm.salePrice) : undefined,
      category: prodForm.category,
      images: [prodForm.imageUrl || 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600'],
      stockQuantity: Number(prodForm.stockQuantity),
      sku: prodForm.sku,
      status: prodForm.stockQuantity === 0 ? ('out_of_stock' as const) : prodForm.status
    };

    try {
      if (editingProduct) {
        await adminEditProduct(editingProduct.productId, {
          ...payload,
          salePrice: prodForm.salePrice !== '' ? Number(prodForm.salePrice) : undefined
        });
        triggerToast('Product details updated successfully!', 'success');
      } else {
        await adminAddProduct(payload);
        triggerToast('New product added to catalog successfully!', 'success');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      resetProductForm();
    } catch (err) {
      triggerToast('Error updating product details.', 'error');
    }
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setProdForm({
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice ?? '',
      category: product.category,
      imageUrl: product.images[0] || '',
      stockQuantity: product.stockQuantity,
      sku: product.sku,
      status: product.status
    });
    setShowProductModal(true);
  };

  const handleAddProductClick = () => {
    setEditingProduct(null);
    resetProductForm();
    setShowProductModal(true);
  };

  const resetProductForm = () => {
    setProdForm({
      name: '',
      description: '',
      price: 0,
      salePrice: '',
      category: categories[0]?.name || 'Smart Appliances',
      imageUrl: '',
      stockQuantity: 10,
      sku: 'KIT-SKU-' + Math.floor(Math.random() * 100000),
      status: 'active'
    });
  };

  const handleCreateCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await adminAddCategory({
        name: newCatName,
        slug,
        description: newCatDesc,
        imageUrl: newCatImg || 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600'
      });
      triggerToast('Category created successfully!', 'success');
      setNewCatName('');
      setNewCatDesc('');
      setNewCatImg('');
    } catch {
      triggerToast('Category creation failed.', 'error');
    }
  };

  // Inline pricing submit
  const submitInlinePrice = async (prodId: string) => {
    try {
      await adminEditProduct(prodId, { price: inlinePriceVal });
      triggerToast('Price updated successfully!', 'success');
      setInlinePriceId(null);
    } catch {
      triggerToast('Error saving price', 'error');
    }
  };

  // Inline stock submit
  const submitInlineStock = async (prodId: string) => {
    try {
      const status = inlineStockVal === 0 ? 'out_of_stock' : 'active';
      await adminEditProduct(prodId, { stockQuantity: inlineStockVal, status });
      triggerToast('Stock quantity saved successfully!', 'success');
      setInlineStockId(null);
    } catch {
      triggerToast('Error saving stock', 'error');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      {/* Floating Custom Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-950 text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 border border-brand-800 text-xs sm:text-sm animate-fade-in">
          <span className={`h-2.5 w-2.5 rounded-full ${toastMessage.type === 'success' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400 animate-pulse'}`}></span>
          <span className="font-sans font-medium text-white">{toastMessage.text}</span>
        </div>
      )}
      
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-brand-100 pb-6">
        <div>
          <h2 className="text-3xl font-bold font-sans tracking-tight text-brand-950 flex items-center gap-2">
            Admin Management Console
          </h2>
          <p className="text-brand-500 text-sm mt-0.5">
            Monitor real-time inventories, customize product listings, manage customer orders, and view sales metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="text-xs font-mono font-bold text-brand-500 uppercase tracking-wider">
            Live Connected Mode
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Admin Sidebar Navigation */}
        <div className="lg:col-span-3 bg-white border border-brand-100 rounded-3xl p-6 shadow-xs flex flex-col gap-6" id="admin_sidebar">
          {/* Logo & Section Title */}
          <div className="flex items-center gap-3 border-b border-brand-55 pb-5">
            <div className="h-10 w-10 bg-brand-900 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-brand-950 text-sm tracking-tight leading-tight">Kitchen Store</h3>
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase">Management</span>
            </div>
          </div>

          {/* Logged in Admin Summary */}
          <div className="bg-brand-50/50 border border-brand-100/60 rounded-2xl p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-brand-900 text-white flex items-center justify-center font-black text-xs border border-brand-200">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-brand-900 truncate">{user?.email?.split('@')[0] || 'Administrator'}</p>
              <span className="text-[9px] bg-amber-500/10 text-amber-600 font-bold tracking-wide px-1.5 py-0.2 rounded-full uppercase">Apex Clearance</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1" id="admin_sidebar_nav_links">
            {/* Dashboard / Analytics */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-normal transition-all duration-200 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-brand-900 text-white shadow-md shadow-brand-900/10 scale-[1.01]'
                  : 'text-brand-650 hover:bg-brand-50 hover:text-brand-900'
              }`}
            >
              <TrendingUp className="h-4 w-4 shrink-0" />
              <span>Overview Statistics</span>
            </button>

            {/* Product Catalog */}
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-normal transition-all duration-200 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-brand-900 text-white shadow-md shadow-brand-900/10 scale-[1.01]'
                  : 'text-brand-650 hover:bg-brand-50 hover:text-brand-900'
              }`}
            >
              <ShoppingBag className="h-4 w-4 shrink-0" />
              <span>Product Catalog ({products.length})</span>
            </button>

            {/* Inventory Levels */}
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-normal transition-all duration-200 cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-brand-900 text-white shadow-md shadow-brand-900/10 scale-[1.01]'
                  : 'text-brand-650 hover:bg-brand-50 hover:text-brand-900'
              }`}
            >
              <Package className="h-4 w-4 shrink-0" />
              <span>Inventory Levels ({depletedProducts.length > 0 ? `${depletedProducts.length} Alert` : 'Healthy'})</span>
            </button>

            {/* Orders Tracker */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-normal transition-all duration-200 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-brand-900 text-white shadow-md shadow-brand-900/10 scale-[1.01]'
                  : 'text-brand-650 hover:bg-brand-50 hover:text-brand-900'
              }`}
            >
              <ClipboardList className="h-4 w-4 shrink-0" />
              <span>Order Control ({orders.length})</span>
            </button>

            {/* Categories */}
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-normal transition-all duration-200 cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-brand-900 text-white shadow-md shadow-brand-900/10 scale-[1.01]'
                  : 'text-brand-650 hover:bg-brand-50 hover:text-brand-900'
              }`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Categories Manager</span>
            </button>

            {/* Users / Members Base */}
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-normal transition-all duration-200 cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-brand-900 text-white shadow-md shadow-brand-900/10 scale-[1.01]'
                  : 'text-brand-650 hover:bg-brand-50 hover:text-brand-900'
              }`}
            >
              <Users className="h-4 w-4 shrink-0" />
              <span>Member Base ({allUsers.length})</span>
            </button>
          </nav>

          {/* Log out section button */}
          <div className="border-t border-brand-50 pt-5 mt-auto">
            <button
              onClick={() => logout()}
              id="admin_sidebar_logout_btn"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-650 hover:bg-red-50 hover:text-red-700 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Exit Console</span>
            </button>
          </div>
        </div>

        {/* Workbench Panel Area */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {/* Main Tab Panels */}
          <AnimatePresence mode="wait">
        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            className="flex flex-col gap-8"
          >
            {/* Bento-grid KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-brand-100 p-6 rounded-2.5xl flex items-center justify-between shadow-xs">
                <div>
                  <p className="text-xs text-brand-400 uppercase tracking-widest font-mono font-bold">Total Orders</p>
                  <h3 className="text-3xl font-bold font-mono text-brand-950 mt-1">{totalOrdersCount}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-brand-500 mt-2 font-sans">
                     <ShoppingBag className="h-3.5 w-3.5 text-brand-500" />
                     <span>All historical transactions</span>
                  </div>
                </div>
                <div className="bg-brand-50 text-brand-600 p-4 rounded-2xl"><ShoppingBag className="h-7 w-7" /></div>
              </div>

              <div className="bg-white border border-brand-100 p-6 rounded-2.5xl flex items-center justify-between shadow-xs">
                <div>
                  <p className="text-xs text-brand-400 uppercase tracking-widest font-mono font-bold">Confirmed Orders</p>
                  <h3 className="text-3xl font-bold font-mono text-brand-950 mt-1">{confirmedOrdersCount}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-indigo-550 mt-2 font-sans">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Approved & ready for prep</span>
                  </div>
                </div>
                <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl"><CheckCircle2 className="h-7 w-7" /></div>
              </div>

              <div className="bg-white border border-brand-100 p-6 rounded-2.5xl flex items-center justify-between shadow-xs">
                <div>
                  <p className="text-xs text-brand-400 uppercase tracking-widest font-mono font-bold">Delivered Orders</p>
                  <h3 className="text-3xl font-bold font-mono text-brand-950 mt-1">{deliveredOrdersCount}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-550 mt-2 font-sans">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Completed handovers</span>
                  </div>
                </div>
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl"><Check className="h-7 w-7" /></div>
              </div>

              <div className="bg-red-50/70 border border-red-100 p-6 rounded-2.5xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-500 uppercase tracking-widest font-mono font-bold">Cancelled Orders</p>
                  <h3 className="text-3xl font-bold font-mono text-red-950 mt-1">{cancelledOrdersCount}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-red-700 mt-2 font-sans">
                     <XCircle className="h-3.5 w-3.5 text-red-500" />
                     <span>Voided transactions</span>
                  </div>
                </div>
                <div className="bg-red-100 text-red-600 p-4 rounded-2xl"><XCircle className="h-7 w-7" /></div>
              </div>
            </div>

            {/* Secondary stats ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-brand-50/30 border border-brand-100/50 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-brand-400 uppercase tracking-widest font-mono font-bold">Total Sales Volume</p>
                  <h4 className="text-lg font-bold font-mono text-brand-950 mt-0.5">${totalSales.toFixed(2)}</h4>
                </div>
                <TrendingUp className="h-5 w-5 text-brand-400" />
              </div>
              <div className="bg-brand-50/30 border border-brand-100/50 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-brand-400 uppercase tracking-widest font-mono font-bold">Active Demands</p>
                   <h4 className="text-lg font-bold font-mono text-brand-950 mt-0.5">{activeOrdersCount}</h4>
                </div>
                <ClipboardList className="h-5 w-5 text-brand-400" />
              </div>
              <div className="bg-amber-50/40 border border-amber-100/50 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-amber-600 uppercase tracking-widest font-mono font-bold">Stock Depletions</p>
                  <h4 className="text-lg font-bold font-mono text-amber-950 mt-0.5">{depletedProducts.length}</h4>
                </div>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
            </div>

            {/* SVG Custom Sales Metric Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Sales Volume by Category */}
              <div className="bg-white border border-brand-100 p-6 rounded-3xl shadow-xs">
                <h4 className="font-bold text-brand-950 text-base mb-6 font-sans">Sales Yield by Category ($)</h4>
                
                <div className="flex flex-col gap-4 mt-6">
                  {categories.map((cat, idx) => {
                    const saleAmount = salesByCategory[cat.name] || 0;
                    const maxAmount = Math.max(...Object.keys(salesByCategory).map(k => salesByCategory[k]), 100);
                    const percentageWidth = Math.min(100, Math.max(8, (saleAmount / maxAmount) * 100));

                    return (
                      <div key={idx} className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-brand-800">{cat.name}</span>
                          <span className="font-mono text-brand-900">${saleAmount.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-brand-50 h-3 rounded-full overflow-hidden">
                          <div 
                            className="bg-brand-600 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${percentageWidth}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(salesByCategory).length === 0 && (
                    <p className="text-center text-xs text-brand-400 py-10">No checkout transactions cleared yet.</p>
                  )}
                </div>
              </div>

              {/* Live Order list Overview */}
              <div className="bg-white border border-brand-100 p-6 rounded-3xl shadow-xs flex flex-col">
                <h4 className="font-bold text-brand-950 text-base mb-4 font-sans">Recent Order Submissions</h4>
                <div className="flex flex-col gap-3 overflow-y-auto max-h-72 pr-1">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.orderId} className="flex justify-between items-center border-b border-brand-50 pb-3 last:border-0 text-xs">
                      <div>
                        <p className="font-bold text-brand-900 truncate max-w-[180px]">{order.customerName}</p>
                        <p className="font-mono text-[10px] text-brand-400 mt-0.5 uppercase">{order.orderId} • {order.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold font-mono text-brand-950">${order.totalAmount.toFixed(2)}</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold capitalize mt-1 ${
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                          order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-center text-xs text-brand-400 py-10 m-auto">No orders submitted by userbase.</p>
                  )}
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div
            key="products"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            className="bg-white border border-brand-100 rounded-3xl overflow-hidden shadow-xs"
          >
            
            {/* Header query controls */}
            <div className="p-6 border-b border-brand-100 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
              
              <div className="flex gap-3 flex-1 flex-wrap">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-sm min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search catalog by name/SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-brand-50 border border-brand-100 rounded-xl py-2 pl-9 pr-4 text-xs font-sans text-brand-950 placeholder-brand-400 focus:outline-hidden focus:border-brand-500"
                  />
                  <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-brand-400" />
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-2 text-xs font-sans text-brand-800 focus:outline-hidden"
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddProductClick}
                className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl py-2 px-5 text-xs font-bold font-sans flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-xs"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-brand-50/50 border-b border-brand-100 uppercase font-mono tracking-wider text-brand-400 font-bold text-[10px]">
                    <th className="py-4 px-6">Product Details</th>
                    <th className="py-4 px-6">SKU Code</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Direct Cost</th>
                    <th className="py-4 px-6 text-center">In Stock</th>
                    <th className="py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {filteredProducts.map((p) => (
                    <tr key={p.productId} className="hover:bg-brand-50/35 transition-colors">
                      
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img 
                          src={p.images[0]} 
                          alt="" 
                          className="h-11 w-11 object-cover rounded-md border border-brand-150"
                          referrerPolicy="no-referrer"
                        />
                        <div className="max-w-[200px]">
                          <p className="font-bold text-brand-950 truncate">{p.name}</p>
                          <span className={`inline-block px-1.5 py-0.2 text-[9px] rounded font-medium mt-1 ${p.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            {p.status}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono font-medium text-brand-500">{p.sku}</td>
                      <td className="py-4 px-6 text-brand-600">{p.category}</td>

                      {/* Inline Price edit column */}
                      <td className="py-4 px-6 font-mono text-brand-950">
                        {inlinePriceId === p.productId ? (
                          <div className="flex items-center gap-1">
                            <span className="text-brand-400">$</span>
                            <input
                              type="number"
                              value={inlinePriceVal}
                              step="0.01"
                              onChange={(e) => setInlinePriceVal(Number(e.target.value))}
                              className="bg-brand-50 border border-brand-200 rounded px-1.5 py-0.5 w-18 font-mono focus:outline-hidden"
                            />
                            <button 
                              onClick={() => submitInlinePrice(p.productId)}
                              className="p-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded cursor-pointer"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 group">
                            <span>Rs. {p.price.toLocaleString()}</span>
                            {p.salePrice && <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1 rounded">On Sale</span>}
                            <button
                              onClick={() => { setInlinePriceId(p.productId); setInlinePriceVal(p.price); }}
                              className="hidden group-hover:block p-1 text-brand-400 hover:text-brand-900 cursor-pointer"
                              title="Quick Edit Price"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Inline Stock edit column */}
                      <td className="py-4 px-6 text-center font-mono">
                        {inlineStockId === p.productId ? (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              value={inlineStockVal}
                              onChange={(e) => setInlineStockVal(Number(e.target.value))}
                              className="bg-brand-50 border border-brand-200 rounded px-1.5 py-0.5 w-14 text-center font-mono focus:outline-hidden"
                            />
                            <button 
                              onClick={() => submitInlineStock(p.productId)}
                              className="p-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded cursor-pointer"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 group">
                            <span className={`font-bold ${p.stockQuantity === 0 ? 'text-red-500' : p.stockQuantity <= 5 ? 'text-amber-500' : 'text-brand-700'}`}>
                              {p.stockQuantity}
                            </span>
                            <button
                              onClick={() => { setInlineStockId(p.productId); setInlineStockVal(p.stockQuantity); }}
                              className="hidden group-hover:block p-1 text-brand-400 hover:text-brand-900 cursor-pointer"
                              title="Quick Edit Stock"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProductClick(p)}
                            className="p-2 text-brand-600 hover:text-brand-950 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
                            title="Full Edit info"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => { if (confirm('Are you sure you want to delete this product?')) adminDeleteProduct(p.productId); }}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-brand-400">
                        No kitchen items matches current search filter queries.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <motion.div
            key="inventory"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            className="bg-white border border-brand-100 rounded-3xl overflow-hidden shadow-xs font-sans animate-fade-in"
          >
            <div className="p-6 border-b border-brand-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="font-bold text-brand-950 text-base">Comprehensive Inventory Levels</h4>
                <p className="text-xs text-brand-400 mt-0.5">Rapid replenishment controls, stock levels monitoring, and direct bulk updates.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-block h-2 w-2 rounded-full ${depletedProducts.length > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                <span className="text-[10px] font-mono font-bold uppercase text-brand-500">
                  {depletedProducts.length > 0 ? `${depletedProducts.length} restock alerts` : 'Stock Levels Healthy'}
                </span>
              </div>
            </div>

            {/* Inventory KPI Grid */}
            <div className="p-6 bg-brand-50/40 border-b border-brand-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-brand-100/85 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-brand-400 block">Catalog Depth</span>
                  <span className="text-2xl font-bold font-mono text-brand-950 mt-1 block">{products.length} Items</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-650 flex items-center justify-center shrink-0">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-brand-100/85 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-500 block">Low Stock Alert (≤ 5)</span>
                  <span className="text-2xl font-bold font-mono text-amber-950 mt-1 block">{products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5).length} SKUs</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 animate-bounce" />
                </div>
              </div>

              <div className="bg-white border border-brand-100/85 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-red-500 block">Depleted / Sold Out (0)</span>
                  <span className="text-2xl font-bold font-mono text-red-950 mt-1 block">{products.filter(p => p.stockQuantity <= 0).length} SKUs</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <XCircle className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Sub-Filters and controls */}
            <div className="p-6 border-b border-brand-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Filter inventory by title or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-brand-50 border border-brand-100 rounded-xl py-2 pl-9 pr-4 text-xs font-sans text-brand-950 placeholder-brand-400 focus:outline-hidden focus:border-brand-500"
                />
                <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-brand-400" />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lowStockOnly"
                    checked={categoryFilter === 'LowStockAlert'}
                    onChange={(e) => setCategoryFilter(e.target.checked ? 'LowStockAlert' : 'All')}
                    className="h-4 w-4 text-brand-900 border-brand-200 rounded-md focus:ring-brand-500 cursor-pointer"
                  />
                  <label htmlFor="lowStockOnly" className="text-xs font-semibold text-brand-700 cursor-pointer select-none">
                    Show Low Stock Warning Only
                  </label>
                </div>
              </div>
            </div>

            {/* Inventory table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-brand-50/30 border-b border-brand-100 uppercase font-mono tracking-wider text-brand-400 font-bold text-[10px]">
                    <th className="py-4 px-6">Product Info & Status</th>
                    <th className="py-4 px-6">SKU Code</th>
                    <th className="py-4 px-6 text-center">Stock Level</th>
                    <th className="py-4 px-6 text-right">Quick Restock Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {products
                    .filter(p => {
                      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase());
                      const matchesLow = categoryFilter !== 'LowStockAlert' || p.stockQuantity <= 5;
                      return matchesSearch && matchesLow;
                    })
                    .map((p) => {
                      const isLow = p.stockQuantity <= 5;
                      const isSoldOut = p.stockQuantity <= 0;
                      return (
                        <tr key={p.productId} className="hover:bg-brand-50/20 transition-colors">
                          <td className="py-4 px-6 flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt=""
                              className="h-10 w-10 object-cover rounded-md border border-brand-100"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-bold text-brand-950 truncate max-w-[220px]">{p.name}</p>
                              <span className={`inline-block px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full mt-1 ${
                                isSoldOut ? 'bg-red-50 text-red-700 border border-red-150' : 
                                isLow ? 'bg-amber-50 text-amber-700 border border-amber-150 animate-pulse' : 
                                'bg-emerald-50 text-emerald-700 border border-emerald-150'
                              }`}>
                                {isSoldOut ? 'Sold Out / Depleted' : isLow ? 'Low Stock' : 'Optimized'}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6 font-mono text-brand-500 font-medium">{p.sku}</td>

                          <td className="py-4 px-6 text-center">
                            {inlineStockId === p.productId ? (
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  value={inlineStockVal}
                                  onChange={(e) => setInlineStockVal(Number(e.target.value))}
                                  className="bg-brand-50 border border-brand-200 rounded px-1.5 py-0.5 w-14 text-center font-mono focus:outline-hidden"
                                />
                                <button
                                  onClick={() => submitInlineStock(p.productId)}
                                  className="p-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded cursor-pointer animate-pulse"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1.5 group">
                                <span className={`font-black font-sans text-sm ${isSoldOut ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-brand-950'}`}>
                                  {p.stockQuantity}
                                </span>
                                <button
                                  onClick={() => { setInlineStockId(p.productId); setInlineStockVal(p.stockQuantity); }}
                                  className="hidden group-hover:block p-1 text-brand-400 hover:text-brand-900 cursor-pointer"
                                  title="Edit Numerically"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Add 5 units */}
                              <button
                                onClick={async () => {
                                  try {
                                    const nextStock = p.stockQuantity + 5;
                                    await adminEditProduct(p.productId, { stockQuantity: nextStock, status: 'active' });
                                    triggerToast(`Restocked +5 units of ${p.sku}`, 'success');
                                  } catch {
                                    triggerToast(`Failed restock`, 'error');
                                  }
                                }}
                                className="px-2.5 py-1 bg-brand-50 border border-brand-100 hover:bg-brand-100 hover:border-brand-200 text-brand-700 text-[10px] font-bold font-mono rounded cursor-pointer"
                              >
                                +5 Units
                              </button>

                              {/* Restore 20 units */}
                              <button
                                onClick={async () => {
                                  try {
                                    const nextStock = p.stockQuantity + 20;
                                    await adminEditProduct(p.productId, { stockQuantity: nextStock, status: 'active' });
                                    triggerToast(`Restocked +20 units of ${p.sku}`, 'success');
                                  } catch {
                                    triggerToast(`Failed restock`, 'error');
                                  }
                                }}
                                className="px-2.5 py-1 bg-amber-50 border border-amber-100 hover:bg-amber-100 hover:border-amber-200 text-amber-900 text-[10px] font-bold font-mono rounded cursor-pointer"
                              >
                                +20 Units
                              </button>

                              {/* Deplete button (Set 0) */}
                              <button
                                onClick={async () => {
                                  if (confirm(`Deplete all inventory stock of SKU ${p.sku}?`)) {
                                    try {
                                      await adminEditProduct(p.productId, { stockQuantity: 0, status: 'out_of_stock' });
                                      triggerToast(`Depleted inventory stock to 0`, 'success');
                                    } catch {
                                      triggerToast(`Failed depletion`, 'error');
                                    }
                                  }
                                }}
                                className="p-1 px-2 border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-650 text-[10px] font-semibold rounded cursor-pointer"
                              >
                                Set Empty
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-brand-400">
                        No products loaded inside the database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            className="bg-white border border-brand-100 rounded-3xl overflow-hidden shadow-xs font-sans"
          >
            <div className="p-6 border-b border-brand-100">
              <h4 className="font-bold text-brand-950 text-base">Customer Orders Master Desk</h4>
              <p className="text-xs text-brand-400 mt-0.5">Control shipping, process refunds, view receipt structures and finalize fulfillment.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-50/50 border-b border-brand-100 uppercase font-mono tracking-wider text-brand-400 font-bold text-[10px]">
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Customer & Date</th>
                    <th className="py-4 px-6">Deliver Location</th>
                    <th className="py-4 px-6">Items Purchased</th>
                    <th className="py-4 px-6">Total Sum</th>
                    <th className="py-4 px-6">Status State</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {orders.map((o) => (
                    <tr key={o.orderId} className="hover:bg-brand-50/30 transition-colors">
                      
                      <td className="py-4 px-6 font-mono font-bold text-brand-950 uppercase">{o.orderId}</td>
                      
                      <td className="py-4 px-6">
                        <p className="font-bold text-brand-950">{o.customerName}</p>
                        <p className="text-[10px] text-brand-400 mt-0.5">{o.customerEmail}</p>
                        <p className="text-[10px] text-brand-400 mt-0.5 font-mono">{new Date(o.createdAt).toLocaleDateString()}</p>
                      </td>

                      <td className="py-4 px-6 max-w-[160px] truncate" title={o.shippingAddress}>{o.shippingAddress}</td>
                      
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1 max-w-[180px]">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="flex gap-1.5 text-[11px] text-brand-700 truncate">
                              <span className="font-bold bg-brand-50 text-brand-800 px-1.5 rounded">{item.quantity}x</span>
                              <span className="truncate">{item.productName}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono font-bold text-brand-900">${o.totalAmount.toFixed(2)}</td>

                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold font-mono uppercase tracking-wide truncate ${
                          o.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 font-bold' :
                          o.status === 'cancelled' ? 'bg-red-50 text-red-500 font-bold' :
                          o.status === 'processing' ? 'bg-blue-50 text-blue-700 font-bold' :
                          o.status === 'confirmed' ? 'bg-indigo-50 text-indigo-700 font-bold' :
                          o.status === 'shipped' ? 'bg-purple-50 text-purple-700 font-bold' :
                          'bg-amber-50 text-amber-700 animate-pulse'
                        }`}>
                          {o.status}
                        </span>
                        {o.status === 'cancelled' && o.cancelledBy && (
                          <div className={`text-[10px] whitespace-nowrap mt-1 font-semibold ${
                            o.cancelledBy === 'Customer' ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            Cancelled by {o.cancelledBy}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right font-sans">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={o.status}
                            onChange={(e) => adminUpdateOrderStatus(o.orderId, e.target.value as any)}
                            className="bg-brand-50 border border-brand-150 rounded-xl px-2.5 py-1.5 text-xs text-brand-800 focus:outline-hidden cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={async () => {
                              if (confirm(`Are you sure you want to permanently delete order ${o.orderId}?`)) {
                                await adminDeleteOrder(o.orderId);
                              }
                            }}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-brand-400">
                        No customer transactions logged currently.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </motion.div>
        )}

        {activeTab === 'categories' && (
          <motion.div
            key="categories"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans"
          >
            
            {/* List Categories */}
            <div className="lg:col-span-2 bg-white border border-brand-100 rounded-3xl p-6 shadow-xs">
              <h4 className="font-bold text-brand-950 text-base mb-6">Active Kitchen Collections</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div key={cat.categoryId} className="flex gap-4 items-center bg-brand-50/50 border border-brand-100 p-4 rounded-2xl relative group">
                    <img 
                      src={cat.imageUrl} 
                      alt={cat.name} 
                      className="h-14 w-14 object-cover rounded-xl border border-brand-150"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-brand-950 text-sm">{cat.name}</p>
                      <p className="text-[11px] text-brand-500 font-mono mt-0.5">Slug: {cat.slug}</p>
                    </div>
                    
                    <button
                      onClick={() => { if (confirm('Are you sure you want to delete this category?')) adminDeleteCategory(cat.categoryId); }}
                      className="absolute top-2 right-2 p-1 text-brand-400 hover:text-red-500 hidden group-hover:block transition-all cursor-pointer bg-white rounded-full border shadow-xs"
                      title="Delete Category"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* New Category creation form */}
            <div className="bg-white border border-brand-100 rounded-3xl p-6 shadow-xs self-start">
              <h4 className="font-bold text-brand-950 text-base mb-4">Add Collection Box</h4>
              <form onSubmit={handleCreateCategorySubmit} className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-800">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Professional Utensils"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="bg-brand-50 border border-brand-100 rounded-xl py-2.5 px-3.5 focus:outline-hidden"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-800">Brief Descriptives</label>
                  <textarea
                    placeholder="e.g., Beautiful serving assets machined out of olivewood..."
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="bg-brand-50 border border-brand-100 rounded-xl py-2.5 px-3.5 h-20 focus:outline-hidden resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-800">Cover Photo Link (URL)</label>
                  <input
                    type="url"
                    placeholder="e.g. https://images.unsplash.com..."
                    value={newCatImg}
                    onChange={(e) => setNewCatImg(e.target.value)}
                    className="bg-brand-50 border border-brand-100 rounded-xl py-2.5 px-3.5 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-brand-900 hover:bg-brand-800 text-white font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-center"
                >
                  Create Category
                </button>
              </form>
            </div>

          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            className="bg-white border border-brand-100 rounded-3xl overflow-hidden shadow-xs font-sans"
          >
            <div className="p-6 border-b border-brand-100">
              <h4 className="font-bold text-brand-950 text-base">Registered Account Base</h4>
              <p className="text-xs text-brand-400 mt-0.5 font-sans">Full view of customer registrations, whitelisted admins and authorization metrics.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-50/50 border-b border-brand-100 uppercase font-mono tracking-wider text-brand-400 font-bold text-[10px]">
                    <th className="py-4 px-6">Avatar</th>
                    <th className="py-4 px-6">Full Name</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Assigned Privilege</th>
                    <th className="py-4 px-6">Role UID Hash</th>
                    <th className="py-4 px-6">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {allUsers.map((u) => (
                    <tr key={u.uid} className="hover:bg-brand-50/20 transition-colors">
                      
                      <td className="py-4 px-6">
                        {u.photoURL ? (
                          <img 
                            src={u.photoURL} 
                            alt="" 
                            className="h-9 w-9 rounded-full object-cover border border-brand-200"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
                            {u.displayName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6 font-bold text-brand-950">{u.displayName}</td>
                      <td className="py-4 px-6 font-mono text-brand-600">{u.email}</td>
                      
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold capitalize ${
                          u.role === 'admin' ? 'bg-orange-50 text-orange-700 font-bold border border-orange-100' : 'bg-brand-50 text-brand-600'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-mono text-brand-400 text-[10px]">{u.uid}</td>
                      <td className="py-4 px-6 font-mono text-brand-500">{new Date(u.createdAt).toLocaleDateString()}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </div> {/* Closes Workbench Panel Area */}
      </div> {/* Closes Grid wrapper */}

      {/* Fully Configured ADD / EDIT Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs font-sans px-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setShowProductModal(false)}></div>
          
          <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-brand-100 z-10 animate-scale-up max-h-[90vh] flex flex-col">
            
            <div className="bg-brand-900 text-white p-6">
              <h3 className="text-lg font-bold">
                {editingProduct ? `Edit ${editingProduct.name}` : 'Assemble New Product'}
              </h3>
              <p className="text-brand-300 text-xs mt-1">Populate accurate field configurations. Real customer maps auto-sync.</p>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 overflow-y-auto flex flex-col gap-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="font-semibold text-brand-800">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., AeroTemp Smart Glass Kettle"
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="bg-brand-50 border border-brand-100 rounded-xl py-2.5 px-3.5 focus:outline-hidden"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-800">SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="KIT-SMR-KET-01"
                    value={prodForm.sku}
                    onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })}
                    className="bg-brand-50 border border-brand-100 rounded-xl py-2.5 px-3.5 focus:outline-hidden font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-800">Category *</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="bg-brand-50 border border-brand-100 rounded-xl py-2.5 px-3.5 focus:outline-hidden cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.categoryId} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-800">Base Price ($) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="bg-brand-50 border border-brand-100 rounded-xl py-2.5 px-3.5 focus:outline-hidden font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-800">Sale Price ($ - Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Leave blank if no discount"
                    value={prodForm.salePrice}
                    onChange={(e) => setProdForm({ ...prodForm, salePrice: e.target.value })}
                    className="bg-brand-50 border border-brand-100 rounded-xl py-2.5 px-3.5 focus:outline-hidden font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-800">Stock Storage *</label>
                  <input
                    type="number"
                    required
                    value={prodForm.stockQuantity}
                    onChange={(e) => setProdForm({ ...prodForm, stockQuantity: Number(e.target.value) })}
                    className="bg-brand-50 border border-brand-100 rounded-xl py-2.5 px-3.5 focus:outline-hidden font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-800">Display Status</label>
                  <select
                    value={prodForm.status}
                    onChange={(e) => setProdForm({ ...prodForm, status: e.target.value as any })}
                    className="bg-brand-50 border border-brand-100 rounded-xl py-2.5 px-3.5 focus:outline-hidden cursor-pointer"
                  >
                    <option value="active">Active (On Store)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="out_of_stock">Out Of Stock</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="font-semibold text-brand-800">Product Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={prodForm.imageUrl}
                    onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                    className="bg-brand-50 border border-brand-100 rounded-xl py-2.5 px-3.5 focus:outline-hidden"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="font-semibold text-brand-800">Description Particulars</label>
                  <textarea
                    placeholder="Provide pristine specifics about double-wall insulation, induction cores or tempered glass..."
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    className="bg-brand-50 border border-brand-100 rounded-xl py-2.5 px-3.5 h-24 focus:outline-hidden resize-none"
                  />
                </div>
              </div>

              <div className="border-t border-brand-50 pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="bg-brand-100 hover:bg-brand-150 text-brand-800 font-semibold py-2 px-5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-900 hover:bg-brand-800 text-white font-bold py-2.5 px-6 rounded-xl cursor-pointer shadow-xs"
                >
                  Save Product
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
