import React from "react";
import { currentConfig } from "../../constants/courierConfig";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-bold text-primary">
              {currentConfig.displayName}
            </span>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              Your trusted partner for global logistics and secure delivery
              solutions.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              <li>
                <a className="text-gray-500 hover:text-primary transition-colors text-sm">
                  Domestic
                </a>
              </li>
              <li>
                <a className="text-gray-500 hover:text-primary transition-colors text-sm">
                  International
                </a>
              </li>
              <li>
                <a className="text-gray-500 hover:text-primary transition-colors text-sm">
                  Tracking
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <a className="text-gray-500 hover:text-primary transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a className="text-gray-500 hover:text-primary transition-colors text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a className="text-gray-500 hover:text-primary transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <a className="text-gray-500 hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="text-gray-500 hover:text-primary transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center bg-white">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {currentConfig.name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
