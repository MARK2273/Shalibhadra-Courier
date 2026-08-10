import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Activity } from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  shipments: number;
  onTime: number;
}

const nodes: NodeData[] = [
  { id: "new_york", name: "New York", x: 25, y: 35, shipments: 1240, onTime: 98 },
  { id: "london", name: "London", x: 45, y: 25, shipments: 1560, onTime: 97 },
  { id: "dubai", name: "Dubai", x: 60, y: 40, shipments: 890, onTime: 96 },
  { id: "mumbai", name: "Mumbai", x: 70, y: 45, shipments: 920, onTime: 95 },
  { id: "singapore", name: "Singapore", x: 80, y: 55, shipments: 1100, onTime: 98 },
  { id: "sydney", name: "Sydney", x: 90, y: 75, shipments: 540, onTime: 99 },
];

const routes = [
  { from: "new_york", to: "london" },
  { from: "london", to: "dubai" },
  { from: "dubai", to: "mumbai" },
  { from: "mumbai", to: "singapore" },
  { from: "singapore", to: "sydney" },
  { from: "new_york", to: "dubai" },
  { from: "london", to: "singapore" }
];

const LiveNetworkSection: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);

  return (
    <section id="network" className="py-24 bg-white dark:bg-[#0B1120] relative overflow-hidden z-20">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight mb-4">
              Always Know Where Your Shipment Is
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              From pickup to final delivery, every movement stays visible across our intelligent routing network.
            </p>
          </motion.div>
        </div>

        {/* Hubs Grid Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nodes.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group bg-white dark:bg-[#0F172A] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Card Hover Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{node.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Active Hub</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Badge */}
                  <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
                    <Activity className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">{node.onTime}% On-time</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-500 dark:text-gray-400">Live Shipments</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{node.shipments}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                      <motion.div 
                        className="bg-primary h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min((node.shipments / 1000) * 100, 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Connections</span>
                    <div className="flex -space-x-2">
                      {routes.filter(r => r.from === node.id || r.to === node.id).slice(0, 3).map((route, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-[#0F172A] flex items-center justify-center text-[8px] font-bold text-gray-600 dark:text-gray-300">
                          {nodes.find(n => n.id === (route.from === node.id ? route.to : route.from))?.name.substring(0, 2).toUpperCase()}
                        </div>
                      ))}
                      {routes.filter(r => r.from === node.id || r.to === node.id).length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-gray-800 border-2 border-white dark:border-[#0F172A] flex items-center justify-center text-[8px] font-bold text-gray-500">
                          +{routes.filter(r => r.from === node.id || r.to === node.id).length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveNetworkSection;
