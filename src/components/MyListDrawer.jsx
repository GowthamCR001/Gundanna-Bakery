import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Send, Sparkles, Cake, Calendar, Edit3, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import bakeryInfo from '../data/bakeryInfo.json';

const OCCASION_OPTIONS = [
  { id: 'Birthday', label: 'Birthday 🎂' },
  { id: 'Anniversary', label: 'Anniversary 💍' },
  { id: 'Wedding Cake', label: 'Wedding Cake 💒' },
  { id: 'Housewarming', label: 'Housewarming 🏡' },
  { id: 'Baby Shower', label: 'Baby Shower 🎈' },
  { id: 'Special Celebration', label: 'Celebration 🎉' }
];

export default function MyListDrawer({ isOpen, onClose, myList, updateQuantity, updateCustomization, clearList }) {
  const [isCounterMode, setIsCounterMode] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  if (!isOpen) return null;

  const totalItemsCount = myList.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalPrice = myList.reduce((sum, entry) => sum + (entry.item.price * entry.quantity), 0);

  const isCakeItem = (item) => {
    if (!item) return false;
    return item.category === 'Birthday Cakes';
  };

  const handleWhatsAppShare = () => {
    if (myList.length === 0) return;
    
    let text = `👋 *${bakeryInfo.name} — Order & Cake Customization List*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    myList.forEach((entry, idx) => {
      text += `${idx + 1}. *${entry.item.name}* (Qty: ${entry.quantity}) = ₹${entry.item.price * entry.quantity}\n`;
      
      if (entry.customization) {
        const { occasion, nameOnCake, eventDate, notes } = entry.customization;
        const hasDetails = (occasion && occasion.trim()) || (nameOnCake && nameOnCake.trim()) || (eventDate && eventDate.trim()) || (notes && notes.trim());
        
        if (hasDetails) {
          text += `   🎂 *CAKE CUSTOMIZATION DETAILS:*\n`;
          if (occasion && occasion.trim()) {
            text += `   • *Occasion:* ${occasion.trim()}\n`;
          }
          if (nameOnCake && nameOnCake.trim()) {
            text += `   • *Name to Write on Cake:* "${nameOnCake.trim()}"\n`;
          }
          if (eventDate && eventDate.trim()) {
            text += `   • *Celebration / Pickup Date:* ${eventDate.trim()}\n`;
          }
          if (notes && notes.trim()) {
            text += `   • *Special Instructions:* ${notes.trim()}\n`;
          }
        }
      }
      text += `\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 *Total Estimated Amount: ₹${totalPrice}*\n`;
    text += `📍 *Pickup Location:* ${bakeryInfo.shortName}, Hassan\n`;
    text += `📞 *Phone:* ${bakeryInfo.phone}`;

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
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[88vh] flex flex-col"
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

                  <div className="space-y-3">
                    {myList.map((entry) => {
                      const cust = entry.customization || {};
                      const hasCust = cust.nameOnCake || cust.occasion || cust.eventDate || cust.notes;

                      return (
                        <div
                          key={entry.item.id}
                          className="p-3 bg-white rounded-xl shadow-xs border border-amber-200/80 space-y-2"
                        >
                          <div className="flex items-center justify-between">
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

                          {/* Highlighted Cake Customization Block for Shopkeeper */}
                          {hasCust && (
                            <div className="p-2.5 bg-amber-100/90 rounded-lg border border-amber-300 text-xs space-y-1 text-amber-950 font-bold">
                              <div className="text-[11px] font-black uppercase text-amber-800 tracking-wider flex items-center gap-1">
                                <Cake className="w-3.5 h-3.5 text-amber-700" />
                                CAKE DETAILS FOR SHOPKEEPER:
                              </div>
                              {cust.occasion && (
                                <div>• <span className="font-extrabold">Occasion:</span> {cust.occasion}</div>
                              )}
                              {cust.nameOnCake && (
                                <div className="text-sm font-black text-rose-900 bg-white/70 px-2 py-0.5 rounded border border-rose-200">
                                  • <span className="underline">Name on Cake:</span> "{cust.nameOnCake}"
                                </div>
                              )}
                              {cust.eventDate && (
                                <div>• <span className="font-extrabold">Event Date:</span> {cust.eventDate}</div>
                              )}
                              {cust.notes && (
                                <div>• <span className="font-extrabold">Notes:</span> {cust.notes}</div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-amber-300 flex items-center justify-between text-lg font-black text-amber-950">
                    <span>Total Amount:</span>
                    <span className="text-xl text-bakery-price">₹{totalPrice}</span>
                  </div>
                </div>
              ) : (
                /* Standard Editable List View */
                <div className="space-y-3">
                  {myList.map((entry) => {
                    const isCake = isCakeItem(entry.item);
                    const cust = entry.customization || {};
                    const isEditingThis = editingItemId === entry.item.id;
                    const hasCust = cust.nameOnCake || cust.occasion || cust.eventDate || cust.notes;

                    return (
                      <div
                        key={entry.item.id}
                        className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5"
                      >
                        {/* Main Item Row */}
                        <div className="flex items-center justify-between gap-3">
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
                                onClick={() => updateQuantity(entry.item, entry.quantity - 1)}
                                className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                                title="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <span className="w-5 text-center font-bold text-xs text-bakery-text">
                                {entry.quantity}
                              </span>

                              <button
                                onClick={() => updateQuantity(entry.item, entry.quantity + 1)}
                                className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                                title="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="font-extrabold text-sm text-slate-900 min-w-[50px] text-right">
                              ₹{entry.item.price * entry.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Cake Customization Bar / Toggle for Cake Items */}
                        {isCake && (
                          <div className="pt-1 border-t border-slate-200/60">
                            {/* Summary / Toggle Trigger */}
                            <div className="flex items-center justify-between gap-2">
                              <button
                                onClick={() => setEditingItemId(isEditingThis ? null : entry.item.id)}
                                className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 flex-1 justify-between ${
                                  hasCust
                                    ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                                    : 'bg-white text-bakery-primary border-bakery-secondary/40 hover:bg-amber-50'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <Cake className="w-3.5 h-3.5 text-bakery-price shrink-0" />
                                  <span className="truncate">
                                    {hasCust ? (
                                      <>
                                        <span className="font-extrabold text-amber-800">
                                          {cust.occasion || 'Cake Details'}:
                                        </span>{' '}
                                        {cust.nameOnCake && `"${cust.nameOnCake}" `}
                                        {cust.eventDate && `(${cust.eventDate})`}
                                      </>
                                    ) : (
                                      'Add Cake Details (Name, Date & Occasion)'
                                    )}
                                  </span>
                                </div>
                                {isEditingThis ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                )}
                              </button>
                            </div>

                            {/* Expanded Customization Form */}
                            {isEditingThis && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 p-3 bg-white rounded-xl border border-amber-200 space-y-2.5 shadow-inner"
                              >
                                <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
                                  <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1">
                                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                                    Customize Cake Order
                                  </span>
                                  <button
                                    onClick={() => setEditingItemId(null)}
                                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600"
                                  >
                                    Done
                                  </button>
                                </div>

                                {/* 1. Occasion Selector Pills */}
                                <div>
                                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                    Select Occasion:
                                  </label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {OCCASION_OPTIONS.map((occ) => {
                                      const isSelected = cust.occasion === occ.id;
                                      return (
                                        <button
                                          key={occ.id}
                                          type="button"
                                          onClick={() =>
                                            updateCustomization(entry.item.id, { occasion: occ.id })
                                          }
                                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                                            isSelected
                                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs scale-102'
                                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                                          }`}
                                        >
                                          {occ.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* 2. Name on Cake Input */}
                                <div>
                                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                    Name / Message to Write on Cake:
                                  </label>
                                  <input
                                    type="text"
                                    value={cust.nameOnCake || ''}
                                    onChange={(e) =>
                                      updateCustomization(entry.item.id, { nameOnCake: e.target.value })
                                    }
                                    placeholder="e.g. Happy Birthday Rahul!"
                                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 bg-slate-50/50 font-medium"
                                  />
                                </div>

                                {/* 3. Event / Delivery Date */}
                                <div>
                                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                    Date of Celebration / Pickup:
                                  </label>
                                  <input
                                    type="date"
                                    value={cust.eventDate || ''}
                                    onChange={(e) =>
                                      updateCustomization(entry.item.id, { eventDate: e.target.value })
                                    }
                                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 bg-slate-50/50 font-medium text-slate-800"
                                  />
                                </div>

                                {/* 4. Special Notes */}
                                <div>
                                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                    Special Request / Notes (Optional):
                                  </label>
                                  <input
                                    type="text"
                                    value={cust.notes || ''}
                                    onChange={(e) =>
                                      updateCustomization(entry.item.id, { notes: e.target.value })
                                    }
                                    placeholder="e.g. Eggless, write in chocolate font, 5 PM pickup"
                                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 bg-slate-50/50 font-medium"
                                  />
                                </div>

                                <div className="pt-1 flex justify-end">
                                  <button
                                    onClick={() => setEditingItemId(null)}
                                    className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-amber-700 transition-colors flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Save Details
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
