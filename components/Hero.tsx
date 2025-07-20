'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-white py-20">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing
            <span className="block text-[#00B4D8]">Travel Experiences</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Book incredible tourism packages and create unforgettable memories with OrbitHike. 
            Your adventure starts here!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/packages"
              className="bg-white text-[#0077B6] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 shadow-lg"
            >
              <span>Explore Packages</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#0077B6] transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <MapPin className="h-12 w-12 mb-4 text-[#00B4D8]" />
              <h3 className="text-2xl font-bold mb-2">50+</h3>
              <p className="opacity-90">Destinations</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 mb-4 text-[#00B4D8]" />
              <h3 className="text-2xl font-bold mb-2">10,000+</h3>
              <p className="opacity-90">Happy Travelers</p>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="h-12 w-12 mb-4 text-[#00B4D8]" />
              <h3 className="text-2xl font-bold mb-2">5+</h3>
              <p className="opacity-90">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}