import React from "react";
import { Search, ArrowRight } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <div
      id="track"
      className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 flex items-center min-h-[90vh] bg-gradient-to-b from-blue-50/50 via-white to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-4">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              Fast • Secure • Real-Time Courier Tracking
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Global Logistics <br />
              <span className="text-primary relative inline-block">
                Simplified
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Reliable, fast, and secure delivery services designed to move your
              business forward. Track your shipments instantly.
            </p>

            {/* Tracking Bar */}
            <div className="mt-8 max-w-lg mx-auto lg:mx-0">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-200 opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center bg-white rounded-full shadow-lg border border-gray-100 p-1.5 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <div className="pl-4 text-gray-400">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Tracking ID (e.g. AWB123456)"
                    className="w-full px-4 py-3 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 text-base"
                  />
                  <button className="flex-shrink-0 bg-primary text-white px-6 py-3 rounded-full hover:bg-blue-700 font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                    Track <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <p className="text-sm text-gray-400">Try: AWB12345678</p>
                <span className="hidden sm:inline text-gray-300">|</span>
                <a
                  href="#services"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View Services
                </a>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative hidden lg:block">
            <div className="absolute top-10 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-10 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="relative">
              {/* SVG Illustration - Replacing simple one with a more detailed abstract logistic composition */}
              <svg
                className="w-full h-auto drop-shadow-2xl"
                viewBox="0 0 600 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="50"
                  y="50"
                  width="500"
                  height="400"
                  rx="20"
                  fill="white"
                  fillOpacity="0.8"
                />
                {/* Map */}
                <path
                  d="M100 150 L200 100 L400 120 L500 200"
                  stroke="#E2E8F0"
                  strokeWidth="4"
                  strokeDasharray="8 8"
                />
                <circle cx="100" cy="150" r="8" fill="#3B82F6" />
                <circle cx="500" cy="200" r="8" fill="#10B981" />

                {/* Truck Card */}
                <g transform="translate(180, 220)">
                  <rect
                    width="240"
                    height="140"
                    rx="16"
                    fill="white"
                    className="shadow-lg"
                    filter="url(#shadow)"
                  />
                  <rect
                    x="20"
                    y="20"
                    width="48"
                    height="48"
                    rx="12"
                    fill="#EFF6FF"
                  />
                  <path
                    d="M34 44H54M34 34H54"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <text
                    x="80"
                    y="45"
                    fontFamily="sans-serif"
                    fontSize="16"
                    fontWeight="bold"
                    fill="#1E293B"
                  >
                    Delivery On The Way
                  </text>
                  <text
                    x="80"
                    y="70"
                    fontFamily="sans-serif"
                    fontSize="14"
                    fill="#64748B"
                  >
                    Arriving in 2 hours
                  </text>
                  <rect
                    x="20"
                    y="100"
                    width="200"
                    height="8"
                    rx="4"
                    fill="#F1F5F9"
                  />
                  <rect
                    x="20"
                    y="100"
                    width="140"
                    height="8"
                    rx="4"
                    fill="#3B82F6"
                  />
                </g>

                {/* Floating Elements */}
                <circle
                  cx="450"
                  cy="100"
                  r="40"
                  fill="#3B82F6"
                  fillOpacity="0.1"
                />
                <circle
                  cx="100"
                  cy="400"
                  r="30"
                  fill="#10B981"
                  fillOpacity="0.1"
                />

                <defs>
                  <filter id="shadow" x="-20" y="-20" width="280" height="180">
                    <feDropShadow
                      dx="0"
                      dy="10"
                      stdDeviation="15"
                      floodColor="#000000"
                      floodOpacity="0.1"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
