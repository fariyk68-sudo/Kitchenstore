import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import { 
  Flame, 
  Compass, 
  Award, 
  ArrowRight, 
  Star, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  ThumbsUp, 
  Quote, 
  PackageCheck,
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import MainHeroSlider from './MainHeroSlider';

interface HomeViewProps {
  setView: (view: string) => void;
  setCategoryFilter: (cat: string) => void;
  setSelectedProductId: (id: string | null) => void;
  openAuth: () => void;
}

export default function HomeView({ setView, setCategoryFilter, setSelectedProductId, openAuth }: HomeViewProps) {
  const { products, categories } = useApp();

  // Active products list
  const activeProducts = products.filter(p => p.status === 'active' || p.status === 'out_of_stock');

  // Featured / Best-selling Products (Bestsellers: first 4 active items)
  const bestsellerProducts = activeProducts.slice(0, 4);

  // New Arrivals Products (Sort by date or slice index 4 to 8)
  const newArrivalProducts = activeProducts.length > 4 
    ? activeProducts.slice(4, 8) 
    : activeProducts.slice(0, 4);

  const handleCategoryClick = (catName: string) => {
    setCategoryFilter(catName);
    setView('shop');
  };

  // Static curated premium testimonials for Pakistan kitchen lovers
  const verifiedReviews = [
    {
      id: 'rev-1',
      author: 'Ayesha Khan',
      city: 'Islamabad',
      rating: 5,
      comment: 'Superb quality! I ordered the triple-clad copper chef pan and it was delivered to F-7 within 24 hours. COD option was smooth. Recommended!',
      date: 'Recent Purchase',
      product: 'Triple-Clad Copper series'
    },
    {
      id: 'rev-2',
      author: 'Muhammad Ahmed',
      city: 'Lahore',
      rating: 5,
      comment: 'The automated smart kettle has changed my morning black coffee routine. Beautiful LED layout and temperature control works perfectly. Excellent shop.',
      date: '2 weeks ago',
      product: 'Smart Automated Kettle'
    },
    {
      id: 'rev-3',
      author: 'Fatima Zahra',
      city: 'Karachi',
      rating: 5,
      comment: 'Extremely professional customer support on WhatsApp. Guided me accurately on choosing the right cookware set. Outstanding Pakistani online shopping experience!',
      date: '3 weeks ago',
      product: 'Enameled Dutch Oven Series'
    }
  ];

  return (
    <div className="space-y-20 pb-20 animate-fade-in font-sans">
      
      {/* 1. Curated Slide Slider */}
      <section className="relative px-4 sm:px-6 lg:px-8 mt-5">
        <MainHeroSlider setView={setView} setCategoryFilter={setCategoryFilter} />
      </section>

      {/* 2. Customer Trust Grid - Calibrated for absolute reassurance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-brand-100 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Trust Column 1 */}
            <div className="flex flex-col items-center text-center p-5 space-y-3 bg-brand-50/10 hover:bg-brand-50/40 border border-transparent hover:border-brand-100 rounded-2xl hover:scale-[1.03] hover:shadow-lg hover:shadow-brand-900/5 transition-all duration-300 cursor-pointer">
              <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-full transition-transform duration-300 hover:rotate-6">
                <Truck className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-brand-950 font-sans">Free & Fast Delivery</h4>
              <p className="text-[11px] text-brand-400 leading-normal max-w-[180px]">
                Deliveries across Lahore, Karachi, Islamabad & nationwide in 24-48 hours.
              </p>
            </div>

            {/* Trust Column 2 */}
            <div className="flex flex-col items-center text-center p-5 space-y-3 bg-brand-50/10 hover:bg-brand-50/40 border border-transparent hover:border-brand-100 rounded-2xl hover:scale-[1.03] hover:shadow-lg hover:shadow-brand-900/5 transition-all duration-300 cursor-pointer">
              <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-full transition-transform duration-300 hover:rotate-6">
                <PackageCheck className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-brand-950 font-sans">Cash On Delivery</h4>
              <p className="text-[11px] text-brand-400 leading-normal max-w-[180px]">
                Available across Pakistan. Pay comfortably only upon receiving your box.
              </p>
            </div>

            {/* Trust Column 3 */}
            <div className="flex flex-col items-center text-center p-5 space-y-3 bg-brand-50/10 hover:bg-brand-50/40 border border-transparent hover:border-brand-100 rounded-2xl hover:scale-[1.03] hover:shadow-lg hover:shadow-brand-900/5 transition-all duration-300 cursor-pointer">
              <div className="bg-amber-50 text-amber-700 p-3.5 rounded-full transition-transform duration-300 hover:rotate-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-brand-950 font-sans">100% Encrypted Checkout</h4>
              <p className="text-[11px] text-brand-400 leading-normal max-w-[180px]">
                Fully safe database connections protect your order details and transactions.
              </p>
            </div>

            {/* Trust Column 4 */}
            <div className="flex flex-col items-center text-center p-5 space-y-3 bg-brand-50/10 hover:bg-brand-50/40 border border-transparent hover:border-brand-100 rounded-2xl hover:scale-[1.03] hover:shadow-lg hover:shadow-brand-900/5 transition-all duration-300 cursor-pointer">
              <div className="bg-amber-50 text-amber-700 p-3.5 rounded-full transition-transform duration-300 hover:rotate-6">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-brand-950 font-sans">Risk-Free 7-Day Returns</h4>
              <p className="text-[11px] text-brand-400 leading-normal max-w-[180px]">
                Easy exchanges and quick returns if you face any mechanical issues.
              </p>
            </div>

            {/* Trust Column 5 */}
            <div className="flex flex-col items-center text-center p-5 space-y-3 bg-brand-50/10 hover:bg-brand-50/40 border border-transparent hover:border-brand-100 rounded-2xl hover:scale-[1.03] hover:shadow-lg hover:shadow-brand-900/5 transition-all duration-300 cursor-pointer">
              <div className="bg-brand-50 text-brand-700 p-3.5 rounded-full transition-transform duration-300 hover:rotate-12">
                <ThumbsUp className="h-6 w-6 animate-pulse" />
              </div>
              <h4 className="font-bold text-sm text-brand-950 font-sans">Certified Guarantee</h4>
              <p className="text-[11px] text-brand-400 leading-normal max-w-[180px]">
                100% genuine products directly source-certified for culinary mastership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Discover Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 border-b border-brand-100 pb-5">
          <div>
            <span className="text-[10px] font-bold font-mono tracking-widest text-brand-500 uppercase">
              Curated Collections
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-sans tracking-tight text-brand-950 mt-1">
              Shop by Category
            </h3>
          </div>
          <button
            onClick={() => { setCategoryFilter('All'); setView('shop'); }}
            className="text-xs font-mono font-bold text-brand-600 hover:text-brand-800 uppercase tracking-widest flex items-center gap-1.5 cursor-pointer hover:underline hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            All Items <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat, idx) => (
            <div 
              key={idx}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-xs border border-brand-100 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-brand-900/10 hover-translate-y-[-6px] hover:scale-[1.015]"
              id={`home_category_card_${idx}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-900/20 to-transparent z-10 transition-colors group-hover:from-brand-950/95" />
              <img 
                src={cat.imageUrl} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-[1.03]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                <span className="text-[9px] font-mono tracking-widest text-amber-300 uppercase block mb-1">Explore</span>
                <h4 className="font-bold text-lg tracking-tight leading-snug">{cat.name}</h4>
                <p className="text-[10px] text-brand-200 uppercase font-mono tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                  View Series <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Best-Selling Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] font-mono font-bold tracking-widest text-brand-500 bg-brand-50 border border-brand-100 px-3.5 py-1 rounded-full uppercase">
            🌟 Top Sellers
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight text-brand-950 mt-3 font-sans">
            Best-Selling Kitchen Tech
          </h3>
          <p className="text-brand-500 text-sm mt-2 leading-relaxed">
            Most-voted utensils praised by professional Pakistani chefs and everyday home creators. Handpicked for extreme durability and beauty.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestsellerProducts.map((p) => (
            <ProductCard 
              key={p.productId} 
              product={p} 
              onSelect={setSelectedProductId} 
              openAuth={openAuth}
              setView={setView}
            />
          ))}
        </div>
      </section>

      {/* 5. Interactive Promotional Bento Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-brand-950 via-brand-900 to-amber-900/40 rounded-3xl p-8 sm:p-14 overflow-hidden shadow-lg border border-brand-800">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent hidden lg:block" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
            
            <div className="lg:col-span-3 space-y-5 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-amber-300 uppercase bg-amber-500/10 px-3 py-1 rounded-full">
                <Sparkles className="h-3.5 w-3.5 animate-spin text-amber-400" /> Complete Culinary Redefinition
              </span>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight text-white leading-tight">
                Crafted for Chefs. <br />
                Ready for Every Counter.
              </h3>
              <p className="text-brand-200 text-sm sm:text-base leading-relaxed max-w-xl">
                We design kitchen solutions that function seamlessly while uplifting the visual atmosphere of your home. Every item is calibrated for lifelong usage, with fast cash-on-delivery ready to reach your doorstep anywhere in Pakistan.
              </p>
              <div className="pt-3 flex flex-wrap gap-4">
                <button
                  onClick={() => { setCategoryFilter('All'); setView('shop'); }}
                  className="bg-amber-400 hover:bg-amber-500 text-brand-950 font-extrabold text-xs py-3.5 px-7 rounded-full tracking-wider uppercase transition-all duration-300 hover:scale-[1.03] shadow-md cursor-pointer"
                >
                  Explore Collection
                </button>
                <button
                  onClick={() => setView('about')}
                  className="bg-transparent hover:bg-white/10 text-white border-2 border-white/20 hover:border-white/50 font-bold text-xs py-3.5 px-6 rounded-full tracking-wider uppercase transition-all duration-300 cursor-pointer"
                >
                  Our Crafting Secrets
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-xs border border-white/10 p-5 rounded-2xl space-y-2 hover:bg-white/10 hover:scale-[1.04] cursor-pointer hover:shadow-xl transition-all duration-300">
                <Award className="h-5 w-5 text-amber-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">Cryo-Tempered Knives</h4>
                <p className="text-xs text-brand-300 leading-normal">
                  Rapidly frozen at ultra-deep temperatures to lock in edge retention.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xs border border-white/10 p-5 rounded-2xl space-y-2 hover:bg-white/10 hover:scale-[1.04] cursor-pointer hover:shadow-xl transition-all duration-300">
                <Flame className="h-5 w-5 text-amber-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">Multi-Clad Core Copper</h4>
                <p className="text-xs text-brand-300 leading-normal">
                  Pristine thermic core laminated with restaurant-grade conduction layers.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xs border border-white/10 p-5 rounded-2xl space-y-2 hover:bg-white/10 hover:scale-[1.04] cursor-pointer hover:shadow-xl transition-all duration-300">
                <Compass className="h-5 w-5 text-amber-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">Sensoring System IoT</h4>
                <p className="text-xs text-brand-300 leading-normal">
                  Precise metrics to guarantee mastership and calorie limits.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xs border border-white/10 p-5 rounded-2xl space-y-2 hover:bg-white/10 hover:scale-[1.04] cursor-pointer hover:shadow-xl transition-all duration-300">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">100% Safe Checkout</h4>
                <p className="text-xs text-brand-300 leading-normal">
                  High-speed data protection keeps your orders completely secure.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#fdfdfc] py-14 border border-brand-100 rounded-3xl">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase">
            🔥 Fresh Release
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight text-brand-950 mt-3 font-sans">
            New Culinary Arrivals
          </h3>
          <p className="text-brand-500 text-sm mt-2 leading-relaxed">
            Introducing modern Smart Kitchen Store gear packed with robust engineering features. Be the first to grab our latest collections!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {newArrivalProducts.map((p) => (
            <ProductCard 
              key={`new-${p.productId}`} 
              product={p} 
              onSelect={setSelectedProductId} 
              openAuth={openAuth}
              setView={setView}
            />
          ))}
        </div>
      </section>

      {/* 7. Beautiful Customer Reviews Testimonial Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] font-mono font-bold tracking-widest text-brand-500 bg-brand-50 border border-brand-100 px-3.5 py-1 rounded-full uppercase">
            ❤️ Customer Love
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight text-brand-950 mt-3 font-sans">
            Hear From Our Cooks
          </h3>
          <p className="text-brand-500 text-sm mt-2 leading-relaxed">
            Our priority is a premium, seamless experience. Read reviews from verified customers who made their kitchens smart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {verifiedReviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white border border-brand-100 rounded-2xl p-6 sm:p-8 space-y-4 hover:shadow-2xl hover:shadow-brand-900/5 hover:-translate-y-1 hover:scale-[1.015] cursor-pointer transition-all duration-300 flex flex-col justify-between"
              id={`verified_review_card_${rev.id}`}
            >
              <div className="space-y-3">
                {/* Five Stars Row */}
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-amber-400" />
                  ))}
                </div>
                {/* Review Text */}
                <p className="text-brand-800 text-xs sm:text-sm leading-relaxed italic text-shadow-none">
                  “{rev.comment}”
                </p>
              </div>

              {/* Author & Verified Tag */}
              <div className="flex items-center gap-3 pt-4 border-t border-brand-50">
                <div className="h-10 w-10 bg-brand-50 text-brand-800 rounded-full flex items-center justify-center font-bold text-sm">
                  {rev.author.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-brand-950 text-xs sm:text-sm">{rev.author}</span>
                    <CheckCircle className="h-3 w-3 text-emerald-500 fill-emerald-500 stroke-white" title="Verified Customer" />
                  </div>
                  <span className="text-[10px] text-brand-400 font-medium">
                    Verified Buyer • {rev.city}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
