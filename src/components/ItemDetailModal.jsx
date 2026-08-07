import React from 'react';
import { X, Star, CheckCircle, Share2, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import bakeryInfo from '../data/bakeryInfo.json';

export default function ItemDetailModal({ item, onClose }) {
  if (!item) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${item.name} — ${bakeryInfo.name}`,
        text: `Check out ${item.name} (₹${item.price}) at ${bakeryInfo.name}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Menu link copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors shadow"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Large Header Image */}
          <div className="relative w-full h-64 sm:h-72 bg-amber-50 shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Badges Overlay */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="bg-bakery-price text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                  {item.category}
                </span>
                {item.badge && (
                  <span className="bg-amber-400 text-amber-950 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    {item.badge}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold border border-white/20">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{item.rating || '4.9'}</span>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-5 overflow-y-auto space-y-4">
            {/* Title & Price Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 border border-emerald-600 flex items-center justify-center bg-white rounded-sm">
                    <div className={`w-2 h-2 rounded-full ${item.isVeg !== false ? 'bg-emerald-600' : 'bg-red-600'}`} />
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {item.isVeg !== false ? '100% Pure Vegetarian' : 'Non-Vegetarian'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold font-heading text-bakery-text">
                  {item.name}
                </h2>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-bakery-muted font-medium block">Price</span>
                <span className="text-2xl font-extrabold text-bakery-price">
                  ₹{item.price}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-bakery-primary uppercase tracking-wider mb-1">
                Item Overview
              </h4>
              <p className="text-sm text-bakery-text/90 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100/60">
                {item.description}
              </p>
            </div>

            {/* Quality & Freshness Guarantee */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <Clock className="w-4 h-4 text-bakery-primary shrink-0" />
                <div>
                  <span className="font-bold text-bakery-text block">Baked Daily</span>
                  <span className="text-[10px] text-bakery-muted">Piping hot fresh bakes</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-bakery-text block">Quality Ingredients</span>
                  <span className="text-[10px] text-bakery-muted">Pure butter & ghee</span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={handleShare}
                className="flex-1 py-3 px-4 rounded-xl border border-bakery-secondary/40 text-bakery-primary font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-50 active:scale-95 transition-all"
              >
                <Share2 className="w-4 h-4" />
                Share Dish
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-bakery-primary text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-bakery-primary/90 active:scale-95 transition-all shadow-md"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
