import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Services from "../components/landing/Services";
import Stats from "../components/landing/Stats";
import LiveNetworkSection from "../components/landing/LiveNetworkSection";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";
import { motion, useScroll, useSpring } from "framer-motion";

const LandingPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#070B14] font-sans text-gray-900 dark:text-gray-100 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors relative">
      
      {/* Scroll Progress Route Line */}
      <div className="fixed left-4 top-0 bottom-0 w-8 z-40 hidden xl:block pointer-events-none">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800 -translate-x-1/2" />
        <motion.div 
          className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-primary -translate-x-1/2 origin-top"
          style={{ scaleY }}
        />
        {/* Nodes along the progress */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white dark:bg-[#070B14] border-2 border-primary" />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white dark:bg-[#070B14] border-2 border-primary" />
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white dark:bg-[#070B14] border-2 border-primary" />
        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white dark:bg-[#070B14] border-2 border-primary" />
      </div>

      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <LiveNetworkSection />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;
