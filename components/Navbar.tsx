"use client";

import { Bus, Ship, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

// Supported languages
const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
];

export default function Navbar() {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const handleLanguageChange = (newLocale: string) => {
    const path = window.location.pathname;
    const newPath = path.replace(/^\/[a-z]{2}/, `/${newLocale}`);
    router.push(newPath);
    setIsLanguageOpen(false);
    setIsOpen(false);
  };

  const navigationItems = [
    { key: "home", href: `/${locale}` },
    { key: "contact", href: `/${locale}/contact` },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="sticky top-0 z-50 bg-gradient-to-r from-[#740e27] to-[#9c2b45] shadow-lg"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Desktop Menu */}
        <div className="hidden md:flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href={`/${locale}`}
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
              className="font-bold text-white text-2xl tracking-tight"
            >
              BUS & BOAT PARIS
            </motion.span>
          </Link>

          {/* Navigation links */}
          <div className="flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="group relative text-white/90 hover:text-white transition-colors"
                >
                  {t(item.key as any)}
                  <motion.span
                    className="bottom-0 left-0 absolute bg-[#FFD700] w-0 group-hover:w-full h-0.5 transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            ))}

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 bg-white/10 px-3 py-2 border border-white/20 hover:border-[#FFD700] rounded-lg transition-colors duration-200"
              >
                <span className="text-lg">{currentLanguage?.flag}</span>
                <span className="font-medium text-white text-sm">
                  {currentLanguage?.code.toUpperCase()}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-white transition-transform duration-200 ${
                    isLanguageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 z-50 bg-white shadow-xl mt-2 py-2 border border-gray-100 rounded-lg w-48">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3 ${
                        locale === lang.code
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href={`/${locale}`}
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
              className="font-bold text-white text-2xl tracking-tight"
            >
              BUS & BOAT PARIS
            </motion.span>
          </Link>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-lg border border-white/20 hover:border-[#FFD700] transition-colors duration-200"
            >
              <span className="text-sm">{currentLanguage?.flag}</span>
              {/* <span className="text-sm text-white">{currentLanguage?.code.toUpperCase()}</span> */}
              <ChevronDown
                className={`h-4 w-4 text-white transition-transform duration-200 ${
                  isLanguageOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isLanguageOpen && (
              <div className="absolute right-0 top-full z-50 bg-white shadow-xl mt-2 py-2 border border-gray-100 rounded-lg w-20 ">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-2 ${
                      locale === lang.code
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    {/* <span className="font-medium">{lang.name}</span> */}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hamburger Menu */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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

        {/* Mobile dropdown menu (links only) */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden top-20 right-0 left-0 z-[60] fixed bg-[#0a2e28] shadow-xl border-white/10 border-t"
          >
            <div className="space-y-2 px-4 pt-2 pb-6">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="block hover:bg-white/10 px-3 py-3 rounded-lg text-white hover:text-[#FFD700] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t(item.key as any)}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Backdrop */}
      {(isLanguageOpen || isOpen) && (
        <div
          className="z-40 fixed inset-0 bg-black bg-opacity-25"
          onClick={() => {
            setIsLanguageOpen(false);
            setIsOpen(false);
          }}
        />
      )}
    </motion.nav>
  );
}
