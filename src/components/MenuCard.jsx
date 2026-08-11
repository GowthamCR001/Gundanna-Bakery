import React from 'react';
import { Star, CheckCircle, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MenuCard({ item, onItemClick, quantity = 0, onUpdateQuantity, index = 0 }) {
  const handleAdd = (e) => {
    e.stopPropagation();
    onUpdateQuantity(item, 1);
  };

  const handleMinus = (e) => {
    e.stopPropagation();
    onUpdateQuantity(item, quantity - 1);
  };

  const handlePlus = (e) => {
    e.stopPropagation();
    onUpdateQuantity(item, quantity + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      onClick={() => onItemClick(item)}
      className="group bg-white rounded-xl p-3 border border-bakery-secondary/20 shadow-sm hover:shadow-bakery-card hover:border-bakery-secondary/40 transition-all duration-200 cursor-pointer flex gap-3.5 items-center justify-between"
    >
      {/* Left: Content Details */}
      <div className="flex-1 min-w-0 space-y-1">
        {/* Badges & Veg Tag */}
        <div className="flex items-center gap-2">
          {/* Veg / Non-Veg Icon */}
          <div className="w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center bg-white rounded-sm shrink-0">
            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg !== false ? 'bg-emerald-600' : 'bg-red-600'}`} />
          </div>

          {item.badge && (
            <span className="text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-1.5 py-0.2 rounded uppercase tracking-wide truncate">
              {item.badge}
            </span>
          )}

          {item.rating && (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {item.rating}
            </span>
          )}
        </div>

        {/* Item Title */}
        <h3 className="font-heading font-bold text-sm sm:text-base text-bakery-text group-hover:text-bakery-price transition-colors line-clamp-2 leading-snug">
          {item.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-bakery-muted line-clamp-2 leading-relaxed font-normal">
          {item.description}
        </p>

        {/* Price & Availability Tag */}
        <div className="pt-1 flex items-center gap-2.5">
          <span className="text-base font-extrabold text-bakery-price">
            ₹{item.price}
          </span>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <CheckCircle className="w-2.5 h-2.5" />
            Available
          </span>
        </div>
      </div>

      {/* Right: Item Image & Add to List Button */}
      <div className="relative flex flex-col items-center gap-1.5 shrink-0">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-amber-50 border border-slate-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Add to List Button / Quantity Counter */}
        <div className="w-full">
          {quantity > 0 ? (
            <div className="flex items-center justify-between bg-bakery-primary text-white text-xs font-bold rounded-lg px-2 py-1 shadow-sm">
              <button
                onClick={handleMinus}
                className="p-0.5 hover:bg-white/20 rounded transition-colors"
                title="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold px-1">{quantity}</span>
              <button
                onClick={handlePlus}
                className="p-0.5 hover:bg-white/20 rounded transition-colors"
                title="Increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-1 bg-amber-50 hover:bg-bakery-primary text-bakery-primary hover:text-white border border-bakery-secondary/40 font-bold text-xs py-1 px-2.5 rounded-lg shadow-xs active:scale-95 transition-all"
              title="Add to selection list"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
