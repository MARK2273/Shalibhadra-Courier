import React from "react";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { currentConfig } from "../../constants/courierConfig";
import { motion } from "framer-motion";

const Contact: React.FC = () => {
  // Standard interactive embed based on address
  const defaultEmbed = `https://www.google.com/maps?q=${encodeURIComponent(currentConfig.address)}&output=embed`;

  return (
    <section id="contact" className="py-24 bg-gray-50/50 overflow-hidden relative">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 font-bold tracking-widest uppercase text-xs mb-4">
              Get In Touch
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Location</span>
            </h2>
            <p className="mt-6 text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
              Find us at our main location or get in touch for any delivery inquiries. We're here to help.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Left Side: Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100/50 flex-1 hover:shadow-2xl transition-all duration-500 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700"></div>
              
              <div className="relative">
                <div className="mb-12 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full text-blue-700 font-bold text-xs uppercase tracking-widest border border-blue-100/50">
                  <MapPin className="w-4 h-4" /> Visit Headquarters
                </div>

                <div className="space-y-10">
                  <div className="flex items-start gap-6 group/item">
                    <div className="p-4 bg-gray-50 rounded-2xl text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors duration-300 shadow-sm">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">Corporate Office</h4>
                      <p className="text-gray-600 leading-relaxed font-medium">
                        {currentConfig.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group/item">
                    <div className="p-4 bg-gray-50 rounded-2xl text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors duration-300 shadow-sm">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">Call Support</h4>
                      <p className="text-gray-600 font-bold text-xl hover:text-blue-600 transition-colors">
                        <a href={`tel:${currentConfig.contact}`}>{currentConfig.contact}</a>
                      </p>
                      <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">Mon-Sat / 9AM - 8PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group/item">
                    <div className="p-4 bg-gray-50 rounded-2xl text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors duration-300 shadow-sm">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">Email Inquiry</h4>
                      <p className="text-gray-600 font-medium hover:text-blue-600 transition-colors text-lg">
                        <a href={`mailto:${currentConfig.email}`}>{currentConfig.email}</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group/item">
                    <div className="p-4 bg-gray-50 rounded-2xl text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors duration-300 shadow-sm">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">Business Hours</h4>
                      <p className="text-gray-600 font-medium">
                        Monday - Saturday: 09:00 AM - 08:30 PM
                      </p>
                      <p className="text-gray-400 text-sm italic mt-1">
                        Sunday Holiday
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                   <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentConfig.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-blue-600 font-bold hover:text-indigo-600 transition-colors group/link"
                  >
                    Open in Google Maps <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Maps Frame */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            {/* Visual background element */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur-2xl opacity-10 scale-105 group-hover:opacity-20 transition-opacity duration-500"></div>
            
            <div className="relative h-[400px] lg:h-full min-h-[500px] bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border-4 border-white overflow-hidden transform hover:-translate-y-2 transition-all duration-500">
              <iframe
                title="Office Location"
                src={defaultEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[0.1] contrast-[1.05] brightness-[1.02] filter hover:grayscale-0 transition-all duration-700"
              ></iframe>
              
              {/* Overlay Badge */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                  <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Live Office Status</span>
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
