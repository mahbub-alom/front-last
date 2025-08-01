"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Shield,
  Plane,
  ArrowLeft,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Mock package data
const packageData = {
  1: {
    id: 1,
    title: "Tropical Paradise Getaway",
    location: "Maldives",
    duration: "7 days",
    price: 1299,
    imageUrl:
      "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
};

interface BookingData {
  ticketId: string;
  travelDate: string;
  numberOfPassengers: number;
  totalAmount: number;
  packageId: number;
  adults: number;
  adultTotal: number;
  children: number;
  childTotal: number;
}

export default function BookingPage() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const packageId = parseInt(bookingData?.packageId as string);
  const pkg = packageData[packageId as keyof typeof packageData];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passengers: 1,
    specialRequests: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("bookingData");
    if (data) {
      setBookingData(JSON.parse(data));
      setLoading(false);
    } else {
      router.push("/packages");
    }
  }, [router]);

console.log(bookingData)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate passenger info
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone
      ) {
        toast.error("Please fill in all required fields");

        return;
      }
    }
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handlePayment = async (event: React.FormEvent) => {
    if (!stripe || !elements || !bookingData) return;

    setIsProcessing(true);
    setError("");

    try {
      // 1. Create booking in backend
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // ticketId: bookingData.ticketId,
          ...bookingData,
          customerName: formData.firstName + " " + formData.lastName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          // travelDate: bookingData.travelDate,
          // totalPassengers: bookingData.totalPassengers,
          // totalAmount: bookingData.totalAmount,
          // adults: bookingData.adults,
          // adultTotal: bookingData.adultTotal,
          // children: bookingData.children,
          // childTotal: bookingData.childTotal,
        }),
      });

      const { booking } = await bookingRes.json();

      if (!bookingRes.ok) {
        const errData = await bookingRes.json();
        console.error("Booking API Error:", errData);
        toast.error(errData.error || "Failed to create booking");
        return;
      }

      // 2. Create PaymentIntent
      const paymentRes = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: bookingData.totalAmount,
          bookingId: booking.bookingId,
        }),
      });

      const { clientSecret } = await paymentRes.json();

      // 3. Confirm card payment
      const cardElement = elements.getElement(CardElement);

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement!,
            billing_details: {
              name: formData.firstName + " " + formData.lastName,
              email: formData.email,
              phone: formData.phone,
            },
          },
        });

      if (stripeError) {
        toast.error(stripeError.message || "Payment failed");
        return;
      }

      // 4. Confirm payment in backend
      await fetch("/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          paymentId: paymentIntent.id,
        }),
      });

      localStorage.removeItem("bookingData");
      setStep(4); // Show confirmation step
    } catch (err) {
      toast.error("Payment error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPrice = bookingData?.totalAmount;

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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("E-Ticket Confirmation", 20, 20);

    doc.setFontSize(12);
    doc.text(
      `Booking Reference: TLX-${Date.now().toString().slice(-6)}`,
      20,
      40
    );
    doc.text(`Name: ${formData.firstName} ${formData.lastName}`, 20, 50);
    doc.text(`Email: ${formData.email}`, 20, 60);
    doc.text(`Phone: ${formData.phone}`, 20, 70);
    doc.text(`Package: ${pkg.title}`, 20, 80);
    doc.text(`Location: ${pkg.location}`, 20, 90);
    doc.text(
      `Departure Date: ${new Date(bookingData?.travelDate).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )}`,
      20,
      100
    );
    doc.text(`Total Paid: $${bookingData?.totalAmount}`, 20, 110);

    doc.save("e-ticket.pdf");
  };

  const parseCustomDate = (dateStr: string): Date | null => {
    const [day, month, year] = dateStr.split("-").map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation */}
      <nav className="top-0 z-50 sticky bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-end items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href={`/firstPackage/${packageId}`}
                className="flex items-center text-gray-700 hover:text-sky-500 transition-colors"
              >
                <ArrowLeft className="mr-1 w-4 h-4" />
                Back to Package
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step >= stepNum
                      ? "bg-sky-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNum ? <Check className="w-5 h-5" /> : stepNum}
                </div>
                {stepNum < 4 && (
                  <div
                    className={`w-20 h-1 mx-2 ${
                      step > stepNum ? "bg-sky-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-gray-600 text-sm">
            <span>Details</span>
            <span>Review</span>
            <span>Payment</span>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="gap-8 grid lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Passenger Information</CardTitle>
                  <CardDescription>
                    Please provide details for all passengers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="gap-4 grid md:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="gap-4 grid md:grid-cols-2">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialRequests">
                      Special Requests (Optional)
                    </Label>
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Dietary restrictions, accessibility needs, etc."
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleNextStep}
                    className="bg-sky-500 hover:bg-sky-600 w-full"
                  >
                    Continue to Review
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Booking</CardTitle>
                  <CardDescription>
                    Please verify all details before proceeding to payment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="mb-2 font-semibold">Passenger Details</h3>
                    <p>
                      <strong>Name:</strong> {formData.firstName}{" "}
                      {formData.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {formData.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {formData.phone}
                    </p>

                    {formData.specialRequests && (
                      <p>
                        <strong>Special Requests:</strong>{" "}
                        {formData.specialRequests}
                      </p>
                    )}
                  </div>

                  <div className="bg-sky-50 p-4 rounded-lg">
                    <h3 className="mb-2 font-semibold">Trip Details</h3>
                    <p>
                      <strong>Package:</strong> {pkg.title}
                    </p>

                    <p>
                      <strong>Departure Date:</strong>{" "}
                      <span className="font-medium">
                        {bookingData?.travelDate
                          ? parseCustomDate(
                              bookingData.travelDate
                            )?.toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </span>
                      {/* {new Date(bookingData?.travelDate).toLocaleDateString()} */}
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="flex-1 bg-sky-500 hover:bg-sky-600"
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 w-5 h-5" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>
                    Your payment is secure and encrypted
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardElement">Card Details *</Label>
                    <div className="bg-white p-4 border rounded-md">
                      <CardElement
                        id="cardElement"
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#1E1E1E",
                              "::placeholder": { color: "#6C757D" },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>
                      Your payment information is secure and encrypted
                    </span>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1 bg-sky-500 hover:bg-sky-600"
                    >
                      {isProcessing ? "Processing..." : `Pay $${totalPrice}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center items-center bg-green-100 mx-auto mb-4 rounded-full w-16 h-16">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <CardTitle className="text-green-600 text-2xl">
                    Booking Confirmed!
                  </CardTitle>
                  <CardDescription>
                    Your tropical adventure is booked
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <p className="mb-2 font-semibold text-lg">
                      Booking Reference
                    </p>
                    <p className="font-bold text-green-600 text-2xl">
                      TLX-{Date.now().toString().slice(-6)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg text-left">
                    <h3 className="mb-3 font-semibold">What&apos;s Next?</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Check className="mr-2 w-4 h-4 text-green-500" />
                        Confirmation email sent to {formData.email}
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 w-4 h-4 text-green-500" />
                        E-tickets and travel documents attached
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 w-4 h-4 text-green-500" />
                        24/7 customer support available
                      </li>
                    </ul>
                  </div>

                  <div className="flex sm:flex-row flex-col gap-4">
                    <Link href="/" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Back to Home
                      </Button>
                    </Link>
                    <Button
                      onClick={handleDownloadPDF}
                      className="flex-1 bg-sky-500 hover:bg-sky-600"
                    >
                      Download E-Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Package Summary */}
          <div className="lg:col-span-1">
            <Card className="top-24 sticky">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-3">
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.title}
                    className="rounded-lg w-16 h-16 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-sm">{pkg.title}</h3>
                    <div className="flex items-center mt-1 text-gray-600 text-xs">
                      <MapPin className="mr-1 w-3 h-3" />
                      {pkg.location}
                    </div>
                    <div className="flex items-center text-gray-600 text-xs">
                      <Calendar className="mr-1 w-3 h-3" />
                      {pkg.duration}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Departure Date:</span>
                    <span className="font-medium">
                      {bookingData?.travelDate
                        ? parseCustomDate(
                            bookingData.travelDate
                          )?.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adult Passengers:</span>
                    <span className="font-medium">{bookingData?.adults}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Children Passengers:</span>
                    <span className="font-medium">{bookingData?.children}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Adult Total ({bookingData?.adults}x €17):</span>
                    <span>${bookingData?.adultTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Children Total ({bookingData?.children}x €8):</span>
                    <span>${bookingData?.childTotal}</span>
                  </div>

                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-sky-500">
                      ${bookingData?.totalAmount}
                    </span>
                  </div>
                </div>

                <div className="text-gray-600 text-xs text-center">
                  <Shield className="inline mr-1 w-3 h-3" />
                  Free cancellation up to 24 hours before departure
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
