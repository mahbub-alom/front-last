"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

type ContactFormInputs = {
  name: string;
  email: string;
  phone?: string;
  Query: string;
  message: string;
};

const ContactUs = () => {
  const t = useTranslations("contact");

  // ✅ Add generic type here
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>();

  // ✅ Explicit type for onSubmit
  const onSubmit: SubmitHandler<ContactFormInputs> = (data) => {
    console.log("Form submitted:", data);
    toast.success("Your message has been sent successfully!");
    reset();
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Hero Section */}
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
            {/* ... same contact info and why-choose-us section ... */}
          </div>

          {/* Contact Form */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white shadow-xl p-8 md:p-12 rounded-2xl">
              <h2 className="mb-2 font-bold text-[#740e27] text-3xl">
                {t("send-message")}
              </h2>
              <p className="mb-8 text-gray-600">{t("fill-form")}</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block mb-1 font-medium text-gray-700 text-sm">
                      {t("full-name")} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register("name", { required: true })}
                      className="px-4 py-3 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#740e27] focus:ring-2 w-full transition"
                    />
                    {errors.name && <span className="text-red-500 text-sm">{t("name-required")}</span>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-1 font-medium text-gray-700 text-sm">
                      {t("email-address")} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email", { required: true })}
                      className="px-4 py-3 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#740e27] focus:ring-2 w-full transition"
                    />
                    {errors.email && <span className="text-red-500 text-sm">{t("email-required")}</span>}
                  </div>
                </div>

                <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="block mb-1 font-medium text-gray-700 text-sm">
                      {t("phone-number")}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register("phone")}
                      className="px-4 py-3 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#740e27] focus:ring-2 w-full transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="Query" className="block mb-1 font-medium text-gray-700 text-sm">
                      {t("query")} *
                    </label>
                    <select
                      id="Query"
                      {...register("Query", { required: true })}
                      className="px-4 py-3 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#740e27] focus:ring-2 w-full transition"
                    >
                      <option value="">{t("select-query")}</option>
                      <option value="booking">{t("booking-query")}</option>
                      <option value="product">{t("product-query")}</option>
                      <option value="service">{t("service-query")}</option>
                      <option value="website">{t("website-query")}</option>
                      <option value="feedback">{t("feedback")}</option>
                      <option value="refund">{t("refund-request")}</option>
                      <option value="other">{t("other")}</option>
                    </select>
                    {errors.Query && <span className="text-red-500 text-sm">{t("query-required")}</span>}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block mb-1 font-medium text-gray-700 text-sm">
                    {t("message")} *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message", { required: true })}
                    className="px-4 py-3 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#740e27] focus:ring-2 w-full transition"
                  ></textarea>
                  {errors.message && <span className="text-red-500 text-sm">{t("message-required")}</span>}
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
          <h2 className="mb-12 font-bold text-[#740e27] text-3xl text-center">{t("find-us")}</h2>
          <div className="shadow-xl rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2071.045921372588!2d2.375784275470812!3d48.946481694504556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66be333ee8b79%3A0xaf55703999bee4ec!2s56%20Rue%20des%20Sculpteurs%2C%2093240%20Stains%2C%20France!5e1!3m2!1sen!2sbd!4v1757519821119!5m2!1sen!2sbd"
              width="100%"
              height="450"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              loading="lazy"
              title="Bus & Boat Paris Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
