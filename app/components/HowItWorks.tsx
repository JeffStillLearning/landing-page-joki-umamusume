import React from "react";
import Link from "next/link";

const STEPS = [
  {
    icon: "shopping_cart",
    title: "Pilih Paket",
    desc: "Tentukan layanan atau paket joki yang sesuai kebutuhan akunmu.",
  },
  {
    icon: "chat",
    title: "Chat Admin",
    desc: "Hubungi admin via WhatsApp untuk konfirmasi detail & pembayaran.",
  },
  {
    icon: "sports_esports",
    title: "Pengerjaan",
    desc: "Worker mengerjakan 100% manual. Kamu bisa minta update atau live.",
  },
  {
    icon: "task_alt",
    title: "Selesai + Bukti",
    desc: "Akun dikembalikan lengkap dengan bukti hasil dan progres.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-28" id="cara-kerja">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Alur Mudah</span>
          <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl md:text-5xl">
            Cara Kerja
          </h2>
          <p className="mt-3 text-gray-500 md:mt-4">Empat langkah simpel dari pesan sampai akun selesai.</p>
        </div>

        <ol className="relative mx-auto max-w-6xl flex flex-col gap-0 lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Horizontal track (desktop) */}
          <div className="absolute left-0 right-0 top-9 hidden h-0.5 bg-gradient-to-r from-primary/30 via-accent/40 to-primary/30 lg:block" />

          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="relative flex items-start gap-5 pb-9 last:pb-0 lg:flex-col lg:gap-0 lg:pb-0"
            >
              {/* Vertical connector (mobile) */}
              {i < STEPS.length - 1 && (
                <span className="absolute bottom-1 left-9 top-[76px] w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/30 to-accent/30 lg:hidden" />
              )}

              <div className="relative z-10 flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25">
                <span className="material-symbols-outlined !text-3xl">{step.icon}</span>
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-extrabold text-white ring-4 ring-white">
                  {i + 1}
                </span>
              </div>

              <div className="pt-2 lg:pt-0">
                <h3 className="text-lg font-extrabold text-ink lg:mt-5">{step.title}</h3>
                <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-gray-500 lg:mt-2">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex justify-center md:mt-14">
          <Link
            href="/joki"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
          >
            <span className="material-symbols-outlined text-[20px]">bolt</span>
            Mulai Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}
