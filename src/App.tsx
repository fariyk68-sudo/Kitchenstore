/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import CartView from './components/CartView';
import ProfileView from './components/ProfileView';
import AboutContactView from './components/AboutContactView';
import AdminPanel from './components/AdminPanel';
import { MessageCircle } from 'lucide-react';

function MainLayout() {
  const [currentView, setView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sychonize URL path on mount and on popstate
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setView('admin');
      } else if (path === '/profile') {
        setView('profile');
      } else if (path === '/cart') {
        setView('cart');
      } else if (path === '/shop') {
        setView('shop');
      } else if (path === '/about') {
        setView('about');
      } else if (path === '/contact') {
        setView('contact');
      } else {
        setView('home');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Update URL pathname whenever state changes
  useEffect(() => {
    let path = '/';
    if (currentView === 'admin') path = '/admin';
    else if (currentView === 'profile') path = '/profile';
    else if (currentView === 'cart') path = '/cart';
    else if (currentView === 'shop') path = '/shop';
    else if (currentView === 'about') path = '/about';
    else if (currentView === 'contact') path = '/contact';

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  }, [currentView]);

  const handleNavView = (view: string) => {
    // If navigating to wishlist, we route to the unified Profile dashboards showing wishlists
    if (view === 'wishlist') {
      setView('profile');
    } else {
      setView(view);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-between">
      
      {/* 1. Global Navigation header */}
      <Header 
        currentView={currentView}
        setView={handleNavView}
        openAuth={() => setAuthModalOpen(true)}
        setSelectedProductId={setSelectedProductId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 2. Primary dynamic viewport routing */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView 
            setView={setView}
            setCategoryFilter={setCategoryFilter}
            setSelectedProductId={setSelectedProductId}
            openAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentView === 'shop' && (
          <ShopView 
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            searchQuery={searchQuery}
            openAuth={() => setAuthModalOpen(true)}
            setView={setView}
          />
        )}

        {currentView === 'cart' && (
          <CartView 
            setView={setView}
            openAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView 
            setView={setView}
            setSelectedProductId={setSelectedProductId}
          />
        )}

        {(currentView === 'about' || currentView === 'contact') && (
          <AboutContactView 
            view={currentView as 'about' | 'contact'}
          />
        )}

        {currentView === 'admin' && (
          <AdminPanel />
        )}
      </main>

      {/* 3. Infinite footer block */}
      <Footer setView={handleNavView} />

      {/* 4. Auth triggers modal overlays */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* 5. Attractive Floating WhatsApp Contact Button */}
      <a 
        href="https://wa.me/923264126794"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white pl-3.5 pr-4.5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-hidden cursor-pointer"
        aria-label="Message Smart Kitchen Store on WhatsApp"
        id="whatsapp_fixed_contact_button"
      >
        {/* Pulsing visual aura effect */}
        <span className="absolute inset-x-0 inset-y-0 rounded-full bg-emerald-400 opacity-45 animate-ping -z-10"></span>
        
        {/* Floating circle WhatsApp logo background with pulse */}
        <div className="bg-white text-emerald-600 p-1.5 rounded-full flex items-center justify-center shadow-xs">
          <MessageCircle className="h-5 w-5 fill-emerald-600 stroke-white stroke-[2.5]" />
        </div>
        
        <div className="flex flex-col text-left leading-none">
          <span className="text-[9px] font-mono font-bold tracking-wider text-emerald-100 uppercase">Live Assistance</span>
          <span className="text-xs font-bold font-sans mt-0.5">WhatsApp Chat</span>
        </div>
      </a>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
