import React, { useState } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { trackShipment } from "../../api/api";
import { brandKey } from "../../constants/courierConfig";
import { motion } from "framer-motion";

const Hero: React.FC = () => {
  const [trackingId, setTrackingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await trackShipment(trackingId.trim(), brandKey);
      if (data.tracking_url) {
        window.open(data.tracking_url, "_blank");
      } else {
        setError("Unable to retrieve tracking URL for this shipment.");
      }
    } catch (err: any) {
      console.error("Tracking Error:", err);
      if (err.response?.status === 404) {
        setError("No shipment found with this tracking number.");
      } else {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again later.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="track"
      className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 flex items-center min-h-[90vh] bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 overflow-hidden"
    >
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 -left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-blue-100/50 text-blue-700 text-sm font-semibold shadow-sm mb-6">
                <span className="relative flex h-3 w-3 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                Next-Gen Global Delivery Solutions
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                Delivering <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 relative inline-block">
                  Trust & Speed
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Experience seamless logistics with our state-of-the-art tracking
                and lightning-fast delivery network. Your packages, our priority.
              </p>
            </motion.div>

            {/* Tracking Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 max-w-lg mx-auto lg:mx-0"
            >
              <form onSubmit={handleTrack} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div
                  className={`relative flex items-center bg-white/90 backdrop-blur-md rounded-2xl shadow-xl ${error ? "border-red-300 ring-2 ring-red-100" : "border-gray-100"} p-2 transition-all`}
                >
                  <div className="pl-4 text-gray-400">
                    <Search className="h-6 w-6" />
                  </div>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => {
                      setTrackingId(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter Tracking ID (e.g. 2026270001)"
                    className="w-full px-4 py-4 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 text-lg font-medium outline-none"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !trackingId.trim()}
                    className={`flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-95 font-bold tracking-wide transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Locating...
                      </>
                    ) : (
                      <>
                        Track <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  <span className="flex h-2 w-2 rounded-full bg-red-600"></span>
                  {error}
                </motion.div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2">
                <p className="text-sm font-medium text-gray-500">Popular: <span className="text-gray-900">AWB12345678</span></p>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300"></div>
                <a
                  href="#services"
                  className="text-sm font-bold text-blue-600 hover:text-indigo-600 transition-colors"
                >
                  Explore Services →
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Modern Abstract Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Glass Card 1 */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-0 w-64 h-80 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] p-6 z-20"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <div className="h-4 w-3/4 bg-gray-200/80 rounded-full mb-4"></div>
                <div className="h-4 w-1/2 bg-gray-200/80 rounded-full mb-8"></div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 w-full bg-gray-200/80 rounded-full mb-2"></div>
                      <div className="h-2 w-2/3 bg-gray-200/80 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 opacity-50">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 w-full bg-gray-200/80 rounded-full mb-2"></div>
                      <div className="h-2 w-2/3 bg-gray-200/80 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Glass Card 2 */}
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 left-0 w-72 h-48 bg-white/60 backdrop-blur-lg border border-white/80 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] p-6 z-30"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-gray-800">In Transit</span>
                  <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Today, 2:30 PM</span>
                </div>
                <div className="relative w-full h-2 bg-gray-100 rounded-full mb-6">
                  <div className="absolute top-0 left-0 h-full w-2/3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-white border-4 border-indigo-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-lg"></div>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>New York</span>
                  <span>London</span>
                </div>
              </motion.div>

              {/* Background Decoration Elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-blue-200/50 rounded-full z-0"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-indigo-200/40 rounded-full z-0"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
