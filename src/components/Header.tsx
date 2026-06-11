import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Heart, User, Search, Menu, X, LogOut, LayoutDashboard, Compass, Info, Mail, ChefHat, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  openAuth: () => void;
  setSelectedProductId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({ 
  currentView, 
  setView, 
  openAuth, 
  setSelectedProductId,
  searchQuery,
  setSearchQuery
}: HeaderProps) {
  const { user, userProfile, isAdmin, cartCount, wishlist = [] } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { logout } = useApp();

  const handleNav = (view: string) => {
    setView(view);
    setMobileMenuOpen(false);
    setSelectedProductId(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (currentView !== 'shop') {
      setView('shop');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNav('home')}
            id="global_brand_logo_header"
          >
            <div className="relative bg-gradient-to-tr from-brand-920 from-brand-900 to-amber-500 text-white p-2 sm:p-2.5 rounded-2xl group-hover:from-amber-500 group-hover:to-brand-900 transition-all duration-300 shadow-sm transform group-hover:scale-105">
              <ChefHat className="h-5 sm:h-6 w-5 sm:w-6 stroke-[2]" />
              <div className="absolute -top-1 -right-1 bg-amber-400 text-brand-950 rounded-full p-0.5 shadow-xs animate-pulse">
                <Sparkles className="h-3 w-3 fill-amber-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 
                style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }} 
                className="font-serif font-bold text-lg sm:text-2xl tracking-tight text-brand-950 leading-none group-hover:text-brand-700 transition-colors"
              >
                Smart Kitchen
              </h1>
              <span 
                style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }} 
                className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mt-1 leading-none font-serif block sm:tracking-[0.2em]"
              >
                S t o r e
              </span>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search premium kitchenware..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-brand-50 border border-brand-100 rounded-full py-2 pl-10 pr-4 text-sm text-brand-900 placeholder-brand-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-sans"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-brand-400" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 font-sans text-sm">
            <button 
              onClick={() => handleNav('home')} 
              className={`relative py-1 cursor-pointer transition-colors duration-300 hover:text-brand-800 ${
                currentView === 'home' 
                  ? 'text-brand-950 font-semibold after:scale-x-100' 
                  : 'text-brand-600 font-medium after:scale-x-0'
              } after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-brand-600 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNav('shop')} 
              className={`relative py-1 cursor-pointer transition-colors duration-300 hover:text-brand-800 ${
                currentView === 'shop' 
                  ? 'text-brand-950 font-semibold after:scale-x-100' 
                  : 'text-brand-600 font-medium after:scale-x-0'
              } after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-brand-600 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`}
            >
              Shop
            </button>
            <button 
              onClick={() => handleNav('about')} 
              className={`relative py-1 cursor-pointer transition-colors duration-300 hover:text-brand-800 ${
                currentView === 'about' 
                  ? 'text-brand-950 font-semibold after:scale-x-100' 
                  : 'text-brand-600 font-medium after:scale-x-0'
              } after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-brand-600 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`}
            >
              About
            </button>
            <button 
              onClick={() => handleNav('contact')} 
              className={`relative py-1 cursor-pointer transition-colors duration-300 hover:text-brand-800 ${
                currentView === 'contact' 
                  ? 'text-brand-950 font-semibold after:scale-x-100' 
                  : 'text-brand-600 font-medium after:scale-x-0'
              } after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-brand-600 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`}
            >
              Contact
            </button>
          </nav>

          {/* User Operations */}
          <div className="flex items-center gap-2 sm:gap-4 ml-4">
            
            {/* Wishlist */}
            <button
              onClick={() => handleNav('wishlist')}
              className="relative p-2 text-brand-700 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer"
              title="View Wishlist"
            >
              <Heart className="h-5.5 w-5.5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-4 px-1 flex items-center justify-center text-[9px] font-mono font-bold bg-amber-500 text-white rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart */}
            <button
              onClick={() => handleNav('cart')}
              className="relative p-2 text-brand-700 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="h-5.5 w-5.5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-4 px-1 flex items-center justify-center text-[9px] font-mono font-bold bg-brand-600 text-white rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown Trigger */}
            <div className="relative font-sans">
              {user ? (
                <div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-1 p-1 hover:bg-brand-50 rounded-full transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer"
                  >
                    {userProfile?.photoURL ? (
                      <img 
                        src={userProfile.photoURL} 
                        alt="Profile" 
                        referrerPolicy="no-referrer"
                        className="h-8.5 w-8.5 rounded-full object-cover border-2 border-brand-200"
                      />
                    ) : (
                      <div className="h-8.5 w-8.5 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold font-sans text-sm">
                        {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-brand-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in font-sans">
                      <div className="px-4 py-2.5 border-b border-brand-50">
                        <p className="text-xs text-brand-400 font-mono">Signed in as</p>
                        <p className="font-semibold text-brand-900 truncate text-sm">{userProfile?.displayName}</p>
                        <p className="text-xs text-brand-500 truncate mt-0.5">{user.email}</p>
                      </div>
                      
                      <button
                        onClick={() => { handleNav('profile'); setShowUserDropdown(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-brand-700 hover:bg-brand-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-brand-400" />
                        My Account (Orders)
                      </button>

                      <div className="border-t border-brand-50 my-1"></div>
                      <button
                        onClick={() => { logout(); setShowUserDropdown(false); handleNav('home'); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={openAuth}
                  className="flex items-center gap-2 bg-brand-900 text-white py-2 px-4 rounded-full hover:bg-brand-800 text-sm font-medium transition-all hover:scale-[1.03] active:scale-97 shadow-xs hover:shadow-md cursor-pointer duration-200"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-brand-700 hover:text-brand-500 hover:bg-brand-50 rounded-full cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Grid */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-100 bg-white shadow-lg py-4 px-6 animate-slide-in font-sans">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search kitchenware..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-brand-50 border border-brand-100 rounded-full py-2 pl-10 pr-4 text-sm text-brand-900 placeholder-brand-400"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-brand-400" />
          </div>
          <div className="flex flex-col gap-4 font-medium text-brand-800">
            <button 
              onClick={() => handleNav('home')} 
              className={`flex items-center gap-2 text-left py-2 border-b border-brand-50 ${currentView === 'home' ? 'text-brand-600' : ''}`}
            >
              <Compass className="h-5 w-5 text-brand-400" /> Home
            </button>
            <button 
              onClick={() => handleNav('shop')} 
              className={`flex items-center gap-2 text-left py-2 border-b border-brand-50 ${currentView === 'shop' ? 'text-brand-600' : ''}`}
            >
              <ShoppingBag className="h-5 w-5 text-brand-400" /> Shop
            </button>
            <button 
              onClick={() => handleNav('about')} 
              className={`flex items-center gap-2 text-left py-2 border-b border-brand-50 ${currentView === 'about' ? 'text-brand-600' : ''}`}
            >
              <Info className="h-5 w-5 text-brand-400" /> About
            </button>
            <button 
              onClick={() => handleNav('contact')} 
              className={`flex items-center gap-2 text-left py-2 border-b border-brand-50 ${currentView === 'contact' ? 'text-brand-600' : ''}`}
            >
              <Mail className="h-5 w-5 text-brand-400" /> Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
