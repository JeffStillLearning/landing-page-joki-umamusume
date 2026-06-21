import React from "react";

const CONTACTS = [
  {
    href: "https://wa.me/6283110123195?text=Halo%20Admin%2C%20saya%20tertarik%20dengan%20jasa%20joki%20Uma%20Musume.",
    label: "Chat WhatsApp",
    img: "/icons/whatsapp.png",
    cls: "bg-green-500 hover:bg-green-600 hover:shadow-green-500/30",
  },
  {
    href: "https://discord.gg/888936708903694377",
    label: "Chat Discord",
    img: "/icons/discord.png",
    cls: "bg-[#5865F2] hover:bg-[#4752C4] hover:shadow-blue-500/30",
  },
  {
    href: "https://m.me/JeffUmamusume",
    label: "Chat Facebook",
    img: "/icons/facebook.png",
    cls: "bg-[#1877F2] hover:bg-[#166fe5] hover:shadow-blue-500/30",
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-background-light py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* CTA card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1d0c12] to-[#3a1d28] p-8 text-center text-white shadow-2xl md:p-14">
          <div className="speed-lines absolute inset-0 opacity-[0.06]" />
          <div className="glow-blob absolute -right-10 -top-10 h-56 w-56 bg-primary/30" />
          <div className="glow-blob absolute -bottom-10 -left-10 h-56 w-56 bg-accent/20" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
              Siap Mulai?
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-5xl">PESAN SEKARANG</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-300 md:text-lg">
              Jangan biarkan stamina terbuang sia-sia. Hubungi kami sekarang dan biarkan worker
              berpengalaman kami yang bekerja!
            </p>

            <div className="mt-9 flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
              {CONTACTS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={c.label}
                  className={`flex w-full items-center justify-center gap-3 rounded-2xl px-7 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 sm:w-auto ${c.cls}`}
                >
                  <img src={c.img} alt="" aria-hidden="true" className="h-6 w-6" />
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
