import React, { useState } from 'react';
import { Mail, Phone, MapPin, Sparkles, Send, ShieldAlert, CheckCircle2, CookingPot, Layers, Heart } from 'lucide-react';

interface AboutContactViewProps {
  view: 'about' | 'contact';
}

export default function AboutContactView({ view }: AboutContactViewProps) {
  
  // Contact Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSendingMsg(true);
    // Simulate API feedback dispatch
    setTimeout(() => {
      setSendingMsg(false);
      setSubmittedMessage(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmittedMessage(false), 5000);
    }, 1500);
  };

  if (view === 'about') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans animate-fade-in space-y-20">
        
        {/* Intro Hero banner */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-brand-500 bg-brand-50 border border-brand-100 px-3.5 py-1.5 rounded-full inline-block">
            Our Culinary Legacy & Heritage
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-950 tracking-tight font-sans">
            Smart Kitchen <br />
            <span className="text-brand-600">Store</span>
          </h2>
          <p className="text-brand-500 text-sm sm:text-base leading-relaxed">
            Founded with a critical goal: providing the culinary community with beautifully balanced cookware, cutlery and smart automated devices that simplify and enrich the daily kitchen.
          </p>
        </section>

        {/* Brand pillars section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white border border-brand-100 p-6 rounded-2.5xl text-center space-y-3.5 shadow-xs hover:shadow-2xl hover:shadow-brand-900/5 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer transition-all duration-300">
            <div className="bg-brand-50 text-brand-600 p-3 rounded-full max-w-max mx-auto transition-transform duration-300 hover:rotate-6">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-sm text-brand-950 font-sans">67-Layer Forging Craft</h3>
            <p className="text-xs text-brand-500 leading-relaxed">
              Our steel knives are forge-rolled with high-carbon VG-10 steel cores bounded by 66 layers of micro-folded Damascus cladding to insure extreme edge retentions.
            </p>
          </div>

          <div className="bg-white border border-brand-100 p-6 rounded-2.5xl text-center space-y-3.5 shadow-xs hover:shadow-2xl hover:shadow-brand-900/5 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer transition-all duration-300">
            <div className="bg-brand-50 text-brand-600 p-3 rounded-full max-w-max mx-auto transition-transform duration-300 hover:rotate-6">
              <CookingPot className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-sm text-brand-950 font-sans">Ergonomic Thermal Efficiency</h3>
            <p className="text-xs text-brand-500 leading-relaxed">
               Cookware pieces are triple-clad layered with copper cores and magnetic induction alloys. Providing equal, responsive thermal distributions.
            </p>
          </div>

          <div className="bg-white border border-brand-100 p-6 rounded-2.5xl text-center space-y-3.5 shadow-xs hover:shadow-2xl hover:shadow-brand-900/5 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer transition-all duration-300">
            <div className="bg-brand-50 text-brand-600 p-3 rounded-full max-w-max mx-auto transition-transform duration-300 hover:rotate-6">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-sm text-brand-950 font-sans">Connected Kitchen IoT</h3>
            <p className="text-xs text-brand-500 leading-relaxed">
              Our dynamic temperature tea kettles and calorie scale sensors pair securely via local Bluetooth grids, tracking nutrition levels in modern smart frames.
            </p>
          </div>

        </section>

        {/* Narrative blocks */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-brand-50/50 border border-brand-100 rounded-3xl p-8 sm:p-12">
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-sans tracking-tight text-brand-950 leading-tight">
              Sustainability in Premium Materials
            </h3>
            <p className="text-xs sm:text-sm text-brand-505 text-brand-800 leading-relaxed">
              Every Dutch oven features 100% recycled cast iron cores and dual-layer glass enameling. Restricting chemical exposures or metal transfers during long slow cooking processes.
            </p>
            <p className="text-xs sm:text-sm text-brand-505 text-brand-800 leading-relaxed">
              By packaging items inside fully biodegradable soy-ink pulp boards and omitting plastic fillers, we help minimize planetary impact while delivering culinary gears that are built to outlive traditional kitchen devices.
            </p>
          </div>
          
          <div className="group aspect-video bg-brand-100 rounded-2xl overflow-hidden relative border shadow-xs cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80" 
              alt="Artisan Manufacturing Forge" 
              className="w-full h-full object-cover saturate-50 transition-all duration-700 ease-out group-hover:scale-110 group-hover:saturate-100 group-hover:brightness-[1.03]"
              referrerPolicy="no-referrer"
            />
          </div>

        </section>

      </div>
    );
  }

  // CONTACT FORM RENDERING
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans animate-fade-in space-y-12">
      
      <section className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-brand-500 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full inline-block">
          Culinary Support Desk
        </span>
        <h2 className="text-3xl font-extrabold text-brand-950 tracking-tight font-sans">Coordinate With Creators</h2>
        <p className="text-brand-500 text-sm leading-relaxed">
          Need technical assistance with automated scales or want to discuss restaurant orders? Submit an enquiry slip and our representatives will reach out in 24 hours.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Side: Address Details (5 Cols) */}
        <div className="lg:col-span-5 bg-brand-900 text-white p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-lg">
          <div className="absolute inset-x-0 bottom-0 top-0 bg-radial-gradient from-brand-800/10 to-brand-950/90 z-0"></div>
          
          <div className="relative z-10 space-y-6 text-xs">
            <h3 className="font-sans font-bold text-lg text-white mb-6">HQ Coordinates</h3>
            
            <div className="flex gap-4 items-start">
              <div className="bg-white/10 p-2.5 rounded-xl text-amber-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <p className="font-bold text-white leading-tight">Smart Kitchen Store HQ</p>
                <p className="text-brand-300">F-7 Markaz, Islamabad, Pakistan</p>
                <p className="text-brand-300">(Blue Area)</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-white/10 p-2.5 rounded-xl text-brand-300">
                <Phone className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 mt-0.5">
                <p className="font-bold text-white leading-tight">Culinary Hotline</p>
                <p className="text-brand-300 font-mono font-bold text-amber-300">+923264126794</p>
                <p className="text-brand-400">Monday - Saturday • 9:00 AM - 8:00 PM PKT</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-white/10 p-2.5 rounded-xl text-brand-300">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <p className="font-bold text-white leading-tight">Inquiry Address</p>
                <p className="text-brand-300 font-mono">storekitchen344@gmail.com</p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-[10px] text-brand-400 font-mono uppercase tracking-wider leading-normal border-t border-white/10 pt-6 mt-12">
            Fully responsive customer support desks in operation under global time zones.
          </p>
        </div>

        {/* Right Side: Contact Send form (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-brand-100 p-8 rounded-3xl shadow-xs self-stretch">
          <h3 className="font-bold text-brand-950 text-base mb-6 font-sans">Submit Enquiry Slip</h3>
          
          {submittedMessage && (
            <div className="mb-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-4 rounded-xl flex items-start gap-2.5 animate-scale-up">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500 mt-0.5" />
              <span className="font-sans font-medium">
                Enquiry slip successfully logged! In compliance with SLA guarantees, our culinary desk representatives will review your comment and contact you post-haste.
              </span>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 text-xs font-sans">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-brand-800">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chef Pierre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-brand-50 border border-brand-100 rounded-xl py-2.5 px-3.5 focus:outline-hidden"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-brand-800">Your Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. pierre@kitchen.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-brand-50 border border-brand-100 rounded-xl py-2.5 px-3.5 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-brand-800">Message Particulars</label>
              <textarea
                required
                placeholder="Detail your request, wholesale questions, or smart kitchen scale inquiries..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-brand-50 border border-brand-100 rounded-xl p-3.5 h-32 focus:outline-hidden resize-none font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={sendingMsg}
              className="bg-brand-900 hover:bg-brand-800 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-brand-300 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4" />
              {sendingMsg ? 'Dispatching Slip...' : 'Submit inquiry'}
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
