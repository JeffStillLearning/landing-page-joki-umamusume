'use client';

import React, { useState, useRef } from 'react';
import { usePricingPackages, PricingPackage } from '@/lib/hooks/usePricingPackages';
import { useCart } from '@/lib/context/CartContext';

export default function Services() {
  const { data: packages, isLoading: isLoadingPackages } = usePricingPackages();
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);

  // Filter packages by type
  const packageGroups = {
    'Paket': packages?.filter(p => p.typesOfServices === 'Paket') || [],
    'Daily Scenario': packages?.filter(p => p.typesOfServices === 'Daily Scenario') || [],
    'Lainnya': packages?.filter(p => !['Paket', 'Daily Scenario'].includes(p.typesOfServices || '')) || []
  };

  return (
    <section className="pt-15 pb-20 bg-white relative overflow-hidden" id="layanan">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-pink-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto lg:px-8">
        <div className="text-center mb-16 px-4">
          <span className="text-accent font-bold tracking-widest text-sm uppercase mb-3 block">Service Selection</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1d0c12] mb-6 tracking-tighter">PILIH JASA JOKIMU</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Geser ke samping untuk melihat pilihan paket. Klik kartu untuk melihat detail lengkapnya.
          </p>
        </div>

        <CategoryRow 
          title="Paket Joki Utama" 
          items={packageGroups['Paket']} 
          accentColor="bg-primary" 
          isLoading={isLoadingPackages} 
          onShowDetail={setSelectedPackage} 
        />
        <CategoryRow 
          title="Daily Scenario" 
          items={packageGroups['Daily Scenario']} 
          accentColor="bg-blue-500" 
          isLoading={isLoadingPackages} 
          onShowDetail={setSelectedPackage} 
        />
        <CategoryRow 
          title="Layanan Lainnya" 
          items={packageGroups['Lainnya']} 
          accentColor="bg-green-500" 
          isLoading={isLoadingPackages} 
          onShowDetail={setSelectedPackage} 
        />
      </div>

      {/* Bottom Sheet Modal */}
      <PackageDetailModal 
        pkg={selectedPackage} 
        onClose={() => setSelectedPackage(null)} 
      />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

function CategoryRow({ title, items, accentColor, isLoading, onShowDetail }: { title: string, items: PricingPackage[], accentColor: string, isLoading: boolean, onShowDetail: (pkg: PricingPackage) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!isLoading && items.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll by 80% of container width
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-12 last:mb-0 relative group">
      <div className="flex items-center justify-between mb-6 px-4 sm:px-0">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-8 rounded-full ${accentColor}`}></div>
          <h3 className="text-2xl font-black text-[#1d0c12] uppercase tracking-tight">{title}</h3>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
            {isLoading ? '...' : items.length} LAYANAN
          </span>
        </div>
      </div>

      <div className="relative group/nav">
        {/* Navigation Buttons for PC - Side Positioned */}
        <div className="hidden md:block">
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border-2 border-primary flex items-center justify-center text-gray-800 transition-all active:scale-90 opacity-0 group-hover/nav:opacity-100 -translate-x-2 group-hover/nav:translate-x-0"
            aria-label="Scroll left"
          >
            <span className="material-symbols-outlined font-bold">chevron_left</span>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute -right-15 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border-2 border-primary flex items-center justify-center text-gray-800 transition-all active:scale-90 opacity-0 group-hover/nav:opacity-100 translate-x-2 group-hover/nav:translate-x-0"
            aria-label="Scroll right"
          >
            <span className="material-symbols-outlined font-bold">chevron_right</span>
          </button>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto pb-6 gap-4 no-scrollbar snap-x px-4 sm:px-0 scroll-pl-4"
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            items.map((pkg) => (
              <ServiceCard 
                key={pkg.id} 
                pkg={pkg} 
                onShowDetail={() => onShowDetail(pkg)} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ pkg, onShowDetail }: { pkg: PricingPackage, onShowDetail: () => void }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const formatCurrency = (price: string) => {
    const numericValue = parseFloat(price.replace(/[^\d]/g, ''));
    return isNaN(numericValue) ? price : new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(numericValue);
  };

  const isScalable = pkg.typesOfServices !== 'Paket';

  return (
    <div className={`flex-none w-[280px] md:w-[350px] snap-start relative bg-white rounded-3xl transition-all duration-500 flex flex-col border ${
      pkg.isPopular ? 'border-primary ring-1 ring-primary/20' : 'border-gray-100'
    }`}>
      <div className="p-6 md:p-8 flex flex-col flex-grow relative">
        {pkg.isPopular && (
          <div className="absolute top-4 right-4 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-md z-10">
            TERLARIS
          </div>
        )}

        <div className="cursor-pointer" onClick={onShowDetail}>
          <h4 className={`text-lg md:text-xl font-bold mb-2 pr-16 ${pkg.isPopular ? 'text-primary' : 'text-gray-900'}`}>
            {pkg.name}
          </h4>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-2xl md:text-3xl font-black text-gray-900">{formatCurrency(pkg.price)}</span>
          </div>
          <p className="text-gray-500 text-sm mb-2 line-clamp-3 h-15">{pkg.description}</p>
          <span className="text-primary text-[10px] font-black uppercase tracking-widest block mb-6 hover:underline">
            Lihat Detail Lengkap
          </span>
        </div>
        
        <div className="mt-auto">
          {isScalable && (
            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2 mb-3 border border-gray-100">
              <span className="text-[10px] font-black text-gray-400 ml-3 tracking-widest uppercase">Jumlah</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-600 active:scale-90"><span className="material-symbols-outlined text-lg">remove</span></button>
                <div className="w-10 text-center font-black text-gray-900 text-lg">{qty}</div>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-600 active:scale-90"><span className="material-symbols-outlined text-lg">add</span></button>
              </div>
            </div>
          )}
          <button
            onClick={() => addToCart({ id: pkg.id, name: pkg.name, price: pkg.price, category: pkg.typesOfServices || 'Lainnya' }, qty)}
            className={`w-full py-4 px-6 font-bold rounded-2xl transition-all duration-300 ${pkg.isPopular ? 'bg-primary text-white' : 'bg-gray-50 text-gray-800 border border-gray-200'}`}
          >
            {pkg.isPopular ? 'Pesan Sekarang' : 'Tambah ke Keranjang'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PackageDetailModal({ pkg, onClose }: { pkg: PricingPackage | null, onClose: () => void }) {
  const touchStartY = useRef(0);
  const [offsetY, setOffsetY] = useState(0);

  // Lock scroll when modal is open
  React.useEffect(() => {
    if (pkg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [pkg]);

  if (!pkg) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.targetTouches[0].clientY;
    const diff = currentY - touchStartY.current;
    if (diff > 0) setOffsetY(diff); // Only allow swiping down
  };

  const handleTouchEnd = () => {
    if (offsetY > 100) {
      onClose();
    }
    setOffsetY(0);
  };

  const formatCurrency = (price: string) => {
    const numericValue = parseFloat(price.replace(/[^\d]/g, ''));
    return isNaN(numericValue) ? price : new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(numericValue);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Bottom Sheet Content */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto transition-transform duration-300 ease-out animate-slide-up"
        style={{ transform: `translateY(${offsetY}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipe Handle (Center Bar) */}
        <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 cursor-grab active:cursor-grabbing"></div>
        
        <div className="mb-6">
          <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">{pkg.name}</h3>
          {pkg.isPopular && <span className="inline-block bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Pilihan Terlaris</span>}
        </div>

        <div className=" pb-8 border-b border-gray-50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Harga Layanan</p>
          <div className="text-3xl font-black text-primary">{formatCurrency(pkg.price)}</div>
        </div>

        <div className="mb-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Informasi Layanan</p>
          <div className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap font-medium">
            {pkg.description}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex-none w-[280px] md:w-[350px] bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse shadow-sm">
      <div className="p-6 md:p-8">
        <div className="h-6 bg-gray-100 rounded w-2/3 mb-4"></div>
        <div className="h-10 bg-gray-100 rounded w-full mb-6"></div>
        <div className="h-20 bg-gray-50 rounded-2xl w-full mb-8"></div>
        <div className="h-14 bg-gray-100 rounded-2xl w-full"></div>
      </div>
    </div>
  );
}
