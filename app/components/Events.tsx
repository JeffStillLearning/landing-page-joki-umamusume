'use client';

import React from 'react';
import { useGameEvents } from '@/lib/hooks/useGameEvents';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import type { GameEvent } from '@/lib/db/schema';

function EventCard({ event }: { event: GameEvent }) {
  // Generate optimized Cloudinary URL if cloudinaryId exists
  const imageUrl = event.cloudinaryId 
    ? getOptimizedImageUrl(event.cloudinaryId, { width: 400, height: 200, crop: 'fill' })
    : null;

  // Gradient colors based on event type
  const gradientColors: Record<string, string> = {
    'Champions Meeting': 'from-purple-500 to-indigo-600',
    'Legend Races': 'from-pink-500 to-rose-500',
    'Event Points': 'from-green-400 to-teal-500',
    'Event Special': 'from-yellow-400 to-orange-500',
    'Lainnya': 'from-blue-400 to-indigo-500',
    default: 'from-blue-400 to-indigo-500',
  };

  const gradient = gradientColors[event.eventType || ''] || gradientColors.default;

  // Format price as Indonesian Rupiah
  const formatPrice = (price: string | null) => {
    if (!price) return 'Rp 0'; // Return default value if price is null
    
    // Extract numeric value from price string (e.g., "Rp 250.000" -> 250000)
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
    <div className="bg-background-light rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 group border border-pink-100">
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        {imageUrl ? (
          // Optimized Cloudinary image with f_auto,q_auto
          <img
            src={imageUrl}
            alt={event.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          // Fallback gradient when no image
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </>
        )}
        <div className="absolute bottom-0 left-0 p-4">
          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded border border-white/30">
            {event.eventType || 'Event'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
          {event.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">{event.priceLabel || 'Mulai dari'}</span>
            <span className="text-lg font-black text-primary">{formatPrice(event.price)}</span>
          </div>
          {/* <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-lg shadow-pink-200 cursor-pointer">
            <span className="material-symbols-outlined">shopping_cart</span>
          </button> */}
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for event cards
function EventCardSkeleton() {
  return (
    <div className="bg-background-light rounded-2xl overflow-hidden shadow-lg border border-pink-100 animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

// Fallback static data when Supabase is not configured
const fallbackEvents: GameEvent[] = [
  {
    id: '1',
    name: 'Champions Meeting: Dirt',
    description: 'Persiapan tim terbaik untuk race Dirt bulan ini. Termasuk building skill dan stats optimal.',
    eventType: 'Champions Meeting',
    price: '150000',
    priceLabel: 'Mulai dari',
    cloudinaryId: null,
    status: 'active',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Summer Festival Event',
    description: 'Full clear event point 1.000.000 pts. Dapatkan SSR Support Card event max limit break.',
    eventType: 'Event Points',
    price: '200000',
    priceLabel: 'Paket Full',
    cloudinaryId: null,
    status: 'active',
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Legend Race Championship',
    description: 'Joki Legend Race trophy lengkap. Bonus farming item sepatu dan money.',
    eventType: 'Legend Races',
    price: '25000',
    priceLabel: 'Per 3 Race',
    cloudinaryId: null,
    status: 'active',
    createdAt: new Date(),
  },
];

export default function Events() {
  const { data: events, isLoading, error } = useGameEvents();

  // Use fallback data if no data or error
  const displayEvents = events && events.length > 0 ? events : fallbackEvents;

  return (
    <section className="py-16 bg-white relative border-b border-pink-50" id="event">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <span className="text-accent font-bold tracking-wider text-sm uppercase mb-2 block">Limited Time</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1d0c12]">EVENT TERBARU</h2>
            <p className="text-gray-600 mt-2">Dapatkan rewards eksklusif dari event yang sedang berlangsung.</p>
          </div>
          {/* <a className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline" href="#contact">
            Lihat Semua Event <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a> */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </>
          ) : error ? (
            // Show fallback on error
            displayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            displayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>

        <div className="md:hidden mt-8 text-center">
          <a className="inline-flex items-center gap-2 text-primary font-bold hover:underline" href="#contact">
            Lihat Semua Event <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  );
}
