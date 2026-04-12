import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { currentConfig } from "../../constants/courierConfig";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled ? "bg-white/80 backdrop-blur-xl py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="flex justify-between items-center h-12">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <span className="text-xl font-medium tracking-tight text-black">
                {currentConfig.displayName}
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10">
              <a
                href="#track"
                className="text-gray-500 hover:text-black text-sm tracking-wide transition-colors"
              >
                Track
              </a>
              <a
                href="#services"
                className="text-gray-500 hover:text-black text-sm tracking-wide transition-colors"
              >
                Services
              </a>
              <a
                href="#contact"
                className="text-gray-500 hover:text-black text-sm tracking-wide transition-colors"
              >
                Contact
              </a>
              <Link
                to="/login"
                className="px-6 py-2.5 text-sm font-medium text-black bg-gray-100/80 hover:bg-gray-200/80 rounded-full transition-colors duration-300 backdrop-blur-sm"
              >
                Log in
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-black focus:outline-none"
              >
                {isOpen ? (
                  <X className="h-6 w-6" strokeWidth={1.5} />
                ) : (
                  <Menu className="h-6 w-6" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Full Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center md:hidden"
          >
            <div className="flex flex-col items-center space-y-8 w-full px-6">
              <a
                href="#track"
                onClick={() => setIsOpen(false)}
                className="text-3xl font-light tracking-tight text-black"
              >
                Track
              </a>
              <a
                href="#services"
                onClick={() => setIsOpen(false)}
                className="text-3xl font-light tracking-tight text-black"
              >
                Services
              </a>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="text-3xl font-light tracking-tight text-black"
              >
                Contact
              </a>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="mt-8 px-10 py-4 text-lg font-medium text-white bg-black rounded-full w-full max-w-xs text-center hover:scale-[1.02] transition-transform duration-300"
              >
                Log in
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
