import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Services from "../components/landing/Services";
import Stats from "../components/landing/Stats";
import Footer from "../components/landing/Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <Footer />
    </div>
  );
};

export default LandingPage;
