import React from "react";
import { currentConfig } from "../../constants/courierConfig";
import { Package } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#070B14] pt-20 pb-10 transition-colors relative z-20">
      
      {/* Animated Top Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="col-span-1 md:col-span-4 lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-xl text-primary dark:text-blue-400">
                <Package className="h-5 w-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {currentConfig.displayName}
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm font-light">
              Your trusted partner for global logistics and secure delivery
              solutions. We move your business forward, faster.
            </p>
          </div>

          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">
              Services
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors text-sm font-medium">
                  Domestic
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors text-sm font-medium">
                  International
                </a>
              </li>
              <li>
                <a href="#track" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors text-sm font-medium">
                  Tracking
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors text-sm font-medium">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors text-sm font-medium">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors text-sm font-medium">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">
              Legal
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors text-sm font-medium">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors text-sm font-medium">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center transition-colors">
          <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
            © {new Date().getFullYear()} {currentConfig.name}. All rights
            reserved.
          </p>
          <div className="mt-4 md:mt-0 text-sm text-gray-400 dark:text-gray-500 flex gap-4">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
