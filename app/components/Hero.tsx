import React from 'react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-hero-pattern opacity-60 z-0"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10 -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-pink-100 shadow-sm mb-8 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          <span className="text-sm font-bold text-gray-600 tracking-wide">SLOT JOKI TERSEDIA</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-[#1d0c12] tracking-tight mb-6 leading-tight">
          JOKI GAME <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">UMA MUSUME</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-medium text-gray-600 mb-10 max-w-2xl mx-auto flex justify-center gap-10">
          <span>Berpengalaman</span>
          <span>Aman</span>
          <span>Ramah</span>
          <span>Puas</span>
        </p>

        
        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white text-lg font-bold py-4 px-10 rounded-xl transition-all shadow-xl shadow-pink-200 hover:shadow-pink-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined">rocket_launch</span>
            Konsultasi Gratis
          </button>
          <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 text-lg font-bold py-4 px-10 rounded-xl transition-all border border-gray-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-primary">price_check</span>
            Cek Harga
          </button>
        </div> */}
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-gray-200/60 pt-8">
          <div>
            <div className="text-3xl font-black text-primary">4 bulan</div>
            <div className="text-sm font-medium text-gray-500">Pengalaman</div>
          </div>
          <div>
            <div className="text-3xl font-black text-accent">A+~S+</div>
            <div className="text-sm font-medium text-gray-500">Rating</div>
          </div>
          <div>
            <div className="text-3xl font-black text-primary">100%</div>
            <div className="text-sm font-medium text-gray-500">Aman & Legal</div>
          </div>
          <div>
            <div className="text-3xl font-black text-accent">24/7</div>
            <div className="text-sm font-medium text-gray-500">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
