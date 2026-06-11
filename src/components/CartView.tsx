import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  MapPin,
  User,
  Mail,
  Phone,
  Building,
  CheckCircle2, 
  ShoppingBag, 
  AlertCircle 
} from 'lucide-react';

interface CartViewProps {
  setView: (view: string) => void;
  openAuth: () => void;
}

export default function CartView({ setView, openAuth }: CartViewProps) {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartTotal, 
    user, 
    userProfile, 
    placeOrder, 
    clearCart 
  } = useApp();

  // Form input states
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('cod'); // COD defaults
  const [selectedSavedAddr, setSelectedSavedAddr] = useState<string>('');

  const [checkingOut, setCheckingOut] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Keep track of last placed order details for the Order Confirmation Page
  const [lastPlacedOrder, setLastPlacedOrder] = useState<{
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    city: string;
    shippingAddress: string;
    paymentMethod: string;
    grandTotal: number;
    items: {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      image?: string;
    }[];
  } | null>(null);

  // Synchronize authenticated user profile fields
  useEffect(() => {
    if (user) {
      setFullName(prev => prev || userProfile?.displayName || user.displayName || '');
      setEmailAddress(prev => prev || user.email || '');
    }
  }, [user, userProfile]);

  // Cost estimates math
  const shippingCost = cartTotal >= 3000 || cartTotal === 0 ? 0 : 250;
  const taxCost = cartTotal * 0.08; // 8% tax
  const orderGrandTotal = cartTotal + shippingCost + taxCost;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuth();
      return;
    }

    // Explicit valid checks as per instruction list
    if (!fullName.trim()) {
      setCheckoutError('Full Name is required');
      return;
    }
    if (!emailAddress.trim()) {
      setCheckoutError('Email Address is required');
      return;
    }
    if (!phoneNumber.trim()) {
      setCheckoutError('Phone Number is required');
      return;
    }
    if (!city.trim()) {
      setCheckoutError('City is required');
      return;
    }
    const finalAddress = selectedSavedAddr || shippingAddress;
    if (!finalAddress.trim()) {
      setCheckoutError('Complete Delivery Address is required');
      return;
    }

    setCheckingOut(true);
    setCheckoutError(null);

    try {
      const checkoutDetails = {
        customerName: fullName.trim(),
        customerEmail: emailAddress.trim(),
        customerPhone: phoneNumber.trim(),
        city: city.trim(),
        shippingAddress: finalAddress.trim(),
        paymentMethod
      };

      // Store local ordered items for the confirmation view
      const orderedItemsDetails = cart.map(item => ({
        productId: item.product.productId,
        productName: item.product.name,
        price: item.product.salePrice ?? item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || ''
      }));

      const orderId = await placeOrder(checkoutDetails);

      setLastPlacedOrder({
        orderId,
        customerName: checkoutDetails.customerName,
        customerEmail: checkoutDetails.customerEmail,
        customerPhone: checkoutDetails.customerPhone,
        city: checkoutDetails.city,
        shippingAddress: checkoutDetails.shippingAddress,
        paymentMethod: checkoutDetails.paymentMethod,
        grandTotal: orderGrandTotal,
        items: orderedItemsDetails
      });

      setSuccessOrderId(orderId);
      
      // Clean inputs
      setShippingAddress('');
      setSelectedSavedAddr('');
      setPhoneNumber('');
      setCity('');
    } catch (err: any) {
      console.error('Checkout flow failed:', err);
      let errorMsg = 'Order submission exception occurred. Please verify your connections.';
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed && parsed.error) {
            errorMsg = `Submission rejected: ${parsed.error}`;
          } else {
            errorMsg = `Submission rejected: ${err.message}`;
          }
        } catch (_) {
          errorMsg = `Submission rejected: ${err.message}`;
        }
      }
      setCheckoutError(errorMsg);
    } finally {
      setCheckingOut(false);
    }
  };

  const handleSavedAddrSelect = (addr: string) => {
    setSelectedSavedAddr(addr);
    if (addr) {
      setShippingAddress('');
    }
  };

  // SUCCESS ORDER CONFIRMATION VIEW
  if (successOrderId && lastPlacedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 font-sans animate-fade-in space-y-8" id="confirmation-view">
        <div className="bg-white border border-brand-100 p-6 sm:p-10 rounded-3xl shadow-xl space-y-8">
          
          {/* Header Status Accent */}
          <div className="text-center space-y-3">
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 max-w-max mx-auto animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-extrabold text-emerald-600 tracking-tight">
              Order Placed Successfully
            </h1>
            <p className="text-brand-500 text-sm max-w-md mx-auto">
              Thank you for shopping with us! Your order has been registered and is currently pending processing.
            </p>
            <div className="inline-block bg-brand-50 border border-brand-100 px-4 py-1.5 rounded-full font-mono text-xs font-bold text-brand-900 mt-2">
              ORDER REF: <span className="uppercase">{successOrderId}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-brand-50">
            {/* Customer Details Display */}
            <div className="space-y-4">
              <h3 className="font-bold text-brand-950 text-sm uppercase tracking-wide border-b border-brand-100 pb-2 flex items-center gap-1.5">
                <User className="h-4 w-4 text-brand-600" />
                Customer Information
              </h3>
              <div className="space-y-3 text-xs text-brand-700">
                <div className="flex justify-between pb-1.5 border-b border-brand-50">
                  <span className="font-semibold text-brand-500">Full Name</span>
                  <span className="font-bold text-brand-900">{lastPlacedOrder.customerName}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-brand-50">
                  <span className="font-semibold text-brand-500">Email Address</span>
                  <span className="font-mono text-brand-900">{lastPlacedOrder.customerEmail}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-brand-50">
                  <span className="font-semibold text-brand-500">Phone Number</span>
                  <span className="font-mono text-brand-900">{lastPlacedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-brand-50">
                  <span className="font-semibold text-brand-500">City</span>
                  <span className="font-bold text-brand-900">{lastPlacedOrder.city}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-brand-500">Delivery Address</span>
                  <p className="bg-brand-50 p-2.5 rounded-xl border border-brand-100 text-brand-800 leading-relaxed font-sans">
                    {lastPlacedOrder.shippingAddress}
                  </p>
                </div>
                <div className="flex justify-between pt-1 font-sans">
                  <span className="font-semibold text-brand-500">Payment Option</span>
                  <span className="bg-brand-100 text-brand-900 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                    {lastPlacedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Credit Card'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Info Summary */}
            <div className="space-y-4">
              <h3 className="font-bold text-brand-950 text-sm uppercase tracking-wide border-b border-brand-100 pb-2 flex items-center gap-1.5">
                <ShoppingBag className="h-4 w-4 text-brand-600" />
                Ordered Items
              </h3>
              <div className="space-y-3">
                {lastPlacedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 justify-between items-center text-xs pb-3 border-b border-brand-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.productName} 
                          className="h-10 w-10 rounded-lg object-cover border border-brand-100" 
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div>
                        <p className="font-bold text-brand-900 line-clamp-1">{item.productName}</p>
                        <p className="text-brand-500 text-[10px]">Qty: {item.quantity} x Rs. {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="font-mono font-extrabold text-brand-950 text-right">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}

                <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100 space-y-1.5 mt-2">
                  <div className="flex justify-between text-xs text-brand-600">
                    <span>Items Total</span>
                    <span className="font-mono text-brand-800">Rs. {lastPlacedOrder.items.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-brand-600">
                    <span>Shipping Fee</span>
                    <span className="font-mono text-brand-800">
                      {lastPlacedOrder.grandTotal >= 3000 ? 'FREE' : 'Rs. 250'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-brand-950 border-t border-brand-200/50 pt-2 font-sans">
                    <span>Total Amount Paid</span>
                    <span className="font-mono text-emerald-600 text-lg">Rs. {lastPlacedOrder.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-brand-50 pt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="back-to-shop-btn"
              onClick={() => { setSuccessOrderId(null); setLastPlacedOrder(null); setView('shop'); }}
              className="bg-brand-900 hover:bg-brand-800 text-white font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wide cursor-pointer transition-all hover:scale-105 active:scale-95 duration-200"
            >
              Back to Catalog
            </button>
            <button
              id="view-orders-btn"
              onClick={() => { setSuccessOrderId(null); setLastPlacedOrder(null); setView('profile'); }}
              className="bg-brand-50 text-brand-700 border border-brand-150 font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wide hover:bg-brand-100 cursor-pointer transition-all hover:scale-105 active:scale-95 duration-200"
            >
              Track Orders History
            </button>
          </div>

        </div>
      </div>
    );
  }

  // EMPTY BASKET FALLBACK
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center font-sans animate-fade-in" id="empty-basket-view">
        <div className="bg-white border border-brand-100 p-8 sm:p-12 rounded-3xl shadow-xs space-y-4">
          <ShoppingBag className="h-12 w-12 text-brand-300 mx-auto" />
          <h2 className="text-2xl font-bold font-sans tracking-tight text-brand-950">Empty Shopping Basket</h2>
          <p className="text-sm text-brand-500 leading-relaxed max-w-sm mx-auto">
            You haven't accumulated cooking sets inside your current session. Browse our premium titanium and smart electronics collections to fill it!
          </p>
          <button
            onClick={() => setView('shop')}
            className="bg-brand-900 hover:bg-brand-800 text-white font-bold px-8 py-3 rounded-full text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer shadow-xs"
          >
            Explore Cooking Gear
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans animate-fade-in" id="cart-checkout-page">
      
      <div className="flex justify-between items-end mb-8 border-b border-brand-100 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-brand-950 tracking-tight font-sans">Shopping Basket</h2>
          <p className="text-brand-400 text-xs mt-0.5">Optimize item checkout volumes and organize delivery details.</p>
        </div>
        <p className="text-xs font-mono font-bold text-brand-500 uppercase tracking-wider">
          Items subtotal: Rs. {cartTotal.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Block: List items (7 Cols) */}
        <div className="lg:col-span-7 space-y-4" id="basket-items-list">
          {cart.map((item) => {
            const hasDiscount = !!item.product.salePrice && item.product.salePrice < item.product.price;
            const singlePrice = item.product.salePrice ?? item.product.price;
            
            return (
              <div 
                key={item.product.productId} 
                className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white border border-brand-100 p-4 rounded-2xl shadow-xs"
              >
                
                {/* Product specifics */}
                <div className="flex gap-4 items-center">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name} 
                    className="h-16 w-16 object-cover rounded-xl border border-brand-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="max-w-[240px]">
                    <span className="text-[10px] font-mono text-brand-400 capitalize">{item.product.category}</span>
                    <h4 className="font-bold text-brand-950 text-sm truncate leading-snug">{item.product.name}</h4>
                    
                    {/* Cost details */}
                    <p className="text-xs text-brand-600 font-mono mt-1">
                      Rs. {singlePrice.toLocaleString()} each 
                      {hasDiscount && <span className="text-[9px] text-red-500 bg-red-50 font-bold px-1 rounded ml-1">Premium rate</span>}
                    </p>
                  </div>
                </div>

                {/* Counter Steppers */}
                <div className="flex items-center gap-4 py-2 sm:py-0 w-full sm:w-auto justify-between sm:justify-end">
                  
                  <div className="flex items-center border border-brand-150 rounded-full p-1 bg-brand-50/50">
                    <button
                      onClick={() => updateCartQuantity(item.product.productId, item.quantity - 1)}
                      className="p-1.5 text-brand-600 hover:text-brand-950 rounded-full cursor-pointer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-xs text-brand-800">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.productId, item.quantity + 1)}
                      className="p-1.5 text-brand-600 hover:text-brand-950 rounded-full cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <p className="font-mono font-bold text-sm text-brand-950 min-w-[70px] text-right">
                    Rs. {(singlePrice * item.quantity).toLocaleString()}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.product.productId)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all hover:scale-110 active:scale-90 duration-200 cursor-pointer ml-1"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>

        {/* Right Block: Professional Checkout Form & Order Information (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-brand-100 p-6 rounded-3xl shadow-xs space-y-6" id="checkout-sidebar">
          
          <h2 className="font-extrabold text-brand-950 text-lg border-b border-brand-50 pb-3 flex items-center gap-2">
            Secure checkout
          </h2>

          {/* Form Side Display of Order Information (Product Name, Quantity, Total Amount for each) */}
          <div className="space-y-3 bg-brand-50/60 p-4 rounded-2xl border border-brand-100/50" id="form-order-info bg-brand-50">
            <h3 className="text-xs font-extrabold text-brand-900 uppercase tracking-widest font-mono border-b border-brand-100/60 pb-1.5 mb-2">
              Order Information
            </h3>
            
            <div className="space-y-2.5">
              {cart.map((item) => (
                <div key={item.product.productId} className="flex justify-between items-start text-xs border-b border-dashed border-brand-100/60 pb-2 last:border-0 last:pb-0">
                  <div className="max-w-[75%]">
                    <p className="font-bold text-brand-950 line-clamp-1">{item.product.name}</p>
                    <p className="text-[10px] text-brand-500">Quantity: <span className="font-mono font-semibold text-brand-800">{item.quantity}</span></p>
                  </div>
                  <p className="font-mono font-bold text-brand-950 text-right">
                    Rs. {((item.product.salePrice ?? item.product.price) * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-brand-200/45 pt-3 space-y-1.5 text-[11px] text-brand-600">
              <div className="flex justify-between items-center">
                <span>Items Subtotal</span>
                <span className="font-mono font-semibold">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center animate-fade-in">
                <span>Delivery Shipping Fee</span>
                <span className="font-mono">
                  {shippingCost === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `Rs. ${shippingCost.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono">Rs. {taxCost.toLocaleString()}</span>
              </div>
              <div className="border-t border-brand-200 pt-2.5 flex justify-between items-center text-brand-950 font-extrabold text-xs">
                <span>Total Amount to Pay</span>
                <span className="font-mono text-base text-brand-950">Rs. {orderGrandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer Information inputs & Verification */}
          {user ? (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs text-brand-800" id="checkout-form-fields">
              
              <h3 className="text-xs font-bold text-brand-950 uppercase tracking-wider font-mono flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-brand-600" />
                Customer Information
              </h3>

              {/* Full Name field */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-brand-900 flex items-center gap-1 text-[11px]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-400">
                    <User className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="E.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-brand-50/50 border border-brand-100 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-brand-300 font-sans text-xs text-brand-950"
                  />
                </div>
              </div>

              {/* Email Address field */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-brand-900 flex items-center gap-1 text-[11px]">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-400">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="john.doe@example.com"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full bg-brand-50/50 border border-brand-100 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-brand-300 font-sans text-xs text-brand-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Phone Number field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-brand-900 flex items-center gap-1 text-[11px]">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-400">
                      <Phone className="h-3.5 w-3.5" />
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-brand-50/50 border border-brand-100 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-brand-300 font-mono text-xs text-brand-950"
                    />
                  </div>
                </div>

                {/* City field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-brand-900 flex items-center gap-1 text-[11px]">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-400">
                      <Building className="h-3.5 w-3.5" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Lahore"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-brand-50/50 border border-brand-100 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-brand-300 font-sans text-xs text-brand-950"
                    />
                  </div>
                </div>
              </div>

              {/* Saved addresses selector */}
              {userProfile?.addresses && userProfile.addresses.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-brand-900 text-[11px]">Or Choose Saved Delivery Address</label>
                  <select
                    value={selectedSavedAddr}
                    onChange={(e) => handleSavedAddrSelect(e.target.value)}
                    className="bg-brand-50 border border-brand-100 rounded-xl p-3 focus:outline-none text-xs cursor-pointer text-brand-950 font-sans"
                  >
                    <option value="">-- Enter dynamic address details instead --</option>
                    {userProfile.addresses.map((addr, idx) => (
                      <option key={idx} value={addr}>{addr}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Delivery address text box */}
              {!selectedSavedAddr && (
                <div className="flex flex-col gap-1.5 animate-fade-in">
                  <label className="font-bold text-brand-900 flex items-center gap-1 text-[11px]">
                    Complete Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-brand-400">
                      <MapPin className="h-3.5 w-3.5" />
                    </span>
                    <textarea
                      required
                      placeholder="House/Apartment #, Street name, Block, Area, Complete Address..."
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full bg-brand-50/50 border border-brand-100 rounded-xl pl-9 pr-3 py-2.5 h-20 focus:outline-none focus:border-brand-300 font-sans text-xs text-brand-950 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Payment selection */}
              <div className="flex flex-col gap-1.5 pt-2">
                <label className="font-bold text-brand-900 text-[11px]">Payment Method</label>
                <div className="grid grid-cols-2 gap-3" id="payment-tabs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-brand-650 bg-brand-50 text-brand-900 font-bold border-emerald-500 text-emerald-800' : 'border-brand-100 bg-white hover:bg-brand-50 text-brand-700'}`}
                  >
                    <LandmarkIcon className="h-4 w-4" />
                    Cash on Delivery (COD)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-brand-650 bg-brand-50 text-brand-900 font-bold' : 'border-brand-100 bg-white hover:bg-brand-50 text-brand-700'}`}
                  >
                    <CreditCard className="h-4 w-4" />
                    Online Card
                  </button>
                </div>
              </div>

              {/* Error messages block */}
              {checkoutError && (
                <div className="bg-red-50 border border-red-100 text-red-800 p-3.5 rounded-xl flex items-start gap-2 animate-fade-in" id="error-alert">
                  <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-left font-sans font-medium leading-normal">
                    {checkoutError}
                  </span>
                </div>
              )}

              {/* Submit Checkout button */}
              <button
                type="submit"
                disabled={checkingOut}
                className="w-full bg-brand-900 hover:bg-brand-800 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wide transition-all mt-4 flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-brand-300"
                id="submit-order-button"
              >
                {checkingOut ? 'Placing Order...' : (
                  <>
                    Confirm & Place Order - Rs. {orderGrandTotal.toLocaleString()}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-brand-400 text-center leading-normal pt-2 flex items-center gap-1 justify-center">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
                Payments fully secured underneath Firebase Rules verification.
              </p>

            </form>
          ) : (
            <div className="pt-4 border-t border-brand-50 text-center space-y-4" id="anon-checkout-prompt">
              <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-left font-sans font-medium leading-normal">
                  <strong>Authentication Required:</strong> Please register some profile locks or log in to secure shipping details and complete this purchase safely.
                </span>
              </div>
              <button
                onClick={openAuth}
                className="w-full bg-brand-900 hover:bg-brand-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                id="anon-auth-button"
              >
                Sign In to Checkout
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

// Simple fallback inline LandMarkIcon component to prevent any missing icon imports issues
function LandmarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 2 7 22 7" />
    </svg>
  );
}
