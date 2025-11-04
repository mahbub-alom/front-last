"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageGallery({ newPkg, locale }: { newPkg: any; locale: string }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [fade, setFade] = useState(false);

  // --- Auto change every 2 seconds ---
  useEffect(() => {
    const totalImages = (newPkg?.gallery?.length || 0) + 1;
    const interval = setInterval(() => {
      setFade(true); // start fade-out
      setTimeout(() => {
        setSelectedImage((prev) => (prev + 1) % totalImages);
        setFade(false); // fade-in new image
      }, 300); // fade duration
    }, 2000);

    return () => clearInterval(interval);
  }, [newPkg]);

  const handleSelect = (index: number) => {
    setFade(true);
    setTimeout(() => {
      setSelectedImage(index);
      setFade(false);
    }, 300);
  };

  const currentImage =
    selectedImage === 0
      ? newPkg?.imageUrl
      : newPkg?.gallery?.[selectedImage - 1];

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      {/* Main Image with fade animation */}
      <div className="relative w-full h-96">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            key={currentImage} // triggers re-render on change
            src={currentImage}
            alt={newPkg?.title?.[locale]}
            fill
            className="rounded-xl object-cover"
            priority
          />
        </div>
      </div>

      {/* Thumbnail list */}
      <div className="p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {/* Main thumbnail */}
          <button
            onClick={() => handleSelect(0)}
            className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden ${
              selectedImage === 0 ? "ring-2 ring-[#750E27]" : ""
            }`}
          >
            <Image
              src={newPkg?.imageUrl || "/images/hero2.jpeg"}
              alt="Main"
              fill
              className="object-cover"
              sizes="64px"
              loading="lazy"
            />
          </button>

          {/* Gallery thumbnails */}
          {newPkg?.gallery?.map((img:any, index:any) => (
            <button
              key={index}
              onClick={() => handleSelect(index + 1)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden ${
                selectedImage === index + 1 ? "ring-2 ring-[#740e27]" : ""
              }`}
            >
              <Image
                src={img}
                alt={`Gallery ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
