'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGameEvents } from '@/lib/hooks/useGameEvents';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import type { GameEvent } from '@/lib/db/schema';
import './carousel-custom.css';

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
    <div className="bg-background-light rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 group border border-pink-100 flex flex-col h-full">
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
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
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
          {event.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">
          {event.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 mt-auto">
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
    <div className="bg-background-light rounded-2xl overflow-hidden shadow-lg border border-pink-100 animate-pulse flex flex-col h-full">
      <div className="aspect-video bg-gray-200"></div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2 flex-grow"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 mt-auto">
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { data: events, isLoading, error } = useGameEvents();

  // Use fallback data if no data or error
  const displayEvents = events && events.length > 0 ? events : fallbackEvents;

  // Check if we're in mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    checkMobileView();
    
    const handleResize = () => {
      checkMobileView();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate number of slides based on view type with responsive itemsPerPage
  const itemsPerPage = isMobileView ? 1 : 3;
  const totalPages = Math.ceil(displayEvents.length / itemsPerPage);

  // Handle next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalPages - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );
  };

  // Handle dot click with smooth scrolling
  const goToSlide = (index: number) => {
    if (isMobileView && carouselRef.current) {
      const carousel = carouselRef.current;
      const cardWidth = carousel.scrollWidth / displayEvents.length; // Average card width
      const targetScrollPosition = index * cardWidth;
      
      carousel.scrollTo({
        left: targetScrollPosition,
        behavior: 'smooth'
      });
    } else {
      // For desktop, update the current index to the slide number
      setCurrentIndex(index);
    }
  };

  // Handle scroll event to sync currentIndex with scroll position
  const handleScroll = () => {
    if (isMobileView && carouselRef.current) {
      const carousel = carouselRef.current;
      const scrollLeft = carousel.scrollLeft;
      const scrollWidth = carousel.scrollWidth;
      const cardWidth = scrollWidth / displayEvents.length; // Average card width
      
      // Calculate the current index based on scroll position
      const newIndex = Math.round(scrollLeft / cardWidth);
      
      // Prevent infinite updates by checking if index actually changed
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < displayEvents.length) {
        setCurrentIndex(newIndex);
      }
    }
  };
  

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
        
        <div className="relative px-4 md:px-8 lg:px-12">
          <div className="overflow-hidden py-8">
            {/* Navigation buttons - hidden on mobile, shown on desktop */}
            {!isMobileView && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -left-10 z-10 bg-white rounded-full p-3 shadow-lg hover:scale-105 transition-transform duration-300 focus:outline-none"
                  aria-label="Previous slide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 -right-10 z-10 bg-white rounded-full p-3 shadow-lg hover:scale-105 transition-transform duration-300 focus:outline-none"
                  aria-label="Next slide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Slides container */}
            {isMobileView ? (
              // Mobile view: Horizontal scroll with snap
              <div 
                ref={carouselRef}
                onScroll={handleScroll}
                className="hide-scrollbar smooth-touch-scroll flex overflow-x-auto py-4 snap-x snap-mandatory" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="snap-center flex-shrink-0 w-[85vw] mx-2">
                      <EventCardSkeleton />
                    </div>
                  ))
                ) : error ? (
                  // Show fallback on error
                  displayEvents.map((event) => (
                    <div key={event.id} className="snap-center flex-shrink-0 w-[85vw] mx-2">
                      <EventCard event={event} />
                    </div>
                  ))
                ) : (
                  displayEvents.map((event, index) => (
                    <div key={event.id} className="snap-center flex-shrink-0 w-[85vw] mx-2" data-index={index}>
                      <EventCard event={event} />
                    </div>
                  ))
                )}
              </div>
            ) : (
              // Desktop view: Traditional slider
              <div className="flex transition-transform duration-500 ease-in-out"
                   style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {isLoading ? (
                  <div className="flex w-full">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="w-1/3 px-4 flex-shrink-0">
                        <EventCardSkeleton />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  // Show fallback on error
                  <div className="flex w-full">
                    {displayEvents.map((event, idx) => (
                      <div key={event.id} className="w-1/3 px-4 flex-shrink-0 h-full items-stretch">
                        <EventCard event={event} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {Array.from({ length: totalPages }).map((_, slideIndex) => (
                      <div
                        key={slideIndex}
                        className="flex w-full min-w-full"
                      >
                        {displayEvents
                          .slice(slideIndex * itemsPerPage, (slideIndex + 1) * itemsPerPage)
                          .map((event) => (
                            <div key={event.id} className="w-1/3 px-4 flex-shrink-0 h-full items-stretch">
                              <EventCard event={event} />
                            </div>
                          ))}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Pagination dots - show on both mobile and desktop */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-primary scale-125' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
