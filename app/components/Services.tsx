'use client';

import React from 'react';
import { usePricingPackages } from '@/lib/hooks/usePricingPackages';
import type { PricingPackage } from '@/lib/db/schema';

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
      <div className="group relative bg-white rounded-2xl border-2 border-primary p-8 shadow-2xl shadow-pink-100 transition-all duration-300 transform md:-translate-y-4 flex flex-col h-full">
        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULER</div>
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
      <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
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
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-2/3 mb-6"></div>
      <div className="space-y-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
          </div>
        ))}
      </div>
      <div className="h-12 bg-gray-200 rounded-xl"></div>
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
  const { data: packages, isLoading, error } = usePricingPackages();

  // Use fallback data if no data or error
  const displayPackages = packages && packages.length > 0 ? packages : fallbackPackages;

  return (
    <section className="py-20 bg-white relative" id="layanan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#1d0c12] mb-4">DAFTAR HARGA JOKI</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Pilih paket yang kamu butuhkan untuk merawat akunmu. Dengan sistem Add-on, kamu bisa tambah event lain selama event berlangsung</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              <PricingCardSkeleton />
              <PricingCardSkeleton />
              <PricingCardSkeleton />
            </>
          ) : error ? (
            // Show fallback on error
            displayPackages.map((pkg) => (
              <PricingCard key={pkg.id} pkg={pkg} isPopular={pkg.isPopular || false} />
            ))
          ) : (
            displayPackages.map((pkg) => (
              <PricingCard key={pkg.id} pkg={pkg} isPopular={pkg.isPopular || false} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
