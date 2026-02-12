'use client';

import React from 'react';
import { useTestimonials } from '@/lib/hooks/useTestimonials';
import type { Testimonial } from '@/lib/db/schema';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import './carousel-custom.css';

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  // Generate random gradient based on index for variety
  const gradients = [
    'from-blue-400 to-indigo-500',
    'from-pink-400 to-red-500',
    'from-green-400 to-emerald-500',
    'from-purple-400 to-violet-500',
    'from-orange-400 to-amber-500',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <div className="bg-background-light p-6 rounded-2xl border border-pink-100 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-1 text-yellow-400 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`material-symbols-outlined text-lg ${
            i < (testimonial.rating || 5) ? 'fill-current' : 'text-gray-300'
          }`}>
            {i < (testimonial.rating || 5) ? 'star' : 'star'}
          </span>
        ))}
      </div>
      <p className="text-gray-700 italic mb-6 flex-grow">"{testimonial.comment}"</p>
      <div className="flex items-center gap-4 mt-auto">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          <div className={`w-full h-full bg-gradient-to-r ${gradient}`}></div>
        </div>
        <div>
          <div className="font-bold text-gray-900">{testimonial.name}</div>
        </div>
      </div>
    </div>
  );
}

function TestimonialsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col h-full animate-pulse">
          <div className="flex gap-1 mb-4">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2 mb-6 flex-grow">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="flex items-center gap-4 mt-auto">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { data: testimonials, isLoading, error } = useTestimonials();

  // Sort testimonials by rating (highest first) and then recent
  const displayTestimonials = testimonials
    ? [...testimonials].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    : [];

  return (
    <section className="py-20 bg-white" id="testimoni">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black text-center text-[#1d0c12] mb-12">KATA MEREKA TENTANG KAMI</h2>

        {isLoading ? (
          <TestimonialsSkeleton />
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            Gagal memuat testimoni. Silakan coba lagi nanti.
          </div>
        ) : displayTestimonials.length > 0 ? (
          <div className="relative">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="mySwiper"
            >
              {displayTestimonials.map((testimonial, index) => (
                <SwiperSlide key={testimonial.id}>
                  <TestimonialCard
                    testimonial={testimonial}
                    index={index}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 italic">
            Belum ada testimoni. Jadilah yang pertama memberikan review!
          </div>
        )}
      </div>
      {/* Payment Methods */}
        <div className="mt-16 pt-10 border-t border-gray-100">
          <p className="text-center text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider">Metode Pembayaran Tersedia</p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="h-8 flex items-center font-bold text-xl text-blue-400">DANA</div>
            <div className="h-8 flex items-center font-bold text-xl text-orange-600">Shopeepay</div>
            <div className="h-8 flex items-center font-bold text-xl text-blue-800">BRI</div>
          </div>
        </div>
    </section>
  );
}
