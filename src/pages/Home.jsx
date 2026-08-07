import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CategoryTabs from '../components/CategoryTabs';
import SpecialsSection from '../components/SpecialsSection';
import MenuCard from '../components/MenuCard';
import ItemDetailModal from '../components/ItemDetailModal';
import QrModal from '../components/QrModal';
import Footer from '../components/Footer';
import { ArrowUp, Utensils, Sparkles, Filter, Leaf } from 'lucide-react';
import menuData from '../data/menu.json';

const CATEGORY_ORDER = [
  'Bread',
  'Buns',
  'Puffs',
  'Cakes',
  'Birthday Cakes',
  'Biscuits',
  'Snacks',
  'Drinks'
];

const CATEGORY_EMOJIS = {
  'Bread': '🍞',
  'Buns': '🥯',
  'Puffs': '🥐',
  'Cakes': '🍰',
  'Birthday Cakes': '🎂',
  'Biscuits': '🍪',
  'Snacks': '🥨',
  'Drinks': '🥤',
  'Specials': '⭐'
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll listener for back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter items based on search query, category, and veg filter
  const filteredItems = useMemo(() => {
    return menuData.filter((item) => {
      // 1. Veg filter
      if (vegOnly && item.isVeg === false) return false;

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchCategory = item.category.toLowerCase().includes(query);
        return matchName || matchDesc || matchCategory;
      }

      // 3. Category tab filter
      if (selectedCategory !== 'All') {
        return item.category === selectedCategory;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, vegOnly]);

  // Extract specials items (items under category 'Specials' or with popular === true)
  const specialsItems = useMemo(() => {
    return menuData.filter(item => item.category === 'Specials' || item.popular === true).slice(0, 5);
  }, []);

  // Group items by category for rendering structured sections
  const groupedCategories = useMemo(() => {
    const groups = {};
    CATEGORY_ORDER.forEach((cat) => {
      const itemsInCat = filteredItems.filter((item) => item.category === cat);
      if (itemsInCat.length > 0) {
        groups[cat] = itemsInCat;
      }
    });
    return groups;
  }, [filteredItems]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-bakery-bg flex flex-col font-sans relative selection:bg-amber-200">
      {/* Sticky Header */}
      <Navbar
        onOpenQr={() => setIsQrOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {/* Hero Section */}
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          totalMatches={filteredItems.length}
        />

        {/* Category Navigation Bar */}
        <CategoryTabs
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Veg Only Filter Switch */}
        <div className="max-w-4xl mx-auto px-4 pt-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-bakery-primary uppercase tracking-wider text-[11px]">
              Filter:
            </span>
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold border transition-all ${
                vegOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-bakery-text border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Leaf className={`w-3.5 h-3.5 ${vegOnly ? 'text-white' : 'text-emerald-600'}`} />
              <span>Veg Only</span>
            </button>
          </div>

          <div className="text-bakery-muted font-medium text-[11px]">
            Showing <span className="font-bold text-bakery-primary">{filteredItems.length}</span> items
          </div>
        </div>

        {/* 1. Specials Highlights Section (Shown when on 'All' or 'Specials' tab and not actively searching) */}
        {(!searchQuery && (selectedCategory === 'All' || selectedCategory === 'Specials')) && (
          <SpecialsSection
            items={specialsItems}
            onItemClick={(item) => setSelectedItem(item)}
          />
        )}

        {/* 2. Menu Items Container */}
        <div className="max-w-4xl mx-auto px-4 mt-4 space-y-8">
          {/* Active Search Results View */}
          {searchQuery ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-bakery-secondary/30 pb-2">
                <h2 className="text-lg font-bold font-heading text-bakery-primary flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-bakery-price" />
                  Search Results for "{searchQuery}"
                </h2>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-semibold text-bakery-price hover:underline"
                >
                  Clear Search
                </button>
              </div>

              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredItems.map((item, idx) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      index={idx}
                      onItemClick={(item) => setSelectedItem(item)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-6 space-y-3">
                  <div className="w-14 h-14 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center mx-auto text-2xl">
                    🔍
                  </div>
                  <h3 className="font-heading font-bold text-lg text-bakery-primary">
                    No matching items found
                  </h3>
                  <p className="text-xs text-bakery-muted max-w-sm mx-auto">
                    We couldn't find any dish matching "{searchQuery}". Try searching for bun, cake, puff, bread, or biscuits!
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-bakery-primary text-white text-xs font-bold rounded-full shadow hover:bg-bakery-primary/90 transition-colors"
                  >
                    View Full Menu
                  </button>
                </div>
              )}
            </div>
          ) : selectedCategory === 'Specials' ? (
            /* Specials Only view when Specials tab is specifically picked */
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredItems.map((item, idx) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    index={idx}
                    onItemClick={(item) => setSelectedItem(item)}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Standard Categorized Group Sections */
            Object.entries(groupedCategories).map(([category, items]) => {
              // If a specific category tab is selected, filter to that section
              if (selectedCategory !== 'All' && selectedCategory !== category) {
                return null;
              }

              return (
                <section
                  key={category}
                  id={`section-${category.replace(/\s+/g, '-').toLowerCase()}`}
                  className="space-y-3 scroll-mt-32"
                >
                  {/* Category Section Header */}
                  <div className="flex items-center justify-between border-b border-bakery-secondary/25 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{CATEGORY_EMOJIS[category] || '🥐'}</span>
                      <h2 className="text-xl font-bold font-heading text-bakery-primary">
                        {category}
                      </h2>
                    </div>
                    <span className="text-xs text-bakery-muted font-semibold bg-white px-2.5 py-1 rounded-full border border-bakery-secondary/20 shadow-xs">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Category Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((item, idx) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        index={idx}
                        onItemClick={(item) => setSelectedItem(item)}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-5 z-40 p-3 rounded-full bg-bakery-price text-white shadow-bakery-float hover:bg-orange-600 active:scale-95 transition-all duration-300"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Dish Detail Popup Modal */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* QR Code Share Modal */}
      <QrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
      />

      {/* Footer */}
      <Footer onOpenQr={() => setIsQrOpen(true)} />
    </div>
  );
}
