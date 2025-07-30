"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Clock, Users, Star, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

interface Package {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  image: string;
  features: string[];
  availability: number;
}

export default function PackageDetailsPage() {
  const ADULT_PRICE = 17;
  const CHILD_PRICE = 8;

  const params = useParams();
  const router = useRouter();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [travelDate, setTravelDate] = useState("");
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const totalPassengers = adults + children;
  const totalAmount = adults * ADULT_PRICE + children * CHILD_PRICE;

  useEffect(() => {
    if (params.id) {
      fetchPackage();
    }
  }, [params.id]);

  const fetchPackage = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.id}`);
      const data = await response.json();
      setPkg(data.ticket);
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
      ticketId: pkg?._id,
      travelDate,
      adults,
      children,
      totalPassengers,
      adultTotal: adults * ADULT_PRICE,
      childTotal: children * CHILD_PRICE,
      totalAmount,
    };

    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    router.push("/checkout");
  };

  const minDate = new Date().toISOString().split("T")[0];

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

  if (!pkg) {
    return (
      <div className="bg-[#F1F1F1] py-8 min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="mb-4 font-bold text-[#1E1E1E] text-2xl">
            Package not found
          </h1>
          <Link href="/packages" className="text-[#0077B6] hover:underline">
            Back to packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F1F1F1] py-8 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/packages"
          className="inline-flex items-center space-x-2 mb-6 text-[#0077B6] hover:text-[#005a8b]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Packages</span>
        </Link>

        {/* Package Image */}
        <div className="relative mb-8 rounded-xl h-64 md:h-96 overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-end bg-black bg-opacity-30">
            <div className="p-6 text-white">
              <h1 className="mb-2 font-bold text-3xl md:text-4xl">
                {pkg.title}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <MapPin className="mr-1 w-5 h-5" />
                  <span>{pkg.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 w-5 h-5" />
                  <span>{pkg.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* Package Details */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg mb-6 p-6 rounded-xl">
              <h2 className="mb-4 font-bold text-[#1E1E1E] text-2xl">
                About This Package
              </h2>
              <p className="mb-6 text-[#6C757D]">{pkg.description}</p>

              <h3 className="mb-4 font-bold text-[#1E1E1E] text-xl">
                What&apos;s Included
              </h3>
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-[#6C757D]">
                    <Star className="mr-2 w-4 h-4 text-[#38B000]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking Form */}
          {/* <div className="lg:col-span-1">
            <div className="top-8 sticky bg-white shadow-lg p-6 rounded-xl">
              <div className="mb-6 text-center">
                <div className="font-bold text-[#0077B6] text-3xl">
                  ${pkg.price}
                  <span className="font-normal text-[#6C757D] text-lg">/person</span>
                </div>
                <p className="text-[#6C757D] text-sm">
                  {pkg.availability} spots available
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium text-[#1E1E1E] text-sm">
                    Travel Date
                  </label>
                  <div className="relative">
                    <Calendar className="top-1/2 left-3 absolute w-5 h-5 text-[#6C757D] -translate-y-1/2 transform" />
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      min={minDate}
                      className="py-3 pr-4 pl-10 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#0077B6] focus:ring-2 w-full text-[#1E1E1E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-[#1E1E1E] text-sm">
                    Number of Passengers
                  </label>
                  <div className="relative">
                    <Users className="top-1/2 left-3 absolute w-5 h-5 text-[#6C757D] -translate-y-1/2 transform" />
                    <select
                      value={numberOfPassengers}
                      onChange={(e) => setNumberOfPassengers(parseInt(e.target.value))}
                      className="py-3 pr-4 pl-10 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#0077B6] focus:ring-2 w-full text-[#1E1E1E] appearance-none"
                    >
                      {[...Array(Math.min(10, pkg.availability))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'Passenger' : 'Passengers'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-[#1E1E1E]">Total Amount:</span>
                    <span className="font-bold text-[#0077B6] text-2xl">
                      ${pkg.price * numberOfPassengers}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleBooking}
                    className="bg-[#0077B6] hover:bg-[#005a8b] py-3 rounded-lg w-full font-semibold text-white transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div> */}
          <div className="bg-[#F1F1F1] min-h-screen">
            <div className="mx-auto">
              {/* Booking Box */}
              <div className="lg:col-span-1">
                <div className="top-8 sticky bg-white shadow-lg p-6 rounded-xl">
                  <div className="mb-6 text-center">
                    <div className="font-bold text-[#0077B6] text-3xl">
                      ${pkg.price}
                      <span className="font-normal text-[#6C757D] text-lg">
                        /person
                      </span>
                    </div>
                    <p className="text-[#6C757D] text-sm">
                      {pkg.availability} spots available
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
                          selected={travelDate ? new Date(travelDate) : null}
                          onChange={(date) =>
                            setTravelDate(
                              date?.toISOString().split("T")[0] || ""
                            )
                          }
                          minDate={new Date()}
                          placeholderText="Select a date"
                          dateFormat="dd MMM yyyy"
                          className="bg-white shadow-sm py-3 pr-4 pl-10 border border-gray-300 hover:border-[#0077B6] rounded-lg focus:outline-none focus:ring-[#0077B6] focus:ring-2 w-full text-[#1E1E1E] transition-all duration-200 ease-in-out"
                          popperPlacement="bottom-start"
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
                        disabled={totalPassengers === 0}
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
