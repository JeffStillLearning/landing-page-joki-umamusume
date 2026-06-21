import React from "react";
import Link from "next/link";

const SERVICES = [
  {
    href: "/joki",
    icon: "analytics",
    badge: "Paling Populer",
    title: "Joki Utama",
    desc: "Daily, Training, dan Farming Fans untuk merawat akun & menyiapkan champions meeting.",
    cta: "Lihat Daftar Jasa",
    image: "/ssr oguri cup 4 banding 3.webp",
    iconWrap: "bg-gradient-to-br from-primary to-primary-dark shadow-primary/25",
    ctaText: "text-primary",
  },
  {
    href: "/event",
    icon: "event",
    badge: "Reward Maksimal",
    title: "Event & Extra",
    desc: "Legend Race, Champions Meeting, dan event spesial lain dengan strategi reward optimal.",
    cta: "Lihat Event Terbaru",
    image: "/ssr meisho doto 4 banding 3.webp",
    iconWrap: "bg-gradient-to-br from-accent to-accent-dark shadow-accent/25",
    ctaText: "text-accent-dark",
  },
];

export default function ServicePortal() {
  return (
    <section className="bg-white py-16 md:py-28" id="layanan">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Layanan Kami</span>
          <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl md:text-5xl">
            Pilih Layanan Joki
          </h2>
          <p className="mt-4 text-gray-500">
            Berbagai pilihan jasa joki sesuai kebutuhan akun Umamusume Anda.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {SERVICES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group relative flex flex-col overflow-hidden rounded-3xl border-2 border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur">
                  {s.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 md:p-8">
                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg ${s.iconWrap}`}
                >
                  <span className="material-symbols-outlined !text-2xl">{s.icon}</span>
                </div>
                <h3 className="text-2xl font-extrabold uppercase tracking-tight text-ink">{s.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-gray-500">{s.desc}</p>
                <span className={`mt-6 inline-flex items-center gap-2 font-bold ${s.ctaText}`}>
                  {s.cta}
                  <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
