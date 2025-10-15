"use client";
import {
  AlertCircle,
  ArrowRight,
  Bus,
  CalendarClock,
  CheckCircle,
  Circle,
  ListChecks,
  Route,
  Ticket,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useLocale } from "next-intl";

interface TicketSelection {
  adult: number;
  child: number;
}

export const TicketSelectionSection = (): JSX.Element => {
  const locale = useLocale();
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const [newPkg, setNewPkg] = useState<Package | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Package | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [ticketSelection, setTicketSelection] = useState<TicketSelection>({
    adult: 0,
    child: 0,
  });
  const [error, setError] = useState("");

  const busTours = newPkg;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
    if (params.id) {
      fetchPackage();
    }
  }, [params.id]);

  const fetchPackage = async () => {
    if (!params?.id) return;
    try {
      const response = await fetch(`/api/tickets/${params.id}`);
      const data = await response.json();
      setNewPkg(data?.data?.variations || null);
    } catch (error) {
      console.error("Error fetching package:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (ticket: Package) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
    setTicketSelection({ adult: 0, child: 0 });
    setError("");
  };

  const handleQuantityChange = (type: "adult" | "child", value: number) => {
    const newValue = Math.max(0, value);
    setTicketSelection((prev) => ({ ...prev, [type]: newValue }));
  };

  const validateSelection = () => {
    if (ticketSelection.adult < 1 && ticketSelection.child > 0) {
      toast.error("You must buy at least 1 adult ticket.");
      setError("You must buy at least 1 adult ticket.");
      return false;
    }
    if (!date) {
      setError("Please select a date.");
      return false;
    }
    setError("");
    return true;
  };

  const calculateTotal = () => {
    if (!selectedTicket) return 0;

    // Extract numeric values from prices (assuming format like "€39.00")
    const adultPrice =
      parseFloat(selectedTicket.adultPrice.replace(/[^0-9.]/g, "")) || 0;
    const childPrice =
      parseFloat(selectedTicket.childPrice?.replace(/[^0-9.]/g, "") || "0") ||
      0;

    return (
      adultPrice * ticketSelection.adult +
      childPrice * ticketSelection.child
    ).toFixed(2);
  };

  const handleCheckout = () => {
    if (validateSelection()) {
      // Proceed to checkout
      // console.log("Proceeding to checkout with:", {
      //   ticket: selectedTicket,
      //   date,
      //   ticketSelection,
      //   total: calculateTotal(),
      // });
      // Here you would typically redirect to a checkout page or show a payment modal
      if (!date) {
        toast.error("Please select a travel date");
        return;
      }

      const adultPrice =
        parseFloat(selectedTicket?.adultPrice.replace(/[^0-9.]/g, "") || "0") ||
        0;
      const childPrice =
        parseFloat(
          selectedTicket?.childPrice?.replace(/[^0-9.]/g, "") || "0"
        ) || 0;

      const adultTotal = adultPrice * ticketSelection.adult;
      const childTotal = childPrice * ticketSelection.child;

      const bookingData = {
        ticketId: selectedTicket?._id,
        travelDate: date,
        adults: ticketSelection.adult,
        children: ticketSelection.child,
        numberOfPassengers: ticketSelection.adult + ticketSelection.child,
        adultTotal: adultTotal.toFixed(2),
        childTotal: childTotal.toFixed(2),
        totalAmount: calculateTotal(),
        image: selectedTicket?.image,
        title: selectedTicket?.title,
        durationBadge: selectedTicket?.durationBadge,
      };

      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      router.push("/secondCheckout");
    }
  };

  const isDayDisabled = (day: Date) => {
    const now = new Date();
    const currentHour = now.getHours();

    // disable past days
    if (day < new Date(now.setHours(0, 0, 0, 0))) {
      return true;
    }

    // disable today if time >= 9 PM
    if (currentHour >= 21 && day.toDateString() === new Date().toDateString()) {
      return true;
    }

    return false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-b from-[#fdf0f3] to-[#fbe6ea] min-h-screen">
        <div className="border-[#740e27] border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <section
      className="bg-gradient-to-b from-[#f9fafb] to-[#f1f3f5] w-full min-h-screen"
      style={{ fontFamily: '"DINRoundPro", Helvetica, sans-serif' }}
    >
      {/* Premium Header Section */}
      <header className="relative bg-gradient-to-r from-[#740e27] to-[#9c2b45] w-full h-[280px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero3.jpeg')] opacity-10" />
        <div className="z-10 relative flex flex-col justify-center items-center mx-auto px-6 py-12 max-w-6xl h-full text-center">
          <h1 className="drop-shadow-md mb-4 font-bold text-white text-5xl tracking-tight">
            Paris Tickets & Passes
          </h1>
          <p className="max-w-2xl text-white/90 text-lg leading-relaxed">
            Explore Paris the Big Bus way. Get the{" "}
            <span className="font-semibold text-white">Essential Ticket</span>{" "}
            for our best value Paris sightseeing experience!
          </p>
        </div>

        {/* Decorative elements */}
        <div className="right-0 bottom-0 left-0 absolute bg-white/10 backdrop-blur-sm h-12" />
        <div className="right-0 bottom-0 left-0 absolute bg-gradient-to-r from-[#FF9E01] via-[#740e27] to-[#4CA1AF] h-1" />
      </header>

      {/* Premium Tabs Navigation */}
      <Tabs
        defaultValue="bus-tours"
        className="z-20 relative mx-auto -mt-8 px-4 w-full max-w-7xl"
      >
        <TabsList className="flex bg-white shadow-xl p-1 border border-gray-200 rounded-lg h-auto">
          <TabsTrigger
            value="bus-tours"
            className="flex flex-1 justify-center items-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#740e27] data-[state=active]:to-[#9c2b45] px-4 md:px-8 py-2 md:py-3 rounded-md data-[state=active]:text-white text-base md:text-lg whitespace-nowrap transition-all"
          >
            <Bus className="mr-2 w-4 md:w-5 h-4 md:h-5" />
            Bus Tours
          </TabsTrigger>
          <TabsTrigger
            value="combination-tickets"
            className="flex flex-1 justify-center items-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#740e27] data-[state=active]:to-[#9c2b45] px-4 md:px-8 py-2 md:py-3 rounded-md data-[state=active]:text-white text-base md:text-lg whitespace-nowrap transition-all"
          >
            <Ticket className="mr-2 w-4 md:w-5 h-4 md:h-5" />
            Combination Tickets
          </TabsTrigger>
        </TabsList>

        {/* Premium Cards Grid */}
        <TabsContent value="bus-tours" className="pt-10">
          <div className="mx-auto px-4 max-w-7xl">
            <div className="flex flex-wrap justify-center gap-8 pb-16">
              {busTours?.map((ticket, index) => {
                // Title & background colors
                const titleColors = [
                  "bg-[#26667F] text-[#ffffff]",
                  "bg-[#6A0066] text-[#ffffff]",
                  "bg-[#3B38A0] text-[#ffffff]",
                  "bg-[#00809D] text-[#ffffff]",
                  "bg-[#725CAD] text-[#ffffff]",
                  "bg-[#075B5E] text-[#ffffff]",
                ];
                const currentTitleStyle =
                  titleColors[index % titleColors.length];

                const cardBg = [
                  "bg-[#FBF9D1]",
                  "bg-[#DDF4E7]",
                  "bg-[#BBFBFF]",
                  "bg-[#E8FFD7]",
                  "bg-[#C4E1E6]",
                  "bg-[#FFF2E0]",
                ];
                const currentBGStyle = cardBg[index % cardBg.length];

                return (
                  <div key={ticket.id}>
                    {/* ---------------- MOBILE VERSION ---------------- */}
                    <Card
                      className={`group md:hidden block relative flex flex-row items-stretch bg-gradient-to-br from-white to-[#faf8f5] shadow-lg hover:shadow-xl border border-gray-100 h-full overflow-hidden transition-all hover:-translate-y-0.5 duration-500 ${currentBGStyle} rounded-none`}
                    >
                      {/* Image Container with Enhanced Overlay */}
                      <div className="relative w-1/4 h-full overflow-hidden">
                        <Image
                          src={ticket?.image}
                          alt={ticket?.title?.[locale]}
                          width={100}
                          height={400}
                          className="border-r-8 border-red-500 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 transfor"
                          sizes="(max-width: 768px) 40vw, 33vw"
                        />
                        Dual gradient overlay for depth
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                        {/* Duration Badge - Premium Styling */}
                        <div className="bottom-2 left-2 absolute">
                          <div className="bg-gradient-to-r from-[#740e27] to-[#9c2b45] shadow-md backdrop-blur-sm px-2 py-1 rounded-md font-semibold text-white text-xs">
                            {ticket.durationBadge}
                          </div>
                        </div>
                      </div>

                      {/* Content Container */}
                      <div className="flex flex-col flex-1 p-3">
                        {/* Top section (title + pricing) */}
                        <div className="flex justify-between items-start">
                          <div className="w-2/3">
                            <h3 className="font-bold text-[16px] text-gray-800 line-clamp-2 leading-[18px] tracking-tight">
                              {ticket.title?.[locale]}
                            </h3>
                            {ticket.specialOffer && (
                              <div className="w-auto text-[#8E6C0A]">
                                <div className="flex justify-center items-center">
                                  <span className="font-medium text-[11px]">
                                    {ticket.specialOffer?.[locale]}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="w-1/3 text-right">
                            <div className="mb-1 font-medium text-[12px] text-gray-500 leading-[18px]">
                              Adult from{" "}
                              <span className="font-extrabold text-[#004030] text-[17px] tracking-tight">
                                {ticket.adultPrice}
                              </span>
                            </div>
                            <div className="mb-2 text-[10px] text-gray-500">
                              Full price from{" "}
                              <span className="font-medium text-red-500 line-through">
                                {ticket.fullPrice}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom section (pushed down) */}
                        <div className="flex justify-between items-end mt-auto">
                          {/* Routes */}
                          {ticket.routes.length > 0 && (
                            <div>
                              <h4 className="flex items-center font-semibold text-[#740e27] text-[10px]">
                                <Route className="mr-2 w-5 h-5" />
                                Ride these routes
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {ticket.routes.map((route, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="bg-white hover:bg-[#8A0000] border-[#740e27]/20 hover:font-medium text-[#740e27] text-[11px] hover:text-white"
                                  >
                                    <Circle className="fill-[#FF4E50] mr-1 w-2 h-2" />
                                    {route}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Buy Now Button */}
                          <Button
                            onClick={() => handleBuyNow(ticket)}
                            className="flex justify-center items-center bg-gradient-to-r from-[#740e27] hover:from-[#8a1a37] to-[#9c2b45] hover:to-[#8a1a37] shadow-md group-hover:shadow-lg py-2.5 rounded-lg w-1/2 font-bold text-white text-xs transition-all duration-300"
                          >
                            BUY NOW
                            <ArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 duration-300" />
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* ---------------- DESKTOP VERSION ---------------- */}
                    <Card
                      className={`group relative hidden md:flex flex-col  bg-white shadow-md hover:shadow-lg  border border-gray-200 h-full overflow-hidden w-80 ${currentBGStyle}`}
                    >
                      {/* Discount Ribbon */}
                      {ticket.discountBadge && (
                        <div className="top-2 -right-8 z-10 absolute bg-[#FF4E50] px-6 py-1 w-[140px] font-semibold text-white text-xs text-center rotate-45">
                          {ticket.discountBadge} OFF
                        </div>
                      )}

                      {/* Card Image */}
                      <div className="relative w-full h-36 overflow-hidden">
                        <Image
                          src={ticket?.image}
                          alt={ticket?.title?.[locale]}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="bottom-2 left-2 absolute">
                          <Badge className="bg-white/90 hover:bg-white px-2 py-1 font-semibold text-[#740e27] text-xs">
                            {ticket.durationBadge}
                          </Badge>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className={`py-2 font-semibold text-lg text-center w-full ${currentTitleStyle}`}
                      >
                        {ticket.title?.[locale]}
                      </h3>

                      {/* Card Details */}
                      <div className="flex flex-col flex-1 px-3 pb-3">
                        {/* upper content */}
                        <div>
                          {/* Price */}
                          <div className="mx-auto py-4 text-center">
                            <div className="flex justify-center items-end gap-1">
                              <span className="text-gray-600 text-sm">
                                Adult from
                              </span>
                              <span className="font-bold text-[#004030] text-xl">
                                {ticket.adultPrice}
                              </span>
                            </div>
                            <div className="mt-0 text-gray-500 text-sm">
                              Full price{" "}
                              <span className="text-red-500 line-through">
                                {ticket.fullPrice}
                              </span>
                            </div>
                          </div>

                          {/* Buy Now */}
                          <Button
                            onClick={() => handleBuyNow(ticket)}
                            className="bg-[#740e27] hover:bg-[#9c2b45] mb-2 py-1.5 rounded-md w-full font-semibold text-white text-sm"
                          >
                            BUY NOW
                            <ArrowRight className="ml-1 w-4 h-4" />
                          </Button>

                          {/* Special Offer */}
                          {/* {ticket.specialOffer && (
                            <div className="bg-[#FFF8E6] my-2 px-3 py-1 rounded-md text-[#8E6C0A] text-xs text-center">
                              <div className="flex justify-center items-start">
                                <AlertCircle className="mr-1 w-4 h-4 text-[#FF4E50]" />
                                <span>{ticket.specialOffer?.[locale]}</span>
                              </div>
                            </div>
                          )} */}
                          {ticket.specialOffer?.[locale] && (
                            <div className="bg-[#FFF8E6] my-2 px-3 py-1 rounded-md text-[#8E6C0A] text-xs text-center">
                              <div className="flex justify-center items-start">
                                <AlertCircle className="mr-1 w-4 h-4 text-[#FF4E50]" />
                                <span>{ticket.specialOffer[locale]}</span>
                              </div>
                            </div>
                          )}

                          {/* Features */}
                          {ticket.features[locale]?.length > 0 && (
                            <div className="py-4 pb-5">
                              <h4 className="flex items-center mb-1 font-bold text-[#740e27] text-base">
                                <ListChecks className="mr-1 w-4 h-4" />
                                What's Included
                              </h4>
                              <ul className="space-y-1 text-gray-700 text-sm">
                                {ticket.features[locale].map((feature, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2"
                                  >
                                    <CheckCircle className="mt-0.5 w-3 h-3 text-[#4CA1AF] shrink-0" />
                                    <span className="leading-snug">
                                      {feature}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* fixed bottom content */}
                        <div className="mt-auto">
                          {ticket.routes.length > 0 && (
                            <div>
                              <h4 className="flex items-center mb-1 font-bold text-[#740e27] text-sm">
                                <Route className="mr-1 w-4 h-4" />
                                Ride these routes:
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {ticket.routes.map((route, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="flex bg-white hover:bg-[#8A0000] border-[#740e27]/20 hover:font-medium text-[#740e27] hover:text-white text-xs"
                                  >
                                    <Circle className="fill-[#FF4E50] mr-1 w-2 h-2" />
                                    <span>{route}</span>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="combination-tickets" className="pt-10">
          <div className="bg-white shadow-md p-12 rounded-xl text-center">
            <div className="mx-auto max-w-md">
              <CalendarClock className="mx-auto mb-4 w-16 h-16 text-[#740e27]" />
              <h3 className="mb-2 font-bold text-[#740e27] text-2xl">
                Coming Soon
              </h3>
              <p className="mb-6 text-gray-600">
                We&apos;re preparing exciting combination ticket options for
                your Paris adventure.
              </p>
              <Button
                variant="outline"
                className="hover:bg-[#740e27]/10 border-[#740e27] text-[#740e27]"
              >
                Notify Me When Available
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Ticket Purchase Dialog - Updated with new color scheme */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-0 rounded-lg sm:max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="top-0 z-10 sticky bg-white p-6 border-b">
            <DialogTitle className="flex justify-between items-center text-left">
              <span className="font-bold text-[#740e27] text-2xl">
                {selectedTicket?.title?.[locale]}
              </span>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </DialogTitle>
          </DialogHeader>

          <div className="gap-8 grid grid-cols-1 md:grid-cols-2 p-6">
            {/* Left Column - Ticket Selection */}
            <div>
              <h3 className="mb-6 font-bold text-[#740e27] text-xl">
                Select Tickets
              </h3>

              {/* Adult Ticket */}
              <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold text-lg">Adult Ticket</h4>
                  </div>
                  <span className="font-bold text-[#740e27]">
                    {selectedTicket?.adultPrice} / Person
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        handleQuantityChange("adult", ticketSelection.adult - 1)
                      }
                      disabled={ticketSelection.adult <= 0}
                      className="flex justify-center items-center hover:bg-[#740e27]/10 disabled:opacity-50 border border-[#740e27] rounded-full w-10 h-10 text-[#740e27] disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-8 font-medium text-center">
                      {ticketSelection.adult}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange("adult", ticketSelection.adult + 1)
                      }
                      className="flex justify-center items-center hover:bg-[#740e27]/10 border border-[#740e27] rounded-full w-10 h-10 text-[#740e27]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Child Ticket */}
              <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold text-lg">Child Ticket</h4>
                    <p className="text-gray-600 text-sm">Age 4-12</p>
                  </div>
                  <span className="font-bold text-[#740e27]">
                    {selectedTicket?.childPrice || "€0.00"} / Per Child
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        handleQuantityChange("child", ticketSelection.child - 1)
                      }
                      disabled={ticketSelection.child <= 0}
                      className="flex justify-center items-center hover:bg-[#740e27]/10 disabled:opacity-50 border border-[#740e27] rounded-full w-10 h-10 text-[#740e27] disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-8 font-medium text-center">
                      {ticketSelection.child}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange("child", ticketSelection.child + 1)
                      }
                      className="flex justify-center items-center hover:bg-[#740e27]/10 border border-[#740e27] rounded-full w-10 h-10 text-[#740e27]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="flex flex-col items-center mb-6 h-full">
                <h3 className="mb-6 font-bold text-[#740e27] text-2xl">
                  Select Date
                </h3>
                <div className="bg-white shadow-xl p-6 border border-gray-200 rounded-3xl w-full max-w-md">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDay) => {
                      const now = new Date();
                      const currentHour = now.getHours();

                      if (
                        selectedDay &&
                        currentHour >= 21 &&
                        selectedDay.toDateString() === new Date().toDateString()
                      ) {
                        toast.error("Same-day booking is closed after 9 PM");
                        return;
                      }

                      setDate(selectedDay);
                    }}
                    disabled={isDayDisabled}
                    className="[&_.rdp-button]:hover:bg-[#F9E6E9] [&_.rdp-day_selected:hover]:bg-[#5a0b1f] [&_.rdp-day_selected]:bg-[#740e27] [&_.rdp-day:hover]:bg-[#F5DFE3] [&_.rdp-day]:rounded-full w-full font-semibold [&_.rdp-day_selected]:text-white [&_.rdp-caption]:text-lg [&_.rdp-day]:transition-colors"
                  />

                  {date && (
                    <p className="mt-4 font-medium text-gray-700 text-center">
                      Selected:{" "}
                      <span className="text-[#740e27]">
                        {date.toDateString()}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Your ticket */}
            <div className="bg-[#F8F9FA] p-6 rounded-lg">
              <h3 className="mb-6 font-bold text-[#740e27] text-xl">
                Your ticket
              </h3>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Tour</span>
                  <span className="font-bold">
                    {selectedTicket?.title?.[locale]}
                  </span>
                </div>

                {date && (
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Date</span>
                    <span className="font-bold">
                      {format(date, "MMMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-6 pt-4 border-gray-200 border-t">
                <h4 className="mb-3 font-bold text-[#740e27] text-lg">
                  Tickets
                </h4>

                {ticketSelection.adult > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span>Adult × {ticketSelection.adult}</span>
                    <span className="font-bold">
                      {(
                        parseFloat(
                          selectedTicket?.adultPrice.replace(/[^0-9.]/g, "")
                        ) * ticketSelection.adult || 0
                      ).toFixed(2)}{" "}
                      €
                    </span>
                  </div>
                )}

                {ticketSelection.child > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span>Child × {ticketSelection.child}</span>
                    <span className="font-bold">
                      {(
                        parseFloat(
                          selectedTicket?.childPrice?.replace(/[^0-9.]/g, "") ||
                            "0"
                        ) * ticketSelection.child || 0
                      ).toFixed(2)}{" "}
                      €
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-6 pt-4 border-gray-200 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-[#740e27] text-xl">
                    {calculateTotal()} €
                  </span>
                </div>
              </div>

              {/* Validation Note for Adult */}
              {ticketSelection.adult === 0 && ticketSelection.child > 0 && (
                <p className="mt-2 text-red-500 text-sm">
                  You must buy at least 1 adult ticket.
                </p>
              )}

              {/* Validation Note for Date */}
              {ticketSelection.adult >= 1 && !date && (
                <p className="mt-2 text-red-500 text-sm">
                  Please select a date to proceed.
                </p>
              )}

              <Button
                onClick={handleCheckout}
                disabled={!date || ticketSelection.adult < 1}
                className={`bg-gradient-to-r from-[#740e27] to-[#9c2b45] hover:opacity-90 shadow-md hover:shadow-lg py-6 rounded-lg w-full font-bold text-white text-lg transition-all ${
                  !date || ticketSelection.adult < 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <div className="flex items-start bg-[#F9E6E9] mt-4 p-3 rounded-md">
                <CheckCircle className="flex-shrink-0 mt-0.5 mr-2 w-5 h-5 text-[#9c2b45]" />
                <p className="text-gray-700 text-sm">
                  Free cancellation up to 24 hours before your tour date
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
