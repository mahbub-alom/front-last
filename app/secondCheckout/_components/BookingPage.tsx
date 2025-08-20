"use client";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BookingData {
  ticketId: string;
  travelDate: Date;
  adults: number;
  children: number;
  numberOfPassengers: number;
  adultTotal: string;
  childTotal: string;
  totalAmount: string;
}

interface PassengerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export const BookingPage = (): JSX.Element => {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [ticketDetails, setTicketDetails] = useState<any>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
  });
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  
  const [errors, setErrors] = useState<{
    passenger?: Partial<PassengerInfo>;
    payment?: Partial<PaymentInfo>;
  }>({});

  useEffect(() => {
    const data = localStorage.getItem("bookingData");
    if (!data) {
      toast.error("No booking data found. Please select tickets first.");
      router.push("/tickets");
      return;
    }
    
    const parsedData = JSON.parse(data);
    setBookingData({
      ...parsedData,
      travelDate: new Date(parsedData.travelDate)
    });
    
    fetchTicketDetails(parsedData.ticketId);
  }, []);

  const fetchTicketDetails = async (ticketId: string) => {
    try {
      // In a real app, you would fetch from your API
      // const response = await fetch(`/api/tickets/${ticketId}`);
      // const data = await response.json();
      
      // For demo purposes, we'll use mock data
      const mockTicket = {
        _id: ticketId,
        title: "Essential Paris Tour",
        image: "/paris-bus.jpg",
        durationBadge: "2 Days",
        adultPrice: "€39.00",
        childPrice: "€29.00",
        features: [
          "Hop-on, hop-off bus tour\nUnlimited rides for 2 days",
          "Free walking tours\nGuided tours of Paris landmarks",
          "Audio guide in 11 languages\nLearn about Paris history",
          "Free app with offline maps\nNavigate the city easily"
        ]
      };
      
      setTicketDetails(mockTicket);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      toast.error("Failed to load ticket details");
      setLoading(false);
    }
  };

  const validatePassengerInfo = () => {
    const newErrors: Partial<PassengerInfo> = {};
    
    if (!passengerInfo.firstName) newErrors.firstName = "First name is required";
    if (!passengerInfo.lastName) newErrors.lastName = "Last name is required";
    if (!passengerInfo.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(passengerInfo.email)) newErrors.email = "Email is invalid";
    if (!passengerInfo.phone) newErrors.phone = "Phone number is required";
    if (!passengerInfo.country) newErrors.country = "Country is required";
    
    setErrors({ ...errors, passenger: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentInfo = () => {
    const newErrors: Partial<PaymentInfo> = {};
    
    if (!paymentInfo.cardNumber) newErrors.cardNumber = "Card number is required";
    else if (paymentInfo.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = "Card number must be 16 digits";
    
    if (!paymentInfo.expiryDate) newErrors.expiryDate = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) newErrors.expiryDate = "Use MM/YY format";
    
    if (!paymentInfo.cvv) newErrors.cvv = "CVV is required";
    else if (paymentInfo.cvv.length !== 3 && paymentInfo.cvv.length !== 4) newErrors.cvv = "CVV must be 3 or 4 digits";
    
    if (!paymentInfo.cardholderName) newErrors.cardholderName = "Cardholder name is required";
    
    setErrors({ ...errors, payment: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (activeStep === 1 && validatePassengerInfo()) {
      setActiveStep(2);
    } else if (activeStep === 2 && validatePaymentInfo()) {
      handlePayment();
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setActiveStep(3);
      
      // Clear booking data from localStorage after successful payment
      localStorage.removeItem("bookingData");
      
      toast.success("Booking confirmed! Your e-tickets have been sent to your email.");
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    return value;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] min-h-screen">
        <div className="border-[#134B42] border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (!bookingData || !ticketDetails) {
    return (
      <div className="flex flex-col justify-center items-center bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] p-4 min-h-screen">
        <AlertCircle className="mb-4 w-16 h-16 text-red-500" />
        <h2 className="mb-2 font-bold text-[#134B42] text-2xl">Booking Not Found</h2>
        <p className="mb-6 text-gray-600 text-center">We couldn&apos;t find your booking information. Please select tickets again.</p>
        <Button 
          onClick={() => router.push("/tickets")}
          className="bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42]"
        >
          Select Tickets
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] pb-16 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#134B42] to-[#1a6b5f] py-6 text-white">
        <div className="flex items-center mx-auto px-4 container">
          <Button 
            variant="ghost" 
            className="hover:bg-white/10 mr-4 text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back
          </Button>
          <h1 className="font-bold text-2xl">Checkout</h1>
        </div>
      </header>

      <div className="mx-auto mt-8 px-4 container">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center w-full max-w-md">
            <div className={`flex flex-col items-center ${activeStep >= 1 ? 'text-[#134B42]' : 'text-gray-400'}`}>
              <div className={`flex justify-center items-center rounded-full w-10 h-10 ${activeStep >= 1 ? 'bg-[#134B42] text-white' : 'bg-gray-200'}`}>
                {activeStep > 1 ? <CheckCircle className="w-6 h-6" /> : '1'}
              </div>
              <span className="mt-2 font-medium text-sm">Details</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? 'bg-[#134B42]' : 'bg-gray-200'}`}></div>
            
            <div className={`flex flex-col items-center ${activeStep >= 2 ? 'text-[#134B42]' : 'text-gray-400'}`}>
              <div className={`flex justify-center items-center rounded-full w-10 h-10 ${activeStep >= 2 ? 'bg-[#134B42] text-white' : 'bg-gray-200'}`}>
                {activeStep > 2 ? <CheckCircle className="w-6 h-6" /> : '2'}
              </div>
              <span className="mt-2 font-medium text-sm">Payment</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? 'bg-[#134B42]' : 'bg-gray-200'}`}></div>
            
            <div className={`flex flex-col items-center ${activeStep >= 3 ? 'text-[#134B42]' : 'text-gray-400'}`}>
              <div className={`flex justify-center items-center rounded-full w-10 h-10 ${activeStep >= 3 ? 'bg-[#134B42] text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="mt-2 font-medium text-sm">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {activeStep === 1 && (
              <Card className="shadow-xl border-0">
                <CardContent className="p-6">
                  <h2 className="flex items-center mb-6 font-bold text-[#134B42] text-xl">
                    <User className="mr-2 w-6 h-6" />
                    Passenger Information
                  </h2>
                  
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mb-6">
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">First Name *</label>
                      <input
                        type="text"
                        value={passengerInfo.firstName}
                        onChange={(e) => setPassengerInfo({...passengerInfo, firstName: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#134B42] focus:border-transparent ${errors.passenger?.firstName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="John"
                      />
                      {errors.passenger?.firstName && <p className="mt-1 text-red-500 text-sm">{errors.passenger.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">Last Name *</label>
                      <input
                        type="text"
                        value={passengerInfo.lastName}
                        onChange={(e) => setPassengerInfo({...passengerInfo, lastName: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#134B42] focus:border-transparent ${errors.passenger?.lastName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Doe"
                      />
                      {errors.passenger?.lastName && <p className="mt-1 text-red-500 text-sm">{errors.passenger.lastName}</p>}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block mb-1 font-medium text-gray-700 text-sm">Email Address *</label>
                    <input
                      type="email"
                      value={passengerInfo.email}
                      onChange={(e) => setPassengerInfo({...passengerInfo, email: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#134B42] focus:border-transparent ${errors.passenger?.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="john.doe@example.com"
                    />
                    {errors.passenger?.email && <p className="mt-1 text-red-500 text-sm">{errors.passenger.email}</p>}
                  </div>
                  
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mb-6">
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">Phone Number *</label>
                      <input
                        type="tel"
                        value={passengerInfo.phone}
                        onChange={(e) => setPassengerInfo({...passengerInfo, phone: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#134B42] focus:border-transparent ${errors.passenger?.phone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="+1 234 567 8900"
                      />
                      {errors.passenger?.phone && <p className="mt-1 text-red-500 text-sm">{errors.passenger.phone}</p>}
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">Country *</label>
                      <select
                        value={passengerInfo.country}
                        onChange={(e) => setPassengerInfo({...passengerInfo, country: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#134B42] focus:border-transparent ${errors.passenger?.country ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">Select your country</option>
                        <option value="FR">France</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="DE">Germany</option>
                        <option value="ES">Spain</option>
                        <option value="IT">Italy</option>
                        <option value="OTHER">Other</option>
                      </select>
                      {errors.passenger?.country && <p className="mt-1 text-red-500 text-sm">{errors.passenger.country}</p>}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] py-6 w-full font-bold text-lg"
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {activeStep === 2 && (
              <Card className="shadow-xl border-0">
                <CardContent className="p-6">
                  <h2 className="flex items-center mb-6 font-bold text-[#134B42] text-xl">
                    <CreditCard className="mr-2 w-6 h-6" />
                    Payment Information
                  </h2>
                  
                  <div className="mb-6">
                    <label className="block mb-1 font-medium text-gray-700 text-sm">Cardholder Name *</label>
                    <input
                      type="text"
                      value={paymentInfo.cardholderName}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#134B42] focus:border-transparent ${errors.payment?.cardholderName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="John Doe"
                    />
                    {errors.payment?.cardholderName && <p className="mt-1 text-red-500 text-sm">{errors.payment.cardholderName}</p>}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block mb-1 font-medium text-gray-700 text-sm">Card Number *</label>
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: formatCardNumber(e.target.value)})}
                      maxLength={19}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#134B42] focus:border-transparent ${errors.payment?.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.payment?.cardNumber && <p className="mt-1 text-red-500 text-sm">{errors.payment.cardNumber}</p>}
                  </div>
                  
                  <div className="gap-4 grid grid-cols-2 mb-6">
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">Expiry Date *</label>
                      <input
                        type="text"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: formatExpiryDate(e.target.value)})}
                        maxLength={5}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#134B42] focus:border-transparent ${errors.payment?.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="MM/YY"
                      />
                      {errors.payment?.expiryDate && <p className="mt-1 text-red-500 text-sm">{errors.payment.expiryDate}</p>}
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">CVV *</label>
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value.replace(/\D/g, '')})}
                        maxLength={4}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#134B42] focus:border-transparent ${errors.payment?.cvv ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="123"
                      />
                      {errors.payment?.cvv && <p className="mt-1 text-red-500 text-sm">{errors.payment.cvv}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-[#E6F7F5] mb-6 p-3 rounded-md">
                    <Lock className="flex-shrink-0 mr-2 w-5 h-5 text-[#4CA1AF]" />
                    <p className="text-gray-700 text-sm">Your payment information is encrypted and secure.</p>
                  </div>
                  
                  <Button 
                    onClick={handleNextStep}
                    disabled={processing}
                    className="bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] disabled:opacity-50 py-6 w-full font-bold text-lg"
                  >
                    {processing ? (
                      <div className="flex items-center">
                        <div className="mr-2 border-white border-t-2 border-b-2 rounded-full w-5 h-5 animate-spin"></div>
                        Processing Payment...
                      </div>
                    ) : (
                      `Pay €${bookingData.totalAmount}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {activeStep === 3 && (
              <Card className="shadow-xl border-0">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="mx-auto mb-4 w-16 h-16 text-green-500" />
                  <h2 className="mb-2 font-bold text-[#134B42] text-2xl">Booking Confirmed!</h2>
                  <p className="mb-6 text-gray-600">Your Paris tour has been successfully booked. Your e-tickets have been sent to your email.</p>
                  
                  <div className="bg-[#E6F7F5] mb-6 p-4 rounded-lg text-left">
                    <h3 className="mb-2 font-bold text-[#134B42]">Booking Reference: PARIS-{Math.random().toString(36).substr(2, 8).toUpperCase()}</h3>
                    <p className="text-sm">Please save this reference number for your records.</p>
                  </div>
                  
                  <Button 
                    onClick={() => router.push("/")}
                    className="bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] mb-4 py-6 w-full font-bold text-lg"
                  >
                    Back to Home
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => window.print()}
                    className="hover:bg-[#134B42]/10 py-6 border-[#134B42] w-full text-[#134B42]"
                  >
                    Print Booking Details
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="top-6 sticky shadow-xl border-0">
              <CardContent className="p-6">
                <h2 className="mb-6 font-bold text-[#134B42] text-xl">Order Summary</h2>
                
                <div className="flex items-start mb-6">
                  <div className="relative mr-4 rounded-lg w-20 h-20 overflow-hidden">
                    <Image
                      src={bookingData?.image}
                      alt={bookingData?.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#134B42]">{bookingData?.title}</h3>
                    <p className="text-gray-600 text-sm">{bookingData?.durationBadge}</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="mr-1 w-4 h-4 text-[#4CA1AF]" />
                      <span className="text-gray-600 text-sm">
                        {format(bookingData.travelDate, "MMMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6 pt-4 border-gray-200 border-t">
                  <h3 className="mb-2 font-bold text-[#134B42]">Passengers</h3>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600">Adults × {bookingData.adults}</span>
                    <span className="font-medium">€{bookingData.adultTotal}</span>
                  </div>
                  {bookingData.children > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Children × {bookingData.children}</span>
                      <span className="font-medium">€{bookingData.childTotal}</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-6 pt-4 border-gray-200 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">€{bookingData.totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">€0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-gray-200 border-t font-bold text-[#134B42] text-lg">
                    <span>Total</span>
                    <span>€{bookingData.totalAmount}</span>
                  </div>
                </div>
                
                <div className="bg-[#F8F9FA] p-4 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="flex-shrink-0 mr-2 w-5 h-5 text-[#4CA1AF]" />
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium text-[#134B42]">Free cancellation</span> up to 24 hours before your tour date for a full refund.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};