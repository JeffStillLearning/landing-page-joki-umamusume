import React from 'react';

export default function Safety() {
  return (
    <section className="py-20 bg-background-light relative overflow-hidden" id="keamanan">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image/Visual side */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl transform scale-95"></div>
            <div className="relative bg-white p-2 rounded-3xl shadow-xl overflow-hidden aspect-[4/3] group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <div className="absolute bottom-6 left-6 z-20">
                <div className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">SAFE & SECURE</div>
                <h3 className="text-white text-2xl font-bold">Data Privasi Terjamin</h3>
                <p className="text-white/80 text-sm mt-1">Kami menjaga kerahasiaan akun anda 100%.</p>
              </div>
              {/* Using a gradient div as placeholder for security illustration */}
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-9xl text-white/80 group-hover:scale-110 transition-transform duration-500 z-20">security</span>
              </div>
            </div>
          </div>

          {/* Accordion/Content Side */}
          <div>
            <h2 className="text-3xl font-black text-[#1d0c12] mb-2 flex items-center gap-3">
              <span className="material-symbols-outlined text-accent text-4xl">verified_user</span>
              JAMINAN KEAMANAN
            </h2>
            <p className="text-gray-600 mb-8">Kami mengerti akun anda sangat berharga. Standar keamanan kami adalah prioritas utama.</p>

            <div className="space-y-4">
              {/* Accordion Item 1 */}
              <div className="bg-white rounded-xl shadow-sm border border-pink-50 overflow-hidden">
                <details className="group p-4" open>
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-900 list-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg text-green-600">
                        <span className="material-symbols-outlined">wifi</span>
                      </div>
                      <span>Koneksi Lokal (No VPN)</span>
                    </div>
                    <span className="transition group-open:rotate-180 material-symbols-outlined">expand_more</span>
                  </summary>
                  <div className="text-gray-600 mt-3 pl-[52px] text-sm leading-relaxed">
                    Kami login menggunakan IP Indonesia murni tanpa VPN, sehingga akun aman dari deteksi suspicious activity oleh Cygames.
                  </div>
                </details>
              </div>

              {/* Accordion Item 2 */}
              <div className="bg-white rounded-xl shadow-sm border border-pink-50 overflow-hidden">
                <details className="group p-4">
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-900 list-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <span className="material-symbols-outlined">sports_esports</span>
                      </div>
                      <span>100% Manual Training</span>
                    </div>
                    <span className="transition group-open:rotate-180 material-symbols-outlined">expand_more</span>
                  </summary>
                  <div className="text-gray-600 mt-3 pl-[52px] text-sm leading-relaxed">
                    Murni skill tangan manusia. Tanpa bot, tanpa script, tanpa macro. Anda bisa request live stream saat pengerjaan.
                  </div>
                </details>
              </div>

              {/* Accordion Item 3 */}
              <div className="bg-white rounded-xl shadow-sm border border-pink-50 overflow-hidden">
                <details className="group p-4">
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-900 list-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                        <span className="material-symbols-outlined">inventory_2</span>
                      </div>
                      <span>Resource Management</span>
                    </div>
                    <span className="transition group-open:rotate-180 material-symbols-outlined">expand_more</span>
                  </summary>
                  <div className="text-gray-600 mt-3 pl-[52px] text-sm leading-relaxed">
                    Kami tidak akan menggunakan Jewels atau item rare tanpa izin tertulis dari anda. Resource anda aman.
                  </div>
                </details>
              </div>

              {/* Accordion Item 4 */}
              <div className="bg-white rounded-xl shadow-sm border border-pink-50 overflow-hidden">
                <details className="group p-4">
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-900 list-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                        <span className="material-symbols-outlined">visibility_off</span>
                      </div>
                      <span>Stealth Mode</span>
                    </div>
                    <span className="transition group-open:rotate-180 material-symbols-outlined">expand_more</span>
                  </summary>
                  <div className="text-gray-600 mt-3 pl-[52px] text-sm leading-relaxed">
                    Chat dimatikan, tidak berinteraksi dengan circle/guild, menjaga privasi anda tetap terjaga selama proses joki.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}