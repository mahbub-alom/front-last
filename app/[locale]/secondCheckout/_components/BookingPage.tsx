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
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { SiPaypal } from "react-icons/si";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Import Stripe
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { useLocale } from "next-intl";

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
    if (!stripe || !elements || !bookingData) {
      return;
    }

    console.log("booking data", bookingData);

    setProcessing(true);

    try {
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // ticketId: bookingData.ticketId,
          // ...bookingData,
          customerName: passengerInfo.firstName + " " + passengerInfo.lastName,
          customerEmail: passengerInfo.email,
          customerPhone: passengerInfo.phone,
          travelDate: bookingData.travelDate,
          totalPassengers: bookingData.numberOfPassengers,
          totalAmount: bookingData.totalAmount,
          adults: bookingData.adults,
          adultTotal: bookingData.adultTotal,
          children: bookingData.children,
          childTotal: bookingData.childTotal,
        }),
      });

      const { booking } = await bookingRes.json();

      if (!bookingRes.ok) {
        const errData = await bookingRes.json();
        console.error("Booking API Error:", errData);
        toast.error(errData.error || "Failed to create booking");
        return;
      }

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
          },
        }),
      });

      const { clientSecret } = await response.json();

      // Get card element
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${passengerInfo.firstName} ${passengerInfo.lastName}`,
            email: passengerInfo.email,
            phone: passengerInfo.phone,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message || "Payment failed");
      } else {
        // Payment succeeded
        toast.success("Payment successful!");
        onSuccess();
      }
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
                  Processing Payment...
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
  const [ticketDetails, setTicketDetails] = useState<any>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const locale = useLocale();

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
      travelDate: new Date(parsedData.travelDate),
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

    if (!passengerInfo.firstName)
      newErrors.firstName = "First name is required";
    if (!passengerInfo.lastName) newErrors.lastName = "Last name is required";
    if (!passengerInfo.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(passengerInfo.email))
      newErrors.email = "Email is invalid";
    if (!passengerInfo.phone) newErrors.phone = "Phone number is required";

    setErrors({ ...errors, passenger: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (activeStep === 1 && validatePassengerInfo()) {
      setActiveStep(2);
    }
  };

  const handlePaymentSuccess = () => {
    setActiveStep(3);
    localStorage.removeItem("bookingData");
    toast.success(
      "Booking confirmed! Your e-tickets have been sent to your email."
    );
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
          Booking Not Found
        </h2>
        <p className="mb-6 text-gray-600 text-center">
          We couldn&apos;t find your booking information. Please select tickets
          again.
        </p>
        <Button
          onClick={() => router.push("/")}
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
        <div className="flex justify-between items-center mx-auto px-4 container">
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
              <span className="mt-2 font-medium text-sm">Details</span>
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
              <span className="mt-2 font-medium text-sm">Payment</span>
            </div>

            <div
              className={`flex-1 h-1 mx-2 ${
                activeStep >= 3 ? "bg-[#740e27]" : "bg-gray-200"
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
                  <h2 className="flex items-center mb-6 font-bold text-[#740e27] text-xl">
                    <User className="mr-2 w-6 h-6" />
                    Passenger Information
                  </h2>

                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mb-6">
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">
                        First Name *
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
                        Last Name *
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
                      Email Address *
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
                      Phone Number *
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
                      Continue to Payment
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform group-hover:translate-x-2 duration-300" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeStep === 2 && (
              <Elements stripe={stripePromise}>
                <Card className="shadow-xl border-0">
                  <CardContent className="p-6">
                    <h2 className="flex items-center mb-6 font-bold text-[#740e27] text-xl">
                      <CreditCard className="mr-2 w-6 h-6" />
                      Payment Method
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
                        Your payment information is encrypted and secure.
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

            {activeStep === 3 && (
              <Card className="shadow-xl border-0">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="mx-auto mb-4 w-16 h-16 text-green-500" />
                  <h2 className="mb-2 font-bold text-[#134B42] text-2xl">
                    Booking Confirmed!
                  </h2>
                  <p className="mb-6 text-gray-600">
                    Your Paris tour has been successfully booked. Your e-tickets
                    have been sent to your email.
                  </p>

                  <div className="bg-[#E6F7F5] mb-6 p-4 rounded-lg text-left">
                    <h3 className="mb-2 font-bold text-[#134B42]">
                      Booking Reference: PARIS-
                      {Math.random().toString(36).substr(2, 8).toUpperCase()}
                    </h3>
                    <p className="text-sm">
                      Please save this reference number for your records.
                    </p>
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
                <h2 className="mb-6 font-bold text-[#134B42] text-sm">
                  Order Summary
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
                      {bookingData.durationBadge || "1 Day"}
                    </p>
                    {/* <div className="flex items-center mt-1">
                      <Calendar className="mr-1 w-4 h-4 text-[#4CA1AF]" />
                      <span className="text-gray-600 text-sm">
                        {format(bookingData.travelDate, "MMMM d, yyyy")}
                      </span>
                    </div> */}
                  </div>
                </div>

                <div className="mb-6 pt-4 border-gray-200 border-t">
                  <h3 className="mb-2 font-bold text-[#740e27]">Passengers</h3>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600">
                      Adults × {bookingData.adults}
                    </span>
                    <span className="font-medium">
                      €{bookingData.adultTotal}
                    </span>
                  </div>
                  {bookingData.children > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Children × {bookingData.children}
                      </span>
                      <span className="font-medium">
                        €{bookingData.childTotal}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-6 pt-4 border-gray-200 border-t">
                  {/* <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      €{bookingData.totalAmount}
                    </span>
                  </div> */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">€0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-gray-200 border-t font-bold text-[#740e27] text-lg">
                    <span>Total</span>
                    <span>€{bookingData.totalAmount}</span>
                  </div>
                </div>

                <div className="bg-[#F8F9FA] p-4 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="flex-shrink-0 mr-2 w-5 h-5 text-[#4CA1AF]" />
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium text-[#740e27]">
                        Free cancellation
                      </span>{" "}
                      up to 24 hours before your tour date for a full refund.
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
