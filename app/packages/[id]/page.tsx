'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Clock, Users, Star, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
  const params = useParams();
  const router = useRouter();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [travelDate, setTravelDate] = useState('');
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);

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
      console.error('Error fetching package:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!travelDate) {
      alert('Please select a travel date');
      return;
    }
    
    const bookingData = {
      ticketId: pkg?._id,
      travelDate,
      numberOfPassengers,
      totalAmount: (pkg?.price || 0) * numberOfPassengers,
    };
    
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    router.push('/checkout');
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

  if (!pkg) {
    return (
      <div className="bg-[#F1F1F1] py-8 min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="mb-4 font-bold text-[#1E1E1E] text-2xl">Package not found</h1>
          <Link href="/packages" className="text-[#0077B6] hover:underline">
            Back to packages
          </Link>
        </div>
      </div>
    );
  }

  const minDate = new Date().toISOString().split('T')[0];

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
              <h1 className="mb-2 font-bold text-3xl md:text-4xl">{pkg.title}</h1>
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
              <h2 className="mb-4 font-bold text-[#1E1E1E] text-2xl">About This Package</h2>
              <p className="mb-6 text-[#6C757D]">{pkg.description}</p>
              
              <h3 className="mb-4 font-bold text-[#1E1E1E] text-xl">What&apos;s Included</h3>
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
          <div className="lg:col-span-1">
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
          </div>
        </div>
      </div>
    </div>
  );
}