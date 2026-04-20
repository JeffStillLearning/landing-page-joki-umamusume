import React from 'react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-hero-pattern opacity-60 z-0"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10 -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

        
        <h1 className="text-5xl md:text-7xl font-black text-[#1d0c12] tracking-tight mb-6 leading-tight">
          JOKI GAME <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">UMAMUSUME</span>
        </h1>
        
        <div className="text-base md:text-lg lg:text-xl text-gray-600 max-w-7xl mx-auto mb-10 leading-relaxed">
          Joki Umamusume adalah layanan profesional yang dirancang khusus untuk membantu para pemain Uma Musume: Pretty Derby dalam mengoptimalkan progres akun mereka tanpa harus mengorbankan waktu produktivitas di dunia nyata. Kami hadir sebagai solusi bagi para pelatih (Trainers) yang ingin melihat Uma favoritnya mencapai performa maksimal, mendapatkan rating tinggi dari S+ hingga UG, namun terkendala oleh kesibukan harian atau kerumitan mekanik skenario terbaru seperti TrackBlazer.
        </div>
        
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-gray-200/60 pt-8">
          <div>
            <div className="text-3xl font-black text-primary">8 Bulan</div>
            <div className="text-sm font-medium text-gray-500">Pengalaman</div>
          </div>
          <div>
            <div className="text-3xl font-black text-accent">S+~Ug</div>
            <div className="text-sm font-medium text-gray-500">Rating</div>
          </div>
          <div>
            <div className="text-3xl font-black text-primary">100%</div>
            <div className="text-sm font-medium text-gray-500">Aman & Legal</div>
          </div>
          <div>
            <div className="text-3xl font-black text-accent">24/7</div>
            <div className="text-sm font-medium text-gray-500">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
