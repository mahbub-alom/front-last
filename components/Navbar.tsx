"use client";

import { Bus, MapPin, Menu, Ship, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="top-0 z-50 sticky bg-gradient-to-r from-[#740e27] to-[#9c2b45] shadow-lg"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center space-x-3"
          >
            <motion.div 
              whileHover={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -inset-2 bg-[#FFD700] opacity-50 group-hover:opacity-70 blur-md rounded-full transition-opacity"></div>
              <div className="relative flex justify-center items-center bg-white p-2 rounded-full">
                <Bus className="w-5 h-5 text-[#740e27]" />
                <Ship className="-ml-1 w-5 h-5 text-[#740e27]" />
              </div>
            </motion.div>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="font-serif font-bold text-white text-2xl tracking-tight"
            >
              BUS & BOAT PARIS
            </motion.span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { href: "/", label: "Home" },
             
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="group relative text-white/90 hover:text-white transition-colors"
                >
                  {item.label}
                  <motion.span 
                    className="bottom-0 left-0 absolute bg-[#FFD700] w-0 group-hover:w-full h-0.5 transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile menu button */}
          <motion.div 
            className="md:hidden flex items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              {isOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="space-y-2 bg-[#0a2e28] px-4 pt-2 pb-4">
              {[
                { href: "/", label: "Home" },
                { href: "/packages", label: "Packages" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="block hover:bg-white/10 px-3 py-3 rounded-lg text-white hover:text-[#FFD700] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}