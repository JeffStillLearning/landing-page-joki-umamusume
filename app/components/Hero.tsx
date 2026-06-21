import React from "react";
import Link from "next/link";

const WA_LINK =
  "https://wa.me/6283110123195?text=Halo%20Admin%2C%20saya%20tertarik%20dengan%20jasa%20joki%20Uma%20Musume.";

const STATS = [
  { value: "8 Bulan", label: "Pengalaman" },
  { value: "S+~UG", label: "Rating" },
  { value: "100%", label: "Aman & Legal" },
  { value: "24/7", label: "Support" },
];

export default function Hero() {
  return (
    <section className="relative flex flex-col justify-center overflow-hidden pb-14 pt-24 sm:pt-28 lg:min-h-dvh lg:pb-20 lg:pt-28">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 bg-hero-pattern opacity-60" />
      <div className="speed-lines absolute inset-0 -z-10 opacity-40" />
      <div className="glow-blob animate-float absolute -right-16 top-24 -z-10 h-72 w-72 bg-primary/25 sm:h-80 sm:w-80" />
      <div className="glow-blob animate-float-slow absolute -left-16 bottom-0 -z-10 h-64 w-64 bg-accent/20 sm:h-72 sm:w-72" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* Text column */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur sm:text-xs">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Jasa Joki Umamusume Terpercaya
          </span>

          <h1 className="mt-5 text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl">
            JOKI GAME
            <br />
            <span className="animate-gradient bg-gradient-to-r from-primary via-purple-500 to-accent bg-[length:200%_auto] bg-clip-text text-transparent">
              UMAMUSUME
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-gray-600 sm:text-base md:text-lg lg:mx-0">
            Bantu Uma favoritmu mencapai performa maksimal — rating{" "}
            <strong className="font-bold text-ink">S+ hingga UG</strong> — tanpa mengorbankan waktu
            produktifmu. Dikerjakan <strong className="font-bold text-ink">100% manual</strong> oleh
            worker berpengalaman, aman, dan anti-ribet skenario TrackBlazer.
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/joki"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
            >
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              Pesan Sekarang
            </Link>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-ink/10 bg-white px-7 py-3.5 text-base font-bold text-ink transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              Chat Admin
            </a>
          </div>

          {/* Stat bar */}
          <dl className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-x-4 gap-y-6 border-t border-gray-200/70 pt-7 sm:max-w-none sm:grid-cols-4 lg:mx-0">
            {STATS.map((s, i) => (
              <div key={s.label} className="text-center lg:text-left">
                <dt
                  className={`text-2xl font-extrabold md:text-3xl ${
                    i % 2 === 0 ? "text-primary" : "text-accent-dark"
                  }`}
                >
                  {s.value}
                </dt>
                <dd className="text-xs font-medium text-gray-500 md:text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual column */}
        <div className="relative order-first mx-auto w-full max-w-[15rem] sm:max-w-xs lg:order-none lg:max-w-none">
          <div className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 blur-2xl" />
          <div className="relative aspect-[4/5] w-full rounded-[1.75rem] border border-white/60 bg-white/40 p-2 shadow-2xl shadow-primary/10 backdrop-blur sm:rounded-[2rem]">
            <img
              src="/ssr kitasan black.webp"
              alt="SSR Kitasan Black — Joki Umamusume"
              className="h-full w-full rounded-[1.4rem] object-cover sm:rounded-[1.5rem]"
            />
          </div>

          {/* Floating trust chips */}
          <div className="animate-float absolute -left-2 top-6 flex items-center gap-1.5 rounded-2xl bg-white px-2.5 py-1.5 shadow-xl shadow-primary/10 sm:-left-4 sm:gap-2 sm:px-3 sm:py-2">
            <span className="material-symbols-outlined text-[20px] text-accent-dark sm:text-2xl">trophy</span>
            <div className="leading-none">
              <div className="text-xs font-extrabold text-ink sm:text-sm">S+ ~ UG</div>
              <div className="text-[9px] text-gray-400 sm:text-[10px]">Rating tercapai</div>
            </div>
          </div>
          <div className="animate-float-slow absolute -right-2 bottom-8 flex items-center gap-1.5 rounded-2xl bg-white px-2.5 py-1.5 shadow-xl shadow-primary/10 sm:-right-3 sm:gap-2 sm:px-3 sm:py-2">
            <span className="material-symbols-outlined text-[20px] text-primary sm:text-2xl">shield</span>
            <div className="leading-none">
              <div className="text-xs font-extrabold text-ink sm:text-sm">100% Aman</div>
              <div className="text-[9px] text-gray-400 sm:text-[10px]">No bot · No VPN</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
