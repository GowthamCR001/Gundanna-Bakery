import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FullScreenImageViewer({ src, alt, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const touchDistRef = useRef(null);
  const containerRef = useRef(null);

  // Clamp panning position so image stays within container bounds
  const clampPosition = (x, y, currentScale) => {
    if (currentScale <= 1) return { x: 0, y: 0 };
    if (!containerRef.current) return { x, y };

    const rect = containerRef.current.getBoundingClientRect();
    // Maximum panning offsets allowed based on scale factor
    const maxX = (rect.width * (currentScale - 1)) / 2;
    const maxY = (rect.height * (currentScale - 1)) / 2;

    return {
      x: Math.min(Math.max(x, -maxX), maxX),
      y: Math.min(Math.max(y, -maxY), maxY),
    };
  };

  // Reset scale and position
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setScale((prev) => {
      const next = Math.min(prev + 0.75, 4);
      return next;
    });
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.75, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
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
      const nextScale = Math.min(Math.max(1, prevScale * zoomFactor), 4);
      if (nextScale === 1) {
        setPosition({ x: 0, y: 0 });
      } else {
        setPosition((pos) => clampPosition(pos.x, pos.y, nextScale));
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
      setScale(2.2);
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
    const rawX = e.clientX - dragStart.x;
    const rawY = e.clientY - dragStart.y;
    setPosition(clampPosition(rawX, rawY, scale));
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
        const nextScale = Math.min(Math.max(1, prevScale * factor), 4);
        if (nextScale === 1) {
          setPosition({ x: 0, y: 0 });
        } else {
          setPosition((pos) => clampPosition(pos.x, pos.y, nextScale));
        }
        return nextScale;
      });
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      const rawX = e.touches[0].clientX - dragStart.x;
      const rawY = e.touches[0].clientY - dragStart.y;
      setPosition(clampPosition(rawX, rawY, scale));
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
        {/* Top Header Navigation & Controls */}
        <div className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent z-20 text-white pointer-events-auto gap-3">
          {/* Title on Left (No Full Screen Image button) */}
          <div className="flex-1 min-w-0">
            {alt ? (
              <h3 className="text-xs sm:text-base font-bold text-slate-100 truncate leading-snug">
                {alt}
              </h3>
            ) : (
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Image View
              </span>
            )}
          </div>

          {/* Action Controls: Zoom Out, Zoom In, Reset, Close */}
          <div className="flex items-center gap-2 shrink-0">
            {scale > 1 && (
              <button
                onClick={resetZoom}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all active:scale-95"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            <button
              onClick={handleZoomOut}
              disabled={scale <= 1}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-white border border-white/20 transition-all active:scale-95"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              onClick={handleZoomIn}
              disabled={scale >= 4}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-white border border-white/20 transition-all active:scale-95"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-red-600/80 hover:bg-red-600 text-white border border-white/20 transition-colors active:scale-95 ml-1 shadow-md"
              title="Close Full Screen"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Main Image View Container */}
        <div
          ref={containerRef}
          className="relative flex-1 w-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-2"
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
            className="max-w-full max-h-full object-contain pointer-events-none select-none transition-transform duration-75 ease-out rounded-lg shadow-2xl"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
            }}
          />
        </div>

        {/* Bottom Helper Footer */}
        <div className="w-full py-2.5 px-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 text-center text-[11px] sm:text-xs text-slate-300 pointer-events-none">
          <p className="font-medium tracking-wide">
            {scale > 1
              ? 'Drag to pan around image • Pinch or tap Reset to zoom out'
              : 'Pinch or double-tap to zoom • Tap + / - to adjust'}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
