import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServicePortal from "./components/ServicePortal";
import WhyUs from "./components/WhyUs";
import HowItWorks from "./components/HowItWorks";
import Safety from "./components/Safety";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Reveal>
        <ServicePortal />
      </Reveal>
      <WhyUs />
      <HowItWorks />
      <Reveal>
        <Safety />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <Footer />
      </Reveal>
    </main>
  );
}
