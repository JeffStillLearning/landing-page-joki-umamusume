'use client';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Events from "../components/Events";

export default function EventPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-15"> {/* Padding to clear fixed navbar */}
        <Events />
      </div>
    </main>
  );
}
