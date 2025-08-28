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
  // Animation variants
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
      className="bg-[#740e27] py-12 overflow-hidden text-white"
    >
      <motion.div
        variants={containerVariants}
        className="gap-8 grid grid-cols-1 md:grid-cols-2 mx-auto px-4 max-w-7xl"
      >
        {/* Left Side - Company Info */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col justify-between h-full"
        >
          <div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="bg-white/10 backdrop-blur-sm p-3 rounded-full"
              >
                <Bus className="w-8 h-8 text-[#FFD700]" />
              </motion.div>
              <h3 className="font-bold text-3xl tracking-tight">
                BUS & BOAT PARIS
              </h3>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mb-6 max-w-md text-white/80"
            >
              Discover Paris by land and water with our premium transportation
              services.
            </motion.p>
          </div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col space-y-2 text-white/60 text-sm"
          >
            {/* <div className="flex space-x-4">
              <a href="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </a>
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
            </div> */}
            <div>
              © {new Date().getFullYear()} BUS & BOAT PARIS. All rights
              reserved.
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Contact Information */}
        <motion.div
          variants={containerVariants}
          className="gap-6 grid grid-cols-1 md:grid-cols-2"
        >
          {/* Contact Methods */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col space-y-6"
          >
            <motion.h4
              variants={itemVariants}
              className="pb-2 border-white/20 border-b font-semibold text-lg"
            >
              Contact Us
            </motion.h4>

            <motion.a
              href="mailto:busandboatparis11@gmail.com"
              target="_blank"
              variants={itemVariants}
              whileHover={{ x: 5 }}
              className="flex items-start space-x-3 cursor-pointer"
            >
              <Mail className="mt-0.5 w-5 h-5 text-[#FFD700]" />
              <span>busandboatparis11@gmail.com</span>
            </motion.a>

            <motion.a
              href="https://wa.me/33758219826"
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ x: 5 }}
              className="flex items-start space-x-3 cursor-pointer"
            >
              <Phone className="mt-0.5 w-5 h-5 text-[#FFD700]" />
              <span>+33 7 58 21 98 26</span>
            </motion.a>

            <motion.div
              variants={itemVariants}
              whileHover={{ x: 5 }}
              className="flex items-start space-x-3"
            >
              <MapPin className="mt-0.5 w-5 h-5 text-[#FFD700]" />
              <span>56 rue des sculpteurs, Stains, France</span>
            </motion.div>
          </motion.div>

          {/* Social Links & Additional Info */}
          <motion.div
            variants={containerVariants}
            className="flex flex-col justify-between"
          >
            <div>
              <motion.h4
                variants={itemVariants}
                className="mb-4 pb-2 border-white/20 border-b font-semibold text-lg"
              >
                Follow Us
              </motion.h4>

              <motion.div
                variants={containerVariants}
                className="flex space-x-3 mb-6"
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
                    href: "#",
                  },
                ].map((social, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{
                      y: -3,
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
                        className="bg-white/10 hover:bg-white/20 rounded-full"
                      >
                        {social.icon}
                      </Button>
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <motion.div
              variants={itemVariants}
              className="flex flex-col space-y-2 text-white/60 text-sm"
            >
              <div className="flex space-x-4">
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </a>
                <a
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
