import React, { useState, useEffect } from "react";
import { Search, ArrowRight, Loader2, MapPin, Package as PackageIcon } from "lucide-react";
import { trackShipment } from "../../api/api";
import { brandKey } from "../../constants/courierConfig";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const Hero: React.FC = () => {
  const [trackingId, setTrackingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); // 0: none, 1: searching, 2: connecting, 3: found
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsLoading(true);
    setError(null);
    setLoadingStep(1);

    try {
      // Simulate modern loading sequence
      await new Promise((res) => setTimeout(res, 800));
      setLoadingStep(2);
      await new Promise((res) => setTimeout(res, 800));
      setLoadingStep(3);
      await new Promise((res) => setTimeout(res, 400));

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
      setLoadingStep(0);
    }
  };

  const textVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position from center (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      id="track"
      className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 flex items-center min-h-[95vh] bg-[#F8FAFC] dark:bg-[#070B14] overflow-hidden"
    >
      {/* Subtle Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-[#F8FAFC] to-[#F8FAFC] dark:from-blue-900/10 dark:via-[#070B14] dark:to-[#070B14]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay" />

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={textVariants} className="inline-flex items-center px-3 py-1.5 rounded-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 shadow-sm text-sm font-medium backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5 mr-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="text-gray-800 dark:text-gray-200 tracking-wide text-xs uppercase">Your shipment is always moving</span>
            </motion.div>

            <motion.h1 variants={textVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1]">
              Global Logistics <br />
              <span className="text-primary relative inline-block">
                Simplified
              </span>
            </motion.h1>

            <motion.p variants={textVariants} className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Reliable, fast, and secure delivery services designed to move your
              business forward. Track your shipments instantly in real-time.
            </motion.p>

            {/* Tracking Bar */}
            <motion.div variants={textVariants} className="mt-8 max-w-lg mx-auto lg:mx-0">
              <form onSubmit={handleTrack} className="relative group z-20">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-primary rounded-full blur opacity-10 group-hover:opacity-30 group-focus-within:opacity-40 transition duration-500"></div>

                <div
                  className={cn(
                    "relative flex items-center bg-white dark:bg-[#0F172A] rounded-full shadow-lg border p-1.5 transition-all duration-300",
                    error
                      ? "border-red-300 ring-4 ring-red-50 dark:ring-red-900/20"
                      : "border-gray-200 dark:border-gray-700/50 focus-within:ring-4 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30 focus-within:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "pl-5 transition-colors duration-300",
                    trackingId ? "text-primary" : "text-gray-400"
                  )}>
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => {
                      setTrackingId(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter Tracking ID (e.g. 2026270001)"
                    className="w-full px-4 py-3.5 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 text-base outline-none"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !trackingId.trim()}
                    className={cn(
                      "flex-shrink-0 text-white px-8 py-3.5 rounded-full font-semibold tracking-wide transition-all shadow-md flex items-center gap-2",
                      isLoading || !trackingId.trim()
                        ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400 shadow-none"
                        : "bg-primary hover:bg-blue-600 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    )}
                  >
                    {isLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 min-w-[100px] justify-center"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">
                          {loadingStep === 1 && "Searching..."}
                          {loadingStep === 2 && "Connecting..."}
                          {loadingStep === 3 && "Found"}
                        </span>
                      </motion.div>
                    ) : (
                      <span className="flex items-center gap-2">
                        Track <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                </div>
              </form>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 px-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 font-medium"
                >
                  <span className="flex h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-400"></span>
                  {error}
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Right Content - Abstract Dashboard Visual */}
          <div className="relative hidden lg:flex h-[500px] w-full items-center justify-center perspective-1000">
            {/* Parallax Container */}
            <motion.div
              className="relative w-full max-w-md transform-style-3d"
              animate={{
                rotateX: mousePosition.y * -10,
                rotateY: mousePosition.x * 10,
              }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            >
              {/* Abstract glowing background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-400/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>

              {/* Main Active Tracking Card */}
              <motion.div
                className="relative z-20 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800 w-full mb-6"
                style={{ transform: "translateZ(50px)" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-primary tracking-wider uppercase flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    Active Delivery
                  </span>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                    AWB #2026270001
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-6 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800">
                      <PackageIcon className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Origin</p>
                        <p className="font-semibold text-gray-900 dark:text-white">New York (JFK)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Destination</p>
                        <p className="font-semibold text-gray-900 dark:text-white">London (LHR)</p>
                      </div>
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="relative w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-primary rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center border border-green-100 dark:border-green-800">
                      <MapPin className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                      In Transit (On Time)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ETA</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Today, 2:30 PM</p>
                  </div>
                </div>
              </motion.div>

              {/* Secondary Card (Behind) */}
              <motion.div
                className="absolute -bottom-8 -right-8 w-64 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md rounded-xl p-4 shadow-xl border border-gray-100 dark:border-gray-800 z-10"
                style={{ transform: "translateZ(20px)" }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Next Dispatch</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">in 15 mins</p>
                  </div>
                </div>
              </motion.div>

              {/* Third Card (Behind) */}
              <motion.div
                className="absolute -top-8 -left-8 w-56 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md rounded-xl p-4 shadow-xl border border-gray-100 dark:border-gray-800 z-10"
                style={{ transform: "translateZ(10px)" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Daily Success</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">99.8% Delivered</p>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
