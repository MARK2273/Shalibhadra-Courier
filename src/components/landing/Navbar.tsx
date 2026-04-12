import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { currentConfig } from "../../constants/courierConfig";
import { Menu, X, Package } from "lucide-react";
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
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm py-3 border-b border-gray-100/50" : "bg-transparent py-5"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span
              className={`text-2xl font-black tracking-tight ${scrolled ? "text-gray-900" : "text-gray-900"}`}
            >
              {currentConfig.displayName}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <a
              href="#track"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 font-bold text-sm rounded-full hover:bg-blue-50 transition-all"
            >
              Track
            </a>
            <a
              href="#services"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 font-bold text-sm rounded-full hover:bg-blue-50 transition-all"
            >
              Services
            </a>
            <a
              href="#contact"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 font-bold text-sm rounded-full hover:bg-blue-50 transition-all"
            >
              Contact
            </a>
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            <Link
              to="/login"
              className="ml-2 px-6 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-full hover:bg-blue-600 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Staff Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 pt-4 pb-8 space-y-3">
              <a
                href="#track"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-lg font-bold text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-colors"
              >
                Track
              </a>
              <a
                href="#services"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-lg font-bold text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-colors"
              >
                Services
              </a>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-lg font-bold text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-colors"
              >
                Contact
              </a>
              <div className="pt-4 mt-2 border-t border-gray-100">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-6 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  Staff Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
