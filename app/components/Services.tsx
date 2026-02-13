'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePricingPackages } from '@/lib/hooks/usePricingPackages';
import type { PricingPackage } from '@/lib/db/schema';
import './carousel-custom.css';

// Feature icon mapping
function getFeatureIcon(isPopular: boolean) {
  return isPopular ? 'verified' : 'check_circle';
}

function PricingCard({ pkg, isPopular }: { pkg: PricingPackage; isPopular: boolean }) {
  const features = pkg.features || [];

  const formatCurrency = (price: string) => {
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

  if (isPopular) {
    return (
      <div className="group relative bg-white rounded-2xl border-2 border-primary p-8 shadow-2xl shadow-pink-100 transition-all duration-300 flex flex-col h-full items-stretch">
        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl z-10">POPULER</div>
        <h3 className="text-xl font-bold text-primary mb-2">{pkg.name}</h3>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-black text-gray-900">
            {formatCurrency(pkg.price)}
          </span>
        </div>
        <p className="text-gray-600 mb-4 flex-grow">{pkg.description}</p>
        <ul className="space-y-4 mb-8 flex-grow">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-gray-800 font-medium">
              <span className="material-symbols-outlined text-primary text-xl shrink-0">{getFeatureIcon(true)}</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <a
            href="#contact"
            className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-lg shadow-pink-200 cursor-pointer inline-block text-center"
          >
            Pesan sekarang
          </a>
        </div>
      </div>
    );
  } else {
    return (
      <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 flex flex-col h-full items-stretch">
        <div className="absolute top-0 inset-x-0 h-2 bg-gray-200 rounded-t-2xl"></div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-black text-gray-900">
            {formatCurrency(pkg.price)}
          </span>
        </div>
        <p className="text-gray-600 mb-4 flex-grow">{pkg.description}</p>
        <ul className="space-y-4 mb-8 flex-grow">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="material-symbols-outlined text-accent text-xl shrink-0">{getFeatureIcon(false)}</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <a
            href="#contact"
            className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold rounded-xl transition-colors border border-gray-200 cursor-pointer inline-block text-center"
          >
            Pesan sekarang
          </a>
        </div>
      </div>
    );
  }
}

// Loading skeleton for pricing cards
function PricingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg animate-pulse flex flex-col h-full items-stretch">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-2/3 mb-6"></div>
      <div className="space-y-4 mb-8 flex-grow">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <div className="h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}

// Fallback static data when Supabase is not configured
const fallbackPackages: PricingPackage[] = [
  {
    id: '1',
    name: 'Paket Pemula',
    price: '50000',
    description: 'Daily Missions, 1x Full Training, No VPN',
    features: ['Daily Missions Complete', '1x Full Training Run', 'Tanpa VPN (Indo IP)', 'Proses 1-2 Jam'],
    isPopular: false,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Paket Sultan',
    price: '250000',
    description: 'Full Event Clear, High Stats (UE/UD), Bonus Items',
    features: [
      'Full Event Clear (1M Pts)', 
      'High Stats Guarantee (UE/UD)', 
      'Bonus Items Farming', 
      'Proses 2-3 Hari', 
      'Live Stream (Optional)'
    ],
    isPopular: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Paket Custom',
    price: '100000',
    description: 'Specific Trophy, Factor Farming, PvP Config',
    features: ['Specific Race Trophy', 'Factor Farming (White/Blue)', 'PvP / Champions Meeting', 'Waktu Menyesuaikan'],
    isPopular: false,
    isActive: true,
    createdAt: new Date(),
  },
];

export default function Services() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { data: packages, isLoading, error } = usePricingPackages();

  // Use fallback data if no data or error
  const displayPackages = packages && packages.length > 0 ? packages : fallbackPackages;

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
  const totalPages = Math.ceil(displayPackages.length / itemsPerPage);

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
      const cardWidth = carousel.scrollWidth / displayPackages.length; // Average card width
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
      const cardWidth = scrollWidth / displayPackages.length; // Average card width
      
      // Calculate the current index based on scroll position
      const newIndex = Math.round(scrollLeft / cardWidth);
      
      // Prevent infinite updates by checking if index actually changed
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < displayPackages.length) {
        setCurrentIndex(newIndex);
      }
    }
  };
  

  return (
    <section className="py-20 bg-white relative" id="layanan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#1d0c12] mb-4">DAFTAR HARGA JOKI</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Pilih paket yang kamu butuhkan untuk merawat akunmu. Dengan sistem Add-on, kamu bisa tambah event lain selama event berlangsung</p>
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
                      <PricingCardSkeleton />
                    </div>
                  ))
                ) : error ? (
                  // Show fallback on error
                  displayPackages.map((pkg) => (
                    <div key={pkg.id} className="snap-center flex-shrink-0 w-[85vw] mx-2">
                      <PricingCard pkg={pkg} isPopular={pkg.isPopular || false} />
                    </div>
                  ))
                ) : (
                  displayPackages.map((pkg, index) => (
                    <div key={pkg.id} className="snap-center flex-shrink-0 w-[85vw] mx-2" data-index={index}>
                      <PricingCard pkg={pkg} isPopular={pkg.isPopular || false} />
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
                      <div key={idx} className="w-1/3 px-4 flex-shrink-0 h-full">
                        <PricingCardSkeleton />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  // Show fallback on error
                  <div className="flex w-full">
                    {displayPackages.map((pkg, idx) => (
                      <div key={pkg.id} className="w-1/3 px-4 flex-shrink-0 h-full items-stretch">
                        <PricingCard pkg={pkg} isPopular={pkg.isPopular || false} />
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
                        {displayPackages
                          .slice(slideIndex * itemsPerPage, (slideIndex + 1) * itemsPerPage)
                          .map((pkg) => (
                            <div key={pkg.id} className="w-1/3 px-4 flex-shrink-0 h-full items-stretch">
                              <PricingCard pkg={pkg} isPopular={pkg.isPopular || false} />
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
