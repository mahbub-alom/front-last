"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Clock, Users, Star } from "lucide-react";
import Image from "next/image";
import img from "@/public/images/hero1.jpeg";

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
interface ApiResponse {
  tickets: Package[];
}

export default function FeaturedPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  

  useEffect(() => {
    fetchFeaturedPackages();
  }, []);

  const fetchFeaturedPackages = async () => {
    try {
      const response = await fetch("/api/tickets?featured=true&limit=3");
      const data = await response.json();
      setPackages((data.tickets || []).reverse());
    } catch (error) {
      console.error("Error fetching packages:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-[#1E1E1E] text-3xl md:text-4xl">
              Featured Packages
            </h2>
          </div>
          <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-xl h-96 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  {
    error && (
      <div className="text-red-500 text-center">
        Failed to load featured packages. Please try again later.
      </div>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-[#1E1E1E] text-3xl md:text-4xl">
            Featured Packages
          </h2>
          {/* <p className="text-[#6C757D] text-lg">
            Discover our most popular travel destinations
          </p> */}
        </div>

        <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
          {/* end  */}
          {packages.map((pkg, index) => (
            <div
              key={pkg._id}
              className="group bg-white shadow-lg hover:shadow-xl rounded-xl overflow-hidden transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  width="300"
                  height="250"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="top-4 right-4 absolute bg-[#38B000] px-3 py-1 rounded-full font-semibold text-white text-sm">
                  10% off
                </div>
              </div>

              <div className="p-6">
                <h3 className="mb-2 font-bold text-[#1E1E1E] text-xl">
                  {pkg.title}
                </h3>
                <p className="mb-4 text-[#6C757D] line-clamp-2">
                  {pkg.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-[#6C757D]">
                    <MapPin className="mr-2 w-4 h-4 text-[#0077B6]" />
                    <span className="text-sm">{pkg.location}</span>
                  </div>
                  {/* <div className="flex items-center text-[#6C757D]">
                    <Clock className="mr-2 w-4 h-4 text-[#0077B6]" />
                    <span className="text-sm">{pkg.duration}</span>
                  </div> */}
                </div>

                <div className="flex justify-between items-center">
                  <div className="font-bold text-[#0077B6] text-2xl">
                    ${pkg.price}
                    <span className="font-normal text-[#6C757D] text-sm">
                      /person
                    </span>
                  </div>
                  {index === 0 ? (
                    <Link
                      href={`/firstPackage/${pkg._id}`}
                      // href={`/firstPackage/1`}
                      className="bg-[#0077B6] hover:bg-[#005a8b] px-6 py-2 rounded-lg text-white transition-colors"
                    >
                      Book 1st
                    </Link>
                  ) : (
                    <Link
                      href={`/packages/${pkg._id}`}
                      className="bg-[#0077B6] hover:bg-[#005a8b] px-6 py-2 rounded-lg text-white transition-colors"
                    >
                      Book Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-12 text-center">
          <Link
            href="/packages"
            className="inline-flex items-center space-x-2 bg-[#00B4D8] hover:bg-[#0096c7] px-8 py-3 rounded-lg text-white transition-colors"
          >
            <span>View All Packages</span>
            <Users className="w-5 h-5" />
          </Link>
        </div> */}
      </div>
    </section>
  );
}
