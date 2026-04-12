import React, { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
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
      className="relative min-h-screen flex items-center justify-center bg-[#FAFAFA] overflow-hidden pt-20"
    >
      {/* Absolute Soft Background Blobs */}
      <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-gray-200/50 rounded-full blur-[120px] -z-10 mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] bg-gray-200/50 rounded-full blur-[100px] -z-10 mix-blend-multiply pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 w-full relative z-10 flex flex-col items-center text-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="space-y-6 max-w-4xl"
        >
          <h1 className="text-5xl sm:text-7xl lg:text-[84px] font-semibold text-[#111111] tracking-[-0.04em] leading-[1.05]">
            Quietly moving the world forward.
          </h1>
          <p className="text-lg sm:text-2xl text-gray-400 font-light max-w-2xl mx-auto tracking-tight">
            Effortless logistics, precise tracking, and delivery that feels invisible.
          </p>
        </motion.div>

        {/* Tracking Input Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mt-16 w-full max-w-2xl"
        >
          <form onSubmit={handleTrack} className="relative group">
            {/* Soft Shadow Layer */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition duration-700"></div>

            <div className="relative flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-2 border border-gray-100">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => {
                  setTrackingId(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter tracking number..."
                className="w-full px-6 py-5 bg-transparent border-none focus:ring-0 text-[#111111] placeholder-gray-300 text-lg md:text-xl font-light outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !trackingId.trim()}
                className="w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0 bg-[#111111] text-white px-10 py-5 rounded-xl hover:bg-black font-medium tracking-wide transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-current" />
                ) : (
                  <>
                    Track <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-sm text-red-500 font-light"
            >
              {error}
            </motion.div>
          )}

          <div className="mt-8 flex justify-center gap-8 text-sm font-light text-gray-400">
            <span className="hover:text-gray-600 transition-colors cursor-default">Air Freight</span>
            <span className="hover:text-gray-600 transition-colors cursor-default">Ocean Cargo</span>
            <span className="hover:text-gray-600 transition-colors cursor-default">Express Rail</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
