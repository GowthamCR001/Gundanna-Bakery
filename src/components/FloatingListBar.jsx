import React from 'react';
import { ShoppingBag, ChevronUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingListBar({ myList, onOpenList }) {
  const totalItemsCount = myList.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalPrice = myList.reduce((sum, entry) => sum + (entry.item.price * entry.quantity), 0);

  if (totalItemsCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="fixed bottom-5 left-4 right-4 max-w-md mx-auto z-40"
      >
        <button
          onClick={onOpenList}
          className="w-full bg-gradient-to-r from-bakery-primary via-amber-900 to-bakery-primary text-white p-3.5 rounded-2xl shadow-bakery-float border-2 border-amber-400/50 flex items-center justify-between gap-3 active:scale-98 transition-transform"
        >
          {/* Left: Item Count Badge */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-bakery-price text-white flex items-center justify-center font-extrabold text-sm shadow-md">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-white text-bakery-price text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-bakery-price">
                {totalItemsCount}
              </span>
            </div>

            <div className="text-left">
              <span className="text-xs text-amber-200 font-semibold block leading-tight">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in your list
              </span>
              <span className="text-lg font-black text-white leading-tight">
                ₹{totalPrice}
              </span>
            </div>
          </div>

          {/* Right: Open List Action */}
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs font-bold text-white border border-white/30">
            <span>View List</span>
            <ChevronUp className="w-4 h-4" />
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
