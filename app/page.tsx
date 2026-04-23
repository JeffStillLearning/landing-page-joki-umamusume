import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Safety from "./components/Safety";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Service Portal Section */}
      <section className="py-24 bg-white" id="layanan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#1d0c12] mb-4 uppercase">Pilih Layanan Joki</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Menyediakan berbagai pilihan jasa joki sesuai kebutuhan akun Umamusume Anda.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-10 max-w-5xl mx-auto">
            {/* Joki Portal Card */}
            <Link href="/joki" className="group relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-gray-50 aspect-square flex flex-col justify-end p-4 md:p-10 border-2 md:border-4 border-gray-100 hover:border-primary transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-primary to-white z-10"></div>
              
              <div className="relative z-20">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-3 md:mb-6 ">
                  <span className="material-symbols-outlined !text-5xl md:text-4xl text-white">analytics</span>
                </div>
                <h3 className="text-sm md:text-3xl font-black text-white mb-1 md:mb-3 uppercase">Joki Utama</h3>
                <p className="hidden md:block text-white mb-8 leading-relaxed text-[17px]">Daily, Training, Farming Fans untuk merawat akun kamu dan persiapkan champions meeting</p>
                <div className="flex items-center gap-2 md:gap-3 text-white font-bold text-[11px] md:text-base">
                  <span className="hidden md:inline text">Lihat Daftar Jasa</span>
                  <span className="md:hidden">Cek Jasa</span>
                  <span className="material-symbols-outlined text-xs md:text-base">arrow_forward</span>
                </div>
              </div>
            </Link>

            {/* Event Portal Card */}
            <Link href="/event" className="group relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-gray-50 aspect-square flex flex-col justify-end p-4 md:p-10 border-2 md:border-4 border-gray-100 hover:border-primary transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-primary to-white z-10"></div>
              
              <div className="relative z-20">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-3 md:mb-6 ">
                  <span className="material-symbols-outlined !text-5xl md:text-4xl text-white">event</span>
                </div>
                <h3 className="text-sm md:text-3xl font-black text-white mb-1 md:mb-3 uppercase">Event & Extra</h3>
                <p className="hidden md:block text-white text-[17px] mb-8 leading-relaxed">Legend Race, Champions Meeting, dan event spesial lainnya dengan reward maksimal.</p>
                <div className="flex items-center gap-2 md:gap-3 text-white font-bold text-[11px] md:text-base">
                  <span className="hidden md:inline text">Lihat Event Terbaru</span>
                  <span className="md:hidden">Cek Event</span>
                  <span className="material-symbols-outlined text-xs md:text-base">arrow_forward</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Safety />
      <Testimonials />
      <Footer />
    </main>
  );
}
