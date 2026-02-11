import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Events from "./components/Events";
import Services from "./components/Services";
import Safety from "./components/Safety";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Events />
      <Safety />
      <Testimonials />
      <Footer />
    </main>
  );
}
