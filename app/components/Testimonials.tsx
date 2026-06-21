'use client';

import React from 'react';
import { useTestimonials } from '@/lib/hooks/useTestimonials';
import type { Testimonial } from '@/lib/db/schema';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import './carousel-custom.css';

const GRADIENTS = [
  'from-pink-400 to-rose-500',
  'from-teal-400 to-emerald-500',
  'from-violet-400 to-purple-500',
  'from-amber-400 to-orange-500',
  'from-sky-400 to-indigo-500',
];

function getInitials(name: string): string {
  if (!name) return 'U';
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const rating = testimonial.rating || 5;

  return (
    <div className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      <span className="material-symbols-outlined !text-4xl leading-none text-primary/25">format_quote</span>

      <div className="mt-1 flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`material-symbols-outlined text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
            style={i < rating ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            star
          </span>
        ))}
      </div>

      <p className="mt-4 flex-1 italic leading-relaxed text-gray-700">&ldquo;{testimonial.comment}&rdquo;</p>

      <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
        <div
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-sm font-bold text-white`}
        >
          {getInitials(testimonial.name)}
        </div>
        <div>
          <div className="font-bold text-ink">{testimonial.name}</div>
          <div className="text-xs text-gray-400">Trainer</div>
        </div>
      </div>
    </div>
  );
}

function TestimonialsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex h-full animate-pulse flex-col rounded-3xl border border-gray-100 bg-white p-7">
          <div className="mb-4 h-4 w-24 rounded bg-gray-200" />
          <div className="mb-6 flex-grow space-y-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-4/6 rounded bg-gray-200" />
          </div>
          <div className="mt-auto flex items-center gap-4 border-t border-gray-100 pt-5">
            <div className="h-11 w-11 rounded-full bg-gray-200" />
            <div className="h-4 w-32 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { data: testimonials, isLoading, error, refetch, isFetching } = useTestimonials();

  const displayTestimonials = testimonials
    ? [...testimonials].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    : [];

  return (
    <section className="bg-white py-16 md:py-28" id="testimoni">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Testimoni</span>
          <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl md:text-5xl">
            Kata Mereka Tentang Kami
          </h2>
          <p className="mt-4 text-gray-500">Ratusan trainer sudah mempercayakan akunnya kepada kami.</p>
        </div>

        {isLoading ? (
          <TestimonialsSkeleton />
        ) : error ? (
          <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50/60 p-8 text-center">
            <span className="material-symbols-outlined !text-4xl text-red-400">cloud_off</span>
            <p className="mt-2 font-bold text-ink">Gagal memuat testimoni</p>
            <p className="mt-1 text-sm text-gray-500">Koneksi ke server sedang bermasalah.</p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              <span className={`material-symbols-outlined text-[18px] ${isFetching ? 'animate-spin' : ''}`}>
                {isFetching ? 'progress_activity' : 'refresh'}
              </span>
              {isFetching ? 'Memuat…' : 'Coba lagi'}
            </button>
            {process.env.NODE_ENV !== 'production' && (
              <p className="mt-4 break-words text-xs text-red-400/80">
                {error instanceof Error ? error.message : String(error)}
              </p>
            )}
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
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="mySwiper !pb-2"
            >
              {displayTestimonials.map((testimonial, index) => (
                <SwiperSlide key={testimonial.id} className="!h-auto">
                  <TestimonialCard testimonial={testimonial} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="py-10 text-center italic text-gray-500">
            Belum ada testimoni. Jadilah yang pertama memberikan review!
          </div>
        )}

        {/* Drive testimoni */}
        <div className="mt-10 flex justify-center md:mt-12">
          <a
            href="https://drive.google.com/drive/folders/1XkXLjKtwlg91z6eDHBE104Gn3txp9vbI?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-white px-7 py-3 text-sm font-bold text-primary transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 md:text-base"
          >
            <span className="material-symbols-outlined text-[20px]">photo_library</span>
            Lihat Drive Testimoni
          </a>
        </div>

        {/* Payment methods */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-gray-400">
            Metode Pembayaran Tersedia
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'DANA', cls: 'text-blue-500' },
              { label: 'ShopeePay', cls: 'text-orange-500' },
              { label: 'BRI', cls: 'text-blue-800' },
            ].map((p) => (
              <span
                key={p.label}
                className={`rounded-xl border border-gray-100 bg-background-light px-5 py-2.5 text-lg font-extrabold ${p.cls}`}
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
