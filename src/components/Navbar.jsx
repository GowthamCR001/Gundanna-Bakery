import React, { useState, useEffect } from 'react';
import { Phone, Instagram, ShoppingBag, Camera } from 'lucide-react';
import bakeryInfo from '../data/bakeryInfo.json';

export default function Navbar({ onOpenQr, listCount = 0, onOpenList }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'glass-nav shadow-md py-2.5' : 'bg-bakery-bg py-3 border-b border-bakery-secondary/20'}`}>
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between gap-3">
        {/* Left: Bakery Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-white text-bakery-primary flex items-center justify-center font-heading font-bold text-lg shadow-md border-2 border-bakery-secondary overflow-hidden shrink-0">
            <img src={bakeryInfo.logo} alt={bakeryInfo.name} className="w-full h-full object-contain p-0.5" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg sm:text-xl text-bakery-primary leading-tight tracking-wide flex items-center gap-1.5">
              GUNDANNA BAKERY
            </h1>
            <div className="flex items-center gap-2 text-xs text-bakery-muted">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Open Now
              </span>
              <span className="hidden sm:inline">• {bakeryInfo.established}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* My List Counter Button */}
          {listCount > 0 && (
            <button
              onClick={onOpenList}
              className="relative p-2.5 rounded-full bg-amber-100 text-bakery-price hover:bg-amber-200 active:scale-95 transition-all flex items-center justify-center shadow-xs"
              title="View My Selection List"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-bakery-price text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                {listCount}
              </span>
            </button>
          )}

          {/* Cake Gallery Button */}
          <button
            onClick={() => {
              const el = document.getElementById('section-gallery');
              if (el) {
                const yOffset = -120;
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-100/80 hover:bg-amber-200/80 text-bakery-primary text-xs font-bold transition-all border border-amber-300/60 active:scale-95"
            title="Explore Custom Cake Gallery"
          >
            <Camera className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden xs:inline">Gallery</span>
          </button>

          {/* Quick Call */}
          <a
            href={`tel:${bakeryInfo.phone}`}
            className="p-2.5 rounded-full bg-bakery-secondary/15 text-bakery-primary hover:bg-bakery-secondary/30 transition-colors flex items-center justify-center"
            title="Call Bakery"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* Instagram QR Button */}
          <button
            onClick={onOpenQr}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all"
            title="View Instagram QR & Profile"
          >
            <Instagram className="w-4 h-4 text-white" />
            <span className="hidden xs:inline">Insta QR</span>
          </button>
        </div>
      </div>
    </header>
  );
}
