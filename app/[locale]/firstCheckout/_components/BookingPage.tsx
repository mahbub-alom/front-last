"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  CreditCard,
  Shield,
  ArrowLeft,
  Check,
  ArrowRight,
  Compass,
  Phone,
  Mail,
  MessageCircle,
  User,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

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
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [cardError, setCardError] = useState("");

  const locale = useLocale();

  const [pkg, setPkg] = useState<Package | null>(null);
  const t = useTranslations("firstpackage");

  useEffect(() => {
    if (bookingData?.ticketId) {
      fetchPackage();
    }
  }, [bookingData?.ticketId]);

  // console.log("bookingData from booking page:", bookingData?.totalAmount);

  const fetchPackage = async () => {
    if (!bookingData?.ticketId) return;

    try {
      const response = await fetch(`/api/tickets/${bookingData.ticketId}`);
      const data = await response.json();
      setPkg(data.data);
    } catch (error) {
      console.error("Error fetching package:", error);
    } finally {
      setLoading(false);
    }
  };

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
      router.push("/");
    }
  }, [router]);

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
    doc.text(`Total Paid: €${bookingData?.totalAmount}`, 20, 110);

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
      {/* <nav className="top-0 z-50 sticky bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-end items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href={`/firstPackage/${bookingData?.ticketId}`}
                className="flex items-center text-gray-700 hover:text-sky-500 transition-colors"
              >
                <ArrowLeft className="mr-1 w-4 h-4" />
                Back to Package
              </Link>
            </div>
          </div>
        </div>
      </nav> */}
      <header className="bg-gradient-to-r from-[#134B42] to-[#1a6b5f] py-6 text-white">
        <div className="flex justify-between items-center mx-auto px-4 container">
          <Button
            variant="ghost"
            className="hover:bg-white/10 mr-4 text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            {t("back-to-package")}
          </Button>
          <p className="font-bold">{t("checkout")}</p>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step >= stepNum
                      ? "bg-[#740e27] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNum ? <Check className="w-5 h-5" /> : stepNum}
                </div>
                {stepNum < 4 && (
                  <div
                    className={`w-20 h-1 mx-2 ${
                      step > stepNum ? "bg-[#134B42]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-gray-600 text-sm">
            <span>{t("details")}</span>
            <span>{t("review")}</span>
            <span>{t("payment")}</span>
            <span>{t("confirmation")}</span>
          </div>
        </div>

        <div className="gap-8 grid lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("passenger-info")}</CardTitle>
                  <CardDescription>{t("passenger-info-desc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="gap-4 grid md:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">{t("first-name")}</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Jean"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t("last-name")}</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Pierre"
                        required
                      />
                    </div>
                  </div>

                  <div className="gap-4 grid md:grid-cols-2">
                    <div>
                      <Label htmlFor="email">{t("email")}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="jean@gmail.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+33 6 12 34 56 78"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialRequests">
                      {t("special-requests")}
                    </Label>
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder={t("special-requests-placeholder")}
                      rows={3}
                    />
                  </div>
                  {/* <Button
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] shadow-md hover:shadow-lg py-6 rounded-lg w-full font-bold text-white text-lg transition-all"
                  >
                    Continue to Review
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button> */}

                  <Button
                    onClick={handleNextStep}
                    className={`group relative flex justify-center items-center 
                        bg-gradient-to-r from-amber-500 hover:from-amber-400 to-pink-600 hover:to-pink-500 
                        shadow-lg hover:shadow-xl py-4 rounded-2xl w-full overflow-hidden font-medium text-white 
                        transition-all duration-500`}
                  >
                    {/* Gradient Overlay */}
                    <div className="-z-10 absolute inset-0 bg-gradient-to-r from-amber-400 to-violet-500 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-500"></div>

                    {/* Moving dots */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="top-2 left-4 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:translate-x-20 duration-1000"></div>
                      <div className="top-4 right-6 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:-translate-x-20 duration-700"></div>
                    </div>

                    <span className="z-10 relative flex justify-center items-center text-sm tracking-wide">
                      {t("continue-to-review")}
                      <ArrowRight className="ml-3 w-4 h-4 group-hover:scale-110 transition-transform group-hover:translate-x-2 duration-300" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card className="relative bg-white shadow-2xl border-0 overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="top-0 right-0 absolute bg-gradient-to-br from-amber-50 to-rose-50 opacity-60 rounded-full w-32 h-32 -translate-y-16 translate-x-16"></div>
                <div className="bottom-0 left-0 absolute bg-gradient-to-tr from-violet-50 to-cyan-50 opacity-60 rounded-full w-24 h-24 -translate-x-12 translate-y-12"></div>

                <CardHeader className="relative pb-6 border-slate-100 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="flex justify-center items-center bg-gradient-to-br from-amber-400 to-rose-500 shadow-lg rounded-xl w-10 h-10">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="font-bold text-slate-800 text-2xl">
                        {t("review_booking")}
                      </CardTitle>
                      <CardDescription className="font-medium text-slate-500">
                        {t("verify_details")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-8 p-6">
                  {/* Passenger Details - Modern Glass Card */}
                  <div className="bg-gradient-to-br from-white to-slate-50/80 shadow-lg backdrop-blur-sm p-1 border border-slate-200/60 rounded-2xl">
                    <div className="bg-white/70 p-5 rounded-xl">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="flex items-center font-bold text-slate-800 text-lg">
                          <div className="flex justify-center items-center bg-gradient-to-r from-amber-400 to-amber-500 mr-3 rounded-md w-6 h-6">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          {t("passenger_details")}
                        </h3>
                        <div className="bg-emerald-400 rounded-full w-2 h-2 animate-pulse"></div>
                      </div>

                      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 text-slate-700">
                        <div className="space-y-3">
                          <div className="flex items-center bg-amber-50/50 p-3 border border-amber-100 rounded-lg">
                            <User className="mr-3 w-4 h-4 text-amber-500" />
                            <div>
                              <p className="text-slate-500 text-sm">
                                {t("name")}
                              </p>
                              <p className="font-semibold text-slate-800">
                                {formData.firstName} {formData.lastName}
                              </p>
                            </div>
                          </div>

                          {formData.specialRequests && (
                            <div className="flex items-start bg-violet-50/50 p-3 border border-violet-100 rounded-lg">
                              <MessageCircle className="mt-1 mr-3 w-4 h-4 text-violet-500" />
                              <div>
                                <p className="text-slate-500 text-sm">
                                  Special Requests
                                </p>
                                <p className="font-semibold text-slate-800">
                                  {formData.specialRequests}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center bg-rose-50/50 p-3 border border-rose-100 rounded-lg">
                            <Mail className="mr-3 w-4 h-4 text-rose-500" />
                            <div>
                              <p className="text-slate-500 text-sm">
                                {t("emails")}
                              </p>
                              <p className="font-semibold text-slate-800">
                                {formData.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center bg-cyan-50/50 p-3 border border-cyan-100 rounded-lg">
                            <Phone className="mr-3 w-4 h-4 text-cyan-500" />
                            <div>
                              <p className="text-slate-500 text-sm">
                                {t("phonee")}
                              </p>
                              <p className="font-semibold text-slate-800">
                                {formData.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details - Modern Glass Card */}
                  <div className="bg-gradient-to-br from-white to-slate-50/80 shadow-lg backdrop-blur-sm p-1 border border-slate-200/60 rounded-2xl">
                    <div className="bg-white/70 p-5 rounded-xl">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="flex items-center font-bold text-slate-800 text-lg">
                          <div className="flex justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-500 mr-3 rounded-md w-6 h-6">
                            <MapPin className="w-3 h-3 text-white" />
                          </div>
                          {t("trip_details")}
                        </h3>
                        <div className="bg-blue-400 rounded-full w-2 h-2 animate-pulse"></div>
                      </div>

                      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        <div className="flex items-center bg-blue-50/50 p-3 border border-blue-100 rounded-lg">
                          <Compass className="mr-3 w-4 h-4 text-blue-500" />
                          <div>
                            <p className="text-slate-500 text-sm">
                              Seine River
                            </p>
                            <p className="font-semibold text-slate-800">
                              {pkg?.secondPageTitle?.[locale]}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center bg-emerald-50/50 p-3 border border-emerald-100 rounded-lg">
                          <Calendar className="mr-3 w-4 h-4 text-emerald-500" />
                          <div>
                            <p className="text-slate-500 text-sm">
                              {t("travel_date")}
                            </p>
                            <p className="font-semibold text-slate-800">
                              {bookingData?.travelDate
                                ? parseCustomDate(
                                    bookingData.travelDate
                                  )?.toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="flex-1"
                    >
                      {t("back")}
                    </Button>

                    {/* <Button
                      onClick={handleNextStep}
                      className="flex-1 bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] shadow-md hover:shadow-lg py-6 rounded-lg w-full font-bold text-white text-lg transition-all"
                    >
                      Proceed to Payment
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button> */}

                    <Button
                      onClick={handleNextStep}
                      className={`group relative flex-1 justify-center items-center 
                        bg-gradient-to-r from-[#750e27] hover:from-pink-600 to-pink-600 hover:to-[#740e27] 
                        shadow-lg hover:shadow-xl py-4 rounded-2xl w-full overflow-hidden font-medium text-white 
                        transition-all duration-500`}
                    >
                      {/* Gradient Overlay */}
                      <div className="-z-10 absolute inset-0 bg-gradient-to-r from-amber-400 to-violet-500 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-500"></div>

                      {/* Moving dots */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="top-2 left-4 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:translate-x-20 duration-1000"></div>
                        <div className="top-4 right-6 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:-translate-x-20 duration-700"></div>
                      </div>

                      <span className="z-10 relative flex justify-center items-center text-sm tracking-wide">
                        {t("proceed_payment")}
                        <ArrowRight className="ml-3 w-4 h-4 group-hover:scale-110 transition-transform group-hover:translate-x-2 duration-300" />
                      </span>
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
                    {t("payment_information")}
                  </CardTitle>
                  <CardDescription>{t("payment_secure")}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="cardholderName">
                      {t("cardholder_name")} *
                    </Label>
                    <Input
                      id="cardholderName"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      placeholder="Jasuan Smith"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardElement">{t("card_details")} *</Label>
                    <div className="bg-white p-4 border rounded-md">
                      <CardElement
                        id="cardElement"
                        options={{
                          hidePostalCode: true,
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#1E1E1E",
                              "::placeholder": { color: "#6C757D" },
                            },
                          },
                        }}
                        onChange={(event) => {
                          setIsCardComplete(event.complete);
                          setCardError(event.error ? event.error.message : "");
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>{t("payment_info_secure")}</span>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="flex-1"
                    >
                      {t("back")}
                    </Button>

                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing || !isCardComplete}
                      className={`group relative flex-1 justify-center items-center 
                        bg-gradient-to-r from-amber-500 hover:from-amber-400 to-pink-600 hover:to-pink-500 
                        shadow-lg hover:shadow-xl py-4 rounded-2xl w-full overflow-hidden font-medium text-white 
                        transition-all duration-500`}
                    >
                      {/* Gradient Overlay */}
                      <div className="-z-10 absolute inset-0 bg-gradient-to-r from-amber-400 to-violet-500 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-500"></div>

                      {/* Moving dots */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="top-2 left-4 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:translate-x-20 duration-1000"></div>
                        <div className="top-4 right-6 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:-translate-x-20 duration-700"></div>
                      </div>

                      <span className="z-10 relative flex justify-center items-center text-sm tracking-wide">
                        {isProcessing ? "Processing..." : `Pay €${totalPrice}`}
                        <ArrowRight className="ml-3 w-4 h-4 group-hover:scale-110 transition-transform group-hover:translate-x-2 duration-300" />
                      </span>
                    </Button>

                    {/* <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] shadow-md hover:shadow-lg py-6 rounded-lg w-full font-bold text-white text-lg transition-all"
                    >
                      {isProcessing ? "Processing..." : `Pay $${totalPrice}`}
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center items-center bg-green-100 mx-auto mb-4 rounded-full w-16 h-16">
                    <Check className="w-8 h-8 text-[#0a2e28]" />
                  </div>
                  <CardTitle className="text-[#134B42] text-2xl">
                    {t("booking_confirmed")}
                  </CardTitle>
                  <CardDescription>{t("adventure_booked")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <p className="mb-2 font-semibold text-lg">
                      {t("booking_reference")}
                    </p>
                    <p className="font-bold text-green-600 text-2xl">
                      TLX-{Date.now().toString().slice(-6)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg text-left">
                    <h3 className="mb-3 font-semibold">{t("whats_next")}</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Check className="mr-2 w-4 h-4 text-green-500" />
                        {t("confirmation_email")} {formData.email}
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 w-4 h-4 text-green-500" />
                        {"etickets_attached"}
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 w-4 h-4 text-green-500" />
                        {"support_available"}
                      </li>
                    </ul>
                  </div>

                  <div className="flex sm:flex-row flex-col gap-4">
                    <Link href="/" className="flex-1">
                      <Button variant="outline" className="w-full">
                        {t("back_to_home")}
                      </Button>
                    </Link>

                    <Button
                      onClick={handleDownloadPDF}
                      className="flex-1 bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] shadow-md hover:shadow-lg py-6 rounded-lg w-full font-bold text-white text-lg transition-all"
                    >
                      {t("download_eticket")}
                      <ArrowRight className="ml-2 w-5 h-5" />
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
                <CardTitle>{t("booking_summary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  {/* <Image
                    src={pkg?.imageUrl || ""}
                    alt={pkg?.title || ""}
                    fill
                    className="object-cover"
                    sizes="64px"
                    loading="lazy"
                  /> */}
                  <div className="relative w-16 h-16">
                    <Image
                      src={pkg?.imageUrl || null}
                      alt={pkg?.title?.[locale] || "Package Image"}
                      fill
                      className="rounded-md object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm">
                      {pkg?.title?.[locale]}
                    </h3>
                    {/* <div className="flex items-center mt-1 text-gray-600 text-xs">
                      <MapPin className="mr-1 w-3 h-3" />
                      {pkg?.location?.[locale]}
                    </div>
                    <div className="flex items-center text-gray-600 text-xs">
                      <Calendar className="mr-1 w-3 h-3" />
                      {pkg?.duration?.[locale]}
                    </div> */}
                  </div>
                </div>
                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t("travel_date")}:</span>
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
                    <span>{t("adult_passengers")}:</span>
                    <span className="font-medium">{bookingData?.adults}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("children_passengers")}:</span>
                    <span className="font-medium">{bookingData?.children}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>
                      {t("adult_total")} ({bookingData?.adults}x €17):
                    </span>
                    <span>€{bookingData?.adultTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {t("children_total")} ({bookingData?.children}x €8):
                    </span>
                    <span>€{bookingData?.childTotal}</span>
                  </div>

                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{t("total")}:</span>
                    <span className="text-[#134B42]">
                      €{bookingData?.totalAmount}
                    </span>
                  </div>
                </div>

                {/* <div className="text-gray-600 text-xs text-center">
                  <Shield className="inline mr-1 w-3 h-3" />
                  Free cancellation up to 24 hours before departure
                </div> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
