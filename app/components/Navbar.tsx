"use client";
import React, { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-200">
              <span className="material-symbols-outlined text-2xl">trophy</span>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight leading-none text-[#1d0c12]">Joki Uma</h1>
              <p className="text-xs text-primary font-medium tracking-wide">PROFESSIONAL</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors" href="#layanan">Daftar Harga</a>
            <a className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors" href="#event">Event Terbaru</a>
            <a className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors" href="#keamanan">Keamanan</a>
            <a className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors" href="#testimoni">Testimoni</a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <a className="bg-primary hover:bg-primary-dark text-white text-sm font-bold py-2.5 px-6 rounded-full transition-all shadow-lg shadow-pink-200 hover:shadow-pink-300 transform hover:-translate-y-0.5 flex items-center gap-2" href="#contact">
              <span>Hubungi Sekarang</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>

          {/* Mobile menu button */}
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-xl absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a 
              className="block px-3 py-3 rounded-md text-base font-semibold text-gray-700 hover:text-primary hover:bg-pink-50 transition-colors" 
              href="#event"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Event Terbaru
            </a>
            <a 
              className="block px-3 py-3 rounded-md text-base font-semibold text-gray-700 hover:text-primary hover:bg-pink-50 transition-colors" 
              href="#layanan"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Daftar Harga
            </a>
            <a 
              className="block px-3 py-3 rounded-md text-base font-semibold text-gray-700 hover:text-primary hover:bg-pink-50 transition-colors" 
              href="#keamanan"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Keamanan
            </a>
            <a 
              className="block px-3 py-3 rounded-md text-base font-semibold text-gray-700 hover:text-primary hover:bg-pink-50 transition-colors" 
              href="#testimoni"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimoni
            </a>
            <div className="pt-4 mt-2 border-t border-gray-100">
              <a 
                className="w-full bg-primary hover:bg-primary-dark text-white text-center font-bold py-3 px-6 rounded-xl transition-all shadow-lg user-select-none flex justify-center items-center gap-2" 
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Hubungi Sekarang</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
