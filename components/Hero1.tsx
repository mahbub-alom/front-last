"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function Hero1() {
  const images = [
    "/images/hero1.jpeg",
    "/images/hero2.jpeg",
    "/images/hero3.jpeg",
    "/images/hero4.jpg",
    "/images/hero5.jpeg",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);
  const t = useTranslations("home");

  return (
    <section className="relative h-screen max-h-[400px] overflow-hidden text-white">
      {/* Image Carousel Background */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      <div className="relative flex justify-center items-center h-full">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="flex md:flex-row flex-col justify-center items-center mb-6 font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight">
              <span>{t("welcome")}</span>
              {/* <span>Discover</span>
              <span className="drop-shadow-lg md:ms-4 mt-2 md:mt-0 text-[#740e27]">
                Paris
              </span> */}
            </h1>

            {/* <p className="opacity-90 mx-auto mb-8 max-w-3xl font-light text-xl md:text-2xl">
              Experience the magic of the City of Lights with curated tours and
              unforgettable moments
            </p> */}

            {/* <div className="flex sm:flex-row flex-col justify-center items-center gap-4 mb-16">
              <Link
                href="/packages"
                className="flex items-center space-x-2 bg-white hover:bg-gray-100 shadow-lg px-8 py-4 rounded-lg font-semibold text-[#0077B6] hover:scale-105 transition-all"
              >
                <span>Explore Tours</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="flex items-center space-x-2 hover:bg-white px-8 py-4 border-2 border-white rounded-lg font-semibold text-white hover:text-[#0077B6] hover:scale-105 transition-all"
              >
                <span>Learn More</span>
              </Link>
            </div> */}
          </motion.div>

          {/* Stats with animation */}
          <motion.div
            className="gap-8 grid grid-cols-1 md:grid-cols-3 mx-auto max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {/* <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <MapPin className="mb-4 w-12 h-12 text-[#00B4D8]" />
              <h3 className="mb-2 font-bold text-3xl">50+</h3>
              <p className="opacity-90 text-lg">Landmarks</p>
            </div>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <Users className="mb-4 w-12 h-12 text-[#00B4D8]" />
              <h3 className="mb-2 font-bold text-3xl">10K+</h3>
              <p className="opacity-90 text-lg">Happy Travelers</p>
            </div>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <Calendar className="mb-4 w-12 h-12 text-[#00B4D8]" />
              <h3 className="mb-2 font-bold text-3xl">5+</h3>
              <p className="opacity-90 text-lg">Years Experience</p>
            </div> */}
          </motion.div>
        </div>
      </div>

      {/* Carousel indicators */}
      <div className="right-10 bottom-8 left-0 absolute flex justify-end gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentImage ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
