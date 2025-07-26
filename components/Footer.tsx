"use client";

import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Ship, Bus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#0A1A2A] to-[#1E1E1E] overflow-hidden text-white">
      {/* Decorative elements */}
      <div className="-bottom-20 -left-20 absolute bg-[#0077B6] opacity-10 blur-3xl rounded-full w-64 h-64 filter"></div>
      <div className="-top-10 -right-10 absolute bg-[#00B4D8] opacity-10 blur-3xl rounded-full w-48 h-48 filter"></div>
      
      {/* Water wave effect */}
      <div className="top-0 left-0 absolute bg-[url('/wave-pattern.svg')] bg-repeat-x opacity-5 w-full h-20"></div>

      <div className="z-10 relative mx-auto px-6 py-16 max-w-7xl container">
        <div className="gap-12 grid grid-cols-1 lg:grid-cols-5">
          {/* Brand section with 3D effect */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-[#0077B6] opacity-75 rounded-lg blur"></div>
                <div className="relative flex justify-center items-center bg-[#0077B6] p-3 rounded-lg">
                  <Bus className="w-6 h-6 text-white" />
                  <Ship className="-ml-2 w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="bg-clip-text bg-gradient-to-r from-[#00B4D8] to-[#0077B6] font-bold text-transparent text-3xl">
                BUS & BOAT PARIS
              </h2>
            </div>
            
            <p className="mb-8 text-[#A3A3A3] text-lg leading-relaxed">
              Experience Paris like never before with our unique land and water tours. 
              We blend iconic sights with hidden gems for unforgettable journeys.
            </p>
            
            <div className="flex space-x-4">
              {[
                { icon: <Facebook className="w-5 h-5" />, href: "https://www.facebook.com/profile.php?id=61553453702299" },
                { icon: <Twitter className="w-5 h-5" />, href: "#" },
                { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/busandboatparis" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  whileHover={{ y: -3 }}
                  className="bg-[#2E2E2E] hover:bg-gradient-to-br from-[#0077B6] to-[#00B4D8] shadow-lg p-3 rounded-full transition-all duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation with animated underline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="flex items-center mb-6 font-bold text-xl">
              <span className="mr-2">Explore</span>
              <span className="bg-gradient-to-r from-[#00B4D8] to-[#0077B6] w-8 h-0.5"></span>
            </h3>
            <ul className="space-y-4">
              {["Home", "About", "Contact"].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                >
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="group relative text-[#A3A3A3] hover:text-white transition-colors duration-300"
                  >
                    <span className="top-1/2 -left-4 absolute bg-[#0077B6] opacity-0 group-hover:opacity-100 rounded-full w-2 h-2 transition-all -translate-y-1/2 duration-300 transform"></span>
                    {item}
                    <span className="bottom-0 left-0 absolute bg-gradient-to-r from-[#00B4D8] to-[#0077B6] w-0 group-hover:w-full h-0.5 transition-all duration-300"></span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact with floating icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <h3 className="flex items-center mb-6 font-bold text-xl">
              <span className="mr-2">Get in Touch</span>
              <span className="bg-gradient-to-r from-[#00B4D8] to-[#0077B6] w-8 h-0.5"></span>
            </h3>
            <div className="space-y-5">
              {[
                { icon: <Mail className="w-5 h-5" />, text: "busandboatparis@gmail.com" },
                { icon: <Phone className="w-5 h-5" />, text: "+33 7 58 21 98 26" },
                { icon: <MapPin className="w-5 h-5" />, text: "56 rue des sculpteurs, Stains, France" },
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start space-x-4 bg-[#2E2E2E]/50 backdrop-blur-sm p-4 border border-[#3E3E3E] hover:border-[#0077B6] rounded-xl transition-all duration-300"
                >
                  <div className="bg-gradient-to-br from-[#0077B6] to-[#00B4D8] p-2 rounded-lg">
                    {item.icon}
                  </div>
                  <span className="flex-1 text-[#A3A3A3]">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Copyright with animated divider */}
        <motion.div 
          className="flex flex-col items-center mt-20 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-transparent via-[#0077B6] to-transparent mb-6 w-full max-w-xs h-px"></div>
          <div className="text-center">
            <p className="text-[#A3A3A3]">
              © {new Date().getFullYear()} BUS & BOAT PARIS. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link href="#" className="text-[#A3A3A3] hover:text-[#00B4D8] transition-colors">Privacy</Link>
              <span className="text-[#A3A3A3]">•</span>
              <Link href="#" className="text-[#A3A3A3] hover:text-[#00B4D8] transition-colors">Terms</Link>
              <span className="text-[#A3A3A3]">•</span>
              <Link href="#" className="text-[#A3A3A3] hover:text-[#00B4D8] transition-colors">Sitemap</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}