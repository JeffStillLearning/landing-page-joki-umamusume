"use client";

import React from "react";
import { motion, type Variants } from "motion/react";
import Reveal from "./Reveal";

const POINTS = [
  {
    icon: "shield",
    title: "Aman & Legal",
    desc: "100% manual, tanpa bot/script & tanpa VPN. Akun dan privasimu terjaga penuh.",
    iconBg: "bg-primary/10 text-primary",
  },
  {
    icon: "bolt",
    title: "Cepat & Terjadwal",
    desc: "Pengerjaan rapi sesuai timeline dengan update progres yang rutin.",
    iconBg: "bg-accent/10 text-accent-dark",
  },
  {
    icon: "trophy",
    title: "Hasil Maksimal",
    desc: "Rating S+ hingga UG dengan strategi event & training yang teruji.",
    iconBg: "bg-primary/10 text-primary",
  },
  {
    icon: "support_agent",
    title: "Support 24/7",
    desc: "Admin responsif via WhatsApp, Discord, dan Facebook kapan saja.",
    iconBg: "bg-accent/10 text-accent-dark",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WhyUs() {
  return (
    <section className="bg-background-light py-16 md:py-28" id="kenapa-kami">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Kenapa Kami</span>
          <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl md:text-5xl">
            Kenapa Pilih Kami
          </h2>
          <p className="mt-3 text-gray-500 md:mt-4">
            Bukan sekadar cepat — kami menjaga keamanan akun dan kualitas hasil sebagai prioritas.
          </p>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {POINTS.map((p) => (
            <motion.div
              key={p.title}
              variants={item}
              whileHover={{ y: -6 }}
              className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl hover:shadow-primary/10 sm:flex-col sm:gap-0 sm:rounded-3xl sm:p-7"
            >
              <div
                className={`inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-5 sm:h-14 sm:w-14 ${p.iconBg}`}
              >
                <span className="material-symbols-outlined !text-2xl sm:!text-3xl">{p.icon}</span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-ink sm:text-lg">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500 sm:mt-2">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
