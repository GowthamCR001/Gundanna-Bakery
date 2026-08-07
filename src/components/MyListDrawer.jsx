import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Send, Check, Sparkles, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import bakeryInfo from '../data/bakeryInfo.json';

export default function MyListDrawer({ isOpen, onClose, myList, updateQuantity, clearList }) {
  const [isCounterMode, setIsCounterMode] = useState(false);

  if (!isOpen) return null;

  const totalItemsCount = myList.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalPrice = myList.reduce((sum, entry) => sum + (entry.item.price * entry.quantity), 0);

  const handleWhatsAppShare = () => {
    if (myList.length === 0) return;
    
    let text = `👋 *${bakeryInfo.name} — My Item Selection List*\n\n`;
    myList.forEach((entry, idx) => {
      text += `${idx + 1}. *${entry.item.name}* x ${entry.quantity} = ₹${entry.item.price * entry.quantity}\n`;
    });
    text += `\n💰 *Total Estimated Amount: ₹${totalPrice}*\n\n📍 *Pickup at:* ${bakeryInfo.shortName}, Hassan`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${bakeryInfo.whatsapp}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-sm">
        {/* Overlay Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Drawer / Modal Container */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-bakery-bg/80">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-bakery-price text-white flex items-center justify-center font-bold text-sm shadow">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-bakery-text leading-tight">
                  My Selection List
                </h3>
                <p className="text-[11px] text-bakery-muted font-medium">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected for counter order
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {myList.length > 0 && (
                <button
                  onClick={clearList}
                  className="p-2 rounded-full text-rose-500 hover:bg-rose-50 transition-colors text-xs font-semibold flex items-center gap-1"
                  title="Clear List"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden xs:inline">Clear</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mode Switcher: Standard List vs Big Counter Screen */}
          {myList.length > 0 && (
            <div className="px-5 py-2 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Show screen to shopkeeper at counter
              </span>
              <button
                onClick={() => setIsCounterMode(!isCounterMode)}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  isCounterMode
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'
                }`}
              >
                {isCounterMode ? 'Standard View' : 'Counter Mode 📱'}
              </button>
            </div>
          )}

          {/* Body Content */}
          <div className="p-5 overflow-y-auto flex-1 space-y-3">
            {myList.length > 0 ? (
              isCounterMode ? (
                /* Counter Display Mode: Clean Large Text for Shop Owner */
                <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-300 space-y-3">
                  <div className="text-center border-b border-amber-200 pb-2">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">
                      GUNDANNA BAKERY COUNTER LIST
                    </span>
                    <span className="text-xs text-slate-500">Show this list to shop owner</span>
                  </div>

                  <div className="space-y-2.5">
                    {myList.map((entry) => (
                      <div
                        key={entry.item.id}
                        className="flex items-center justify-between p-3 bg-white rounded-xl shadow-xs border border-amber-200/60"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-bakery-price text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm">
                            {entry.quantity}x
                          </span>
                          <span className="font-bold text-base text-slate-900">
                            {entry.item.name}
                          </span>
                        </div>

                        <span className="font-extrabold text-base text-bakery-price">
                          ₹{entry.item.price * entry.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-amber-300 flex items-center justify-between text-lg font-black text-amber-950">
                    <span>Total Amount:</span>
                    <span className="text-xl text-bakery-price">₹{totalPrice}</span>
                  </div>
                </div>
              ) : (
                /* Standard Editable List View */
                <div className="space-y-2.5">
                  {myList.map((entry) => (
                    <div
                      key={entry.item.id}
                      className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                          src={entry.item.image}
                          alt={entry.item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-bakery-text truncate">
                            {entry.item.name}
                          </h4>
                          <span className="text-xs font-semibold text-bakery-price">
                            ₹{entry.item.price} each
                          </span>
                        </div>
                      </div>

                      {/* Right: Quantity Controls & Subtotal */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-xs">
                          <button
                            onClick={() => updateQuantity(entry.item.id, entry.quantity - 1)}
                            className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="w-5 text-center font-bold text-xs text-bakery-text">
                            {entry.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(entry.item.id, entry.quantity + 1)}
                            className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-extrabold text-sm text-slate-900 min-w-[50px] text-right">
                          ₹{entry.item.price * entry.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Empty List View */
              <div className="text-center py-10 space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto text-3xl">
                  🛒
                </div>
                <h4 className="font-heading font-bold text-lg text-bakery-primary">
                  Your selection list is empty
                </h4>
                <p className="text-xs text-bakery-muted max-w-xs mx-auto">
                  Tap the <strong className="text-bakery-price">+ Add</strong> button on any dish card to build your list for the shopkeeper.
                </p>
              </div>
            )}
          </div>

          {/* Footer Total & Actions */}
          {myList.length > 0 && (
            <div className="p-4 bg-white border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <span className="text-xs text-bakery-muted block">Estimated Total</span>
                  <span className="text-2xl font-extrabold text-bakery-price">
                    ₹{totalPrice}
                  </span>
                </div>

                <div className="text-right text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'} Ready
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleWhatsAppShare}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Send List on WhatsApp
                </button>

                <button
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl bg-bakery-primary hover:bg-bakery-primary/90 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
