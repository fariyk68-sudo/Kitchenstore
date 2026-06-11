import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { ArrowLeft, Star, ShoppingBag, Plus, Minus, Tag, ShieldCheck, MailWarning, Clock, MessageSquare, Heart } from 'lucide-react';

interface ShopViewProps {
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  searchQuery: string;
  openAuth: () => void;
  setView?: (view: string) => void;
}

export default function ShopView({
  categoryFilter,
  setCategoryFilter,
  selectedProductId,
  setSelectedProductId,
  searchQuery,
  openAuth,
  setView
}: ShopViewProps) {
  const { 
    products, 
    categories, 
    cart, 
    addToCart, 
    getProductReviews, 
    submitReview, 
    user, 
    userProfile, 
    toggleWishlist 
  } = useApp();

  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low' | 'rating'>('featured');
  const [selectedThumbIndex, setSelectedThumbIndex] = useState(0);

  // Review fields input
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Selector quantities for add-to-cart
  const [buyQty, setBuyQty] = useState(1);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => prev?.text === text ? null : prev);
    }, 3500);
  };

  // Match the currently viewed product
  const activeProduct = products.find(p => p.productId === selectedProductId);

  // 1. FILTERING & SORTING LOGIC
  const currentCatalog = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const isVisible = p.status === 'active' || p.status === 'out_of_stock';
    return matchesSearch && matchesCategory && isVisible;
  });

  const sortedCatalog = [...currentCatalog].sort((a, b) => {
    if (sortBy === 'low-high') {
      const pA = a.salePrice ?? a.price;
      const pB = b.salePrice ?? b.price;
      return pA - pB;
    }
    if (sortBy === 'high-low') {
      const pA = a.salePrice ?? a.price;
      const pB = b.salePrice ?? b.price;
      return pB - pA;
    }
    if (sortBy === 'rating') {
      return (b.ratings ?? 0) - (a.ratings ?? 0);
    }
    return b.createdAt.localeCompare(a.createdAt); // featured/recent by default
  });

  // 2. PRODUCT DETAILS RENDERING
  if (activeProduct) {
    const isLiked = userProfile?.wishlist?.includes(activeProduct.productId) || false;
    const isOutOfStock = activeProduct.stockQuantity <= 0 || activeProduct.status === 'out_of_stock';
    const hasDiscount = !!activeProduct.salePrice && activeProduct.salePrice < activeProduct.price;
    const activePrice = activeProduct.salePrice ?? activeProduct.price;
    const activeReviews = getProductReviews(activeProduct.productId);
    
    // Related products in similar category
    const related = products
      .filter(p => p.category === activeProduct.category && p.productId !== activeProduct.productId && p.status === 'active')
      .slice(0, 3);

    const handleIncrement = () => {
      setBuyQty(prev => Math.min(prev + 1, activeProduct.stockQuantity));
    };

    const handleDecrement = () => {
      setBuyQty(prev => Math.max(1, prev - 1));
    };

    const handleAddToCartSubmit = () => {
      addToCart(activeProduct, buyQty);
      triggerToast(`${buyQty} premium tool(s) successfully added to Cart!`, 'success');
      setBuyQty(1);
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
        openAuth();
        return;
      }
      if (!reviewComment.trim()) return;

      setSubmittingReview(true);
      try {
        await submitReview(activeProduct.productId, reviewRating, reviewComment);
        setReviewComment('');
        setReviewRating(5);
        triggerToast('Review published! Thank you for the culinary feedback.', 'success');
      } catch (err) {
        triggerToast('Could not publish review. Verify Firestore rule constraints.', 'error');
      } finally {
        setSubmittingReview(false);
      }
    };

    return (
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans animate-fade-in space-y-16">
        {/* Floating Custom Toast */}
        {toastMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-950 text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 border border-brand-800 text-xs sm:text-sm animate-fade-in">
            <span className={`h-2.5 w-2.5 rounded-full ${toastMessage.type === 'success' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400 animate-pulse'}`}></span>
            <span className="font-sans font-medium text-white">{toastMessage.text}</span>
          </div>
        )}
        
        {/* Back navigation Row */}
        <button
          onClick={() => { setSelectedProductId(null); setSelectedThumbIndex(0); }}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600 hover:text-brand-900 cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5" /> Back to Store List
        </button>

        {/* Primary Info Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-4">
          
          {/* Left Block: Image View & Selector thumbnails */}
          <div className="space-y-4">
            <div className="aspect-square bg-white border border-brand-100 rounded-3xl overflow-hidden shadow-xs relative">
              <img 
                src={activeProduct.images[selectedThumbIndex] || activeProduct.images[0]} 
                alt={activeProduct.name} 
                className="w-full h-full object-cover transition-all"
                referrerPolicy="no-referrer"
              />
              
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-red-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-md">
                  On Sale
                </span>
              )}
            </div>

            {/* Thumbnails list */}
            {activeProduct.images.length > 1 && (
              <div className="flex gap-3">
                {activeProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedThumbIndex(idx)}
                    className={`h-20 w-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${selectedThumbIndex === idx ? 'border-brand-600 shadow-md' : 'border-brand-100 opacity-80 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Block: Purchase Specs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold text-brand-500 uppercase tracking-widest">{activeProduct.category}</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-brand-950 font-sans leading-tight">{activeProduct.name}</h2>
              <div className="flex items-center gap-4 py-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="text-sm font-bold font-mono">{activeProduct.ratings || '5.0'}</span>
                  <span className="text-xs text-brand-400">({activeReviews.length} reviews)</span>
                </div>
                <span className="text-brand-200">|</span>
                <span className="text-xs font-mono text-brand-400">SKU: {activeProduct.sku}</span>
              </div>
            </div>

            {/* Pricing group */}
            <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-brand-400">Target Value</p>
                <div className="flex items-baseline gap-2.5 mt-0.5 mt-1">
                  {hasDiscount ? (
                    <>
                      <span className="text-3xl font-bold text-brand-950 font-mono">Rs. {activeProduct.salePrice?.toLocaleString()}</span>
                      <span className="text-sm text-brand-400 line-through font-mono">Rs. {activeProduct.price.toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-brand-950 font-mono">Rs. {activeProduct.price.toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* In-Stock Indicator */}
              <div className="text-right">
                {isOutOfStock ? (
                  <span className="bg-red-50 text-red-700 border border-red-100 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider">Out Of Stock</span>
                ) : (
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider">In Stock</span>
                    <span className="text-[10px] text-brand-400 font-mono mt-1">{activeProduct.stockQuantity} items in Firestore</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description details */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-brand-950 text-sm">Product Overview</h4>
              <p className="text-brand-750 text-sm leading-relaxed">{activeProduct.description}</p>
            </div>

            {/* Quantity Stepper and Wishlist toggle */}
            {!isOutOfStock && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-brand-100">
                
                {/* Stepper */}
                <div className="flex items-center border border-brand-200 rounded-full p-1 bg-white">
                  <button
                    onClick={handleDecrement}
                    className="p-2 text-brand-600 hover:text-brand-900 rounded-full cursor-pointer hover:bg-brand-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-sm text-brand-900">{buyQty}</span>
                  <button
                    onClick={handleIncrement}
                    className="p-2 text-brand-600 hover:text-brand-900 rounded-full cursor-pointer hover:bg-brand-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCartSubmit}
                  className="flex-1 bg-brand-900 hover:bg-brand-800 text-white font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  Add to cart - Rs. {(activePrice * buyQty).toLocaleString()}
                </button>

                <button
                  onClick={() => { if(!user) openAuth(); else toggleWishlist(activeProduct.productId); }}
                  className={`p-3.5 rounded-full border transition-all cursor-pointer ${isLiked ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-brand-700 border-brand-200 hover:bg-brand-50'}`}
                  title={isLiked ? "Linked in Wishlist" : "Bookmark in Wishlist"}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>

              </div>
            )}

            {/* Trust points */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-100 text-xs text-brand-600">
              <div className="flex gap-2"><Tag className="h-4.5 w-4.5 text-brand-400 shrink-0" /> Verified SKU: {activeProduct.sku}</div>
              <div className="flex gap-2"><ShieldCheck className="h-4.5 w-4.5 text-brand-400 shrink-0" /> Lifetime Cookware Guarantee</div>
            </div>

          </div>
        </div>

        {/* Dynamic Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-brand-100">
          
          {/* Review write block (1/3) */}
          <div className="bg-white border border-brand-100 p-6 rounded-3xl shadow-xs self-start">
            <h4 className="font-bold text-brand-950 text-base mb-4 font-sans">Publish Your Experience</h4>
            
            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                {/* Rating selection stars */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-800">Assign Rating Stars</label>
                  <div className="flex gap-1.5 text-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`text-2xl transition-all cursor-pointer ${star <= reviewRating ? 'text-amber-500 hover:scale-110' : 'text-brand-200 hover:scale-105'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-800">Review Comments</label>
                  <textarea
                    required
                    placeholder="Describe how this device optimizes your daily cooking routines..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="bg-brand-50 border border-brand-100 rounded-xl p-3 h-24 focus:outline-hidden resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-brand-950 text-white font-bold py-3.5 rounded-xl transition-all h-11 flex items-center justify-center cursor-pointer disabled:bg-brand-350"
                >
                  {submittingReview ? 'Dispatching...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="space-y-3.5 text-center py-6 text-brand-650">
                <MailWarning className="h-10 w-10 text-amber-500 mx-auto" />
                <p className="text-xs">You must authenticate your user registration to publish item assessments.</p>
                <button
                  onClick={openAuth}
                  className="bg-brand-900 text-white font-semibold py-2 px-5 rounded-full text-xs hover:bg-brand-800 cursor-pointer"
                >
                  Sign In Now
                </button>
              </div>
            )}
          </div>

          {/* Reviews list block (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-bold text-brand-950 text-base flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-brand-400" />
              Verified Reviews ({activeReviews.length})
            </h4>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 divide-y divide-brand-50">
              {activeReviews.map((rev) => (
                <div key={rev.reviewId} className="pt-4 first:pt-0">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-brand-950 text-sm">{rev.userName}</p>
                    <span className="text-[10px] text-brand-400 font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex text-amber-400 my-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span key={idx} className="text-sm">
                        {idx < rev.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>

                  <p className="text-brand-850 text-xs leading-relaxed font-sans">{rev.comment}</p>
                </div>
              ))}

              {activeReviews.length === 0 && (
                <div className="text-center py-12 text-brand-400 border border-dashed border-brand-200 rounded-2xl bg-white/50">
                  No verified experiences listed. Be the first to publish a review!
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 3. RELATED ITEMS GRID */}
        {related.length > 0 && (
          <div className="pt-12 border-t border-brand-100">
            <h3 className="font-bold text-brand-950 text-lg mb-6">Coordinate With More Sets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <ProductCard 
                  key={p.productId} 
                  product={p} 
                  onSelect={setSelectedProductId} 
                  openAuth={openAuth}
                  setView={setView}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    );
  }

  // 3. PRODUCT CATALOG GRID VIEW
  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans animate-fade-in">
      {/* Floating Custom Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-950 text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 border border-brand-800 text-xs sm:text-sm animate-fade-in">
          <span className={`h-2.5 w-2.5 rounded-full ${toastMessage.type === 'success' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400 animate-pulse'}`}></span>
          <span className="font-sans font-medium text-white">{toastMessage.text}</span>
        </div>
      )}
      
      {/* Search description indicator line */}
      {searchQuery && (
        <div className="mb-6 text-xs text-brand-500 bg-brand-50 border border-brand-100 rounded-full px-4 py-2 inline-block">
          Showing search results for: <span className="font-bold">"{searchQuery}"</span> ({sortedCatalog.length} items found)
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Sidebar Filter panel */}
        <aside className="space-y-6 lg:col-span-1 hidden lg:block sticky top-28">
          
          {/* Categories Selector */}
          <div className="bg-white border border-brand-100 p-6 rounded-2.5xl space-y-4 shadow-xs">
            <h4 className="font-bold text-brand-950 text-sm uppercase tracking-wider font-mono">Kitchen Categories</h4>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setCategoryFilter('All')}
                className={`text-left px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${categoryFilter === 'All' ? 'bg-brand-900 text-white' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'}`}
              >
                All Series
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.categoryId}
                  onClick={() => setCategoryFilter(cat.name)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${categoryFilter === cat.name ? 'bg-brand-905 bg-brand-900 text-white' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Support Card */}
          <div className="bg-brand-900 text-white p-6 rounded-2.5xl text-xs relative overflow-hidden shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-900 opacity-90 z-0"></div>
            <div className="relative z-10 space-y-3">
              <h4 className="font-bold text-sm">Need Culinary Advice?</h4>
              <p className="leading-relaxed text-brand-200">Our support engineers assist you in choosing the correct copper skill levels or kryo sets.</p>
              <p className="font-mono font-bold text-amber-300">Mon-Sat: +92 326 4126794</p>
            </div>
          </div>

        </aside>

        {/* Right main catalogue section */}
        <main className="lg:col-span-3 space-y-8">
          
          {/* Controls Bar */}
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-brand-100 pb-4">
            <p className="text-xs text-brand-500 font-mono font-medium">
              Showing <span className="font-bold text-brand-900">{sortedCatalog.length}</span> curated kitchen assets
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-400">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-brand-200 rounded-xl px-3 py-1.5 text-xs text-brand-800 focus:outline-hidden cursor-pointer shadow-xs"
              >
                <option value="featured">Featured Fresh</option>
                <option value="low-high">Cost: Low to High</option>
                <option value="high-low">Cost: High to Low</option>
                <option value="rating">Best Customer Ratings</option>
              </select>
            </div>
          </div>

          {/* Mobile Categories Quick Scrollbar */}
          <div className="lg:hidden">
            <p className="text-[10px] text-brand-400 font-mono uppercase tracking-wider mb-2">Filter Collections</p>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
              <button
                onClick={() => setCategoryFilter('All')}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all shrink-0 ${categoryFilter === 'All' ? 'bg-brand-900 text-white shadow-xs' : 'bg-white text-brand-700 border border-brand-100 hover:bg-brand-50'}`}
              >
                All Series
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.categoryId}
                  onClick={() => setCategoryFilter(cat.name)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all shrink-0 ${categoryFilter === cat.name ? 'bg-brand-900 text-white shadow-xs' : 'bg-white text-brand-700 border border-brand-100'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {sortedCatalog.map((product) => (
              <ProductCard 
                key={product.productId} 
                product={product} 
                onSelect={setSelectedProductId} 
                openAuth={openAuth}
                setView={setView}
              />
            ))}
          </div>

          {sortedCatalog.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border border-brand-100 shadow-xs max-w-lg mx-auto p-8 space-y-3">
              <ShoppingBag className="mx-auto h-12 w-12 text-brand-300" />
              <h4 className="text-lg font-bold text-brand-950">Empty Series Matching</h4>
              <p className="text-brand-500 text-xs">No active cooking sets matches the current query or selected categories option.</p>
              <button
                onClick={() => { setCategoryFilter('All'); }}
                className="bg-brand-900 text-white font-semibold py-2 px-5 rounded-full text-xs hover:bg-brand-800 cursor-pointer"
              >
                Reset System Categories
              </button>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
