"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutParisBusBoat() {
  return (
    <div className="bg-white min-h-screen font-[DINRoundPro,Helvetica,sans-serif] text-gray-800">
      {/* Hero Image Section */}
      <section
        className="relative bg-cover bg-center w-full h-[60vh] md:h-[70vh]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
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
      <section className="items-center gap-10 grid md:grid-cols-2 bg-gray-100 px-6 md:px-10 lg:px-16 py-16">
        <div>
          <h2 className="bg-clip-text bg-gradient-to-r from-[#740e27] to-[#9c2b45] font-bold text-transparent text-3xl md:text-4xl">
            We're on a Mission
          </h2>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            Our mission is to turn every city break into an adventure worth
            remembering. We create tours that blend fun with discovery, letting
            you experience Paris from a fresh perspective. From iconic monuments
            to hidden gems, our hop-on, hop-off style means you set the pace.
            Ride along with commentary that shares the city’s stories, then step
            off and dive deeper into the places that catch your eye. We believe
            travel should inspire, and every journey with us is designed to do
            just that.
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
      <section className="flex justify-center bg-gray-100 px-8 md:px-10 lg:px-16 py-16">
        <div className="relative mb-10 max-w-4xl text-left">
          <h2 className="bg-clip-text bg-gradient-to-r from-[#740e27] to-[#9c2b45] mb-4 font-bold text-transparent text-3xl md:text-4xl">
            Because size matters
          </h2>
          <p className="mb-10 text-gray-600 text-lg leading-relaxed">
            Bus and Boat Paris invites you to experience the city of lights like
            never before. From the open-top comfort of our iconic buses to the
            gentle glide of our riverboats on the Seine, every journey is
            designed to showcase Paris in all its charm. Discover world-famous
            landmarks, uncover hidden neighborhoods, and enjoy the freedom to
            explore at your own pace with our flexible hop-on, hop-off routes.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Whether it’s your very first visit or a return adventure, we make
            sightseeing effortless, entertaining, and unforgettable.
            <span className="font-medium text-red-600 cursor-pointer">
              {" "}
              Sign up
            </span>{" "}
            to hear when new routes and experiences launch.
          </p>

          <Image
            width={1000}
            height={800}
            className="bottom-[-30px] left-[-7%] absolute max-w-[105%]"
            src="https://www.bigbustours.com/media/wysiwyg/HOHO-arrow-Desktop-1.png"
            alt="desktop icon"
          />
        </div>
      </section>

      {/* the history section  */}
      <section className="bg-gradient-to-r from-red-50 via-yellow-50 to-red-100 px-6 md:px-16 py-20">
        <div className="space-y-10 mx-auto max-w-5xl text-center">
          {/* Section Title */}
          <h2 className="bg-clip-text bg-gradient-to-r from-[#740e27] to-[#9c2b45] mb-4 font-bold text-transparent text-3xl md:text-4xl">
            Our Journey
          </h2>

          {/* Intro Paragraph */}
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            In 2011, two iconic sightseeing companies –{" "}
            <span className="font-semibold text-red-500">
              Bus & Boat Paris Company Ltd
            </span>{" "}
            in London and{" "}
            <span className="font-semibold text-yellow-600">
              Les Cars Rouges
            </span>{" "}
            in Paris – joined forces to create a fresh, modern sightseeing
            experience in Paris:{" "}
            <span className="font-semibold text-red-600">Bus & Boat Paris</span>
            .
          </p>

          {/* Highlighted Action Words */}
          <p className="space-x-4 md:text-5xl">
            <span className="font-bold text-yellow-500 animate-pulse">HOP-ON</span>
            <span className="text-[#740e27] animate-bounce">DISCOVER</span>
            <span className="font-bold text-yellow-500 animate-pulse">HOP-OFF</span>
            <span className="text-[#740e27] animate-bounce">EXPLORE</span>
          </p>

          {/* Main Story Paragraph */}
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            <span className="font-semibold text-red-600">Bus & Boat Paris</span>{" "}
            offers a unique way to explore the City of Lights from both land and
            water. Visitors can hop on an open-top bus to see famous landmarks
            like the Eiffel Tower and Notre-Dame, or enjoy a scenic cruise along
            the Seine. Founded on the philosophy{" "}
            <span className="text-yellow-600 italic">
              'think global, act local'
            </span>
            , the company ensures every tour feels authentic and memorable,
            making it a favorite experience for tourists visiting Paris.
          </p>
        </div>
      </section>

      {/* Placeholder for other sections */}
      <section className="px-6 md:px-10 lg:px-16 py-16 text-gray-500 text-center">
        <p>
          Other sections (The History, Hop-On Discover, Meet the Team, Let's
          Connect) remain below…
        </p>
      </section>

      {/* Footer */}
      <footer className="mx-auto px-6 md:px-10 lg:px-16 py-10 max-w-4xl text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} Bus & Boat Paris — All rights reserved.
      </footer>
    </div>
  );
}
