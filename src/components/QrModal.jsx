import React, { useState } from 'react';
import { X, QrCode, Instagram, Copy, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import bakeryInfo from '../data/bakeryInfo.json';

export default function QrModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('menu'); // Default to 'menu' or 'instagram'
  const [copiedInsta, setCopiedInsta] = useState(false);
  const [copiedMenu, setCopiedMenu] = useState(false);

  if (!isOpen) return null;

  const instaUrl = bakeryInfo.instagramUrl || "https://www.instagram.com/gb__gundanna.bakery/";
  const instaQr = bakeryInfo.instagramQr || "/images/instagram-qr.png";
  const menuUrl = bakeryInfo.qrWebsiteUrl || "https://gundannabakerymenu1.vercel.app/";

  const handleCopyInsta = () => {
    navigator.clipboard.writeText(instaUrl);
    setCopiedInsta(true);
    setTimeout(() => setCopiedInsta(false), 2000);
  };

  const handleCopyMenu = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopiedMenu(true);
    setTimeout(() => setCopiedMenu(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
        {/* Overlay backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl z-10 text-center space-y-3.5 border border-amber-100"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Bakery Logo Header */}
          <div className="space-y-1">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-bakery-secondary overflow-hidden flex items-center justify-center mx-auto mb-1 shadow-sm">
              <img src={bakeryInfo.logo} alt={bakeryInfo.name} className="w-full h-full object-contain p-0.5" />
            </div>
            <h3 className="text-lg font-bold font-heading text-bakery-primary">
              {bakeryInfo.name}
            </h3>
          </div>

          {/* Dual Tab Toggle Switch */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'menu'
                  ? 'bg-bakery-primary text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              Menu QR
            </button>
            <button
              onClick={() => setActiveTab('instagram')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'instagram'
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Instagram className="w-3.5 h-3.5" />
              Instagram QR
            </button>
          </div>

          {/* TAB 1: DIGITAL MENU QR CODE VIEW */}
          {activeTab === 'menu' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* Clickable & Scannable QR Code */}
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-block p-3 bg-amber-50 rounded-2xl border-2 border-dashed border-bakery-secondary/40 shadow-inner hover:border-bakery-primary transition-all"
                title="Scan or Click QR Code to open Digital Menu URL"
              >
                <div className="relative w-52 h-52 sm:w-56 sm:h-56 mx-auto bg-white rounded-xl p-3 shadow-md flex items-center justify-center overflow-hidden">
                  <QRCodeSVG
                    value={menuUrl}
                    size={200}
                    bgColor="#FFFFFF"
                    fgColor="#8B4513"
                    level="H"
                    imageSettings={{
                      src: bakeryInfo.logo,
                      x: undefined,
                      y: undefined,
                      height: 38,
                      width: 38,
                      excavate: true,
                    }}
                  />
                  {/* Click to Redirect Hover Prompt */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 rounded-xl">
                    <ExternalLink className="w-6 h-6 mb-1 animate-bounce" />
                    <span className="text-xs font-bold">Click to open Vercel Menu</span>
                    <span className="text-[10px] text-amber-200">gundannabakerymenu1.vercel.app</span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] font-bold text-bakery-primary flex items-center justify-center gap-1">
                  <span className="truncate max-w-[200px]">{menuUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </div>
              </a>

              <p className="text-[11px] text-slate-500 font-medium">
                Scan with phone camera or tap QR code to open menu
              </p>

              {/* Action Buttons: Copy Link & Redirect */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCopyMenu}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                >
                  {copiedMenu ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copiedMenu ? 'Copied!' : 'Copy Menu URL'}
                </button>

                <a
                  href={menuUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-bakery-primary hover:bg-bakery-primary/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Website
                </a>
              </div>
            </motion.div>
          )}

          {/* TAB 2: INSTAGRAM QR CODE VIEW */}
          {activeTab === 'instagram' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* Clickable Instagram QR Code Image */}
              <a
                href={instaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-block p-3 bg-gradient-to-tr from-amber-50 via-pink-50 to-purple-50 rounded-2xl border-2 border-pink-200/80 shadow-inner hover:border-pink-500 transition-all"
                title="Click QR Code to redirect to Instagram Profile"
              >
                <div className="relative w-52 h-52 sm:w-56 sm:h-56 mx-auto bg-white rounded-xl p-2 shadow-md overflow-hidden flex items-center justify-center">
                  <img
                    src={instaQr}
                    alt="GB__GUNDANNA.BAKERY Instagram QR Code"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Click to Redirect Hover Prompt */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 rounded-xl">
                    <ExternalLink className="w-6 h-6 mb-1 animate-bounce" />
                    <span className="text-xs font-bold">Click to open Instagram</span>
                    <span className="text-[10px] text-pink-200">@GB__GUNDANNA.BAKERY</span>
                  </div>
                </div>

                <div className="mt-2 text-xs font-bold text-pink-700 flex items-center justify-center gap-1">
                  <span>@GB__GUNDANNA.BAKERY</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              <p className="text-[11px] text-slate-500 font-medium">
                Tap the QR Code or use buttons below to visit Instagram account
              </p>

              {/* Action Buttons: Copy Link & Redirect */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCopyInsta}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                >
                  {copiedInsta ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copiedInsta ? 'Copied!' : 'Copy Insta URL'}
                </button>

                <a
                  href={instaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Account
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
