"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Clock,
  Shield,
  Camera,
  Utensils,
  Plane,
  ArrowLeft,
  Milestone,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Test from "@/components/test";
import { toast } from "react-toastify";
import Image from "next/image";

// Mock package data (in real app, this would come from API)
const packageData = {
  1: {
    id: 1,
    title: "1 hour audio commented cruise",
    description: "The summer enjoy Guided tour with family or friends in paris",

    price: 1299,
    duration: "7 days",
    location: "Maldives",
    category: "Beach",
    rating: 4.9,
    reviews: 342,
    imageUrl: "/images/hero1.jpeg",
    gallery: ["/images/hero2.jpeg", "/images/hero3.jpeg", "/images/hero4.jpg"],
    features: [
      "All-inclusive",
      "Overwater Villa",
      "Spa Treatment",
      "Water Sports",
      "Private Beach",
    ],
    availableSlots: 12,
    itinerary: [
      {
        day: 1,
        title: "Starting Location:",
        description: "7 Portde la Bourdonnais",
      },
      {
        day: 2,
        title: "Les Invalides",
        description: "",
      },
      {
        day: 3,
        title: "Musée d'Orsay",
        description: "",
      },
      {
        day: 4,
        title: "IIe de la Cité",
        description: "",
      },
      {
        day: 5,
        title: "Notre-Dame Cathedral",
        description: "",
      },
      {
        day: 6,
        title: "Hôtel de Ville",
        description: "",
      },
      {
        day: 7,
        title: "Louvre Museum",
        description: "",
      },
      {
        day: 8,
        title: "Place de la Concorde",
        description: "",
      },
      {
        day: 9,
        title: "Grand Palais",
        description: "",
      },
      {
        day: "",
        title: "Arrive Back at:",
        description: "7 Port de la Bourdonnais",
      },
    ],
    included: [
      "Round-trip flights",
      "Airport transfers",
      "Accommodation",
      "All meals",
      "Activities",
      "Professional guide",
    ],
    notIncluded: [
      "Travel insurance",
      "Personal expenses",
      "Optional tours",
      "Alcoholic beverages",
    ],
    dates: [
      "2024-03-15",
      "2024-04-12",
      "2024-05-10",
      "2024-06-14",
      "2024-07-19",
    ],
  },
};

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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
    if (params.id) {
      fetchPackage();
    }
  }, [params.id]);

  const fetchPackage = async () => {
    if (!params?.id) return;
    try {
      const response = await fetch(`/api/tickets/${params.id}`);
      const data = await response.json();
      setNewPkg(data.ticket);
    } catch (error) {
      console.error("Error fetching package:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("single package here", newPkg?._id);

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

  const minDate = new Date().toISOString().split("T")[0];

  const parseCustomDate = (dateStr: string): Date | null => {
    const [day, month, year] = dateStr.split("-").map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day); // JS month is 0-indexed
  };

  if (loading) {
    return (
      <div className="bg-[#F1F1F1] py-8 min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-gray-200 mb-8 rounded-xl h-96 animate-pulse"></div>
          <div className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!newPkg) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="mb-4 font-bold text-gray-900 text-2xl">
            Package Not Found
          </h1>
          <Link href="/">
            <Button>Back to Packages</Button>
          </Link>
        </div>
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
                className="flex items-center text-gray-700 hover:text-sky-500 transition-colors"
              >
                <ArrowLeft className="mr-1 w-4 h-4" />
                Back to Packages
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
                  alt={newPkg?.title}
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
                      selectedImage === 0 ? "ring-2 ring-sky-500" : ""
                    }`}
                  >
                    <Image
                      src={newPkg?.imageUrl || "/images/hero1.jpeg"}
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
                        selectedImage === index + 1 ? "ring-2 ring-sky-500" : ""
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
                    {newPkg?.title}
                  </h1>
                </div>
              </div>

              <p className="mb-6 text-gray-700">{newPkg?.description}</p>

              {/* Tabs */}
              <Tabs defaultValue="itinerary" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="included">
                    What&apos;s Included
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
                                ? "bg-sky-500"
                                : "bg-emerald-500"
                            } z-10 flex items-center justify-center text-white font-bold`}
                          >
                            {idx === 0 ? <Milestone /> : day.day}
                          </div>

                          {/* Line (skip for last item) */}
                          {idx !== newPkg?.itinerary.length - 1 && (
                            <div className="bg-sky-500 w-2 h-10"></div>
                          )}
                        </div>
                        {/* to do  */}
                        {/* Content section */}
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {day.title}
                          </h3>
                          <p className="mt-1 text-gray-600 text-sm">
                            {day.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="included" className="mt-6">
                  <div className="gap-6 grid md:grid-cols-2">
                    <div>
                      <h3 className="flex items-center mb-3 font-semibold text-green-600">
                        <Shield className="mr-2 w-4 h-4" />
                        Included
                      </h3>
                      <ul className="space-y-2">
                        {newPkg?.included.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center text-gray-700"
                          >
                            <span className="mr-2 text-green-500">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-3 font-semibold text-red-600">
                        Not Included
                      </h3>
                      <ul className="space-y-2">
                        {newPkg?.notIncluded.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center text-gray-700"
                          >
                            <span className="mr-2 text-red-500">✗</span>
                            {item}
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
                          <div className="flex justify-center items-center bg-sky-500 rounded-full w-8 h-8 font-medium text-white">
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
                    <div className="font-bold text-[#0077B6] text-3xl">
                      ${newPkg?.price}
                      <span className="font-normal text-[#6C757D] text-lg">
                        /person
                      </span>
                    </div>
                    <p className="text-[#6C757D] text-sm">
                      {newPkg?.availability} spots available
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Add People Section */}
                    <div>
                      <label className="block mb-2 font-medium text-[#1E1E1E] text-sm">
                        Add people
                      </label>

                      {[
                        {
                          label: "ADULT(s)",
                          desc: "12 years and older",
                          count: adults,
                          set: setAdults,
                        },
                        {
                          label: "CHILDREN",
                          desc: "4 to 11 years old",
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
                            <p className="text-[#6C757D] text-sm">
                              {group.desc}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
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
                            <button
                              type="button"
                              onClick={() => group.set(group.count + 1)}
                              className="flex justify-center items-center hover:bg-gray-100 border border-gray-400 rounded-full w-8 h-8 font-bold text-lg"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Travel Date Picker */}
                    <div>
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
                    </div>

                    {/* Total and Book */}
                    <div className="pt-4 border-t">
                      <div className="space-y-1 text-right">
                        <p className="text-[#1E1E1E] text-sm">
                          Adults: {adults} × €17
                        </p>
                        <p className="text-[#1E1E1E] text-sm">
                          Children: {children} × €8
                        </p>
                        <p className="font-bold text-[#0077B6] text-2xl">
                          €{totalAmount}
                        </p>
                      </div>

                      <button
                        onClick={handleBooking}
                        disabled={numberOfPassengers === 0}
                        className="bg-[#0077B6] hover:bg-[#005a8b] disabled:opacity-50 py-3 rounded-lg w-full font-semibold text-white transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* end col-span */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
