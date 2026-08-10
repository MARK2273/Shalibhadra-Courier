import React, { useState } from "react";
import { Globe, Truck, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const Services: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: "spring", stiffness: 60, damping: 15 } 
    }
  };

  const CardSpotlight = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    return (
      <motion.div
        variants={itemVariants}
        className={cn(
          "group relative overflow-hidden rounded-[32px] bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-800 transition-all duration-500",
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        whileHover={{ y: -4 }}
      >
        <div
          className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59,130,246,0.1), transparent 40%)`,
          }}
        />
        <div className="relative h-full flex flex-col p-8 z-10">
          {children}
        </div>
      </motion.div>
    );
  };

  return (
    <section id="services" className="py-24 bg-[#F8FAFC] dark:bg-[#070B14] transition-colors relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="text-primary dark:text-blue-400 font-semibold tracking-wider uppercase text-sm border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full">
              Why Choose Us
            </span>
            <h2 className="mt-6 text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
              A Better Way to Ship Smarter
            </h2>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 font-light">
              Reliable logistics solutions designed for speed, security, and
              trust. Experience the next generation of delivery.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[420px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Global Shipping - Large Feature Card */}
          <CardSpotlight className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white to-blue-50/50 dark:from-[#0F172A] dark:to-[#0F172A]">
            <div className="flex flex-col h-full justify-between">
              <div className="max-w-md">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mb-6 ring-1 ring-blue-200 dark:ring-blue-800/50">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                  Global Shipping Network
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                  Reach customers worldwide with our extensive international delivery network. 
                  Seamless customs clearance and cross-border logistics.
                </p>
              </div>

              {/* Animated World/Network Visual */}
              <div className="relative mt-8 h-48 w-full overflow-hidden rounded-2xl bg-white/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 flex items-center justify-center">
                <svg viewBox="0 0 400 200" className="w-full h-full absolute inset-0 opacity-20 dark:opacity-40">
                  <path d="M0,100 Q100,50 200,100 T400,100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" className="text-blue-500" />
                  <path d="M0,150 Q100,100 200,150 T400,150" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                  <path d="M0,50 Q100,0 200,50 T400,50" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                </svg>
                
                {/* Moving Nodes */}
                <motion.div 
                  className="absolute w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                  animate={{ x: [-150, 150], y: [-20, 20] }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  animate={{ x: [100, -100], y: [30, -30] }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 1 }}
                />
              </div>

              <div className="mt-6 flex items-center text-primary dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Learn more <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </CardSpotlight>

          {/* Express Delivery - Medium Card */}
          <CardSpotlight className="lg:col-span-1">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 mb-6 ring-1 ring-green-200 dark:ring-green-800/50">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                  Express Delivery
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  Secure and fast delivery for your urgent documents and parcels within 24 hours.
                </p>
              </div>

              {/* Animated Truck/Progress Visual */}
              <div className="relative mt-8 h-48 w-full rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-6 border border-gray-100 dark:border-gray-700/50 flex flex-col justify-center">
                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 relative">
                    <motion.div 
                      className="bg-green-500 h-full rounded-full"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "85%" }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                      viewport={{ once: true }}
                    />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-green-500 drop-shadow-md z-10"
                      initial={{ left: "0%" }}
                      whileInView={{ left: "85%" }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-white dark:bg-gray-800 p-1.5 rounded-full border-2 border-green-500 shadow-sm flex items-center justify-center">
                         <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                    </motion.div>
                 </div>
                 
                 <div className="flex justify-between text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mt-6">
                    <span>Origin</span>
                    <span className="text-green-500 font-bold">24h</span>
                    <span>Destination</span>
                 </div>
              </div>

              <div className="mt-6 flex items-center text-primary dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Learn more <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </CardSpotlight>

          {/* Real-time Tracking - Interactive Card */}
          <CardSpotlight className="md:col-span-3 lg:col-span-3">
             <div className="flex flex-col md:flex-row h-full gap-8 items-center">
                <div className="flex-1 max-w-xl">
                  <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 mb-6 ring-1 ring-purple-200 dark:ring-purple-800/50">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                    Military-Grade Tracking
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                    Monitor your shipment status 24/7 with our advanced GPS tracking system. 
                    Get instant notifications at every checkpoint, ensuring complete transparency.
                  </p>
                  
                  <div className="mt-8 flex items-center text-primary dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Track now <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>

                {/* Tracking Timeline Visual */}
                <div className="flex-1 w-full relative">
                  <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-[#0F172A] to-transparent z-10 pointer-events-none" />
                  <div className="flex items-center space-x-4 overflow-hidden py-4 px-2">
                    {[
                      { status: "Picked Up", time: "09:00 AM", active: true },
                      { status: "In Transit", time: "11:30 AM", active: true },
                      { status: "Out for Delivery", time: "02:15 PM", active: true },
                      { status: "Delivered", time: "Pending", active: false }
                    ].map((step, i) => (
                      <motion.div 
                        key={i} 
                        className={cn(
                          "flex-shrink-0 w-40 p-4 rounded-xl border relative",
                          step.active 
                            ? "bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800/50 shadow-sm" 
                            : "bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-60"
                        )}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2, duration: 0.5 }}
                      >
                        {step.active && i === 2 && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                          </span>
                        )}
                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-3">
                          <div className={cn("w-2 h-2 rounded-full", step.active ? "bg-purple-600 dark:bg-purple-400" : "bg-gray-300 dark:bg-gray-600")} />
                        </div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{step.status}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{step.time}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
             </div>
          </CardSpotlight>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
