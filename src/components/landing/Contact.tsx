import React from "react";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { currentConfig } from "../../constants/courierConfig";
import { motion } from "framer-motion";

const Contact: React.FC = () => {
  // Standard interactive embed based on address
  const defaultEmbed = `https://www.google.com/maps?q=${encodeURIComponent(currentConfig.address)}&output=embed`;

  return (
    <section id="contact" className="py-24 bg-white dark:bg-[#070B14] transition-colors overflow-hidden relative z-20">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -ml-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
              Our <span className="text-primary dark:text-blue-400">Location</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
              Find us at our main hub or get in touch with our support team for any logistics inquiries.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Left Side: Contact Information */}
          <motion.div 
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="bg-[#F8FAFC] dark:bg-[#0F172A] p-8 sm:p-10 rounded-[32px] border border-gray-200 dark:border-gray-800 flex-1 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden relative group">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent dark:from-blue-900/30 dark:to-transparent rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="relative z-10">
                <div className="mb-10 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-primary dark:text-blue-400 font-bold text-xs uppercase tracking-widest shadow-sm border border-gray-100 dark:border-gray-700">
                  <MapPin className="w-3.5 h-3.5" /> Headquarters
                </div>

                <div className="space-y-8">
                  <div className="flex items-start gap-5 group/item">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl text-primary dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-700 group-hover/item:scale-110 transition-transform duration-300">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Corporate Office</h4>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                        {currentConfig.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group/item">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl text-primary dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-700 group-hover/item:scale-110 transition-transform duration-300">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Call Support</h4>
                      <p className="text-gray-900 dark:text-white font-semibold text-lg hover:text-primary dark:hover:text-blue-400 transition-colors">
                        <a href={`tel:${currentConfig.contact}`}>{currentConfig.contact}</a>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase font-bold tracking-wider">Mon-Sat / 9AM - 8:30PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group/item">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl text-primary dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-700 group-hover/item:scale-110 transition-transform duration-300">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Email Inquiry</h4>
                      <p className="text-gray-600 dark:text-gray-400 font-light hover:text-primary dark:hover:text-blue-400 transition-colors">
                        <a href={`mailto:${currentConfig.email}`}>{currentConfig.email}</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group/item">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl text-primary dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-700 group-hover/item:scale-110 transition-transform duration-300">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Business Hours</h4>
                      <p className="text-gray-600 dark:text-gray-400 font-light">
                        Mon - Sat: 09:00 AM - 08:30 PM
                      </p>
                      <p className="text-primary dark:text-blue-400/80 text-sm font-medium mt-1">
                        Sunday Holiday
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                   <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentConfig.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-primary dark:text-blue-400 font-semibold hover:gap-3 transition-all"
                  >
                    Open in Maps <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Maps Frame */}
          <motion.div 
            className="relative group h-[400px] lg:h-auto min-h-[500px]"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {/* Visual background element */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-[40px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative w-full h-full bg-[#F8FAFC] dark:bg-[#0F172A] rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              <iframe
                title="Office Location"
                src={defaultEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale-[0.2] contrast-[1.05] dark:invert-[0.9] dark:hue-rotate-180 transition-all duration-700 hover:grayscale-0 hover:contrast-100 dark:hover:invert dark:hover:hue-rotate-180"
              />
              
              {/* Overlay Badge */}
              <div className="absolute top-6 left-6 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest">Open Now</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
