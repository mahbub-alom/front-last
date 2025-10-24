"use client";
import {
  ArrowLeft,
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Apple,
  ArrowRight,
  MapPin,
  Compass,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { SiPaypal } from "react-icons/si";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
}: {
  bookingData: BookingData;
  passengerInfo: PassengerInfo;
  selectedPaymentMethod: string;
  onSuccess: () => void;
  paymentInfo: { cardholderName: string };
  cardComplete: boolean;
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
      console.log("booking data", bookingData);

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
      await fetch("/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          paymentId: paymentIntent.id,
        }),
      });

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

export const BookingPage = (): JSX.Element => {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const locale = useLocale();
  const t = useTranslations("secondpackage");

  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardholderName: "",
  });
  const [cardComplete, setCardComplete] = useState(false);

  const [errors, setErrors] = useState<{
    passenger?: Partial<PassengerInfo>;
    payment?: any;
  }>({});

  useEffect(() => {
    const data = localStorage.getItem("bookingData");
    if (!data) {
      toast.error("No booking data found. Please select tickets first.");
      router.push("/");
      return;
    }

    const parsedData = JSON.parse(data);
    const bookingDataWithDefaults: BookingData = {
      ...parsedData,
      // travelDate: new Date(parsedData.travelDate),
      title: parsedData.title || "Paris Bus Tour",
      durationBadge: parsedData.durationBadge || "1 Day",
      image: parsedData.image || "/paris-bus.jpg",
    };

    setBookingData(bookingDataWithDefaults);

    fetchTicketDetails(parsedData.ticketId);
  }, []);

  const fetchTicketDetails = async (ticketId: string) => {
    try {
      // In a real app, you would fetch from your API
      // const mockTicket = {
      //   _id: ticketId,
      //   title: "Essential Paris Tour",
      //   image: "/paris-bus.jpg",
      //   durationBadge: "2 Days",
      //   adultPrice: "€39.00",
      //   childPrice: "€29.00",
      //   features: [
      //     "Hop-on, hop-off bus tour\nUnlimited rides for 2 days",
      //     "Free walking tours\nGuided tours of Paris landmarks",
      //     "Audio guide in 11 languages\nLearn about Paris history",
      //     "Free app with offline maps\nNavigate the city easily",
      //   ],
      // };

      // setTicketDetails(mockTicket);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      toast.error("Failed to load ticket details");
      setLoading(false);
    }
  };

  const validatePassengerInfo = () => {
    const newErrors: Partial<PassengerInfo> = {};

    // First Name
    if (!passengerInfo.firstName)
      newErrors.firstName = "First name is required";

    // Email
    if (!passengerInfo.email) newErrors.email = "Email is required";
    else if (
      !/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/.test(
        passengerInfo.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email address from gmail, yahoo, outlook, or hotmail";
    }

    // Phone
    if (!passengerInfo.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+]?[\d\s\-()]{7,20}$/.test(passengerInfo.phone)) {
      // ✅ Note: max length increased to 20 for spaces, country code, parentheses
      newErrors.phone =
        "Please enter a valid phone number (digits, +, -, (), spaces allowed)";
    }

    // Set errors in state
    setErrors({ ...errors, passenger: newErrors });

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (activeStep === 1) {
      if (validatePassengerInfo()) {
        setActiveStep(2);
      }
    } else if (activeStep === 2) {
      // Step 2 is review - no validation needed, just move to payment
      setActiveStep(3);
    } else if (activeStep === 3) {
      // Payment handled inside PaymentProcessor onSuccess
      // Optionally, you could prevent advancing until payment method selected
      if (!selectedPaymentMethod) {
        toast.error("Please select a payment method.");
        return;
      }
      if (selectedPaymentMethod === "stripe" && !cardComplete) {
        toast.error("Please complete your card details.");
        return;
      }
      // Payment processing is async, advancing handled in onSuccess
    }
  };

  const handlePreviousStep = () => {
    setActiveStep(activeStep - 1);
  };

  const handlePaymentSuccess = () => {
    setActiveStep(4);
    localStorage.removeItem("bookingData");
    toast.success(
      "Booking confirmed! Your e-tickets have been sent to your email."
    );
  };

  const parseCustomDate = (dateStr: string): Date | null => {
    const [day, month, year] = dateStr.split("-").map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] min-h-screen">
        <div className="border-[#740e27] border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="flex flex-col justify-center items-center bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] p-4 min-h-screen">
        <AlertCircle className="mb-4 w-16 h-16 text-red-500" />
        <h2 className="mb-2 font-bold text-[#134B42] text-2xl">
          {t("booking-not-found")}
        </h2>
        <p className="mb-6 text-gray-600 text-center">
          {t("booking-not-found-desc")}
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42]"
        >
          {t("select-tickets")}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] pb-16 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#134B42] to-[#1a6b5f] py-6 text-white">
        <div className="flex justify-between items-center mx-auto px-4 container">
          <Button
            variant="ghost"
            className="hover:bg-white/10 mr-4 text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            {t("back")}
          </Button>
          <h1 className="font-bold text-2xl">{t("checkout")}</h1>
        </div>
      </header>

      <div className="mx-auto mt-8 px-4 container">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center w-full max-w-md">
            <div
              className={`flex flex-col items-center ${
                activeStep >= 1 ? "text-[#740e27]" : "text-gray-400"
              }`}
            >
              <div
                className={`flex justify-center items-center rounded-full w-10 h-10 ${
                  activeStep >= 1 ? "bg-[#740e27] text-white" : "bg-gray-200"
                }`}
              >
                {activeStep > 1 ? <CheckCircle className="w-6 h-6" /> : "1"}
              </div>
              <span className="mt-2 font-medium text-sm">{t("details")}</span>
            </div>

            <div
              className={`flex-1 h-1 mx-2 ${
                activeStep >= 2 ? "bg-[#134B42]" : "bg-gray-200"
              }`}
            ></div>

            <div
              className={`flex flex-col items-center ${
                activeStep >= 2 ? "text-[#740e27]" : "text-gray-400"
              }`}
            >
              <div
                className={`flex justify-center items-center rounded-full w-10 h-10 ${
                  activeStep >= 2 ? "bg-[#740e27] text-white" : "bg-gray-200"
                }`}
              >
                {activeStep > 2 ? <CheckCircle className="w-6 h-6" /> : "2"}
              </div>
              <span className="mt-2 font-medium text-sm">Review</span>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${
                activeStep >= 3 ? "bg-[#134B42]" : "bg-gray-200"
              }`}
            ></div>

            <div
              className={`flex flex-col items-center ${
                activeStep >= 3 ? "text-[#740e27]" : "text-gray-400"
              }`}
            >
              <div
                className={`flex justify-center items-center rounded-full w-10 h-10 ${
                  activeStep >= 3 ? "bg-[#740e27] text-white" : "bg-gray-200"
                }`}
              >
                {activeStep > 3 ? <CheckCircle className="w-6 h-6" /> : "3"}
              </div>
              <span className="mt-2 font-medium text-sm">{t("payment")}</span>
            </div>

            <div
              className={`flex-1 h-1 mx-2 ${
                activeStep >= 4 ? "bg-[#740e27]" : "bg-gray-200"
              }`}
            ></div>

            <div
              className={`flex flex-col items-center ${
                activeStep >= 4 ? "text-[#740e27]" : "text-gray-400"
              }`}
            >
              <div
                className={`flex justify-center items-center rounded-full w-10 h-10 ${
                  activeStep >= 4 ? "bg-[#740e27] text-white" : "bg-gray-200"
                }`}
              >
                4
              </div>
              <span className="mt-2 font-medium text-sm">
                {t("confirmation")}
              </span>
            </div>
          </div>
        </div>

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {activeStep === 1 && (
              <Card className="shadow-xl border-0">
                <CardContent className="p-6">
                  <h2 className="flex items-center mb-6 font-bold text-[#740e27] text-xl">
                    <User className="mr-2 w-6 h-6" />
                    {t("passenger-information")}
                  </h2>

                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mb-6">
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">
                        {t("first-name")} *
                      </label>
                      <input
                        type="text"
                        value={passengerInfo.firstName}
                        onChange={(e) =>
                          setPassengerInfo({
                            ...passengerInfo,
                            firstName: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#134B42] focus:border-transparent ${
                          errors.passenger?.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Jasuan"
                      />
                      {errors.passenger?.firstName && (
                        <p className="mt-1 text-red-500 text-sm">
                          {errors.passenger.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">
                        {t("last-name")}
                      </label>
                      <input
                        type="text"
                        value={passengerInfo.lastName}
                        onChange={(e) =>
                          setPassengerInfo({
                            ...passengerInfo,
                            lastName: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#134B42] focus:border-transparent ${
                          errors.passenger?.lastName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Smith"
                      />
                      {errors.passenger?.lastName && (
                        <p className="mt-1 text-red-500 text-sm">
                          {errors.passenger.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      {t("email-address")} *
                    </label>
                    <input
                      type="email"
                      value={passengerInfo.email}
                      onChange={(e) =>
                        setPassengerInfo({
                          ...passengerInfo,
                          email: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#134B42] focus:border-transparent ${
                        errors.passenger?.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="your-email@gmail.com"
                    />
                    {errors.passenger?.email && (
                      <p className="mt-1 text-red-500 text-sm">
                        {errors.passenger.email}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      {t("phone-number")} *
                    </label>
                    <input
                      type="tel"
                      value={passengerInfo.phone}
                      onChange={(e) =>
                        setPassengerInfo({
                          ...passengerInfo,
                          phone: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#134B42] focus:border-transparent ${
                        errors.passenger?.phone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="+1 234 567 8900"
                    />
                    {errors.passenger?.phone && (
                      <p className="mt-1 text-red-500 text-sm">
                        {errors.passenger.phone}
                      </p>
                    )}
                  </div>

                  {/* <Button
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] py-6 w-full font-bold text-lg"
                  >
                    Continue to Payment
                  </Button> */}

                  <Button
                    onClick={handleNextStep}
                    className={`group relative flex justify-center items-center 
                    bg-gradient-to-r from-[#740e27] to-pink-600 hover:from-pink-600  hover:to-[#740e27] 
                    shadow-lg hover:shadow-xl py-4 rounded-lg w-full overflow-hidden font-medium text-white 
                    transition-all duration-[10000ms] ease-in-out h-9`}
                  >
                    {/* Gradient Overlay */}
                    <div className="-z-10 absolute inset-0 bg-gradient-to-r from-amber-400 to-violet-500 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-500"></div>

                    {/* Moving dots */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="top-2 left-4 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:translate-x-20 duration-1000"></div>
                      <div className="top-4 right-6 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:-translate-x-20 duration-700"></div>
                    </div>

                    <span className="z-10 relative flex justify-center items-center text-sm tracking-wide">
                      {/* {t("book-now")} */}
                      {t("continue-payment")}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform group-hover:translate-x-2 duration-300" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeStep === 2 && (
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
                                {passengerInfo.firstName}{" "}
                                {passengerInfo.lastName}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center bg-rose-50/50 p-3 border border-rose-100 rounded-lg">
                          <Mail className="mr-3 w-4 h-4 text-rose-500" />
                          <div>
                            <p className="text-slate-500 text-sm">
                              {t("emails")}
                            </p>
                            <p className="font-semibold text-slate-800">
                              {passengerInfo.email}
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
                              {passengerInfo.phone}
                            </p>
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

            {activeStep === 3 && (
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
                      passengerInfo={passengerInfo}
                      selectedPaymentMethod={selectedPaymentMethod}
                      onSuccess={handlePaymentSuccess}
                      paymentInfo={paymentInfo}
                      cardComplete={cardComplete}
                    />
                  </CardContent>
                </Card>
              </Elements>
            )}

            {activeStep === 4 && (
              <Card className="shadow-xl border-0">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="mx-auto mb-4 w-16 h-16 text-green-500" />
                  <h2 className="mb-2 font-bold text-[#134B42] text-2xl">
                    {t("booking-confirmed")}
                  </h2>
                  <p className="mb-6 text-gray-600">
                    {t("booking-success")}
                  </p>

                  <div className="bg-[#E6F7F5] mb-6 p-4 rounded-lg text-left">
                    <h3 className="mb-2 font-bold text-[#134B42]">
                      Booking Reference: PARIS-
                      {Math.random().toString(36).substr(2, 8).toUpperCase()}
                    </h3>
                    <p className="text-sm">{t("save-reference")}</p>
                  </div>

                  {/* <Button
                    onClick={() => router.push("/")}
                    className="bg-gradient-to-r from-[#740e27] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] mb-4 py-6 w-full font-bold text-lg"
                  >
                    Back to Home
                  </Button> */}

                  <Button
                    onClick={() => router.push("/")}
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
                     {t("back-to-home")}
                      <ArrowRight className="ml-3 w-4 h-4 group-hover:scale-110 transition-transform group-hover:translate-x-2 duration-300" />
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => window.print()}
                    className="hover:bg-[#134B42]/10 py-6 border-[#134B42] w-full text-[#134B42]"
                  >
                    {t("download-e-ticket")}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="top-6 sticky shadow-xl border-0">
              <CardContent className="p-6">
                <h2 className="mb-6 font-bold text-[#134B42] text-sm">
                  {t("order-summary")}
                </h2>

                <div className="flex items-start mb-6">
                  <div className="relative mr-4 rounded-lg w-20 h-20 overflow-hidden">
                    <Image
                      src={bookingData.image || "/paris-bus.jpg"}
                      alt={bookingData.title?.[locale] || "Paris Tour"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#740e27] text-xl">
                      {bookingData.title?.[locale] || "Paris Bus Tour"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {bookingData.durationBadge?.[locale] || "1 Day"}
                    </p>
                    <div className="flex items-center mt-1">
                      <Calendar className="mr-1 w-4 h-4 text-[#4CA1AF]" />
                      <span className="text-gray-600 text-sm">
                        {bookingData?.travelDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6 pt-4 border-gray-200 border-t">
                  <h3 className="mb-2 font-bold text-[#740e27]">
                    {t("passengers")}
                  </h3>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600">
                      {t("adult")} × {bookingData.adults}
                    </span>
                    <span className="font-medium">
                      €{bookingData.adultTotal}
                    </span>
                  </div>
                  {bookingData.children > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {t("child")} × {bookingData.children}
                      </span>
                      <span className="font-medium">
                        €{bookingData.childTotal}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-6 pt-4 border-gray-200 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{t("taxes-fees")}</span>
                    <span className="font-medium">€0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-gray-200 border-t font-bold text-[#740e27] text-lg">
                    <span>{t("total")}</span>
                    <span>€{bookingData.totalAmount}</span>
                  </div>
                </div>

                <div className="bg-[#F8F9FA] p-4 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="flex-shrink-0 mr-2 w-5 h-5 text-[#4CA1AF]" />
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium text-[#740e27]">
                        {t("free-cancellation")}
                      </span>{" "}
                      {t("free-cancellation-desc")}
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
