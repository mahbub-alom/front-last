"use client";

import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AboutParisBusBoat() {
  const t = useTranslations("about");
  const tContactUs = useTranslations("contact");
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
            {t("title")}
          </motion.h1>
        </div>
      </section>

      {/* Mission Section */}
      <section className="items-center gap-10 grid md:grid-cols-2 bg-gray-100 px-6 md:px-10 lg:px-16 py-16">
        <div>
          <h2 className="bg-clip-text bg-gradient-to-r from-[#740e27] to-[#9c2b45] font-bold text-transparent text-3xl md:text-4xl">
            {t("mission-title")}
          </h2>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            {t("mission-text")}
          </p>
        </div>
        <div className="shadow-lg rounded-xl w-full aspect-video overflow-hidden">
          {/* <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe> */}

          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/8Sucd2UZHiM?si=WEoi2F-5_JMNLqpF&amp;start=27"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Because Size Matters */}
      <section className="flex justify-center bg-gray-100 px-8 md:px-10 lg:px-16 py-16">
        <div className="relative mb-10 max-w-4xl text-left">
          <h2 className="bg-clip-text bg-gradient-to-r from-[#740e27] to-[#9c2b45] mb-4 font-bold text-transparent text-3xl md:text-4xl">
            {t("because-size-matters")}
          </h2>
          <p className="mb-10 text-gray-600 text-lg leading-relaxed">
            {t("experience-text")}
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            {t("sightseeing-intro")}
            <span className="font-medium text-red-600 cursor-pointer">
              {" "}
              {t("signup")}
            </span>{" "}
            {t("sightseeing-intro")}
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
      <section className="bg-gradient-to-r from-red-50 via-yellow-50 to-red-100 px-6 md:px-16 py-10">
        <div className="mx-auto max-w-5xl text-center">
          {/* Section Title */}
          <h2 className="bg-clip-text bg-gradient-to-r from-[#740e27] to-[#9c2b45] mb-4 font-bold text-transparent text-3xl md:text-4xl">
            {t("our-journey-title")}
          </h2>

          <div className="space-y-10">
            {/* Intro Paragraph */}
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {t.rich("our-journey-text", {
                bus: (chunks) => (
                  <span className="font-semibold text-red-500">{chunks}</span>
                ),
                cars: (chunks) => (
                  <span className="font-semibold text-yellow-600">
                    {chunks}
                  </span>
                ),
                bbp: (chunks) => (
                  <span className="font-semibold text-red-600">{chunks}</span>
                ),
              })}
            </p>

            {/* Highlighted Action Words */}
            <p className="space-x-4 md:text-5xl">
              {t.rich("hopon-discover", {
                hopon: (chunks) => (
                  <span className="font-bold text-yellow-500 animate-pulse">
                    {chunks}
                  </span>
                ),
                discover: (chunks) => (
                  <span className="text-[#740e27] animate-bounce">
                    {chunks}
                  </span>
                ),
                hopoff: (chunks) => (
                  <span className="font-bold text-yellow-500 animate-pulse">
                    {chunks}
                  </span>
                ),
                explore: (chunks) => (
                  <span className="text-[#740e27] animate-bounce">
                    {chunks}
                  </span>
                ),
              })}
            </p>

            {/* Main Story Paragraph */}
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {t.rich("company-intro", {
                company: (chunks) => (
                  <span className="font-semibold text-red-600">{chunks}</span>
                ),
                philosophy: (chunks) => (
                  <span className="text-yellow-600 italic">{chunks}</span>
                ),
              })}
            </p>
          </div>
        </div>
      </section>

      {/* meet the team section  */}
      <section className="flex justify-center bg-gray-100 px-8 md:px-10 lg:px-16 pt-20 pb-8">
        <div className="relative max-w-4xl text-right">
          <h2 className="bg-clip-text bg-gradient-to-r from-[#740e27] to-[#9c2b45] font-bold text-transparent text-3xl md:text-4xl">
            {t("meet-the-team")}
          </h2>
          <p className="mb-10 text-gray-600 text-lg leading-relaxed">
            {t.rich("team-intro", {
              company: (chunks) => (
                <span className="font-semibold text-red-600">{chunks}</span>
              ),
              highlight: (chunks) => (
                <span className="text-yellow-600 italic">{chunks}</span>
              ),
            })}
          </p>

          <Image
            width={1000}
            height={800}
            className="bottom-20 left-6 absolute max-w-[105%]"
            src="https://www.bigbustours.com/media/wysiwyg/HOHO-arrow-Desktop-2.png"
            alt="desktop icon"
          />
        </div>
      </section>

      <section className="bg-gray-100 px-6 md:px-16 pb-16">
        <div className="flex md:flex-row flex-col justify-center items-center gap-12 mx-auto max-w-6xl">
          {/* Image 1 */}
          <div className="border-4 border-yellow-600 rounded-full w-56 h-56 overflow-hidden">
            <Image
              src="https://www.bigbustours.com/media/wysiwyg/Meet-Team-1.png"
              alt="Bus Driver"
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image 2 */}
          <div className="border-4 border-yellow-600 rounded-full w-56 h-56 overflow-hidden">
            <Image
              src="https://www.bigbustours.com/media/wysiwyg/Meet-Team-2.png"
              alt="Guides"
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image 3 */}
          <div className="border-4 border-yellow-600 rounded-full w-56 h-56 overflow-hidden">
            <Image
              src="https://www.bigbustours.com/media/wysiwyg/Meet-Team-3.png"
              alt="meet Team"
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-100 px-6 md:px-16 py-20 text-center">
        <div className="space-y-8 mx-auto max-w-3xl">
          {/* Small Text */}
          <p className="text-gray-700 text-lg md:text-xl">
            {t("contact-text")}
            <a href="/contact" className="text-red-600 hover:underline">
              {" "}
              {tContactUs("title")}{" "}
            </a>
            .
          </p>

          {/* Title */}
          <h2 className="font-extrabold text-[#740e27] text-3xl md:text-5xl uppercase tracking-wide">
            {t("connect-title")}
          </h2>

          {/* Social Icons */}
          <div className="flex justify-center gap-8 mt-8">
            <a
              href="https://www.facebook.com/profile.php?id=61553453702299"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center bg-[#740e27] hover:bg-red-800 rounded-full w-14 h-14 text-white transition"
            >
              <FaFacebookF className="text-4xl" />
            </a>

            <a
              href="https://www.instagram.com/busandboatparis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center bg-[#740e27] hover:bg-red-800 rounded-full w-14 h-14 text-white transition"
            >
              <FaInstagram className="text-4xl" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
