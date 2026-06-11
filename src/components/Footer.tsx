import React from 'react';
import { ShoppingBag, Flame, Phone, ShieldCheck, Mail, ArrowRight, ChefHat, Sparkles } from 'lucide-react';

interface FooterProps {
  setView: (v: string) => void;
}

export default function Footer({ setView }: FooterProps) {
  return (
    <footer className="bg-brand-900 text-brand-100 font-sans mt-20 border-t border-brand-800">
      
      {/* Brand values / Perks list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-brand-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-brand-800 text-amber-500 p-3 rounded-2xl">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Rapid Heating / Searing Quality</h4>
              <p className="text-xs text-brand-300">All cookware engineered for perfect heat optimization and distribution.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-brand-800 text-brand-300 p-3 rounded-2xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Lifetime Warranty Guarantee</h4>
              <p className="text-xs text-brand-300">A minimum of 5-year guarantees on all heavy cast irons & digital scales.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-brand-800 text-brand-300 p-3 rounded-2xl">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Expert Kitchen Support</h4>
              <p className="text-xs text-brand-300">Friendly culinary support lines available to fine-tune your workflow.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand details */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative bg-gradient-to-tr from-brand-950 to-amber-500 text-white p-2 rounded-xl">
                <ChefHat className="h-5 w-5 stroke-[2]" />
                <div className="absolute -top-1 -right-1 bg-amber-400 text-brand-950 rounded-full p-0.5 scale-90">
                  <Sparkles className="h-2.5 w-2.5 fill-amber-300" />
                </div>
              </div>
              <h3 
                style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }} 
                className="font-serif font-bold text-lg text-white"
              >
                Smart Kitchen Store
              </h3>
            </div>
            <p className="text-xs text-brand-300 leading-normal">
              Reinventing modern workspaces with elegant culinary devices, artisan titanium tools, copper-core skillets, and automated pantry scales.
            </p>
            <div className="text-xs text-brand-400 font-mono mt-2">
              © 2026 Smart Kitchen Store. All privileges reserved.
            </div>
          </div>

          {/* Column 2: Collections links */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-5 font-mono">Collections</h4>
            <ul className="flex flex-col gap-3 text-xs text-brand-300">
              <li><button onClick={() => setView('shop')} className="hover:text-amber-500 cursor-pointer">Smart Appliances</button></li>
              <li><button onClick={() => setView('shop')} className="hover:text-amber-500 cursor-pointer">Chef Cookware</button></li>
              <li><button onClick={() => setView('shop')} className="hover:text-amber-500 cursor-pointer">Precision Tools</button></li>
              <li><button onClick={() => setView('shop')} className="hover:text-amber-500 cursor-pointer">Storage Systems</button></li>
            </ul>
          </div>

          {/* Column 3: Corporate Info */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-5 font-mono">Company</h4>
            <ul className="flex flex-col gap-3 text-xs text-brand-300">
              <li><button onClick={() => setView('about')} className="hover:text-amber-500 cursor-pointer">Our Craft & Origin</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-amber-500 cursor-pointer">Contact Us</button></li>
              <li><button onClick={() => setView('about')} className="hover:text-amber-500 cursor-pointer">Sustainability</button></li>
              <li><button onClick={() => setView('about')} className="hover:text-amber-500 cursor-pointer">Terms & Privacy</button></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase font-mono">Newsletter</h4>
            <p className="text-xs text-brand-300">Subscribe to receive recipe ideas, fresh product drops, and exclusive flash prices.</p>
            <div className="relative mt-2">
              <input
                type="email"
                placeholder="Submit your email"
                className="w-full bg-brand-800 border border-brand-700 rounded-full py-2.5 pl-4 pr-10 text-xs text-white placeholder-brand-400 focus:outline-hidden focus:border-brand-500"
              />
              <button className="absolute right-1 top-1 p-1.5 bg-brand-600 hover:bg-brand-500 rounded-full transition-all cursor-pointer">
                <ArrowRight className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}
