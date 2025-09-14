'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ArrowLeft, CreditCard, User, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface BookingData {
  ticketId: string;
  travelDate: string;
  numberOfPassengers: number;
  totalAmount: number;
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      router.push('/packages');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !bookingData) return;
    
    setProcessing(true);
    setError('');

    try {
      // Create booking
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          customerName,
          customerEmail,
          customerPhone,
        }),
      });

      const { booking } = await bookingResponse.json();

      // Create payment intent
      const paymentResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: bookingData.totalAmount,
          bookingId: booking.bookingId,
        }),
      });

      const { clientSecret } = await paymentResponse.json();

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement!,
          billing_details: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        return;
      }

      // Confirm payment on backend
      await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          paymentId: paymentIntent.id,
        }),
      });

      // Clear booking data and redirect
      localStorage.removeItem('bookingData');
      router.push(`/confirmation?bookingId=${booking.bookingId}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!bookingData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#F1F1F1] py-8 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link
          href="/packages"
          className="inline-flex items-center space-x-2 mb-6 text-[#0077B6] hover:text-[#005a8b]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Packages</span>
        </Link>

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
          {/* Customer Information */}
          <div className="bg-white shadow-lg p-6 rounded-xl">
            <h2 className="mb-6 font-bold text-[#1E1E1E] text-2xl">Customer Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-[#1E1E1E] text-sm">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="top-1/2 left-3 absolute w-5 h-5 text-[#6C757D] -translate-y-1/2 transform" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="py-3 pr-4 pl-10 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#0077B6] focus:ring-2 w-full text-[#1E1E1E]"
                    placeholder="Enter your full name "
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-[#1E1E1E] text-sm">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="top-1/2 left-3 absolute w-5 h-5 text-[#6C757D] -translate-y-1/2 transform" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="py-3 pr-4 pl-10 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#0077B6] focus:ring-2 w-full text-[#1E1E1E]"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-[#1E1E1E] text-sm">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="top-1/2 left-3 absolute w-5 h-5 text-[#6C757D] -translate-y-1/2 transform" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="py-3 pr-4 pl-10 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#0077B6] focus:ring-2 w-full text-[#1E1E1E]"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-[#1E1E1E] text-sm">
                  Payment Information *
                </label>
                <div className="p-4 border border-gray-300 rounded-lg">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#1E1E1E',
                          '::placeholder': {
                            color: '#6C757D',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-[#D00000] bg-opacity-10 px-4 py-3 border border-[#D00000] rounded-lg text-[#D00000]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!stripe || processing}
                className="flex justify-center items-center space-x-2 bg-[#0077B6] hover:bg-[#005a8b] disabled:opacity-50 py-3 rounded-lg w-full font-semibold text-white transition-colors disabled:cursor-not-allowed"
              >
                <CreditCard className="w-5 h-5" />
                <span>
                  {processing ? 'Processing...' : `Pay $${bookingData.totalAmount}`}
                </span>
              </button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="bg-white shadow-lg p-6 rounded-xl">
            <h2 className="mb-6 font-bold text-[#1E1E1E] text-2xl">Booking Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[#6C757D]">Travel Date:</span>
                <span className="font-medium text-[#1E1E1E]">
                  {new Date(bookingData.travelDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-[#6C757D]">Passengers:</span>
                <span className="font-medium text-[#1E1E1E]">
                  {bookingData.numberOfPassengers}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-[#6C757D]">Price per person:</span>
                <span className="font-medium text-[#1E1E1E]">
                  ${bookingData.totalAmount / bookingData.numberOfPassengers}
                </span>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1E1E1E] text-xl">Total:</span>
                  <span className="font-bold text-[#0077B6] text-2xl">
                    ${bookingData.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#F1F1F1] mt-6 p-4 rounded-lg">
              <h3 className="mb-2 font-semibold text-[#1E1E1E]">Secure Payment</h3>
              <p className="text-[#6C757D] text-sm">
                Your payment information is encrypted and secure. You will receive a confirmation email with your e-ticket after successful payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}