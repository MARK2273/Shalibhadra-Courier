import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { currentConfig } from "../../constants/courierConfig";
import { Menu, X, Package } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";

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
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white dark:bg-gray-900 shadow-md py-2" : "bg-transparent py-4"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
              <Package className="h-6 w-6 text-primary dark:text-blue-400" />
            </div>
            <span
              className={`text-2xl font-bold ${scrolled ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white"}`}
            >
              {currentConfig.displayName}
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#track"
              className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 font-medium transition-colors"
            >
              Track
            </a>
            <a
              href="#services"
              className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 font-medium transition-colors"
            >
              Services
            </a>
            <a
              href="#contact"
              className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 font-medium transition-colors"
            >
              Contact
            </a>
            <ThemeToggle />
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-full hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Staff Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 focus:outline-none"
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
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg border-t border-gray-100 dark:border-gray-800">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a
              href="#track"
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
            >
              Track
            </a>
            <a
              href="#services"
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
            >
              Services
            </a>
            <a
              href="#contact"
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
            >
              Contact
            </a>
            <Link
              to="/login"
              className="block w-full text-center mt-4 px-5 py-3 text-base font-medium text-white bg-primary rounded-lg shadow-md"
            >
              Staff Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
