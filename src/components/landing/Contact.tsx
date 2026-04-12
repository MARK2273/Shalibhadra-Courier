import React from "react";
import { currentConfig } from "../../constants/courierConfig";
import { motion } from "framer-motion";

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 bg-white text-[#111111]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-20">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-4xl sm:text-5xl font-medium tracking-tight mb-12">
              Reach out.
            </h2>

            <div className="space-y-12">
              <div>
                <h3 className="text-sm font-medium text-gray-400 tracking-wider uppercase mb-3">Address</h3>
                <p className="text-xl sm:text-2xl font-light leading-relaxed max-w-sm">
                  {currentConfig.address}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 tracking-wider uppercase mb-3">Contact</h3>
                <a href={`tel:${currentConfig.contact}`} className="block text-xl sm:text-2xl font-light hover:text-gray-500 transition-colors mb-2">
                  {currentConfig.contact}
                </a>
                <a href={`mailto:${currentConfig.email}`} className="block text-xl sm:text-2xl font-light hover:text-gray-500 transition-colors">
                  {currentConfig.email}
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-[500px] w-full bg-gray-100 rounded-3xl overflow-hidden relative"
          >
            <iframe
                title="Office Location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(currentConfig.address)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80 mix-blend-multiply hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
              ></iframe>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
