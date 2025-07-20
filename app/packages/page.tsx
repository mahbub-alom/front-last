'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Users, Search, Filter } from 'lucide-react';

interface Package {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  image: string;
  features: string[];
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchPackages();
  }, [locationFilter]);

  const fetchPackages = async () => {
    try {
      const params = new URLSearchParams();
      if (locationFilter) params.append('location', locationFilter);
      
      const response = await fetch(`/api/tickets?${params}`);
      const data = await response.json();
      setPackages(data.tickets || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#F1F1F1] py-8 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-bold text-[#1E1E1E] text-4xl md:text-5xl">
            Travel Packages
          </h1>
          <p className="mx-auto max-w-2xl text-[#6C757D] text-lg">
            Discover amazing destinations and book your perfect getaway
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow-lg mb-8 p-6 rounded-xl">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
            <div className="relative">
              <Search className="top-1/2 left-3 absolute w-5 h-5 text-[#6C757D] -translate-y-1/2 transform" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3 pr-4 pl-10 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#0077B6] focus:ring-2 w-full text-[#1E1E1E]"
              />
            </div>
            <div className="relative">
              <MapPin className="top-1/2 left-3 absolute w-5 h-5 text-[#6C757D] -translate-y-1/2 transform" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="py-3 pr-4 pl-10 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#0077B6] focus:ring-2 w-full text-[#1E1E1E] appearance-none"
              >
                <option value="">All Locations</option>
                <option value="Bali">Bali</option>
                <option value="Paris">Paris</option>
                <option value="Tokyo">Tokyo</option>
                <option value="New York">New York</option>
                <option value="London">London</option>
              </select>
            </div>
            <button
              onClick={fetchPackages}
              className="flex justify-center items-center space-x-2 bg-[#0077B6] hover:bg-[#005a8b] px-6 py-3 rounded-lg text-white transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white shadow-lg hover:shadow-xl rounded-xl overflow-hidden transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="mb-2 font-bold text-[#1E1E1E] text-xl">{pkg.title}</h3>
                  <p className="mb-4 text-[#6C757D] line-clamp-2">{pkg.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-[#6C757D]">
                      <MapPin className="mr-2 w-4 h-4 text-[#0077B6]" />
                      <span className="text-sm">{pkg.location}</span>
                    </div>
                    <div className="flex items-center text-[#6C757D]">
                      <Clock className="mr-2 w-4 h-4 text-[#0077B6]" />
                      <span className="text-sm">{pkg.duration}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="font-bold text-[#0077B6] text-2xl">
                      ${pkg.price}
                      <span className="font-normal text-[#6C757D] text-sm">/person</span>
                    </div>
                    <Link
                      href={`/packages/${pkg._id}`}
                      className="bg-[#0077B6] hover:bg-[#005a8b] px-6 py-2 rounded-lg text-white transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPackages.length === 0 && !loading && (
          <div className="py-12 text-center">
            <p className="text-[#6C757D] text-lg">No packages found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}