import React from "react";

const ITEMS = [
  {
    icon: "wifi",
    title: "Koneksi Lokal (No VPN)",
    chip: "bg-green-50 text-green-600",
    body: "Kami login menggunakan IP Indonesia murni tanpa VPN, sehingga akun aman dari deteksi suspicious activity oleh Cygames.",
  },
  {
    icon: "sports_esports",
    title: "100% Manual Training",
    chip: "bg-blue-50 text-blue-600",
    body: "Murni skill tangan manusia. Tanpa bot, tanpa script, tanpa macro. Anda bisa request live stream saat pengerjaan.",
  },
  {
    icon: "inventory_2",
    title: "Resource Management",
    chip: "bg-orange-50 text-orange-600",
    body: "Kami tidak akan menggunakan Jewels atau item rare tanpa izin tertulis dari anda. Resource anda aman.",
  },
  {
    icon: "visibility_off",
    title: "Stealth Mode",
    chip: "bg-purple-50 text-purple-600",
    body: "Chat dimatikan, tidak berinteraksi dengan circle/guild, menjaga privasi anda tetap terjaga selama proses joki.",
  },
];

export default function Safety() {
  return (
    <section className="relative overflow-hidden bg-background-light py-16 md:py-28" id="keamanan">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Visual */}
          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-primary/15 to-accent/15 blur-2xl" />
            <div className="relative flex aspect-[4/3] w-full items-center justify-center rounded-[2rem] border border-white/60 bg-gradient-to-br from-primary-soft via-white to-accent/10 shadow-2xl shadow-primary/10">
              <span className="material-symbols-outlined !text-[120px] text-primary/70 md:!text-[160px]">
                verified_user
              </span>
            </div>
            <div className="absolute bottom-6 left-6 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-2.5 shadow-xl shadow-primary/10">
              <span className="material-symbols-outlined text-accent-dark">verified_user</span>
              <div className="leading-none">
                <div className="text-sm font-extrabold text-ink">Data Privasi Terjamin</div>
                <div className="text-[10px] text-gray-400">Kerahasiaan akun 100%</div>
              </div>
            </div>
          </div>

          {/* Accordion */}
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Jaminan</span>
            <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-ink md:text-4xl">
              Keamanan Akun
            </h2>
            <p className="mt-3 text-gray-500">
              Kami mengerti akun Anda sangat berharga. Standar keamanan adalah prioritas utama kami.
            </p>

            <div className="mt-8 space-y-3">
              {ITEMS.map((item) => (
                <details
                  key={item.title}
                  className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-ink">
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${item.chip}`}
                      >
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </span>
                      {item.title}
                    </span>
                    <span className="material-symbols-outlined flex-shrink-0 text-gray-400 transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <p className="mt-3 pl-[52px] text-sm leading-relaxed text-gray-600">{item.body}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
