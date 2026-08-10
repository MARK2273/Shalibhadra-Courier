import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, useIsomorphicLayoutEffect } from "framer-motion";

const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && ref.current) {
      let startTimestamp: number | null = null;
      const duration = 2000; // 2 seconds

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function: easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        const currentVal = Math.floor(easeProgress * value);
        if (ref.current) {
          ref.current.textContent = currentVal.toLocaleString() + suffix;
        }
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          if (ref.current) {
             ref.current.textContent = value.toLocaleString() + suffix; // Ensure final exact value
          }
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [isInView, value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

const Stats: React.FC = () => {
  const stats = [
    { value: 10, suffix: "K+", label: "Deliveries" },
    { value: 500, suffix: "+", label: "Cities Covered" },
    { value: 99, suffix: "%", label: "On-Time" },
    { value: 24, suffix: "/7", label: "Support", isString: true } 
    // Special handling for 24/7 since it's not a simple number counter.
  ];

  return (
    <div className="bg-white dark:bg-[#0B1120] border-y border-gray-100 dark:border-gray-800 transition-colors relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100 dark:divide-gray-800">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="p-4 group relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Subtle hover background glow */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 dark:group-hover:bg-blue-900/10 rounded-2xl transition-colors duration-300" />
              
              <div className="relative z-10 text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight transition-transform duration-300 group-hover:scale-105 group-hover:text-primary dark:group-hover:text-blue-400">
                {stat.isString ? (
                  <span>{stat.value}{stat.suffix}</span>
                ) : (
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <div className="relative z-10 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
