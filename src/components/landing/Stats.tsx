import React from "react";

const Stats: React.FC = () => {
  return (
    <div className="bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
          <div className="p-4">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              10K+
            </div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Deliveries
            </div>
          </div>
          <div className="p-4">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              500+
            </div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Cities Covered
            </div>
          </div>
          <div className="p-4">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              99%
            </div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              On-Time
            </div>
          </div>
          <div className="p-4">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              24/7
            </div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
