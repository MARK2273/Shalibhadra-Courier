import React from "react";
import { Globe, Plane, PackageSearch } from "lucide-react";
import { motion } from "framer-motion";

const Services: React.FC = () => {
  const services = [
    {
      title: "Global Reach",
      desc: "Connecting businesses across continents with invisible precision and zero friction.",
      icon: Globe,
    },
    {
      title: "Priority Air",
      desc: "Time-critical solutions delivered with unprecedented speed and care.",
      icon: Plane,
    },
    {
      title: "Live Visibility",
      desc: "Absolute clarity. Know exactly where your cargo is, down to the minute.",
      icon: PackageSearch,
    },
  ];

  return (
    <section id="services" className="py-32 bg-white selection:bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-24"
        >
          <h2 className="text-4xl sm:text-5xl font-medium text-[#111111] tracking-tight leading-tight mb-6">
            Logistics, refined.
          </h2>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            We stripped away the complexity of traditional shipping to offer a service that feels completely effortless.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 sm:gap-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
              className="group flex flex-col items-start"
            >
              <div className="mb-8 p-0">
                <service.icon className="h-8 w-8 text-[#111111] stroke-[1.5] group-hover:scale-110 transition-transform duration-500 ease-out" />
              </div>

              <h3 className="text-2xl font-medium text-[#111111] mb-4 tracking-tight">
                {service.title}
              </h3>
              <p className="text-gray-400 font-light leading-relaxed text-lg">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
