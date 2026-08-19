import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'All', label: 'All Items', icon: '🍽️' },
  { id: 'Specials', label: 'Specials', icon: '⭐' },
  { id: 'Gallery', label: 'Cake Gallery', icon: '📸' },
  { id: 'Bread', label: 'Bread', icon: '🍞' },
  { id: 'Buns', label: 'Buns', icon: '🥯' },
  { id: 'Puffs', label: 'Puffs', icon: '🥐' },
  { id: 'Cakes', label: 'Cakes', icon: '🍰' },
  { id: 'Birthday Cakes', label: 'Birthday Cakes', icon: '🎂' },
  { id: 'Biscuits', label: 'Biscuits', icon: '🍪' },
  { id: 'Snacks', label: 'Snacks', icon: '🥨' },
  { id: 'Drinks', label: 'Drinks', icon: '🥤' }
];

export default function CategoryTabs({ selectedCategory, setSelectedCategory, activeSection }) {
  const containerRef = useRef(null);

  // Scroll active tab into view when selectedCategory changes
  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.querySelector(`[data-category="${selectedCategory}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedCategory]);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'All') {
      window.scrollTo({ top: 320, behavior: 'smooth' });
    } else {
      const el = document.getElementById(`section-${catId.replace(/\s+/g, '-').toLowerCase()}`);
      if (el) {
        const yOffset = -120; // Offset for sticky navbar & category tabs
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="sticky top-[60px] z-30 bg-bakery-bg/95 backdrop-blur-md py-2.5 border-y border-bakery-secondary/20 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between gap-2">
        {/* Section Label */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-bakery-primary uppercase tracking-wider shrink-0">
          <span>Explore</span>
        </div>

        {/* Scrollable Pills List */}
        <div
          ref={containerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 w-full"
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                data-category={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`relative shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-bakery-price text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                    : 'bg-white text-bakery-text border border-bakery-secondary/25 hover:bg-amber-50/80 active:scale-95'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.label}</span>

                {/* Active Underline Pill Animation */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 rounded-full border-2 border-orange-400 pointer-events-none"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
