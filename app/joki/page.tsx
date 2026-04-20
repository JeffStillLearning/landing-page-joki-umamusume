'use client';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Services from "../components/Services";

export default function JokiPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-10"> {/* Padding to clear fixed navbar */}
        <Services />
      </div>
    </main>
  );
}
