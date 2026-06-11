import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Flame, Sparkles, Compass, Award, Shield, CheckCircle } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  tagline: string;
  description: string;
  ctaText: string;
}

interface MainHeroSliderProps {
  setView: (view: string) => void;
  setCategoryFilter: (cat: string) => void;
}

export default function MainHeroSlider({ setView, setCategoryFilter }: MainHeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides: Slide[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&auto=format&fit=crop&q=80",
      badge: "Thermal Dynamics",
      badgeIcon: <Flame className="h-3.5 w-3.5 text-amber-400 animate-pulse" />,
      title: "The Fire Of Gastronomy",
      tagline: "Engineered with restaurant-grade titanium and high-purity copper core for absolute heat dynamics.",
      description: "Experience immediate temperature feedback and perfect thermal distribution designed for master-chefs and gourmet home cooking alike.",
      ctaText: "Explore Heat Range"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=1600&auto=format&fit=crop&q=80",
      badge: "Cryo-Tempered Steel",
      badgeIcon: <Award className="h-3.5 w-3.5 text-blue-400" />,
      title: "Legendary Sharpness",
      tagline: "Damascus steel blades frozen rapidly to -320°F to guarantee legendary, everlasting sharpness.",
      description: "Individually balanced and forged with 67 layers of low-impurity high-carbon steel, creating the world's most elegant cutting feel.",
      ctaText: "Shop Fine Cutlery"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=1600&auto=format&fit=crop&q=80",
      badge: "Heirloom Collections",
      badgeIcon: <Sparkles className="h-3.5 w-3.5 text-yellow-400" />,
      title: "Dual-Process Cast Iron",
      tagline: "Forged with dual-process seasoning to enrich natural food caramelization with every cook.",
      description: "Our signature sand-cast iron vessels require zero complex maintenance, building a superior non-stick glide naturally over generations.",
      ctaText: "Discover Cast Iron"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1600&auto=format&fit=crop&q=80",
      badge: "Smart Brewing Systems",
      badgeIcon: <Compass className="h-3.5 w-3.5 text-emerald-400" />,
      title: "Intelligent Brewing",
      tagline: "Target temp curves and solid state sensors calibrated specifically for the connoisseur's palate.",
      description: "Maintain water purity and lock down precision pour-over speeds. Designed to synchronize water pressure with custom micro-applet presets.",
      ctaText: "View Smart Brewing"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&auto=format&fit=crop&q=80",
      badge: "High Gastronomy Plating",
      badgeIcon: <CheckCircle className="h-3.5 w-3.5 text-pink-400" />,
      title: "Artistry Of Presentation",
      tagline: "Sleek, ergonomic plates and presentation boards designed to complement your master creations.",
      description: "Constructed with premium impact-resistant vitrified porcelain and raw grain acacia, highlighting visual depth for unforgettable presentations.",
      ctaText: "Shop Table Art"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&auto=format&fit=crop&q=80",
      badge: "Pastry Thermodynamic",
      badgeIcon: <Award className="h-3.5 w-3.5 text-purple-400" />,
      title: "Pastisserie Secrets",
      tagline: "Micro-perforated baking mats and marble pastry slabs designed for precise thermodynamic stability.",
      description: "Get perfect crust separation and temperature-neutral handling for pastry doughs. High humidity resistant materials built for fine baking.",
      ctaText: "Explore Bakingware"
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1600&auto=format&fit=crop&q=80",
      badge: "Culinary Preservations",
      badgeIcon: <Shield className="h-3.5 w-3.5 text-indigo-400" />,
      title: "Organic Intentions",
      tagline: "Every ingredient honored, preserved, and handled with hyper-sanitary molecular-grade materials.",
      description: "Introduce custom airflow organizers and raw ceramic produce vaults constructed to prolong nutrient vitality and absolute food safety.",
      ctaText: "Browse Organizers"
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=1600&auto=format&fit=crop&q=80",
      badge: "Luxury Metallurgy",
      badgeIcon: <Flame className="h-3.5 w-3.5 text-amber-500" />,
      title: "Master Multi-Clad",
      tagline: "Laminated multi-clad cookware designed to elevate professional and home culinary workflows alike.",
      description: "Seven individual metal sheets layered for instant response. Zero hot spots, maximum flavor retention, and compatibility with all cooking surfaces.",
      ctaText: "Learn About Metals"
    }
  ];

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Autoplay Logic
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(interval);
  }, [isHovered, handleNext]);

  return (
    <div 
      className="relative w-full overflow-hidden"
      id="main-hero-slider-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider viewport */}
      <div className="relative h-[550px] sm:h-[600px] lg:h-[650px] w-full rounded-3xl overflow-hidden bg-brand-950 shadow-2xl">
        
        {/* Animated Slide Elements */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 w-full h-full"
            id={`slide-content-${current}`}
          >
            {/* Background Image with Rich Shadow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-900/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-transparent to-brand-950/20 z-10" />
            <img 
              src={slides[current].image} 
              alt={slides[current].title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-45 filter saturate-[85%]"
            />

            {/* Slide Content Sheet - Grid Alignment */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 md:px-16 flex flex-col items-start text-left">
                
                {/* Floating Modern Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-brand-900/80 border border-brand-700/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-full backdrop-blur-md mb-6"
                >
                  {slides[current].badgeIcon}
                  <span>{slides[current].badge}</span>
                </motion.div>

                {/* Main Heading Title in Modern Display Font */}
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-sans drop-shadow-md mb-4"
                >
                  {slides[current].title}
                </motion.h2>

                {/* THE PRIZED TIMES NEW ROMAN TAGLINE / SUBTITLE */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.7 }}
                  className="mb-4 max-w-2xl"
                >
                  <p 
                    style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }} 
                    className="text-base sm:text-xl md:text-2xl lg:text-3xl italic text-amber-100 tracking-wide font-normal leading-relaxed text-shadow-xs"
                  >
                    “{slides[current].tagline}”
                  </p>
                </motion.div>

                {/* Supporting description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                  className="text-brand-200 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mb-8 opacity-90 hidden sm:block"
                >
                  {slides[current].description}
                </motion.p>

                {/* Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.5 }}
                  className="flex flex-wrap gap-4"
                >
                  <button
                    onClick={() => { setCategoryFilter('All'); setView('shop'); }}
                    className="bg-amber-500 hover:bg-amber-600 active:scale-95 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20 text-brand-950 font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    {slides[current].ctaText}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView('about')}
                    className="bg-white/10 hover:bg-white/20 active:scale-95 hover:scale-105 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-full text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer backdrop-blur-xs"
                  >
                    Engineering Science
                  </button>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-brand-950/45 border border-white/10 text-white hover:bg-brand-550 hover:border-brand-400 transition-all cursor-pointer backdrop-blur-md group"
          aria-label="Previous Slide"
          id="hero-slider-prev-btn"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-brand-950/45 border border-white/10 text-white hover:bg-brand-550 hover:border-brand-400 transition-all cursor-pointer backdrop-blur-md group"
          aria-label="Next Slide"
          id="hero-slider-next-btn"
        >
          <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Dynamic Dots Indicator Bar */}
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-brand-950/60 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-md"
          id="hero-slider-indicators"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                index === current 
                  ? 'w-7 h-2 bg-amber-400' 
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Subtle slide index counter top-right */}
        <div className="absolute top-6 right-6 z-30 bg-brand-950/50 border border-white/10 rounded-full py-1.5 px-3.5 font-mono text-[11px] font-semibold text-white/85 backdrop-blur-md">
          {current + 1} <span className="opacity-45">/</span> {slides.length}
        </div>

      </div>
    </div>
  );
}
