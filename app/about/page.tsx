"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutParisBusBoat() {
  return (
    <div className="bg-white min-h-screen font-[DINRoundPro,Helvetica,sans-serif] text-gray-800">
      {/* Hero Image Section */}
      <section className="relative bg-cover bg-center w-full h-[60vh] md:h-[70vh]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="absolute inset-0 flex justify-center items-center bg-black/40">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-extrabold text-white text-4xl md:text-6xl text-center"
          >
            About Bus And Boat Paris Tours
          </motion.h1>
        </div>
      </section>

      {/* Mission Section */}
      <section className="items-center gap-10 grid md:grid-cols-2 px-6 md:px-10 lg:px-16 py-16">
        <div>
          <h2 className="bg-clip-text bg-gradient-to-r from-[#740e27] to-[#9c2b45] font-bold text-transparent text-3xl md:text-4xl">
            We're on a Mission
          </h2>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            Our mission is to turn every city break into an adventure worth remembering. We create tours that blend fun with discovery, letting you experience Paris from a fresh perspective. From iconic monuments to hidden gems, our hop-on, hop-off style means you set the pace. Ride along with commentary that shares the city’s stories, then step off and dive deeper into the places that catch your eye. We believe travel should inspire, and every journey with us is designed to do just that.
          </p>
        </div>
        <div className="shadow-lg rounded-xl w-full aspect-video overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Because Size Matters */}
      <section className="bg-gradient-to-r from-[#740e27] to-[#9c2b45] px-6 md:px-10 lg:px-16 py-16 text-white text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-bold text-3xl md:text-4xl">Because Size Matters</h2>
          <p className="mt-6 text-white/90 text-lg leading-relaxed">
            Bus & Boat Paris is part of one of the largest sightseeing tour networks in the world—
            sparking a sense of adventure in more than 25 cities across four continents. What began with just a few vehicles
            has now grown into hundreds of buses and boats, helping millions of travelers discover cities every single year.
            And the journey isn’t slowing down—we’re always planning new destinations, ready to bring more unforgettable experiences.
          </p>

          <div className="flex justify-center mt-10">
            <Image
              src="https://www.bigbustours.com/media/wysiwyg/HOHO-arrow-Mobile-1.png"
              alt="Hop On Hop Off Arrow"
              width={180}
              height={60}
              className="object-contain"
            />
          </div>

          <div className="mt-6">
            <a
              href="#newsletter"
              className="inline-block bg-white hover:opacity-90 shadow px-8 py-3 rounded-full font-semibold text-[#740e27]"
            >
              Sign up for Updates
            </a>
          </div>
        </div>
      </section>

      {/* Placeholder for other sections */}
      <section className="px-6 md:px-10 lg:px-16 py-16 text-gray-500 text-center">
        <p>Other sections (The History, Hop-On Discover, Meet the Team, Let's Connect) remain below…</p>
      </section>

      {/* Footer */}
      <footer className="mx-auto px-6 md:px-10 lg:px-16 py-10 max-w-4xl text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} Bus & Boat Paris — All rights reserved.
      </footer>
    </div>
  );
}
