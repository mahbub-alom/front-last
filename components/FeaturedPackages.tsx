"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

interface Package {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  imageUrl: string;
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
      <div className="flex justify-center items-center bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] min-h-screen">
        <div className="border-[#134B42] border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-white to-[#f5f5f5] py-20 text-center">
        <div className="bg-white shadow-lg mx-auto p-8 rounded-xl max-w-2xl">
          <h3 className="mb-4 font-semibold text-[#0a2e28] text-2xl">
            Something went wrong
          </h3>
          <p className="mb-6 text-[#6C757D]">
            We couldn&apos;t load our featured packages. Please refresh the page
            or try again later.
          </p>
          <Button
            onClick={fetchFeaturedPackages}
            className="bg-gradient-to-r from-[#0a2e28] hover:from-[#134B42] to-[#134B42] hover:to-[#0a2e28] text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-white to-[#f5f5f5] py-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-3 font-bold text-[#0a2e28] text-4xl md:text-5xl">
            Premium Experiences
          </h2>
          <div className="bg-gradient-to-r from-[#0a2e28] to-[#134B42] mx-auto w-24 h-1"></div>
          <p className="mx-auto mt-6 max-w-2xl text-[#6C757D]">
            Discover our curated selection of exclusive travel packages designed
            for the discerning traveler.
          </p>
        </div>

        <div className="gap-8 grid grid-cols-1 md:grid-cols-3 mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={pkg._id}
              className="group bg-white shadow-lg hover:shadow-xl rounded-xl overflow-hidden transition-all hover:-translate-y-2 duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={pkg?.imageUrl}
                  alt={pkg?.title}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="top-4 right-4 absolute bg-[#134B42] backdrop-blur-sm px-3 py-1 rounded-full font-semibold text-white text-sm">
                  Popular
                </div>
                <div className="bottom-4 left-4 absolute">
                  <span className="bg-[#0a2e28] px-3 py-1 rounded-md font-medium text-white text-sm">
                    ${pkg.price}
                    <span className="ml-1 font-light text-xs">/person</span>
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-[#0a2e28] text-2xl">
                    {pkg.title}
                  </h3>
                  <div className="flex items-center text-[#6C757D] text-sm">
                    <Clock className="mr-1 w-4 h-4 text-[#134B42]" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>

                <p className="mb-6 text-[#6C757D] line-clamp-3">
                  {pkg.description}
                </p>

                <div className="mb-6">
                  <div className="flex items-center text-[#6C757D]">
                    <MapPin className="mr-2 w-5 h-5 text-[#134B42]" />
                    <span className="font-medium">{pkg.location}</span>
                  </div>
                </div>

                <div className="pt-4 border-[#eee] border-t">
                  {index === 0 ? (
                    <Link href={`/firstPackage/${pkg._id}`}>
                      <Button className="flex justify-center items-center bg-gradient-to-r from-[#0a2e28] hover:from-[#134B42] to-[#134B42] hover:to-[#0a2e28] group-hover:shadow-lg py-6 rounded-lg w-full font-bold text-white text-lg transition-all">
                        Explore Package
                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/packages/${pkg._id}`}>
                      <Button className="flex justify-center items-center bg-gradient-to-r from-[#0a2e28] hover:from-[#134B42] to-[#134B42] hover:to-[#0a2e28] group-hover:shadow-lg py-6 rounded-lg w-full font-bold text-white text-lg transition-all">
                        Explore Package
                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
