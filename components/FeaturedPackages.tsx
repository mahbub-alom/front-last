"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, Star, StarHalf } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useLocale, useTranslations } from "next-intl";

interface LocalizedString {
  en: string;
  es: string;
  fr: string;
  it: string;
  pt: string;
}

interface Package {
  _id: string;
  title: LocalizedString;
  subTitle: LocalizedString;
  description: LocalizedString;
  price: number;
  fullPrice: number;
  adultPrice: number;
  duration: string;
  location: string;
  imageUrl: string;
  features: string[];
  rating: number;
  reviews: number;
}
interface ApiResponse {
  tickets: Package[];
}

export default function FeaturedPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const t = useTranslations("home");
  const firstPackageTranslate = useTranslations("firstpackage");
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
              {/* --- MOBILE (improved layout) --- */}
              <div className="md:hidden flex flex-col bg-white shadow-md border border-rose-100 rounded-2xl h-full overflow-hidden">
                {/* Image */}
                <div className="relative w-full h-44">
                  <Image
                    src={pkg.imageUrl}
                    alt={pkg.title?.[locale as keyof LocalizedString] || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 justify-between p-4">
                  {/* Title + Subtitle */}
                  <div>
                    <h3 className="font-semibold text-[#740e27] text-lg line-clamp-2">
                      {pkg.title?.[locale as keyof LocalizedString] || ""}
                    </h3>
                    <p className="mt-1 text-gray-600 text-sm line-clamp-2">
                 {pkg.subTitle?.[locale as keyof LocalizedString]
                        ? pkg.subTitle?.[locale as keyof LocalizedString]
                        : pkg.description?.[locale as keyof LocalizedString]}
                    </p>
                  </div>

                  {/* Rating + Duration */}
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 mr-1 ${
                            i < pkg.rating ? "text-amber-400" : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {pkg.duration && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="mr-1 w-4 h-4" />
                        <span>{pkg.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  {pkg.adultPrice > 0 && pkg.fullPrice > 0 && (
                    <div className="mt-3">
                      <span className="text-rose-300 text-xs">
                        {firstPackageTranslate("from")}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm line-through">
                          €{pkg.fullPrice}
                        </span>
                        <span className="font-bold text-[#740e27] text-lg">
                          €{pkg.adultPrice}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {firstPackageTranslate("per-person")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Button */}
                  <div className="mt-4">
                    <Link
                      href={
                        index === 0
                          ? `/firstPackage/${pkg._id}`
                          // : `/packages/${pkg._id}`
                          :"https://affiliates.bigbuspartners.com/?r=busandboatparis13"
                      }
                    >
                      <Button className="bg-gradient-to-r from-[#740e27] to-[#9c2440] hover:brightness-110 py-3 rounded-xl w-full font-semibold text-white">
                        {t("explore-package")}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* --- DESKTOP (card layout) --- */}
              <div className="group hidden md:flex md:flex-col flex-1 cursor-pointer">
                <div className="relative flex flex-col bg-gradient-to-br from-red-700 via-rose-800 to-pink-900 shadow-2xl border-2 border-rose-400/50 rounded-3xl h-full overflow-hidden hover:scale-105 transition-transform duration-500">
                  {/* Image */}
                  <div className="relative rounded-t-3xl h-52 overflow-hidden">
                    <Image
                        src={pkg.imageUrl}
                      alt={pkg.title?.[locale as keyof LocalizedString]}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 to-transparent"></div>
                  </div>

                  {/* Content (full flex column) */}
                  <div className="flex flex-col flex-1 bg-rose-900/70 p-6 rounded-b-3xl">
                    <div className="flex-1">
                      {" "}
                      {/* 👈 makes text area grow and push button down */}
                      <h3 className="mb-2 font-bold text-white text-xl line-clamp-2">
                        {pkg.title?.[locale as keyof LocalizedString]}
                      </h3>
                      <p className="mb-4 text-rose-200 text-sm line-clamp-2 leading-relaxed">
               {pkg.subTitle?.[locale as keyof LocalizedString]
                          ? pkg.subTitle?.[locale as keyof LocalizedString]
                          : pkg.description?.[locale as keyof LocalizedString]}
                      </p>
                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        <div className="flex items-center mr-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 mr-1 ${
                                i < pkg.rating
                                  ? "text-amber-400"
                                  : "text-rose-600"
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-rose-300 text-sm">
                          {pkg.rating} ({pkg.reviews})
                        </span>
                      </div>
                      {/* Pricing */}
                      {pkg.adultPrice > 0 && pkg.fullPrice > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-rose-300 text-xs">
                              {firstPackageTranslate("from")}
                            </span>
                            <span className="text-white text-xl line-through">
                              {pkg.fullPrice > 0 ? `€ ${pkg.fullPrice}` : ""}
                            </span>
                          </div>
                          <div className="flex items-end gap-2">
                            <span className="font-bold text-white text-3xl">
                              {pkg.adultPrice > 0 ? `€ ${pkg.adultPrice}` : ""}
                            </span>
                            <span className="text-rose-400 text-sm">
                              {firstPackageTranslate("per-person")}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Button stays fixed at bottom */}
                    <div className="mt-auto">
                      <Link
                        href={
                          index === 0
                            ? `/firstPackage/${pkg._id}`
                            // : `/packages/${pkg._id}`
                            :"https://affiliates.bigbuspartners.com/?r=busandboatparis13"
                        }
                      >
                        {/* <Button className="group relative flex justify-center items-center bg-gradient-to-r from-slate-800 hover:from-slate-700 to-slate-900 hover:to-slate-800 shadow-lg hover:shadow-xl py-4 rounded-2xl w-full overflow-hidden font-medium text-white transition-all duration-500"> */}
                        <Button className="group relative flex justify-center items-center bg-gradient-to-r from-amber-500 hover:from-amber-400 to-pink-600 hover:to-pink-500 shadow-lg hover:shadow-xl py-4 rounded-2xl w-full overflow-hidden font-medium text-white transition-all duration-500">
                          {/* ####### */}
                          <div className="-z-10 absolute inset-0 bg-gradient-to-r from-amber-400 to-violet-500 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-500"></div>
                          <div className="absolute inset-0 opacity-10">
                            <div className="top-2 left-4 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:translate-x-20 duration-1000"></div>
                            <div className="top-4 right-6 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:-translate-x-20 duration-700"></div>
                          </div>
                          <span className="z-10 relative flex justify-center items-center text-sm tracking-wide">
                            {t("explore-package")}
                            <ArrowRight className="ml-3 w-4 h-4 group-hover:scale-110 transition-transform group-hover:translate-x-2 duration-300" />
                          </span>
                        </Button>
                      </Link>
                    </div>
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
