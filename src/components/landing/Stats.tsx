import React from "react";
import { motion } from "framer-motion";

const Stats: React.FC = () => {
  return (
    <div className="bg-[#FAFAFA] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-8 text-center sm:text-left"
        >
          <div className="flex flex-col gap-y-3">
            <div className="text-5xl sm:text-6xl font-light text-[#111111] tracking-tight">
              10M+
            </div>
            <div className="text-sm font-medium text-gray-400 tracking-wider uppercase">
              Packages Delivered
            </div>
          </div>
          <div className="flex flex-col gap-y-3">
            <div className="text-5xl sm:text-6xl font-light text-[#111111] tracking-tight">
              150
            </div>
            <div className="text-sm font-medium text-gray-400 tracking-wider uppercase">
              Countries Reached
            </div>
          </div>
          <div className="flex flex-col gap-y-3">
            <div className="text-5xl sm:text-6xl font-light text-[#111111] tracking-tight">
              99.9%
            </div>
            <div className="text-sm font-medium text-gray-400 tracking-wider uppercase">
              On-Time Rate
            </div>
          </div>
          <div className="flex flex-col gap-y-3">
            <div className="text-5xl sm:text-6xl font-light text-[#111111] tracking-tight">
              0
            </div>
            <div className="text-sm font-medium text-gray-400 tracking-wider uppercase">
              Carbon Footprint
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Stats;
