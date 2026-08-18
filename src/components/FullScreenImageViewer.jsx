import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FullScreenImageViewer({ src, alt, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const touchDistRef = useRef(null);
  const containerRef = useRef(null);

  // Reset scale and position
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle Mouse Wheel Zooming
  const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const zoomFactor = e.deltaY < 0 ? 1.25 : 0.8;
    setScale((prevScale) => {
      const nextScale = Math.min(Math.max(1, prevScale * zoomFactor), 5);
      if (nextScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return nextScale;
    });
  };

  // Double Click / Double Tap to toggle zoom
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2.5);
    }
  };

  // Dragging / Panning logic for Mouse
  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Pinch-to-Zoom & Touch Panning
  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      touchDistRef.current = getTouchDistance(e.touches);
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchDistRef.current) {
      const newDist = getTouchDistance(e.touches);
      const factor = newDist / touchDistRef.current;
      touchDistRef.current = newDist;

      setScale((prevScale) => {
        const nextScale = Math.min(Math.max(1, prevScale * factor), 5);
        if (nextScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
        return nextScale;
      });
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    touchDistRef.current = null;
    setIsDragging(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between select-none overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Top Header */}
        <div className="w-full flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent z-10 text-white pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full">
              Full Screen Image
            </span>
            {alt && <span className="text-sm font-medium text-slate-300 truncate max-w-xs">{alt}</span>}
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 backdrop-blur-sm active:scale-95"
            title="Close Full Screen"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Image Container */}
        <div
          ref={containerRef}
          className="relative flex-1 w-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
        >
          <motion.img
            src={src}
            alt={alt || 'Full screen preview'}
            className="max-w-full max-h-full object-contain pointer-events-none select-none transition-transform duration-75 ease-out"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
            }}
          />
        </div>

        {/* Bottom Helper Bar (Text only, NO zoom in / zoom out icons) */}
        <div className="w-full py-3 px-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 text-center text-xs text-slate-300 pointer-events-none">
          <p className="font-medium tracking-wide">
            {scale > 1
              ? 'Drag to pan • Double-click or scroll/pinch to reset zoom'
              : 'Scroll wheel or pinch to zoom • Double-click to zoom in'}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
