import React from 'react';
import { Star, Sparkles, Plus, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SpecialsSection({ items, onItemClick }) {
  if (!items || items.length === 0) return null;

  return (
    <section id="section-specials" className="py-6 px-4 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-bakery-primary">
              Bakery Specials
            </h2>
          </div>
          <p className="text-xs text-bakery-muted mt-0.5">
            Most loved recipes freshly prepared every single morning
          </p>
        </div>
        <span className="text-xs font-bold text-bakery-price bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
          {items.length} Must Try Items
        </span>
      </div>

      {/* Specials Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            onClick={() => onItemClick(item)}
            className="group relative bg-white rounded-2xl p-3.5 border border-bakery-secondary/25 shadow-bakery-card hover:shadow-bakery-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* Top Badges */}
            <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden mb-3 bg-amber-50">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80';
                }}
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

              {/* Special Badge */}
              <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                <span className="bg-bakery-price text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md tracking-wider uppercase flex items-center gap-1">
                  {item.badge || '⭐ Bestseller'}
                </span>
              </div>

              {/* Veg Indicator Badge */}
              <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm p-1 rounded-md shadow border border-slate-200">
                <div className={`w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                </div>
              </div>

              {/* Rating Pill */}
              <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{item.rating || '4.9'}</span>
              </div>

              {/* Quick View Prompt */}
              <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-bakery-primary text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow">
                <Eye className="w-3 h-3" /> Quick View
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-bakery-text group-hover:text-bakery-price transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-bakery-muted line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Price & Action Footer */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                <div>
                  <span className="text-[10px] text-bakery-muted font-medium block">Price</span>
                  <span className="text-lg font-extrabold text-bakery-price">
                    ₹{item.price}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 bg-bakery-bg border border-bakery-secondary/30 text-bakery-primary text-xs font-bold px-3 py-1.5 rounded-full group-hover:bg-bakery-primary group-hover:text-white transition-all shadow-sm">
                  View Details &rarr;
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
