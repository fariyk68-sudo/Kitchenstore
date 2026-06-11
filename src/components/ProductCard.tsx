import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingBag, Star, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string | null) => void;
  openAuth: () => void;
  setView?: (view: string) => void;
  key?: string;
}

export default function ProductCard({ product, onSelect, openAuth, setView }: ProductCardProps) {
  const { user, userProfile, toggleWishlist, addToCart } = useApp();
  
  const isLiked = userProfile?.wishlist?.includes(product.productId) || false;
  const isOutOfStock = product.stockQuantity <= 0 || product.status === 'out_of_stock';
  const hasDiscount = !!product.salePrice && product.salePrice < product.price;
  const percentOff = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100) 
    : 0;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openAuth();
      return;
    }
    try {
      await toggleWishlist(product.productId);
    } catch (err) {
      console.error('Wishlist error', err);
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
      if (setView) {
        setView('cart');
      }
    }
  };

  // Render 5 beautiful star ratings
  const renderStars = (rating: number = 5) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, idx) => (
          <Star 
            key={idx} 
            className={`h-3 w-3 ${
              idx < rounded 
                ? 'fill-amber-400 text-amber-400' 
                : 'text-brand-200'
            }`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div 
      onClick={() => onSelect(product.productId)}
      className="group relative bg-white border border-brand-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-brand-900/5 hover:-translate-y-1.5 hover:scale-[1.01] cursor-pointer flex flex-col h-full font-sans shadow-xs"
      id={`product_card_${product.productId}`}
    >
      {/* 1. Large Image Container with Hover zoom and heart badge */}
      <div className="relative aspect-square w-full bg-brand-50 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-[1.03]"
          referrerPolicy="no-referrer"
          id={`product_image_${product.productId}`}
        />

        {/* Promo Floating Badges - Sale, Out of Stock */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md animate-pulse">
              -{percentOff}% Off
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-brand-900/90 backdrop-blur-xs text-brand-100 text-[10px] font-mono font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Floating Rounded Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all duration-300 transform scale-90 group-hover:scale-100 z-10 ${
            isLiked 
              ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:scale-105 active:scale-95' 
              : 'bg-white/80 text-brand-700 border-white/60 hover:bg-white hover:text-red-500 hover:shadow-md hover:scale-105 active:scale-95'
          } cursor-pointer`}
          title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
          id={`wishlist_btn_${product.productId}`}
        >
          <Heart className={`h-4 w-4 transition-transform duration-200 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* 2. Text Content Description Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Ratings row */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono tracking-wider text-brand-400 capitalize bg-brand-50 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            {renderStars(product.ratings)}
            <span className="text-[10px] text-brand-500 font-medium tracking-tight">
              ({product.reviewsCount || 0})
            </span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="font-bold text-brand-950 text-sm sm:text-base line-clamp-2 leading-tight group-hover:text-brand-600 transition-colors flex-1 mb-2">
          {product.name}
        </h3>

        {/* Pricing Layout */}
        <div className="flex items-baseline justify-between mb-3 border-t border-brand-50 pt-2.5">
          <div className="flex flex-col">
            {hasDiscount ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-bold text-brand-950 font-sans">
                  Rs. {product.salePrice?.toLocaleString()}
                </span>
                <span className="text-xs text-brand-400 line-through font-mono">
                  Rs. {product.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-base sm:text-lg font-bold text-brand-950 font-sans">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
            
            {/* Live Stock Indicators */}
            <div className="mt-0.5">
              {isOutOfStock ? (
                <span className="text-[9px] text-red-500 font-semibold tracking-tight uppercase">Unavailable</span>
              ) : product.stockQuantity <= 5 ? (
                <span className="text-[9px] text-orange-600 font-bold tracking-tight uppercase animate-pulse">
                  Only {product.stockQuantity} Left!
                </span>
              ) : (
                <span className="text-[9px] text-brand-400 font-mono">Free Shipping Eligible</span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Action Buttons - Dual setup (Add to Cart / Buy Now) */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {/* Add to Cart button */}
          <button
            onClick={handleCartClick}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 border cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${
              isOutOfStock 
                ? 'bg-brand-50 text-brand-300 border-brand-100 cursor-not-allowed hover:scale-100 active:scale-100'
                : 'bg-brand-50 hover:bg-brand-100 text-brand-900 border-brand-100 hover:border-brand-200 hover:shadow-xs'
            }`}
            title="Add to basket"
            id={`add_to_cart_btn_${product.productId}`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>

          {/* Buy Now button */}
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold tracking-normal transition-all duration-200 cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${
              isOutOfStock
                ? 'bg-brand-100 text-brand-300 cursor-not-allowed hover:scale-100 active:scale-100'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-brand-950 hover:text-black shadow-xs hover:shadow-md'
            }`}
            title="Order instantly"
            id={`buy_now_btn_${product.productId}`}
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>
    </div>
  );
}
