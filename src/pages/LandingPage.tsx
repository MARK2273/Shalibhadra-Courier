import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Services from "../components/landing/Services";
import Stats from "../components/landing/Stats";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors">
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;
