'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, MapPin } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-[#0077B6]" />
              <span className="text-2xl font-bold text-[#0077B6]">OrbitHike</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[#1E1E1E] hover:text-[#0077B6] transition-colors">
              Home
            </Link>
            <Link href="/packages" className="text-[#1E1E1E] hover:text-[#0077B6] transition-colors">
              Packages
            </Link>
            <Link href="/about" className="text-[#1E1E1E] hover:text-[#0077B6] transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-[#1E1E1E] hover:text-[#0077B6] transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#1E1E1E] hover:text-[#0077B6]"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-[#1E1E1E] hover:text-[#0077B6] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/packages"
                className="block px-3 py-2 text-[#1E1E1E] hover:text-[#0077B6] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Packages
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-[#1E1E1E] hover:text-[#0077B6] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-[#1E1E1E] hover:text-[#0077B6] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}