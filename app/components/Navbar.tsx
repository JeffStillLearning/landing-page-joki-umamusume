"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/joki", label: "Paket Joki" },
  { href: "/event", label: "Event & Add-on" },
  { href: "/#keamanan", label: "Keamanan" },
  { href: "/#testimoni", label: "Testimoni" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-nav border-b border-primary/10 shadow-lg shadow-primary/5"
          : "border-b border-transparent bg-background-light/60 backdrop-blur-sm"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center transition-all duration-300 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Logo */}
          <div className="flex flex-1 justify-start">
            <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl ring-2 ring-primary/20 transition-transform duration-300 group-hover:scale-105">
                <img src="/favicon.ico" alt="Logo Joki Uma" className="h-full w-full object-cover" />
              </div>
              <div className="leading-none">
                <h1 className="text-xl font-extrabold tracking-tight text-ink">Joki Uma</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Professional
                </p>
              </div>
            </Link>
          </div>

          {/* Center menu */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-primary/5 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <Link
              href="/track"
              className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-ink transition-colors hover:text-primary md:flex"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              Cek Pesanan
            </Link>
            <Link
              href="/joki"
              className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 md:flex"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              Pesan Sekarang
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isMobileMenuOpen}
              className="flex items-center justify-center rounded-lg p-2 text-ink transition-colors hover:bg-primary/5 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:hidden"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
            >
              <span className="material-symbols-outlined text-3xl">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute w-full border-t border-primary/10 bg-white/95 shadow-xl backdrop-blur-md md:hidden">
          <div className="space-y-1 px-4 pb-6 pt-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-base font-semibold text-gray-700 transition-colors hover:bg-primary/5 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/track"
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-bold text-ink transition-colors hover:bg-primary/5 hover:text-primary"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              Cek Pesanan
            </Link>
            <Link
              href="/joki"
              onClick={closeMenu}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/25"
            >
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              Pesan Sekarang
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
