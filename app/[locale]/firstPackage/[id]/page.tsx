"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Star,
  Shield,
  ArrowLeft,
  Milestone,
  ArrowRight,
  Check,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { FaFlagCheckered } from "react-icons/fa";

export default function PackageDetailPage() {
  const ADULT_PRICE = 17;
  const CHILD_PRICE = 8;
  const params = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [travelDate, setTravelDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const numberOfPassengers = adults + children;
  const totalAmount =
    adults * (ADULT_PRICE || 0) + children * (CHILD_PRICE || 0);
  const [newPkg, setNewPkg] = useState<Package | null>(null);
  const locale = useLocale();
  const t = useTranslations("firstpackage");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
    if (params.id) {
      fetchPackage();
    }
  }, [params.id]);

  // // Adults
  // const incrementAdult = () => setAdults(adults + 1);
  // const decrementAdult = () => setAdults(Math.max(0, adults - 1));

  // // Children
  // const incrementChild = () => {
  //   if (adults === 0) {
  //     toast.error("You must buy at least 1 adult ticket.");
  //     return;
  //   }
  //   setChildren(children + 1);
  // };
  // const decrementChild = () => setChildren(Math.max(0, children - 1));

  const fetchPackage = async () => {
    if (!params?.id) return;
    try {
      const response = await fetch(`/api/tickets/${params.id}`);
      const data = await response.json();
      setNewPkg(data?.data);
    } catch (error) {
      console.error("Error fetching package:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!travelDate) {
      toast.error("Please select a travel date");
      return;
    }

    const bookingData = {
      ticketId: newPkg?._id,
      travelDate,
      adults,
      children,
      numberOfPassengers,
      adultTotal: adults * ADULT_PRICE,
      childTotal: children * CHILD_PRICE,
      totalAmount,
    };

    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    router.push("/firstCheckout");
  };

  const isBookingDisabled = adults === 0 || !travelDate;

  const minDate = new Date().toISOString().split("T")[0];

  const parseCustomDate = (dateStr: string): Date | null => {
    const [day, month, year] = dateStr.split("-").map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-b from-[#fdf0f3] to-[#fbe6ea] min-h-screen">
        <div className="border-[#740e27] border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation */}
      <nav className="top-0 z-50 sticky bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-end items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-gray-700 hover:text-[#740e27] transition-colors"
              >
                <ArrowLeft className="mr-1 w-4 h-4" />
                {t("back-to-package")}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="gap-8 grid lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
              <div className="relative w-full h-96">
                <Image
                  src={
                    selectedImage === 0
                      ? newPkg?.imageUrl
                      : newPkg?.gallery[selectedImage - 1]
                  }
                  alt={newPkg?.title?.[locale]}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  <button
                    onClick={() => setSelectedImage(0)}
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

                  {newPkg?.gallery.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index + 1)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden ${
                        selectedImage === index + 1
                          ? "ring-2 ring-[#740e27]"
                          : ""
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

            {/* Package Info */}
            <div className="bg-white shadow-sm p-8 rounded-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="mb-2 font-bold text-gray-900 text-3xl">
                    {newPkg?.title?.[locale]}
                  </h1>
                </div>
              </div>

              <p className="mb-6 text-gray-700">
                {newPkg?.description?.[locale]}
              </p>

              {/* Tabs */}
              <Tabs defaultValue="itinerary" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="itinerary">{t("Itinerary")}</TabsTrigger>
                  <TabsTrigger value="included">
                    {t("whats-included")}
                  </TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="itinerary" className="mt-6">
                  <div className="">
                    {newPkg?.itinerary.map((day, idx) => (
                      <div key={day.day} className="flex items-start gap-4">
                        {/* Timeline section */}
                        <div className="flex flex-col items-center">
                          {/* Dot */}
                          <div
                            className={`w-8 h-8 rounded-full ${
                              idx === 0 || idx === newPkg?.itinerary.length - 1
                                ? "bg-[#740e27]"
                                : // : "bg-[#046d4d]"
                                  // : "bg-[#075B5E]"
                                  "bg-[#6A1E55]"
                            } z-10 flex items-center justify-center text-white font-bold`}
                          >
                            {idx === 0 ? (
                              <Milestone className="w-6 h-6" />
                            ) : idx === newPkg?.itinerary.length - 1 ? (
                              <FaFlagCheckered className="w-4 h-4" />
                            ) : (
                              day.day
                            )}
                          </div>

                          {/* Line (skip for last item) */}
                          {idx !== newPkg?.itinerary.length - 1 && (
                            <div className="bg-[#740e27] w-2 h-10"></div>
                          )}
                        </div>
                        {/* to do  */}
                        {/* Content section */}
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {day.title?.[locale]}
                          </h3>
                          <p className="mt-1 text-gray-600 text-sm">
                            {day.description?.[locale]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                {/* from-[#0a2e28] to-[#134B42] */}

                <TabsContent value="included" className="mt-6">
                  <div className="gap-6 grid md:grid-cols-2">
                    <div>
                      <h3 className="flex items-center mb-3 font-semibold text-green-600">
                        <Shield className="mr-2 w-4 h-4" />
                        Included
                      </h3>
                      <ul className="space-y-2">
                        {newPkg?.included?.[locale]?.map((item, index) => (
                          // <li
                          //   key={index}
                          //   className="flex items-start text-gray-700"
                          // >
                          //   <Circle className="fill-[#FF4E50] mr-2" />
                          //                                       <span>{item}</span>
                          //   <span className="mr-2 text-green-500"></span>
                          //   {item}
                          // </li>
                          <li key={index} className="flex gap-2 text-gray-400">
                            <Check className="flex-shrink-0 w-8 h-7 text-green-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="font-bold text-gray-900 text-3xl">
                        {newPkg?.rating}
                      </div>
                      <div>
                        <div className="flex items-center mb-1 text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="fill-current w-4 h-4" />
                          ))}
                        </div>
                        <p className="text-gray-600">
                          {newPkg?.reviews} reviews
                        </p>
                      </div>
                    </div>

                    {/* Sample Reviews */}
                    <div className="space-y-4">
                      <div className="pb-4 border-b">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex justify-center items-center bg-[#134B42] rounded-full w-8 h-8 font-medium text-white">
                            AP
                          </div>
                          <div>
                            <p className="font-medium">Adamption</p>
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="fill-current w-3 h-3"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">
                          Amazing experience! The overwater villa was incredible
                          and the staff was super friendly.
                        </p>
                      </div>

                      <div className="pb-4 border-b">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex justify-center items-center bg-emerald-500 rounded-full w-8 h-8 font-medium text-white">
                            M
                          </div>
                          <div>
                            <p className="font-medium">Miller</p>
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="fill-current w-3 h-3"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">
                          Perfect honeymoon destination. Everything was
                          organized perfectly from start to finish.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar - Booking */}
          <div className="in-h-screen">
            <div className="mx-auto">
              {/* Booking Box */}
              <div className="lg:col-span-1">
                <div className="top-8 sticky bg-white shadow-lg p-6 rounded-xl min-h-screen">
                  <div className="mb-6 text-center">
                    <div className="font-bold text-[#740e27] text-3xl">
                      €{newPkg?.adultPrice} 
                      <span className="font-normal text-[#6C757D] text-lg">
                      /  {t("per-person")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Add People Section */}
                    {[
                      {
                        label: t("adults"),
                        desc: t("adults-desc"),
                        count: adults,
                        set: setAdults,
                      },
                      {
                        label: t("children"),
                        desc: t("children-desc"),
                        count: children,
                        set: setChildren,
                      },
                    ].map((group, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center mb-3 px-4 py-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-[#1E1E1E]">
                            {group.label}
                          </p>
                          <p className="text-[#6C757D] text-sm">{group.desc}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* Decrement button */}
                          <button
                            type="button"
                            onClick={() =>
                              group.set(Math.max(0, group.count - 1))
                            }
                            className="flex justify-center items-center hover:bg-gray-100 border border-gray-400 rounded-full w-8 h-8 font-bold text-lg"
                          >
                            –
                          </button>

                          <span className="w-6 font-medium text-center">
                            {group.count}
                          </span>

                          {/* Increment button with extra logic */}
                          <button
                            type="button"
                            onClick={() => {
                              if (group.label === "CHILDREN" && adults === 0) {
                                toast.error(
                                  "You must buy at least 1 adult ticket."
                                );
                                return;
                              }
                              group.set(group.count + 1);
                            }}
                            className="flex justify-center items-center hover:bg-gray-100 border border-gray-400 rounded-full w-8 h-8 font-bold text-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Travel Date Picker */}
                    {/* <div>
                      <label className="block mb-2 font-semibold text-[#1E1E1E] text-sm">
                        Choose a date
                      </label>
                      <div className="relative">
                        <Calendar className="top-3.5 left-3 absolute w-5 h-5 text-[#0077B6] pointer-events-none" />
                        <DatePicker
                          selected={
                            travelDate ? parseCustomDate(travelDate) : null
                          }
                          onChange={(date: Date | null) => {
                            if (date) {
                              const formatted = `${String(
                                date.getDate()
                              ).padStart(2, "0")}-${String(
                                date.getMonth() + 1
                              ).padStart(2, "0")}-${date.getFullYear()}`;
                              setSelectedDate(date);
                              setTravelDate(formatted);
                            } else {
                              setSelectedDate(null);
                              setTravelDate("");
                            }
                          }}
                          dateFormat="dd-MM-yyyy"
                          minDate={new Date()}
                          placeholderText="Select a date"
                          className="py-3 pr-4 pl-10 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#0077B6] focus:ring-2 w-full text-[#1E1E1E]"
                        />
                      </div>
                    </div> */}

                    <div>
                      <label className="block mb-2 font-semibold text-[#1E1E1E] text-sm">
                        {t("choose-date")}
                      </label>
                      <div className="relative">
                        <Calendar className="top-3.5 left-3 absolute w-5 h-5 text-[#0077B6] pointer-events-none" />
                        <DatePicker
                          selected={
                            travelDate ? parseCustomDate(travelDate) : null
                          }
                          onChange={(date: Date | null) => {
                            if (date) {
                              const formatted = `${String(
                                date.getDate()
                              ).padStart(2, "0")}-${String(
                                date.getMonth() + 1
                              ).padStart(2, "0")}-${date.getFullYear()}`;
                              setSelectedDate(date);
                              setTravelDate(formatted);
                            } else {
                              setSelectedDate(null);
                              setTravelDate("");
                            }
                          }}
                          dateFormat="dd-MM-yyyy"
                          minDate={new Date()}
                          filterDate={(date) => {
                            // Disable after 9 PM today
                            const now = new Date();
                            if (
                              date.toDateString() === now.toDateString() &&
                              now.getHours() >= 21
                            ) {
                              return false;
                            }
                            return true; // allow other days
                          }}
                          dayClassName={(date) => {
                            // Custom styling for weekends
                            const day = date.getDay();
                            if (day === 0 || day === 6) {
                              return "bg-red-100 text-red-700 rounded-full"; // weekends
                            }
                            return "bg-green-50 text-green-900 rounded-lg hover:bg-green-200"; // weekdays
                          }}
                          placeholderText={t("select-date")}
                          className="py-3 pr-4 pl-10 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#0077B6] focus:ring-2 w-full font-medium text-[#1E1E1E]"
                        />
                      </div>
                    </div>

                    {/* Total and Book */}
                    <div className="pt-4 border-t">
                      <div className="space-y-1 text-right">
                        <p className="text-[#1E1E1E] text-sm">
                         {t("adults")}: {adults} × €17
                        </p>
                        <p className="text-[#1E1E1E] text-sm">
                          {t("children")}: {children} × €8
                        </p>
                        <p className="font-bold text-[#740e27] text-2xl">
                          €{totalAmount}
                        </p>
                      </div>

                      {/* <Button
                        onClick={handleBooking}
                        disabled={numberOfPassengers === 0}
                        className="bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] shadow-md hover:shadow-lg py-6 rounded-lg w-full font-bold text-white text-lg transition-all"
                      >
                        Book Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button> */}
                      <div
                        title={
                          adults === 0 || !travelDate
                            ? "Please select adult and date to activate this button."
                            : ""
                        }
                        className="w-full"
                      >
                        <Button
                          onClick={handleBooking}
                          // disabled={numberOfPassengers === 0}
                          disabled={isBookingDisabled}
                          className={`group relative flex justify-center items-center 
      bg-gradient-to-r from-amber-500 hover:from-amber-400 to-pink-600 hover:to-pink-500 
      shadow-lg hover:shadow-xl py-4 rounded-2xl w-full overflow-hidden font-medium text-white 
      transition-all duration-500 
      ${isBookingDisabled ? "opacity-50 cursor-not-allowed" : ""}
    `}
                        >
                          {/* Gradient Overlay */}
                          <div className="-z-10 absolute inset-0 bg-gradient-to-r from-amber-400 to-violet-500 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-500"></div>

                          {/* Moving dots */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="top-2 left-4 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:translate-x-20 duration-1000"></div>
                            <div className="top-4 right-6 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:-translate-x-20 duration-700"></div>
                          </div>

                          <span className="z-10 relative flex justify-center items-center text-sm tracking-wide">
                            Book Now
                            <ArrowRight className="ml-3 w-4 h-4 group-hover:scale-110 transition-transform group-hover:translate-x-2 duration-300" />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
