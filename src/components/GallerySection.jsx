import React, { useState, useMemo } from 'react';
import { Camera, Maximize2, Sparkles, MessageCircle, Cake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGalleryImages } from '../utils/galleryResolver';
import FullScreenImageViewer from './FullScreenImageViewer';
import bakeryInfo from '../data/bakeryInfo.json';

export default function GallerySection() {
  const [selectedViewImage, setSelectedViewImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically load gallery images from Gallery_images folder
  const allGalleryImages = useMemo(() => getGalleryImages(), []);

  // Filter gallery images based on search
  const filteredGallery = useMemo(() => {
    if (!searchQuery.trim()) return allGalleryImages;
    const query = searchQuery.toLowerCase();
    return allGalleryImages.filter((img) => img.title.toLowerCase().includes(query));
  }, [allGalleryImages, searchQuery]);

  const handleWhatsAppInquiry = (e, cake) => {
    e.stopPropagation();
    const phone = bakeryInfo.whatsapp || '919483622026';
    const text = encodeURIComponent(
      `Hello Gundanna Bakery! 🎂 I would like to inquire about ordering a custom birthday cake similar to: *${cake.title}* from your gallery.`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <section id="section-gallery" className="py-8 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 border-t border-amber-200/50">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Section Title & Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-amber-200/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Cake className="w-3.5 h-3.5 text-amber-600" />
                Custom Creations
              </span>
              <span className="px-2 py-0.5 rounded-full bg-bakery-price/10 text-bakery-price text-[11px] font-extrabold border border-bakery-price/20">
                {allGalleryImages.length} Designs
              </span>
            </div>
            
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-bakery-primary tracking-tight flex items-center gap-2">
              Custom Cake Gallery
              <span className="text-sm font-normal text-bakery-muted font-sans hidden sm:inline">(ಕಸ್ಟಮೈಸ್ಡ್ ಬರ್ತ್‌ಡೇ ಕೇಕ್ ಗ್ಯಾಲರಿ)</span>
            </h2>

            <p className="text-xs sm:text-sm text-bakery-muted max-w-2xl leading-relaxed">
              Explore our handcrafted artisan birthday cakes! Click any photo to view in full screen or order a custom cake for your celebration.
            </p>
          </div>

          {/* Quick Search inside Gallery */}
          {allGalleryImages.length > 4 && (
            <div className="shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cake gallery..."
                className="px-3 py-1.5 text-xs rounded-full border border-bakery-secondary/30 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 w-full sm:w-48 shadow-xs"
              />
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        {filteredGallery.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredGallery.map((cake, idx) => (
              <motion.div
                key={cake.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                onClick={() => setSelectedViewImage(cake)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-amber-200/80 shadow-xs hover:shadow-lg hover:border-amber-400 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-amber-100/50">
                  <img
                    src={cake.url}
                    alt={cake.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Top Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full shadow-xs border border-amber-200/60">
                      <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-400 animate-pulse" />
                      Custom Design
                    </span>
                  </div>

                  {/* Hover Overlay with Zoom Icon */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 p-2.5 rounded-full bg-white/90 text-amber-800 shadow-md">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Footer Details */}
                <div className="p-3 flex flex-col justify-between flex-1 gap-2 bg-gradient-to-b from-white to-amber-50/30">
                  <div>
                    <h3 className="font-heading font-bold text-xs sm:text-sm text-bakery-text group-hover:text-bakery-primary transition-colors line-clamp-1">
                      {cake.title}
                    </h3>
                    <p className="text-[11px] text-bakery-muted truncate">
                      Handcrafted by Gundanna Bakery
                    </p>
                  </div>

                  {/* WhatsApp Order/Inquire Button */}
                  <button
                    onClick={(e) => handleWhatsAppInquiry(e, cake)}
                    className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1.5 px-2.5 rounded-xl shadow-xs active:scale-95 transition-all mt-1"
                    title="Inquire about ordering this cake on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                    <span>Inquire / Order</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-amber-200 p-6 space-y-2">
            <Camera className="w-10 h-10 mx-auto text-amber-400" />
            <p className="font-bold text-bakery-text text-sm">No cake designs found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-bakery-primary font-bold hover:underline"
            >
              Clear Search Filter
            </button>
          </div>
        )}

      </div>

      {/* Lightbox Full Screen View */}
      <AnimatePresence>
        {selectedViewImage && (
          <FullScreenImageViewer
            src={selectedViewImage.url}
            alt={selectedViewImage.title}
            onClose={() => setSelectedViewImage(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
