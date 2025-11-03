'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Mail, Home } from 'lucide-react';
import Link from 'next/link';

interface Booking {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  travelDate: string;
  numberOfPassengers: number;
  totalAmount: number;
  paymentId: string;
  ticketId: {
    title: string;
    location: string;
    duration: string;
  };
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

      const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      const data = await response.json();
      setBooking(data.booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };



    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);



  if (loading) {
    return (
      <div className="bg-[#F1F1F1] py-8 min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-[#F1F1F1] py-8 min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <h1 className="mb-4 font-bold text-[#1E1E1E] text-2xl">Booking not found</h1>
          <Link href="/" className="text-[#0077B6] hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F1F1F1] py-8 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-[#38B000] p-6 text-white text-center">
            <CheckCircle className="mx-auto mb-4 w-16 h-16" />
            <h1 className="mb-2 font-bold text-2xl">Booking Confirmed!</h1>
            <p className="opacity-90">Your travel package has been successfully booked</p>
          </div>

          {/* Booking Details */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="mb-4 font-bold text-[#1E1E1E] text-xl">Booking Details</h2>
              <div className="space-y-3 bg-[#F1F1F1] p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Booking ID:</span>
                  <span className="font-mono font-semibold text-[#1E1E1E]">
                    {booking.bookingId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Payment ID:</span>
                  <span className="font-mono text-[#1E1E1E]">
                    {booking.paymentId}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 font-bold text-[#1E1E1E] text-lg">Trip Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Package:</span>
                  <span className="font-medium text-[#1E1E1E]">
                    {booking.ticketId.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Location:</span>
                  <span className="font-medium text-[#1E1E1E]">
                    {booking.ticketId.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Duration:</span>
                  <span className="font-medium text-[#1E1E1E]">
                    {booking.ticketId.duration}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Travel Date:</span>
                  <span className="font-medium text-[#1E1E1E]">
                    {new Date(booking.travelDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Passengers:</span>
                  <span className="font-medium text-[#1E1E1E]">
                    {booking.numberOfPassengers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Total Paid:</span>
                  <span className="font-bold text-[#0077B6] text-lg">
                    ${booking.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 font-bold text-[#1E1E1E] text-lg">Customer Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Name:</span>
                  <span className="font-medium text-[#1E1E1E]">
                    {booking.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Email:</span>
                  <span className="font-medium text-[#1E1E1E]">
                    {booking.customerEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Email Confirmation Notice */}
            <div className="bg-[#0077B6] bg-opacity-10 mb-6 p-4 border border-[#0077B6] rounded-lg">
              <div className="flex items-start space-x-3">
                <Mail className="mt-0.5 w-5 h-5 text-[#0077B6]" />
                <div>
                  <h4 className="mb-1 font-semibold text-[#0077B6]">
                    Confirmation Email Sent
                  </h4>
                  <p className="text-[#6C757D] text-sm">
                    We&apos;ve sent a confirmation email with your e-ticket PDF to{' '}
                    <strong>{booking.customerEmail}</strong>. Please check your inbox and show the e-ticket during your travel.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex sm:flex-row flex-col gap-4">
              <Link
                href="/"
                className="flex flex-1 justify-center items-center space-x-2 bg-[#0077B6] hover:bg-[#005a8b] px-6 py-3 rounded-lg font-semibold text-white text-center transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <Link
                href="/packages"
                className="flex-1 hover:bg-[#0077B6] px-6 py-3 border-[#0077B6] border-2 rounded-lg font-semibold text-[#0077B6] hover:text-white text-center transition-colors"
              >
                Book Another Trip
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}