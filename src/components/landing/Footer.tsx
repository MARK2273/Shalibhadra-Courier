import React from "react";
import { currentConfig } from "../../constants/courierConfig";
import { Package, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">
                {currentConfig.displayName}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-medium mb-8">
              Redefining global logistics with next-generation tracking, lightning-fast deliveries, and uncompromising security for your peace of mind.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">
              Services
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white font-medium transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 transition-opacity"></span> Domestic Shipping
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white font-medium transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 transition-opacity"></span> International Cargo
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white font-medium transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 transition-opacity"></span> Express Delivery
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white font-medium transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 transition-opacity"></span> Real-time Tracking
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white font-medium transition-colors text-sm flex items-center gap-2">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white font-medium transition-colors text-sm flex items-center gap-2">
                  Our Fleet
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white font-medium transition-colors text-sm flex items-center gap-2">
                  Careers <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold ml-2">Hiring</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white font-medium transition-colors text-sm flex items-center gap-2">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">
              Legal
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white font-medium transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white font-medium transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white font-medium transition-colors text-sm">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} {currentConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <span className="text-sm text-gray-500 font-medium hover:text-white cursor-pointer transition-colors">English (US)</span>
             <span className="text-sm text-gray-500 font-medium hover:text-white cursor-pointer transition-colors">USD ($)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
