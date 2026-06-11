import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, MapPin, Heart, ShoppingBag, Trash2, XCircle, ChevronRight, 
  LayoutDashboard, Copy, Check, CheckCircle, Search, SlidersHorizontal, 
  Package, ChevronDown, ChevronUp, DollarSign, Calendar, ListFilter
} from 'lucide-react';

interface ProfileViewProps {
  setView: (view: string) => void;
  setSelectedProductId: (id: string | null) => void;
}

export default function ProfileView({ setView, setSelectedProductId }: ProfileViewProps) {
  const { 
    user, 
    userProfile, 
    isAdmin, 
    orders, 
    products, 
    saveAddress, 
    removeAddress, 
    toggleWishlist,
    customerUpdateOrderStatus
  } = useApp();

  const [newAddressInput, setNewAddressInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => prev?.text === text ? null : prev);
    }, 4000);
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center font-sans animate-fade-in">
        <div className="bg-white border border-brand-100 p-8 sm:p-12 rounded-3xl shadow-xs space-y-4">
          <ShoppingBag className="h-12 w-12 text-brand-300 mx-auto" />
          <h2 className="text-2xl font-bold font-sans tracking-tight text-brand-950">Secure Member Account</h2>
          <p className="text-sm text-brand-500 leading-relaxed max-w-sm mx-auto">
            You must authenticate your email credentials to access order status tracking, registered wishlist bookmarks, and saved shipping configurations.
          </p>
          <button
            onClick={() => setView('home')}
            className="bg-brand-900 text-white font-bold px-8 py-3 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Find products that are bookmarked inside the wishlist
  const wishlistItems = products.filter(p => userProfile?.wishlist?.includes(p.productId));

  const handleCreateAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressInput.trim()) return;
    try {
      await saveAddress(newAddressInput.trim());
      setNewAddressInput('');
      triggerToast('Address entry added successfully!', 'success');
    } catch {
      triggerToast('Failed saving address details.', 'error');
    }
  };

  const confirmOrderCancellation = async (orderId: string) => {
    try {
      await customerUpdateOrderStatus(orderId, 'cancelled');
      triggerToast('Your order was cancelled successfully.', 'success');
      setCancellingOrderId(null);
    } catch (err: any) {
      console.error('Detailed cancellation error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      triggerToast(`Error cancelling order: ${errMsg}`, 'error');
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to confirm this order? This will prepare it for packaging and courier dispatch.')) {
      try {
        await customerUpdateOrderStatus(orderId, 'processing');
        triggerToast('Thank you! Your order is now confirmed and sent for packaging.', 'success');
      } catch (err) {
        triggerToast('Error confirming order. Please verify your connection.', 'error');
      }
    }
  };

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    setView('shop');
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans animate-fade-in space-y-12">
      {/* Floating Custom Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-950 text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 border border-brand-800 text-xs sm:text-sm animate-fade-in">
          <span className={`h-2.5 w-2.5 rounded-full ${toastMessage.type === 'success' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400 animate-pulse'}`}></span>
          <span className="font-sans font-medium text-white">{toastMessage.text}</span>
        </div>
      )}
      
      {/* 1. Account Greeting Card */}
      <section className="bg-white border border-brand-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xs relative overflow-hidden">
        
        <div className="flex gap-4 items-center relative z-10">
          {userProfile?.photoURL ? (
            <img 
              src={userProfile.photoURL} 
              alt="" 
              className="h-16 w-16 rounded-full object-cover border-4 border-brand-50"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-2xl font-sans shrink-0">
              {userProfile?.displayName?.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-brand-950 font-sans">
              Welcome, {userProfile?.displayName || 'Customer'}
            </h2>
            <p className="text-xs text-brand-500 font-mono mt-0.5">{user.email}</p>
            <p className="text-[10px] text-brand-400 font-mono uppercase tracking-wider mt-1 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-md inline-block">
              Role: {userProfile?.role || 'customer'} Clearances
            </p>
          </div>
        </div>


      </section>

      {/* Main Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Column: Address Book & Wishlist (1/3) */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Address Book management */}
          <div className="bg-white border border-brand-100 p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="font-bold text-brand-950 text-sm uppercase tracking-wider font-mono flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-brand-400" />
              My Saved Addresses
            </h3>
            
            <form onSubmit={handleCreateAddressSubmit} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Add a new shipping spot..."
                value={newAddressInput}
                onChange={(e) => setNewAddressInput(e.target.value)}
                className="bg-brand-50 border border-brand-100 rounded-xl px-3 py-2 text-xs flex-1 text-brand-950 focus:outline-hidden"
              />
              <button
                type="submit"
                className="bg-brand-650 bg-brand-900 text-white rounded-xl text-xs font-bold px-4 py-2 cursor-pointer hover:bg-brand-800"
              >
                Add
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {userProfile?.addresses?.map((addr, idx) => (
                <div key={idx} className="flex justify-between items-center bg-brand-50/50 border border-brand-100 rounded-xl py-2 px-3.5 text-xs text-brand-800">
                  <span className="truncate max-w-[200px]" title={addr}>{addr}</span>
                  <button
                    onClick={() => removeAddress(addr)}
                    className="p-1 hover:text-red-500 cursor-pointer"
                    title="Delete saved address"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {(!userProfile?.addresses || userProfile.addresses.length === 0) && (
                <p className="text-center text-brand-400 text-xs py-4">No shipping addresses saved yet.</p>
              )}
            </div>
          </div>

          {/* Bookmarked Wishlist */}
          <div className="bg-white border border-brand-100 p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="font-bold text-brand-950 text-sm uppercase tracking-wider font-mono flex items-center gap-2">
              <Heart className="h-4.5 w-4.5 text-yellow-500 fill-yellow-500" />
              Favorited Culinary Gear ({wishlistItems.length})
            </h3>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {wishlistItems.map((item) => (
                <div key={item.productId} className="flex justify-between items-center gap-2 border-b border-brand-50 pb-3 last:border-0">
                  <div 
                    className="flex gap-2.5 items-center cursor-pointer group"
                    onClick={() => handleProductSelect(item.productId)}
                  >
                    <img src={item.images[0]} alt="" className="h-10 w-10 object-cover rounded-lg border border-brand-150" />
                    <div className="max-w-[140px]">
                      <p className="font-bold text-brand-900 text-xs truncate group-hover:text-brand-600 transition-colors leading-tight">{item.name}</p>
                      <p className="text-[10px] text-brand-500 font-mono mt-0.5">Rs. {(item.salePrice ?? item.price).toLocaleString()}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleWishlist(item.productId)}
                    className="p-2 text-brand-400 hover:text-red-500 rounded-lg"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {wishlistItems.length === 0 && (
                <p className="text-center text-brand-400 text-xs py-8">Your wishlist holds no bookmarks.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Order Transactions history ledger (2/3) */}
        <div className="lg:col-span-2 bg-white border border-brand-100 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-left">
              <h3 className="font-bold text-brand-950 text-base uppercase tracking-wider font-mono flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand-400 text-brand-900" />
                Purchases & Status Tracking
              </h3>
              <p className="text-[11px] text-brand-500 mt-0.5 leading-normal">
                Monitor culinary equipment dispatches, view archived transactions, and track active deliveries.
              </p>
            </div>
          </div>

          {/* Symmetrical Stats Ribbon */}
          {orders.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-brand-50/30 p-4 rounded-2xl border border-brand-100/50">
              <div className="text-left space-y-1">
                <p className="text-[10px] text-brand-400 font-mono uppercase tracking-wider font-bold">Total Investments</p>
                <p className="font-mono text-base font-bold text-brand-950">Rs. {orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0).toLocaleString()}</p>
              </div>
              <div className="text-left space-y-1 border-l border-brand-100/80 pl-3.5">
                <p className="text-[10px] text-brand-400 font-mono uppercase tracking-wider font-bold">Active Orders</p>
                <div className="flex items-center gap-1.5">
                  <p className="font-mono text-base font-bold text-brand-950">
                    {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
                  </p>
                  {orders.filter(o => o.status === 'pending' || o.status === 'processing').length > 0 && (
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </div>
              </div>
              <div className="text-left space-y-1 border-l border-brand-100/80 pl-3.5">
                <p className="text-[10px] text-brand-400 font-mono uppercase tracking-wider font-bold">Completed</p>
                <p className="font-mono text-base font-bold text-brand-950">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <div className="text-left space-y-1 border-l border-brand-100/80 pl-3.5">
                <p className="text-[10px] text-brand-400 font-mono uppercase tracking-wider font-bold font-sans">Total Placed</p>
                <p className="font-mono text-base font-bold text-brand-950">{orders.length}</p>
              </div>
            </div>
          )}

          {/* Symmetrical Controls Bar */}
          {orders.length > 0 && (
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID, item name, shipping spot..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-50/50 hover:bg-brand-50/80 border border-brand-150 focus:border-brand-300 rounded-xl pl-10 pr-4 py-2 text-xs text-brand-950 focus:outline-hidden transition-all placeholder:text-brand-400"
                />
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2 shrink-0 justify-end">
                <SlidersHorizontal className="h-3.5 w-3.5 text-brand-450" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-brand-150 hover:border-brand-250 rounded-xl px-3 py-1.5 text-xs text-brand-700 focus:outline-hidden cursor-pointer shadow-3xs font-semibold"
                >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="amount_desc">Highest Price</option>
                  <option value="amount_asc">Lowest Price</option>
                </select>
              </div>
            </div>
          )}

          {/* Quick Tabs Navigation */}
          {orders.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-b border-brand-100 pb-3">
              {[
                { id: 'all', label: 'All Orders', count: orders.length },
                { 
                  id: 'active', 
                  label: 'Current Status', 
                  count: orders.filter(o => o.status === 'pending' || o.status === 'processing').length 
                },
                { 
                  id: 'delivered', 
                  label: 'Delivered', 
                  count: orders.filter(o => o.status === 'delivered').length 
                },
                { 
                  id: 'cancelled', 
                  label: 'Cancelled', 
                  count: orders.filter(o => o.status === 'cancelled').length 
                }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id as any)}
                  className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                    filterTab === tab.id 
                      ? 'bg-brand-900 text-white shadow-xs' 
                      : 'bg-brand-50/40 hover:bg-brand-50 text-brand-600 hover:text-brand-950'
                  }`}
                >
                  {tab.label}
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${filterTab === tab.id ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-600'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Order list ledger */}
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
            {orders.length > 0 && orders
              .filter(order => {
                if (filterTab === 'active') return order.status === 'pending' || order.status === 'processing';
                if (filterTab === 'delivered') return order.status === 'delivered';
                if (filterTab === 'cancelled') return order.status === 'cancelled';
                return true;
              })
              .filter(order => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                const matchId = order.orderId.toLowerCase().includes(q);
                const matchItemName = order.items.some(item => item.productName.toLowerCase().includes(q));
                const matchAddress = order.shippingAddress.toLowerCase().includes(q);
                return matchId || matchItemName || matchAddress;
              })
              .sort((a, b) => {
                if (sortBy === 'date_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                if (sortBy === 'date_asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                if (sortBy === 'amount_desc') return b.totalAmount - a.totalAmount;
                if (sortBy === 'amount_asc') return a.totalAmount - b.totalAmount;
                return 0;
              })
              .map((order) => {
                const isExpanded = expandedOrders[order.orderId] !== false; // default expanded is true

                const renderTracker = (status: typeof order.status) => {
                  if (status === 'cancelled') {
                    return (
                      <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                          <XCircle className="h-4.5 w-4.5" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-red-950 text-xs text-left">Order Cancelled</p>
                          <p className="text-[10px] text-red-500 mt-0.5 leading-normal">
                            This transaction has been cancelled. Your payment source or delivery schedule has been voided.
                          </p>
                        </div>
                      </div>
                    );
                  }

                  const trackingSteps = [
                    { label: 'Placed', desc: 'Order received', completed: true },
                    { label: 'Confirmed', desc: 'Order approved', completed: status !== 'pending' },
                    { label: 'Processing', desc: 'Warehouse prep', completed: status !== 'pending' && status !== 'confirmed' },
                    { label: 'Shipped', desc: 'Courier dispatch', completed: status === 'shipped' || status === 'delivered' },
                    { label: 'Delivered', desc: 'Arrived', completed: status === 'delivered' }
                  ];

                  const currentStepIdx = 
                    status === 'delivered' ? 4 : 
                    status === 'shipped' ? 3 : 
                    status === 'processing' ? 2 : 
                    status === 'confirmed' ? 1 : 0;

                  return (
                    <div className="space-y-4 bg-brand-50/20 border border-brand-100/50 rounded-2xl p-4">
                      <div className="flex justify-between items-center text-[10px] uppercase font-mono font-bold">
                        <span className="text-brand-400">Order Delivery Tracker</span>
                        <span className={`px-2 py-0.5 rounded-full font-mono text-[9.5px] ${
                          status === 'delivered' ? 'text-green-700 bg-green-50 font-bold' :
                          status === 'shipped' ? 'text-purple-700 bg-purple-50 font-bold' :
                          status === 'processing' ? 'text-blue-700 bg-blue-50 font-bold' :
                          status === 'confirmed' ? 'text-indigo-700 bg-indigo-50 font-bold' :
                          'text-amber-700 bg-amber-50 animate-pulse'
                        }`}>
                          Current State: {status}
                        </span>
                      </div>

                      <div className="relative pt-2 pb-1">
                        {/* Connecting bar */}
                        <div className="absolute top-[18px] left-[10%] right-[11%] h-1 bg-brand-100 -z-5 rounded-full">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${(currentStepIdx / 4) * 100}%` }}
                          />
                        </div>

                        {/* Tracking circles */}
                        <div className="flex justify-between items-start relative z-10">
                          {trackingSteps.map((step, sIdx) => {
                            const isStepCompleted = step.completed;
                            const isCurrent = sIdx === currentStepIdx;

                            return (
                              <div key={sIdx} className="flex flex-col items-center text-center max-w-[80px] sm:max-w-[120px]">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                  isStepCompleted 
                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs' 
                                    : isCurrent
                                      ? 'bg-amber-500 border-amber-500 text-white animate-pulse'
                                      : 'bg-white border-brand-200 text-brand-300'
                                }`}>
                                  {isStepCompleted ? (
                                    <CheckCircle className="h-4 w-4 fill-current text-white shrink-0" />
                                  ) : (
                                    <span className="text-[10px] font-bold font-mono">{sIdx + 1}</span>
                                  )}
                                </div>
                                <p className={`font-bold mt-2 text-[10.5px] ${isStepCompleted || isCurrent ? 'text-brand-950' : 'text-brand-400'}`}>
                                  {step.label}
                                </p>
                                <p className="text-[9px] text-brand-400 leading-tight mt-0.5 hidden sm:block">
                                  {step.desc}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                };

                return (
                  <div 
                    key={order.orderId} 
                    className="border border-brand-100 rounded-3xl overflow-hidden shadow-2xs text-xs bg-white hover:border-brand-200 transition-colors"
                  >
                    {/* Order Meta Header */}
                    <div className="bg-brand-50/50 py-3.5 px-4 border-b border-brand-100 flex flex-wrap gap-2 justify-between items-center text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-brand-900 font-mono uppercase">{order.orderId}</span>
                        <button 
                          onClick={() => copyToClipboard(order.orderId)}
                          className="p-1 hover:bg-brand-100 rounded text-brand-400 hover:text-brand-900 transition-all cursor-pointer"
                          title="Copy Reference ID"
                        >
                          {copiedId === order.orderId ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        </button>
                        <span className="text-brand-250 font-mono">|</span>
                        <span className="text-brand-500 font-mono">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold capitalize ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700 font-semibold' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'confirmed' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-amber-100 text-amber-950 font-semibold animate-pulse'
                        }`}>
                          {order.status === 'pending' ? 'awaiting confirmation' : order.status}
                        </span>

                        {order.status === 'cancelled' && order.cancelledBy && (
                          <span className="text-[10px] text-red-600 font-medium">
                            (Cancelled by {order.cancelledBy})
                          </span>
                        )}

                        <button
                          onClick={() => setExpandedOrders(prev => ({ ...prev, [order.orderId]: !isExpanded }))}
                          className="p-1.5 hover:bg-brand-150/40 rounded-lg text-brand-600 hover:text-brand-950 transition-colors cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Content */}
                    {isExpanded && (
                      <div className="p-4 space-y-5 animate-fade-in divide-y divide-brand-100/50 text-left">
                        {/* Tracker Module */}
                        <div className="block">
                          {renderTracker(order.status)}
                        </div>

                        {/* Itemized Lists */}
                        <div className="pt-4 block">
                          <p className="font-bold text-brand-950 text-xs mb-2.5 uppercase font-mono tracking-wider">Itemized Gear List</p>
                          <div className="divide-y divide-brand-50 bg-brand-50/10 border border-brand-100/50 rounded-2xl px-4 py-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4">
                                <div className="flex gap-2.5 items-center max-w-[280px]">
                                  {item.image && (
                                    <img 
                                      src={item.image} 
                                      alt="" 
                                      className="h-9 w-9 object-cover rounded-md border border-brand-150 shrink-0" 
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                  <p className="font-semibold text-brand-950 truncate">{item.productName}</p>
                                </div>
                                <p className="font-mono text-brand-600 font-medium shrink-0">
                                  {item.quantity}x <span className="text-brand-400">@</span> Rs. {item.price.toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipment Info details Row */}
                        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-1">
                            <p className="font-bold text-brand-900 font-mono uppercase tracking-wider text-[10px]">Shipping & Payments</p>
                            <p className="text-brand-500 font-sans leading-relaxed">
                              <strong>Destination:</strong> {order.shippingAddress}
                            </p>
                            <p className="text-brand-500 font-sans leading-relaxed">
                              <strong>Method:</strong> {order.paymentMethod || 'Cash On Delivery'}
                            </p>
                          </div>
                          <div className="flex flex-col items-start sm:items-end justify-between font-sans">
                            <div className="text-left sm:text-right space-y-0.5">
                              <p className="font-bold text-brand-900 font-mono uppercase tracking-wider text-[10px]">Payment Summary</p>
                              <p className="font-semibold text-xs text-brand-500">All prices packaged inclusive of taxes</p>
                              <p className="font-bold text-sm">
                                Total Invoiced: <span className="font-mono text-base text-brand-950 font-black ml-1">Rs. {order.totalAmount.toLocaleString()}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Customer direct interactions line */}
                        {order.status === 'pending' && (
                          <div className="pt-4">
                            {cancellingOrderId === order.orderId ? (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-50/40 p-4 rounded-2xl border border-red-100/70 animate-fade-in text-left">
                                <div className="space-y-0.5">
                                  <p className="font-bold text-red-900 text-xs flex items-center gap-1">
                                    <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                                    Confirm Action: Cancel Order?
                                  </p>
                                  <p className="text-[10px] text-red-600 leading-normal max-w-md">
                                    Are you sure you want to cancel this order? Once confirmed, the order will be marked cancelled and the items will be returned to stock.
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => setCancellingOrderId(null)}
                                    className="px-3 py-1.5 bg-white hover:bg-brand-50 text-brand-700 border border-brand-200 rounded-xl transition-all duration-200 cursor-pointer text-[11px] font-semibold"
                                  >
                                    No, Keep
                                  </button>
                                  <button
                                    onClick={() => confirmOrderCancellation(order.orderId)}
                                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 cursor-pointer text-[11px] font-bold flex items-center gap-1"
                                  >
                                    Yes, Cancel Order
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-brand-50/40 p-4 rounded-2xl border border-brand-100">
                                <div className="text-left space-y-0.5">
                                  <p className="font-bold text-brand-950 text-xs flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                    Cancel Your Order
                                  </p>
                                  <p className="text-[10px] text-brand-500 leading-normal max-w-md">
                                    This order is pending confirmation. You may cancel it at this stage if needed.
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => setCancellingOrderId(order.orderId)}
                                    className="px-3.5 py-2 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-brand-200 hover:border-red-200 rounded-xl transition-all duration-200 cursor-pointer text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                    Cancel Order
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

            {/* Display when search or filters return empty but user has baseline orders */}
            {orders.length > 0 && orders
              .filter(order => {
                if (filterTab === 'active') return order.status === 'pending' || order.status === 'processing';
                if (filterTab === 'delivered') return order.status === 'delivered';
                if (filterTab === 'cancelled') return order.status === 'cancelled';
                return true;
              })
              .filter(order => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                const matchId = order.orderId.toLowerCase().includes(q);
                const matchItemName = order.items.some(item => item.productName.toLowerCase().includes(q));
                const matchAddress = order.shippingAddress.toLowerCase().includes(q);
                return matchId || matchItemName || matchAddress;
              }).length === 0 && (
              <div className="text-center py-16 text-brand-450 border border-dashed border-brand-200 rounded-3xl bg-white/50 space-y-3">
                <ShoppingBag className="h-10 w-10 text-brand-300 mx-auto" />
                <p className="text-xs">No customer orders fit your selected status filters or search term.</p>
                <button
                  onClick={() => {
                    setFilterTab('all');
                    setSearchQuery('');
                  }}
                  className="bg-brand-950 text-white font-semibold py-2 px-5 rounded-full text-xs hover:bg-brand-800 cursor-pointer"
                >
                  Clear Search Filters
                </button>
              </div>
            )}

            {/* Baseline empty state if user has absolutely no order history whatsoever */}
            {orders.length === 0 && (
              <div className="text-center py-16 text-brand-450 border border-dashed border-brand-200 rounded-3xl m-auto bg-white/50 space-y-4">
                <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center mx-auto text-brand-400">
                  <Package className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-brand-950">No Order Transactions Yet</p>
                  <p className="text-xs text-brand-500 max-w-xs mx-auto">Your account historical purchases ledger holds no items yet. Build your ultimate kitchen arsenal today!</p>
                </div>
                <button
                  onClick={() => setView('shop')}
                  className="bg-brand-900 text-white font-semibold py-2.5 px-6 rounded-full text-xs hover:bg-brand-800 cursor-pointer shadow-sm transition-all"
                >
                  Browse Premium Cookware Collection
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
