import React from 'react';
import { MapPin, Phone, Clock, QrCode, Navigation, Heart } from 'lucide-react';
import bakeryInfo from '../data/bakeryInfo.json';

export default function Footer({ onOpenQr }) {
  return (
    <footer className="bg-gradient-to-b from-bakery-primary/95 to-amber-950 text-amber-50 pt-10 pb-16 px-4 border-t-4 border-bakery-secondary">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-amber-800/60">
          {/* Brand Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white text-bakery-primary flex items-center justify-center overflow-hidden border border-bakery-secondary shrink-0">
                <img src={bakeryInfo.logo} alt={bakeryInfo.name} className="w-full h-full object-contain p-0.5" />
              </div>
              <h3 className="text-xl font-extrabold font-heading text-white">
                {bakeryInfo.name}
              </h3>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              {bakeryInfo.description}
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenQr}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-800/80 hover:bg-amber-700 text-amber-100 text-xs font-semibold border border-amber-600/40 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-300" />
                Show QR Code
              </button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-xs">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Contact & Location
            </h4>

            <div className="space-y-2 text-amber-100/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{bakeryInfo.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${bakeryInfo.phone}`} className="hover:text-white underline underline-offset-2">
                  {bakeryInfo.phone}
                </a>
              </div>

              <div className="pt-1">
                <a
                  href={bakeryInfo.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bakery-price text-white text-xs font-bold shadow hover:bg-orange-600 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Get Google Maps Directions
                </a>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="space-y-3 text-xs">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Bakery Timings
            </h4>

            <div className="p-3 rounded-xl bg-amber-900/60 border border-amber-800/80 space-y-2">
              <div className="flex items-center gap-2 text-amber-200">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white">Daily Operating Hours</span>
              </div>
              <p className="text-amber-100 font-semibold text-sm">
                {bakeryInfo.workingHours}
              </p>
              <p className="text-[11px] text-amber-300/80">
                Fresh breads out of oven at 7:00 AM & 4:00 PM daily.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-300/80 pt-4 border-t border-amber-800/60">
          <p>© {new Date().getFullYear()} {bakeryInfo.name}. All Rights Reserved.</p>
          
          <div className="flex items-center gap-1.5 bg-amber-900/90 px-3.5 py-1.5 rounded-full border border-amber-700/60 shadow-xs">
            <span className="text-amber-200/90 text-xs font-medium">Developed by</span>
            <span className="font-extrabold text-amber-300 text-xs tracking-wider">
              InfoTreeTech
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
