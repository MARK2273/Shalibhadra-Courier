import React from "react";
import { Globe, Truck, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const Services: React.FC = () => {
  const services = [
    {
      title: "Global Shipping",
      desc: "Reach customers worldwide with our extensive international delivery network.",
      icon: Globe,
      color: "from-blue-400 to-blue-600",
      shadow: "shadow-blue-500/20",
      delay: 0.1,
    },
    {
      title: "Express Delivery",
      desc: "Secure and fast delivery for your urgent documents and parcels within 24 hours.",
      icon: Truck,
      color: "from-emerald-400 to-emerald-600",
      shadow: "shadow-emerald-500/20",
      delay: 0.2,
    },
    {
      title: "Real-time Tracking",
      desc: "Monitor your shipment status 24/7 with our advanced GPS tracking system.",
      icon: MapPin,
      color: "from-indigo-400 to-indigo-600",
      shadow: "shadow-indigo-500/20",
      delay: 0.3,
    },
  ];

  return (
    <section id="services" className="py-24 bg-gray-50/50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 font-bold tracking-widest uppercase text-xs mb-4">
              Our Expertise
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
              A Better Way to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Ship Smarter</span>
            </h2>
            <p className="mt-6 text-xl text-gray-500 font-medium leading-relaxed">
              Reliable logistics solutions designed for speed, security, and absolute trust.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: service.delay }}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all duration-500 border border-gray-100/50 relative overflow-hidden flex flex-col h-full"
            >
              {/* Card Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 flex-1">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} ${service.shadow} text-white shadow-lg mb-8 transform group-hover:scale-110 transition-transform duration-500`}
                >
                  <service.icon className="h-8 w-8" strokeWidth={2} />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  {service.desc}
                </p>
              </div>

              <div className="relative z-10 mt-8 pt-8 border-t border-gray-100">
                <a href="#" className="inline-flex items-center text-blue-600 font-bold group-hover:text-indigo-600 transition-colors">
                  Learn more
                  <motion.span
                    className="ml-2 inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    →
                  </motion.span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
