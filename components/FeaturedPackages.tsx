"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, Star, StarHalf } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useLocale, useTranslations } from "next-intl";

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
  const t = useTranslations("home");
  const locale = useLocale();

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
      <div className="flex justify-center items-center bg-gradient-to-b from-[#fdf0f3] to-[#fbe6ea] min-h-screen">
        <div className="border-[#740e27] border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-white to-[#f8f8f8] py-20 text-center">
        <div className="bg-white shadow-lg mx-auto p-8 rounded-2xl max-w-2xl">
          <h3 className="mb-4 font-semibold text-[#740e27] text-2xl">
            Something went wrong
          </h3>
          <p className="mb-6 text-gray-600">
            We couldn&apos;t load our featured packages. Please refresh the page
            or try again later.
          </p>
          <Button
            onClick={fetchFeaturedPackages}
            className="bg-gradient-to-r from-[#740e27] to-[#9c2440] hover:brightness-110 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-white to-[#fdf0f3] py-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-16 text-center">
          <h2 className="mb-3 font-bold text-[#740e27] text-4xl md:text-5xl">
            {t("premium-experiences")}
          </h2>
          <div className="bg-[#740e27] mx-auto rounded-full w-40 h-1"></div>
        </div>

        {/* Center when only 2 cards */}
        <div
          className={`grid gap-8 mx-auto 
        ${
          packages.length === 2
            ? "md:grid-cols-2 justify-center"
            : "md:grid-cols-3"
        }`}
        >
          {packages.map((pkg, index) => (
            <div
              key={pkg._id}
              className="group flex flex-col bg-white shadow-md hover:shadow-xl rounded-2xl h-full overflow-hidden transition-all hover:-translate-y-1 duration-300"
            >
              {/* --- MOBILE (row layout) --- */}
              <div className="md:hidden flex flex-col h-full">
                <div className="flex">
                  <div className="relative w-1/3 h-40">
                    <Image
                      src={pkg.imageUrl}
                      alt={pkg.title?.[locale] || ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-between p-4">
                    <h3 className="font-semibold text-[#740e27] text-lg line-clamp-2">
                      {pkg.title?.[locale] || ""}
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                      {pkg.description?.[locale] || ""}
                    </p>
                    <span className="mt-2 font-bold text-[#740e27] text-base">
                      ${pkg.price}
                    </span>
                  </div>
                </div>

                {/* Button pinned at bottom */}
                <div className="mt-auto p-4">
                  <Link
                    href={
                      index === 0
                        ? `/firstPackage/${pkg._id}`
                        : `/packages/${pkg._id}`
                    }
                  >
                    <Button className="bg-gradient-to-r from-[#740e27] to-[#9c2440] hover:brightness-110 py-4 rounded-xl w-full font-semibold text-white">
                      Explore
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* --- DESKTOP (card layout) --- */}
              <div className="hidden md:flex md:flex-col flex-1">
                <div className="relative h-52">
                  <Image
                    src={pkg.imageUrl}
                    alt={pkg.title?.[locale]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* <div className="bottom-3 left-3 absolute bg-[#740e27] px-3 py-1 rounded-full font-medium text-white text-sm">
                    ${pkg.price}/person
                  </div> */}
                </div>

                {/* Card body with button at bottom */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="mb-2 font-bold text-[#740e27] text-xl">
                    {pkg.title?.[locale]}
                  </h3>
                  <p className="mb-4 text-gray-600 text-sm line-clamp-3">
                    {pkg.subTitle?.[locale]}
                  </p>
                  <div className="flex items-center mb-3 text-gray-500 text-sm">
                    <div className="flex items-center">
                      <Star size={28} strokeWidth={2.25} />
                      <Star size={28} strokeWidth={2.25} />
                      <Star size={28} strokeWidth={2.25} />
                      <Star size={28} strokeWidth={2.25} />
                      <StarHalf size={28} strokeWidth={2.25} />
                    </div>
                    {pkg.rating} ({pkg.reviews})
                  </div>
                  {/* price here  */}
                  <div className="mx-auto py-4 text-center">
                    <div className="flex justify-center items-end gap-1">
                      From{" "}
                      <span className="text-red-500 line-through">
                        €{pkg?.fullPrice}
                      </span>
                    </div>
                    <div className="mt-0 text-gray-500 text-sm">
                      <span className="font-bold text-[#004030] text-xl">
                        €{pkg?.adultPrice}
                      </span>
                      <span className="text-gray-600 text-sm">per person</span>
                    </div>
                  </div>

                  {/* Button always sticks at bottom */}
                  <div className="mt-auto">
                    <Link
                      href={
                        index === 0
                          ? `/firstPackage/${pkg._id}`
                          : `/packages/${pkg._id}`
                      }
                    >
                      <Button className="group relative bg-gradient-to-r from-[#740e27] hover:from-[#8a1a33] to-[#9c2440] hover:to-[#b22a4d] hover:shadow-2xl hover:shadow-rose-400/20 py-4 rounded-xl w-full overflow-hidden font-semibold text-white hover:scale-105 transition-all duration-300">
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transition-transform translate-x-[-100%] group-hover:translate-x-[100%] duration-1000 transform"></div>

                        <span className="z-10 relative flex justify-center items-center">
                          {t("explore-package")}
                          <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 duration-300" />
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
