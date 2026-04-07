import React from "react";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { currentConfig } from "../../constants/courierConfig";

const Contact: React.FC = () => {
  // Standard interactive embed based on address
  const defaultEmbed = `https://www.google.com/maps?q=${encodeURIComponent(currentConfig.address)}&output=embed`;

  return (
    <section id="contact" className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Our <span className="text-blue-600">Location</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Find us at our main location or get in touch for any delivery inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Left Side: Contact Information */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 flex-1 hover:shadow-2xl transition-all duration-500 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors"></div>
              
              <div className="relative">
                <div className="mb-10 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-bold text-xs uppercase tracking-widest">
                  <MapPin className="w-3 h-3" /> Visit Us
                </div>

                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="p-4 bg-gray-50 rounded-2xl text-blue-600">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Corporate Office</h4>
                      <p className="text-gray-600 leading-relaxed font-medium">
                        {currentConfig.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="p-4 bg-gray-50 rounded-2xl text-blue-600">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Call Support</h4>
                      <p className="text-gray-600 font-bold text-lg hover:text-blue-600 transition-colors">
                        <a href={`tel:${currentConfig.contact}`}>{currentConfig.contact}</a>
                      </p>
                      <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">Mon-Sat / 9AM - 8PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="p-4 bg-gray-50 rounded-2xl text-blue-600">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Email Inquiry</h4>
                      <p className="text-gray-600 font-medium hover:text-blue-600 transition-colors">
                        <a href={`mailto:${currentConfig.email}`}>{currentConfig.email}</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="p-4 bg-gray-50 rounded-2xl text-blue-600">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Business Hours</h4>
                      <p className="text-gray-600 font-medium">
                        Monday - Saturday: 09:00 AM - 08:30 PM
                      </p>
                      <p className="text-gray-400 text-sm italic">
                        Sunday Holiday
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 flex justify-between items-center">
                   <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentConfig.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-blue-600 font-bold hover:underline"
                  >
                    Open in Maps <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Maps Frame */}
          <div className="relative group">
            {/* Visual background element */}
            <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] blur-2xl opacity-[0.03] scale-105 group-hover:opacity-10 transition-opacity"></div>
            
            <div className="relative h-[400px] lg:h-full min-h-[500px] bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border-4 border-white overflow-hidden transform hover:-translate-y-1 transition-all duration-500">
              <iframe
                title="Office Location"
                src={defaultEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[0.2] contrast-[1.1] brightness-[1.05]"
              ></iframe>
              
              {/* Overlay Badge */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Live Office Status</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
