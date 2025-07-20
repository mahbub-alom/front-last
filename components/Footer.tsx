import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        <div className="gap-8 grid grid-cols-1 md:grid-cols-4">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-8 h-8 text-[#0077B6]" />
              <span className="font-bold text-[#0077B6] text-2xl">
                OrbitHike
              </span>
            </div>
            <p className="mb-4 text-[#6C757D]">
              Your trusted partner for amazing travel experiences. We offer the
              best tourism packages to make your journey unforgettable.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-[#6C757D] hover:text-[#0077B6] transition-colors cursor-pointer" />
              <Twitter className="w-6 h-6 text-[#6C757D] hover:text-[#0077B6] transition-colors cursor-pointer" />
              <Instagram className="w-6 h-6 text-[#6C757D] hover:text-[#0077B6] transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-[#6C757D] hover:text-[#0077B6] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/packages"
                  className="text-[#6C757D] hover:text-[#0077B6] transition-colors"
                >
                  Packages
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-[#6C757D] hover:text-[#0077B6] transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-[#6C757D] hover:text-[#0077B6] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-semibold text-lg">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-[#0077B6]" />
                <span className="text-[#6C757D]">info@orbithike.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-[#0077B6]" />
                <span className="text-[#6C757D]">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-[#0077B6]" />
                <span className="text-[#6C757D]">
                  Badda, Dhaka, Bangladesh
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-[#6C757D] border-t text-center">
          <p className="text-[#6C757D]">
            © 2025 OrbitHike. All rights reserved. | Privacy Policy | Terms of
            Service
          </p>
        </div>
      </div>
    </footer>
  );
}
