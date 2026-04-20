'use client';

import React from 'react';
import { useGameEvents } from '@/lib/hooks/useGameEvents';
import { useCart } from '@/lib/context/CartContext';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import Image from 'next/image';

export default function Events() {
  const { data: events, isLoading: isLoadingEvents } = useGameEvents();
  const { addToCart } = useCart();

  const handleAddToCart = (item: { id: string, name: string, price: string, category: string }) => {
    addToCart(item);
  };

  const formatCurrency = (price: string) => {
    const numericValue = parseFloat(price.replace(/[^\d]/g, ''));
    return isNaN(numericValue)
      ? price
      : new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
        }).format(numericValue);
  };

  return (
    <section className="py-8 bg-gray-50 relative border-y border-pink-50" id="event">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-accent font-bold tracking-widest text-sm uppercase mb-3 block">Special Add-on</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1d0c12] mb-4">LIMITED EVENT</h2>
            <p className="text-gray-600 text-lg">
              Lengkapi joki utamamu dengan event yang sedang berlangsung atau kustomisasi sesuai kebutuhan akunmu.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:gap-8 max-w-5xl mx-auto">
          {isLoadingEvents ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            events?.map((event) => (
              <div key={event.id} className="group bg-white rounded-2xl md:rounded-3xl border border-pink-100 overflow-hidden hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-500 flex flex-col md:flex-row relative">
                {/* Event Image */}
                <div className="relative h-48 md:h-auto md:w-80 shrink-0 bg-gray-100 overflow-hidden">
                  {event.cloudinaryId ? (
                    <Image
                      src={getOptimizedImageUrl(event.cloudinaryId, { width: 600, height: 400, crop: 'fill' })}
                      alt={event.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-pink-50 text-pink-200">
                      <span className="material-symbols-outlined text-6xl">image</span>
                    </div>
                  )}
                  {/* Badge on Image (Bottom Left) */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-tighter shadow-lg">
                      {event.eventType || 'Event'}
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {event.name}
                      </h3>
                      <p className="text-gray-500 text-sm md:text-base line-clamp-2 overflow-hidden text-ellipsis">
                        {event.description}
                      </p>
                    </div>
                    
                    <div className="text-left md:text-right shrink-0">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
                        {event.priceLabel || 'Biaya'}
                      </span>
                      <div className="text-2xl font-black text-primary">
                        {formatCurrency(event.price || '0')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <button
                      onClick={() => handleAddToCart({ id: event.id, name: event.name, price: event.price || '0', category: 'Event' })}
                      className="py-3 px-6 bg-gray-900 text-white font-bold rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-primary hover:shadow-lg hover:shadow-pink-200 transition-all duration-300"
                    >
                      <span>Masukkan Keranjang</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-pink-100 overflow-hidden animate-pulse flex flex-col md:flex-row">
      <div className="h-48 md:h-64 md:w-80 bg-gray-100 shrink-0"></div>
      <div className="p-6 md:p-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="flex-grow">
            <div className="h-7 bg-gray-100 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-2/3"></div>
          </div>
          <div className="w-24 h-12 bg-gray-100 rounded self-start"></div>
        </div>
        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <div className="h-4 bg-gray-100 rounded w-32"></div>
          <div className="h-12 bg-gray-100 rounded-xl w-40"></div>
        </div>
      </div>
    </div>
  );
}
