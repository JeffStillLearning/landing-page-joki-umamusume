import React from 'react';

export default function Footer() {
  return (
    <section className="py-20 px-4 relative" id="contact">
      <div className="absolute inset-0 bg-primary/5 z-0"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-[#1d0c12] to-[#3a1d28] rounded-3xl p-8 md:p-12 text-center shadow-2xl text-white overflow-hidden relative">
          {/* Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight relative z-10">PESAN SEKARANG</h2>
          <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto relative z-10">Jangan biarkan stamina terbuang sia-sia. Hubungi kami sekarang dan biarkan worker berpengalaman kami yang bekerja!</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <a 
              href="https://wa.me/6283110123195?text=Halo%20Admin%2C%20saya%20tertarik%20dengan%20jasa%20joki%20Uma%20Musume." 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1 cursor-pointer"
            >
              {/* Whatsapp Icon replacement */}
              <span className="material-symbols-outlined text-2xl">chat</span>
              Chat WhatsApp
            </a>
            <a 
              href="https://discord.gg/888936708903694377" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Chat Admin lewat Discord"
              className="flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1 cursor-pointer"
            >
              {/* Discord Icon replacement */}
              <span className="material-symbols-outlined text-2xl">chat</span>
              Join Discord
            </a>
          </div>
          
          <p className="mt-8 text-xs text-gray-500">© 2025 Joki Uma Musume. All rights reserved. <br/> Not affiliated with Cygames.</p>
        </div>
      </div>
    </section>
  );
}
