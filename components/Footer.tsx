"use client";
import { motion, Variants } from "framer-motion";
import {
  Bus,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { Button } from "./ui/button";

export const Footer = () => {
  // Define variants with proper typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="bg-gradient-to-b from-[#134B42] to-[#0a2e28] py-8 overflow-hidden text-white"
    >
      <motion.div
        variants={containerVariants}
        className="mx-auto px-4 max-w-7xl"
      >
        {/* Logo & Name */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 mb-4"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="bg-white/10 backdrop-blur-sm p-3 rounded-full"
            >
              <Bus className="w-8 h-8 text-[#FFD700]" />
            </motion.div>
            <motion.h3
              whileHover={{ scale: 1.02 }}
              className="font-bold text-3xl tracking-tight"
            >
              BUS & BOAT PARIS
            </motion.h3>
          </motion.div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          variants={containerVariants}
          className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-8"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center bg-white/5 backdrop-blur-sm p-4 rounded-xl"
          >
            <Mail className="mb-2 w-6 h-6 text-[#FFD700]" />
            <span>busandboatparis@gmail.com</span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center bg-white/5 backdrop-blur-sm p-4 rounded-xl"
          >
            <Phone className="mb-2 w-6 h-6 text-[#FFD700]" />
            <span>+33 7 58 21 98 26</span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center bg-white/5 backdrop-blur-sm p-4 rounded-xl"
          >
            <MapPin className="mb-2 w-6 h-6 text-[#FFD700]" />
            <span>56 rue des sculpteurs, Stains, France</span>
          </motion.div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={containerVariants}
          className="flex justify-center space-x-4 mb-8"
        >
          {[
            {
              icon: <Facebook className="w-5 h-5" />,
              name: "Facebook",
              href: "https://www.facebook.com/profile.php?id=61553453702299",
            },
            {
              icon: <Instagram className="w-5 h-5" />,
              name: "Instagram",
              href: "https://www.instagram.com/busandboatparis",
            },
            {
              icon: <Twitter className="w-5 h-5" />,
              name: "Twitter",
              href: "#", // add Twitter link when available
            },
          ].map((social, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -5,
                scale: 1.1,
                transition: { type: "spring", stiffness: 300 },
              }}
              whileTap={{ scale: 0.9 }}
            >
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/5 hover:bg-white/10 rounded-full"
                >
                  {social.icon}
                </Button>
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="pt-6 border-white/10 border-t text-white/60 text-sm text-center"
        >
          © {new Date().getFullYear()} BUS & BOAT PARIS. All rights reserved.
        </motion.div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
