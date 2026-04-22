"use client";
import React, { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-pink-100">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          
          {/* SISI KIRI: Logo (Pojok Kiri) */}
          <div className="flex-1 flex justify-start">
            <a href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 overflow-hidden rounded-xl flex items-center justify-center">
                <img src="/favicon.ico" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight leading-none text-[#1d0c12]">Joki Uma</h1>
                <p className="text-xs text-primary font-medium tracking-wide">PROFESSIONAL</p>
              </div>
            </a>
          </div>

          {/* SISI TENGAH: Desktop Menu (Tepat di Tengah) */}
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors" href="/joki">Paket Joki</a>
            <a className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors" href="/event">Event & Add-on</a>
            <a className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors" href="/#keamanan">Keamanan</a>
            <a className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors" href="/#testimoni">Testimoni</a>
          </div>

          {/* SISI KANAN: Penyeimbang / Mobile Menu Button */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <a className="hidden md:flex items-center gap-1 text-sm font-bold text-primary hover:opacity-80 transition-opacity" href="/track">
              <span className="material-symbols-outlined text-[18px]">search</span>
              Cek Pesanan
            </a>
            <div className="md:hidden flex items-center">
              <button 
                className="text-gray-700 hover:text-primary p-2 focus:outline-none"
                onClick={toggleMobileMenu}
              >
                <span className="material-symbols-outlined text-3xl">
                  {isMobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-xl absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a 
              className="block px-3 py-3 rounded-md text-base font-semibold text-gray-700 hover:text-primary hover:bg-pink-50 transition-colors" 
              href="/joki"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Paket Joki
            </a>
            <a 
              className="block px-3 py-3 rounded-md text-base font-semibold text-gray-700 hover:text-primary hover:bg-pink-50 transition-colors" 
              href="/event"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Event & Add-on
            </a>
            <a 
              className="block px-3 py-3 rounded-md text-base font-semibold text-gray-700 hover:text-primary hover:bg-pink-50 transition-colors" 
              href="/#keamanan"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Keamanan
            </a>
            <a 
              className="block px-3 py-3 rounded-md text-base font-semibold text-gray-700 hover:text-primary hover:bg-pink-50 transition-colors" 
              href="/#testimoni"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimoni
            </a>
            <a 
              className="block px-3 py-3 rounded-md text-base font-bold text-primary hover:bg-pink-50 transition-colors flex items-center gap-2" 
              href="/track"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              Cek Pesanan
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
