import React from "react";
import { currentConfig } from "../../constants/courierConfig";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111111] text-white pt-24 pb-12 selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-16 mb-12">
          <div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight mb-6">
              {currentConfig.displayName}
            </h2>
            <p className="text-gray-400 font-light max-w-sm text-lg">
              The minimalist approach to global logistics.
            </p>
          </div>
          <div className="mt-12 md:mt-0 flex gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-sm font-medium text-gray-500 tracking-wider uppercase mb-2">Platform</span>
              <a href="#track" className="text-gray-300 hover:text-white transition-colors font-light">Track</a>
              <a href="#services" className="text-gray-300 hover:text-white transition-colors font-light">Services</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors font-light">Contact</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-light">
          <p>© {new Date().getFullYear()} {currentConfig.name}. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
