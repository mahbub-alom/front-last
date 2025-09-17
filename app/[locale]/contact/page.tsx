"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ContactUs = () => {
  const t = useTranslations("contact");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    toast.success("Your message has been sent successfully!");
    reset();
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Hero Section with Full Background Image */}
      <div className="relative h-96">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://www.bigbustours.com/media/wysiwyg/generic/Contact-Us-Big-Bus-Tours-01.17.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="z-10 relative flex flex-col justify-center items-center px-4 h-full text-center">
          <h1 className="mb-6 font-bold text-white text-5xl md:text-7xl">
            {t("title")}
          </h1>
        </div>

        <div className="right-0 bottom-10 left-0 absolute flex justify-center">
          <div className="animate-bounce">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-[#740e27] text-4xl">
            {t("get-in-touch")}
          </h2>
          {/* <p className="mx-auto max-w-3xl text-gray-600 text-xl leading-relaxed">
            Need help with your booking or tours? Contact us via{" "}
            <span className="font-semibold text-[#740e27]">Live Chat</span>, the{" "}
            <span className="font-semibold text-[#740e27]">
              Bus &amp; Boat Paris web
            </span>
            , or the enquiry form below.
          </p> */}
          <p className="mx-auto max-w-3xl text-gray-600 text-xl leading-relaxed">
            {t.rich("need-help", {
              strong: (chunks) => (
                <span className="font-semibold text-[#740e27]">{chunks}</span>
              ),
              brand: (chunks) => (
                <span className="font-semibold text-[#740e27]">{chunks}</span>
              ),
            })}
          </p>
        </div>

        <div className="flex lg:flex-row flex-col gap-12">
          {/* Contact Information */}
          <div className="w-full lg:w-2/5">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-[#740e27] mr-4 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Address
                  </h3>
                  <p className="text-gray-600">
                    56 rue des sculpteurs, Stains, France
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-[#740e27] mr-4 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Phone</h3>
                  <p className="text-gray-600">+33 7 58 21 98 26</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-[#740e27] mr-4 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Email</h3>
                  <p className="text-gray-600">busandboatparis11@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-[#740e27] mr-4 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Business Hours
                  </h3>
                  <p className="text-gray-600">
                    Monday - Sunday: 8:00 AM - 10:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg mt-12 p-8 rounded-xl">
              <h3 className="mb-4 font-semibold text-[#740e27] text-xl">
                Why Choose Us?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg
                    className="mr-3 w-5 h-5 text-[#740e27]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-gray-600">Award-winning tours</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-3 w-5 h-5 text-[#740e27]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-gray-600">Multilingual guides</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-3 w-5 h-5 text-[#740e27]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-gray-600">Luxury vehicles & boats</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-3 w-5 h-5 text-[#740e27]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-gray-600">
                    Personalized experiences
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white shadow-xl p-8 md:p-12 rounded-2xl">
              <h2 className="mb-2 font-bold text-[#740e27] text-3xl">
                Send us a Message
              </h2>
              <p className="mb-8 text-gray-600">
                Fill out the form below and our team will get back to you within
                24 hours.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-1 font-medium text-gray-700 text-sm"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register("name", { required: true })}
                      className="px-4 py-3 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#740e27] focus:ring-2 w-full transition"
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm">
                        Name is required
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-1 font-medium text-gray-700 text-sm"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email", { required: true })}
                      className="px-4 py-3 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#740e27] focus:ring-2 w-full transition"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm">
                        Email is required
                      </span>
                    )}
                  </div>
                </div>

                <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-1 font-medium text-gray-700 text-sm"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register("phone")}
                      className="px-4 py-3 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#740e27] focus:ring-2 w-full transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="Query"
                      className="block mb-1 font-medium text-gray-700 text-sm"
                    >
                      Query *
                    </label>
                    <select
                      id="Query"
                      {...register("Query", { required: true })}
                      className="px-4 py-3 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#740e27] focus:ring-2 w-full transition"
                    >
                      <option value="">Select a Query</option>
                      <option value="booking">Booking Query</option>
                      <option value="product">Product Query</option>
                      <option value="service">Service Query</option>
                      <option value="website">Website Query</option>
                      <option value="feedback">Feedback</option>
                      <option value="refund">Refund Request</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.Query && (
                      <span className="text-red-500 text-sm">
                        Query is required
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block mb-1 font-medium text-gray-700 text-sm"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    {...register("message", { required: true })}
                    className="px-4 py-3 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#740e27] focus:ring-2 w-full transition"
                  ></textarea>
                  {errors.message && (
                    <span className="text-red-500 text-sm">
                      Message is required
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-[#740e27] hover:bg-[#5a0b1f] px-6 py-4 rounded-lg focus:outline-none focus:ring-[#740e27] focus:ring-2 focus:ring-offset-2 w-full font-semibold text-white text-lg hover:scale-105 transition duration-300 transform"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="mb-12 font-bold text-[#740e27] text-3xl text-center">
            Find Us in Paris
          </h2>
          <div className="shadow-xl rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2071.045921372588!2d2.375784275470812!3d48.946481694504556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66be333ee8b79%3A0xaf55703999bee4ec!2s56%20Rue%20des%20Sculpteurs%2C%2093240%20Stains%2C%20France!5e1!3m2!1sen!2sbd!4v1757519821119!5m2!1sen!2sbd"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowfullscreen="true"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Bus & Boat Paris Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
