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
  Lock,
  Apple,
} from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

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

// Import Stripe
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { useLocale, useTranslations } from "next-intl";
import { FcGoogle } from "react-icons/fc";
import { SiPaypal } from "react-icons/si";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_your_stripe_publishable_key"
);

interface BookingData {
  ticketId: string;
  travelDate: Date;
  adults: number;
  children: number;
  numberOfPassengers: number;
  adultTotal: string;
  childTotal: string;
  totalAmount: string;
  title?: string;
  durationBadge?: string;
  image?: string;
}

interface PassengerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Payment Processing Component
const PaymentProcessor = ({
  bookingData,
  passengerInfo,
  selectedPaymentMethod,
  onSuccess,
  paymentInfo,
  cardComplete,
  setConfirmedBookingId,
  setConfirmedPaymentId,
}: {
  bookingData: BookingData;
  passengerInfo: PassengerInfo;
  selectedPaymentMethod: string;
  onSuccess: () => void;
  paymentInfo: { cardholderName: string };
  cardComplete: boolean;
  setConfirmedBookingId: (id: string) => void;
  setConfirmedPaymentId: (id: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const t = useTranslations("secondpackage");

  // Load PayPal script
  useEffect(() => {
    if (selectedPaymentMethod === "paypal" && !paypalLoaded) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${
        process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test"
      }&currency=EUR`;
      script.addEventListener("load", () => setPaypalLoaded(true));
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [selectedPaymentMethod, paypalLoaded]);

  // Set up PayPal button
  useEffect(() => {
    if (
      selectedPaymentMethod === "paypal" &&
      paypalLoaded &&
      (window as any).paypal
    ) {
      // Render PayPal button
      (window as any).paypal
        .Buttons({
          createOrder: function (data: any, actions: any) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: bookingData.totalAmount,
                    currency_code: "EUR",
                  },
                  description: bookingData.title || "Paris Tour Booking",
                },
              ],
            });
          },
          onApprove: function (data: any, actions: any) {
            setProcessing(true);
            return actions.order
              .capture()
              .then(function (details: any) {
                // Handle successful payment
                toast.success("PayPal payment successful!");
                onSuccess();
              })
              .catch(function (error: any) {
                console.error("PayPal error:", error);
                toast.error("PayPal payment failed. Please try again.");
                setProcessing(false);
              });
          },
          onError: function (err: any) {
            console.error("PayPal error:", err);
            toast.error("PayPal payment failed. Please try again.");
            setProcessing(false);
          },
        })
        .render("#paypal-button-container");
    }
  }, [selectedPaymentMethod, paypalLoaded, bookingData, onSuccess]);

  // Set up Google Pay and Apple Pay
  useEffect(() => {
    if (!stripe || selectedPaymentMethod === "paypal") return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "eur",
      total: {
        label: `${bookingData.title || "Paris Tour"}`,
        // amount: bookingData.totalAmount,
        amount: Math.round(parseFloat(bookingData.totalAmount) * 100),
        // amount: bookingData.totalAmount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    pr.on("paymentmethod", async (ev) => {
      setProcessing(true);

      try {
        // Create payment intent on server
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // amount: Math.round(parseFloat(bookingData.totalAmount) * 100),
            amount: bookingData.totalAmount,
            currency: "eur",
            metadata: {
              ticketId: bookingData.ticketId,
              passengerName: `${passengerInfo.firstName} ${passengerInfo.lastName}`,
              passengerEmail: passengerInfo.email,
              travelDate: bookingData.travelDate.toISOString(),
              paymentMethod: "wallet",
            },
          }),
        });

        const { clientSecret } = await response.json();

        // Confirm the PaymentIntent without handling potential next actions (such as 3D Secure)
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (error) {
          // Report to the browser that the payment failed
          ev.complete("fail");
          toast.error(error.message || "Payment failed");
          setProcessing(false);
          return;
        }

        // Report to the browser that the payment was successful
        ev.complete("success");

        if (paymentIntent.status === "requires_action") {
          // Let Stripe.js handle the rest of the payment flow
          const { error } = await stripe.confirmCardPayment(clientSecret);
          if (error) {
            toast.error(error.message || "Payment failed");
            setProcessing(false);
            return;
          }
        }

        toast.success("Payment successful!");
        onSuccess();
      } catch (error) {
        console.error("Payment error:", error);
        toast.error("Payment failed. Please try again.");
        ev.complete("fail");
      } finally {
        setProcessing(false);
      }
    });
  }, [stripe, bookingData, passengerInfo, onSuccess, selectedPaymentMethod]);

  const handleStripePayment = async () => {
    if (!stripe || !elements || !bookingData) return;

    setProcessing(true);

    try {
      // Format travel date for backend
      const date = new Date(bookingData.travelDate);

      // 1️⃣ Create booking first
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          customerName: `${passengerInfo.firstName} ${passengerInfo.lastName}`,
          customerEmail: passengerInfo.email,
          customerPhone: passengerInfo.phone,
        }),
      });

      const bookingDataRes = await bookingRes.json();

      // console.log("Booking API Response:", bookingRes.status, bookingDataRes);

      if (!bookingRes.ok) {
        toast.error(bookingDataRes.error || "Failed to create booking");
        return;
      }

      const booking = bookingDataRes.booking;

      // 2️⃣ Create payment intent on server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: bookingData.totalAmount,
          currency: "eur",
          metadata: {
            ticketId: bookingData.ticketId,
            passengerName: `${passengerInfo.firstName} ${passengerInfo.lastName}`,
            passengerEmail: passengerInfo.email,
            travelDate: bookingData.travelDate,
          },
        }),
      });

      const { clientSecret } = await response.json();

      // 3️⃣ Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      // 4️⃣ Confirm card payment
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${passengerInfo.firstName} ${passengerInfo.lastName}`,
              email: passengerInfo.email,
              phone: passengerInfo.phone,
            },
          },
        });

      if (stripeError) {
        toast.error(stripeError.message || "Payment failed");
        return;
      } else {
        toast.success("Payment successful!");
        onSuccess();
      }

      // 4. Confirm payment in backend
      const confirmPaymentRes = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          paymentId: paymentIntent.id,
        }),
      });

      const confirmData = await confirmPaymentRes.json();

      if (!confirmPaymentRes.ok) {
        toast.error(confirmData.error || "Booking confirmation failed");
        return;
      }

      // Store IDs for later PDF download
      setConfirmedBookingId(booking.bookingId);
      setConfirmedPaymentId(paymentIntent.id);

      localStorage.removeItem("bookingData");
      // activeStep(3); // Show confirmation step
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleWalletPayment = () => {
    if (paymentRequest) {
      paymentRequest.show();
    } else {
      toast.error("Google Pay/Apple Pay is not available in your browser");
    }
  };

  return (
    <>
      {selectedPaymentMethod === "stripe" && (
        // <Button
        //   onClick={handleStripePayment}
        //   disabled={processing || !stripe}
        //   className="bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] disabled:opacity-50 py-6 w-full font-bold text-lg"
        // >
        //   {processing ? (
        //     <div className="flex items-center">
        //       <div className="mr-2 border-white border-t-2 border-b-2 rounded-full w-5 h-5 animate-spin"></div>
        //       Processing Payment...
        //     </div>
        //   ) : (
        //     `Pay €${bookingData.totalAmount}`
        //   )}
        // </Button>

        <Button
          onClick={handleStripePayment}
          // disabled={processing || !stripe }
          disabled={
            !stripe ||
            !cardComplete ||
            paymentInfo.cardholderName.trim() === "" ||
            processing
          }
          className={`group relative flex justify-center items-center 
          bg-gradient-to-r from-[#740e27] to-pink-600 hover:from-pink-600  hover:to-[#740e27] 
          shadow-lg hover:shadow-xl py-4 rounded-lg w-full overflow-hidden font-medium text-white 
          transition-all duration-[10000ms] ease-in-out h-14 ${
            !stripe ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {/* Gradient Overlay */}
          <div className="-z-10 absolute inset-0 bg-gradient-to-r from-amber-400 to-violet-500 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-500"></div>

          {/* Moving dots */}
          <div className="absolute inset-0 opacity-10">
            <div className="top-2 left-4 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:translate-x-20 duration-1000"></div>
            <div className="top-4 right-6 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:-translate-x-20 duration-700"></div>
          </div>

          <span className="z-10 relative flex justify-center items-center text-xl tracking-wide">
            {processing ? (
              <div className="flex items-center">
                <div className="mr-2 border-white border-t-2 border-b-2 rounded-full w-5 h-5 animate-spin"></div>
                Processing Payment...
              </div>
            ) : (
              `Pay €${bookingData.totalAmount}`
            )}
          </span>
        </Button>
      )}

      {(selectedPaymentMethod === "google-pay" ||
        selectedPaymentMethod === "apple-pay") &&
        paymentRequest && (
          <div className="mt-4">
            <PaymentRequestButtonElement
              options={{
                paymentRequest,
                style: {
                  paymentRequestButton: {
                    type: "default",
                    theme: "dark",
                    height: "56px",
                  },
                },
              }}
            />
          </div>
        )}

      {(selectedPaymentMethod === "google-pay" ||
        selectedPaymentMethod === "apple-pay") &&
        !paymentRequest && (
          // <Button
          //   onClick={handleWalletPayment}
          //   disabled={processing}
          //   className="bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] disabled:opacity-50 py-6 w-full font-bold text-lg"
          // >
          //   {processing ? (
          //     <div className="flex items-center">
          //       <div className="mr-2 border-white border-t-2 border-b-2 rounded-full w-5 h-5 animate-spin"></div>
          //       Processing Payment...
          //     </div>
          //   ) : (
          //     `Pay €${bookingData.totalAmount}`
          //   )}
          // </Button>
          <Button
            onClick={handleWalletPayment}
            disabled={processing}
            className={`group relative flex justify-center items-center 
          bg-gradient-to-r from-[#740e27] to-pink-600 hover:from-pink-600  hover:to-[#740e27] 
          shadow-lg hover:shadow-xl py-4 rounded-lg w-full overflow-hidden font-medium text-white 
          transition-all duration-[10000ms] ease-in-out h-14 
               ${!processing ? "opacity-50 cursor-not-allowed" : ""}
          `}
          >
            {/* Gradient Overlay */}
            <div className="-z-10 absolute inset-0 bg-gradient-to-r from-amber-400 to-violet-500 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-500"></div>

            {/* Moving dots */}
            <div className="absolute inset-0 opacity-10">
              <div className="top-2 left-4 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:translate-x-20 duration-1000"></div>
              <div className="top-4 right-6 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:-translate-x-20 duration-700"></div>
            </div>

            <span className="z-10 relative flex justify-center items-center text-xl tracking-wide">
              {processing ? (
                <div className="flex items-center">
                  <div className="mr-2 border-white border-t-2 border-b-2 rounded-full w-5 h-5 animate-spin"></div>
                  {t("processing-payment")}...
                </div>
              ) : (
                `Pay €${bookingData.totalAmount}`
              )}
            </span>
          </Button>
        )}

      {selectedPaymentMethod === "paypal" && (
        <div className="mt-4">
          <div id="paypal-button-container"></div>
          {processing && (
            <div className="mt-4 text-center">
              <div className="inline-block mr-2 border-[#740e27] border-t-2 border-b-2 rounded-full w-5 h-5 animate-spin"></div>
              <span className="text-[#740e27]">
                Processing PayPal Payment...
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

// Stripe Card Form Component
const StripeCardForm = ({
  paymentInfo,
  setPaymentInfo,
  errors,
  setCardComplete = { setCardComplete },
}: {
  paymentInfo: any;
  setPaymentInfo: (info: any) => void;
  errors: any;
}) => {
  return (
    <div className="mb-6 p-6 border border-gray-200 rounded-lg">
      <h3 className="mb-4 font-bold text-[#740e27] text-2xl">Card Details</h3>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700 text-sm">
          Cardholder Name *
        </label>
        <input
          type="text"
          value={paymentInfo.cardholderName}
          onChange={(e) =>
            setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#134B42] focus:border-transparent ${
            errors.payment?.cardholderName
              ? "border-red-500"
              : "border-gray-300"
          }`}
          placeholder="Jasuan doe"
          required
        />
        {errors.payment?.cardholderName && (
          <p className="mt-1 text-red-500 text-sm">
            {errors.payment.cardholderName}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700 text-sm">
          Card Details *
        </label>
        <div
          className={`p-3 border rounded-lg ${
            errors.payment?.cardNumber ? "border-red-500" : "border-gray-300"
          }`}
        >
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
              },
            }}
            onChange={(e) => setCardComplete(e.complete)}
          />
        </div>
        {errors.payment?.cardNumber && (
          <p className="mt-1 text-red-500 text-sm">
            {errors.payment.cardNumber}
          </p>
        )}
      </div>
    </div>
  );
};

export default function BookingPage() {
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(
    null
  );
  const [confirmedPaymentId, setConfirmedPaymentId] = useState<string | null>(
    null
  );

  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [paymentInfo, setPaymentInfo] = useState({
    cardholderName: "",
  });
  const [errors, setErrors] = useState<{
    passenger?: Partial<PassengerInfo>;
    payment?: any;
  }>({});
  const locale = useLocale();

  const [pkg, setPkg] = useState<Package | null>(null);
  const t = useTranslations("firstpackage");
  useEffect(() => {
    if (step === 4) {
      setTimeout(() => {
        handleDownloadPDF();
      }, 500);
    }
  }, [step]);

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
    // passengers: 1,
    // specialRequests: "",
    // cardNumber: "",
    // expiryDate: "",
    // cvv: "",
    // cardholderName: "",
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
      const { firstName, lastName, email, phone } = formData;

      // Check if required fields are filled
      if (!firstName.trim() || !email.trim() || !phone.trim()) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate email - only allow someone@gmail.com format
      // const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      // if (!emailRegex.test(email)) {
      //   toast.error(
      //     "Please enter a valid Gmail address (e.g., someone@gmail.com)"
      //   );
      //   return;
      // }

      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/;

      if (!emailRegex.test(email)) {
        toast.error(
          "Please enter a valid email address from gmail, yahoo, outlook, or hotmail"
        );
        return;
      }

      // Validate phone (basic: only digits, optional +, min 7 digits)
      const phoneRegex = /^[+]?[\d\s\-()]{7,15}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
        toast.error("Please enter a valid phone number (7-15 digits)");
        return;
      }

      // No name validation - just check they're not empty
      if (firstName.trim().length < 2) {
        toast.error("Please enter valid names (minimum 2 characters)");
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
      toast.success(
        "Booking confirmed! Your e-tickets have been sent to your email."
      );
      setStep(4); // Show confirmation step
    } catch (err) {
      toast.error("Payment error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setStep(4);
    localStorage.removeItem("bookingData");
    toast.success(
      "Booking confirmed! Your e-tickets have been sent to your email."
    );
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

  // function downloadPDFs(pdfBase64: { filename: string; content: string }[]) {
  //   pdfBase64.forEach((pdf) => {
  //     const byteCharacters = atob(pdf.content);
  //     const byteNumbers = new Array(byteCharacters.length);
  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       byteNumbers[i] = byteCharacters.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);
  //     const blob = new Blob([byteArray], { type: "application/pdf" });
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = pdf.filename;
  //     link.click();
  //   });
  // }

  const handleDownloadPDF = async () => {
    if (!confirmedBookingId || !confirmedPaymentId) {
      console.log("bookingId", confirmedBookingId);
      console.log("paymentId", confirmedPaymentId);
      toast.error("Booking or payment not found. Cannot download tickets.");
      return;
    }

    try {
      const res = await fetch(`/api/confirmBooking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: confirmedBookingId,
          paymentId: confirmedPaymentId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Booking confirmation failed: ${data.error || "Unknown error"}`);
        return;
      }

      // ✅ Download PDFs from base64
      data.pdfFiles.forEach((pdf: { filename: string; content: string }) => {
        const byteCharacters = atob(pdf.content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = pdf.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      });

      toast.success("Tickets downloaded successfully!");
    } catch (err) {
      console.error("Booking confirmation error:", err);
      alert("Booking confirmation failed: Network error");
    }
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
        <div className="mb-8 px-4 sm:px-0">
          <div className="relative flex justify-between items-center mx-auto max-w-4xl">
            {/* Active line */}
            <div
              className="absolute inset-0 flex items-center"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            >
              <div className="bg-[#134B42] w-full h-1 transition-all duration-500"></div>
            </div>

            {/* Steps */}
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className="z-10 relative flex flex-col items-center"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-medium ${
                    step >= stepNum
                      ? "bg-[#740e27] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNum ? (
                    <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6" />
                  ) : (
                    stepNum
                  )}
                </div>
                <span className="mt-2 px-1 text-xs sm:text-sm text-center truncate">
                  {stepNum === 1
                    ? t("details")
                    : stepNum === 2
                    ? t("review")
                    : stepNum === 3
                    ? t("payment")
                    : t("confirmation")}
                </span>
              </div>
            ))}
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
              <Elements stripe={stripePromise}>
                <Card className="shadow-xl border-0">
                  <CardContent className="p-6">
                    <h2 className="flex items-center mb-6 font-bold text-[#740e27] text-xl">
                      <CreditCard className="mr-2 w-6 h-6" />
                      {t("payment-method")}
                    </h2>

                    {/* Payment Method Selection */}
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mb-8">
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPaymentMethod === "google-pay"
                            ? "border-[#740e27] bg-[#134B42]/5"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => setSelectedPaymentMethod("google-pay")}
                      >
                        <div className="flex items-center">
                          <div
                            className={`flex justify-center items-center rounded-full w-6 h-6 mr-3 ${
                              selectedPaymentMethod === "google-pay"
                                ? "bg-[#740e27] border-[#740e27]"
                                : "border-gray-300 border"
                            }`}
                          >
                            {selectedPaymentMethod === "google-pay" && (
                              <div className="bg-white rounded-full w-3 h-3"></div>
                            )}
                          </div>

                          <FcGoogle className="mr-2 w-8 h-8" />
                          <span className="font-medium">Google Pay</span>
                        </div>
                      </div>

                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPaymentMethod === "apple-pay"
                            ? "border-[#740e27] bg-[#134B42]/5"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => setSelectedPaymentMethod("apple-pay")}
                      >
                        <div className="flex items-center">
                          <div
                            className={`flex justify-center items-center rounded-full w-6 h-6 mr-3 ${
                              selectedPaymentMethod === "apple-pay"
                                ? "bg-[#740e27] border-[#740e27]"
                                : "border-gray-300 border"
                            }`}
                          >
                            {selectedPaymentMethod === "apple-pay" && (
                              <div className="bg-white rounded-full w-3 h-3"></div>
                            )}
                          </div>
                          <Apple className="mr-2 w-8 h-8" />
                          <span className="font-medium">Apple Pay</span>
                        </div>
                      </div>

                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPaymentMethod === "paypal"
                            ? "border-[#740e27] bg-[#134B42]/5"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => setSelectedPaymentMethod("paypal")}
                      >
                        <div className="flex items-center">
                          <div
                            className={`flex justify-center items-center rounded-full w-6 h-6 mr-3 ${
                              selectedPaymentMethod === "paypal"
                                ? "bg-[#740e27] border-[#740e27]"
                                : "border-gray-300 border"
                            }`}
                          >
                            {selectedPaymentMethod === "paypal" && (
                              <div className="bg-white rounded-full w-3 h-3"></div>
                            )}
                          </div>
                          <SiPaypal className="mr-2 w-8 h-8 text-blue-600" />
                          <span className="font-medium">PayPal</span>
                        </div>
                      </div>

                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPaymentMethod === "stripe"
                            ? "border-[#740e27] bg-[#134B42]/5"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => setSelectedPaymentMethod("stripe")}
                      >
                        <div className="flex items-center">
                          <div
                            className={`flex justify-center items-center rounded-full w-6 h-6 mr-3 ${
                              selectedPaymentMethod === "stripe"
                                ? "bg-[#740e27] border-[#740e27]"
                                : "border-gray-300 border"
                            }`}
                          >
                            {selectedPaymentMethod === "stripe" && (
                              <div className="bg-white rounded-full w-3 h-3"></div>
                            )}
                          </div>
                          <CreditCard className="mr-2 w-8 h-8" />
                          <span className="font-medium">Credit Card</span>
                        </div>
                      </div>
                    </div>

                    {/* Stripe Card Form (only shown if stripe is selected) */}
                    {selectedPaymentMethod === "stripe" && (
                      <StripeCardForm
                        paymentInfo={paymentInfo}
                        setPaymentInfo={setPaymentInfo}
                        errors={errors}
                        setCardComplete={setCardComplete}
                      />
                    )}

                    <div className="flex items-center bg-[#E6F7F5] mb-6 p-3 rounded-md">
                      <Lock className="flex-shrink-0 mr-2 w-5 h-5 text-[#4CA1AF]" />
                      <p className="text-gray-700 text-sm">
                        {t("payment-info")}
                      </p>
                    </div>

                    <PaymentProcessor
                      bookingData={bookingData}
                      passengerInfo={formData}
                      selectedPaymentMethod={selectedPaymentMethod}
                      onSuccess={handlePaymentSuccess}
                      paymentInfo={paymentInfo}
                      cardComplete={cardComplete}
                      setConfirmedBookingId={setConfirmedBookingId}
                      setConfirmedPaymentId={setConfirmedPaymentId}
                    />
                  </CardContent>
                </Card>
              </Elements>
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
                      {/* TLX-{Date.now().toString().slice(-6)} */}
                      {confirmedBookingId}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg text-left">
                    <h3 className="mb-3 font-semibold">{t("whats_next")}</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Check className="mr-2 w-4 h-4 text-green-500" />
                        {t("confirmation_email")}{" "}
                        <span
                          className="inline-block ms-2 font-bold text-[#740e27]"
                          a
                        >
                          {formData.email}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 w-4 h-4 text-green-500" />
                        {t("etickets_attached")}
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 w-4 h-4 text-green-500" />
                        {t("support_available")}
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
