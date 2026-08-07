import React from 'react';
import { Search, Star, Sparkles, X, Flame, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import bakeryInfo from '../data/bakeryInfo.json';

export default function Hero({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, totalMatches }) {
  return (
    <section className="relative pt-4 pb-6 px-4 max-w-4xl mx-auto">
      {/* Decorative Warm Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-48 bg-gradient-to-b from-bakery-secondary/20 to-transparent blur-3xl -z-10 pointer-events-none" />

      {/* Hero Header Box */}
      <div className="text-center space-y-3 mb-6">
        {/* Bakery Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-white p-1.5 shadow-xl border-4 border-bakery-secondary overflow-hidden flex items-center justify-center">
            <img src={bakeryInfo.logo} alt={bakeryInfo.name} className="w-full h-full object-contain p-1" />
          </div>
          <span className="absolute -bottom-1 right-0 bg-bakery-price text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> {bakeryInfo.rating}
          </span>
        </motion.div>

        {/* Title & Tagline with Chef Mascot Kannada Graphic Banner */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-2"
        >
          {/* Chef Mascot 3D Kannada Banner */}
          <div className="max-w-md mx-auto relative rounded-2xl bg-gradient-to-r from-amber-100/90 via-orange-50 to-amber-100/90 p-2 sm:p-3 shadow-md border border-amber-300/60 overflow-hidden group">
            <img
              src="/images/bakery-banner-kannada.png"
              alt="ಗುಂಡಣ್ಣ ಬೇಕರಿ Chef Mascot"
              className="w-full h-auto max-h-28 sm:max-h-36 object-contain filter drop-shadow-md group-hover:scale-102 transition-transform duration-300 mx-auto"
            />
          </div>

          <p className="text-sm font-semibold text-bakery-price tracking-wide">
            {bakeryInfo.tagline}
          </p>
          <p className="text-xs text-bakery-muted">
            {bakeryInfo.subTagline}
          </p>
        </motion.div>

        {/* Quick Highlights Pill Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          {bakeryInfo.features.map((feat, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 bg-white/80 border border-bakery-secondary/30 text-bakery-text px-2.5 py-1 rounded-full text-[11px] font-medium shadow-sm">
              <span>{feat.icon}</span>
              <span>{feat.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Prominent Search Bar (Inspired by Reference UI) */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative max-w-xl mx-auto mb-6"
      >
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-bakery-primary/60 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Dish, Bun, Cake, Puff, Tea Snax..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white border border-bakery-secondary/30 text-bakery-text text-sm font-medium shadow-bakery-card placeholder-bakery-muted/70 focus:outline-none focus:ring-2 focus:ring-bakery-price focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Match Counter Feedback */}
        {searchQuery && (
          <div className="mt-2 text-xs text-center text-bakery-primary font-medium flex items-center justify-center gap-1">
            <span>Found</span>
            <span className="font-bold text-bakery-price">{totalMatches}</span>
            <span>items matching "{searchQuery}"</span>
          </div>
        )}
      </motion.div>

      {/* Offer Banner Card (Inspired by Attached Reference Image) */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-bakery-price via-orange-500 to-amber-600 text-white p-4 sm:p-5 shadow-lg border border-orange-400/30"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="space-y-1 max-w-[65%]">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {bakeryInfo.offers[0].badge}
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-heading leading-tight">
                {bakeryInfo.offers[0].title}
              </h3>
              <p className="text-xl sm:text-2xl font-extrabold text-amber-100 font-heading">
                {bakeryInfo.offers[0].discount}
              </p>
              <p className="text-xs text-white/90 line-clamp-1">
                {bakeryInfo.offers[0].description}
              </p>
              <button
                onClick={() => setSelectedCategory('Birthday Cakes')}
                className="mt-2 inline-flex items-center gap-1 bg-white text-bakery-price font-bold text-xs px-3.5 py-1.5 rounded-full shadow hover:bg-amber-50 active:scale-95 transition-all"
              >
                {bakeryInfo.offers[0].action} &rarr;
              </button>
            </div>

            {/* Banner Image */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-white/40 shadow-md shrink-0">
              <img
                src={bakeryInfo.offers[0].image}
                alt="Bakery Offer"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
