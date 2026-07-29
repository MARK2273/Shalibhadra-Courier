import React from "react";
import { Globe, Truck, MapPin } from "lucide-react";

const Services: React.FC = () => {
  const services = [
    {
      title: "Global Shipping",
      desc: "Reach customers worldwide with our extensive international delivery network.",
      icon: Globe,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Express Delivery",
      desc: "Secure and fast delivery for your urgent documents and parcels within 24 hours.",
      icon: Truck,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Real-time Tracking",
      desc: "Monitor your shipment status 24/7 with our advanced GPS tracking system.",
      icon: MapPin,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary dark:text-blue-400 font-semibold tracking-wider uppercase text-sm">
            Why Choose Us
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
            A Better Way to Ship Smarter
          </h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Reliable logistics solutions designed for speed, security, and
            trust.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-full opacity-50 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors"></div>

              <div
                className={`inline-flex items-center justify-center p-3 rounded-xl ${service.color.replace('bg-blue-100', 'bg-blue-100 dark:bg-blue-900/30').replace('text-blue-600', 'text-blue-600 dark:text-blue-400').replace('bg-green-100', 'bg-green-100 dark:bg-green-900/30').replace('text-green-600', 'text-green-600 dark:text-green-400').replace('bg-purple-100', 'bg-purple-100 dark:bg-purple-900/30').replace('text-purple-600', 'text-purple-600 dark:text-purple-400')} mb-6 relative z-10`}
              >
                <service.icon className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">
                {service.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed relative z-10">
                {service.desc}
              </p>

              <div className="mt-6 flex items-center text-primary dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                Learn more <span className="ml-2">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
