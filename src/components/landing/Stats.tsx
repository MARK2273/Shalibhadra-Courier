import React from "react";
import { motion } from "framer-motion";

const Stats: React.FC = () => {
  const stats = [
    { value: "10K+", label: "Deliveries", color: "text-blue-600", delay: 0.1 },
    { value: "500+", label: "Cities Covered", color: "text-indigo-600", delay: 0.2 },
    { value: "99%", label: "On-Time", color: "text-emerald-500", delay: 0.3 },
    { value: "24/7", label: "Support", color: "text-purple-600", delay: 0.4 },
  ];

  return (
    <div className="relative z-20 bg-white shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)] border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: stat.delay }}
              className="p-6 rounded-3xl hover:bg-gray-50 transition-colors duration-300"
            >
              <div className={`text-4xl sm:text-5xl font-black ${stat.color} mb-3 tracking-tight`}>
                {stat.value}
              </div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
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
