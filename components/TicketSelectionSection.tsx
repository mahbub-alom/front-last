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
import { useParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { toast } from "react-toastify";

interface TicketSelection {
  adult: number;
  child: number;
}

export const TicketSelectionSection = (): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const params = useParams();
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
      setNewPkg(data?.ticket?.variations || null);
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
      console.log("Proceeding to checkout with:", {
        ticket: selectedTicket,
        date,
        ticketSelection,
        total: calculateTotal(),
      });
      // Here you would typically redirect to a checkout page or show a payment modal
    }
  };

  if (loading) {
    const skeletonCount = 6;
    const skeletonHeight = "h-64";
    const gridColumns = 3;

    return (
      <div className="bg-[#F1F1F1] py-8 min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className={`grid grid-cols-1 md:grid-cols-${gridColumns} gap-6`}>
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <div
                key={index}
                className={`bg-gray-200 rounded-xl w-full ${skeletonHeight} animate-pulse`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] w-full min-h-screen">
      {/* Premium Header Section */}
      <header className="relative bg-gradient-to-r from-[#134B42] to-[#1a6b5f] w-full h-[280px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/paris-pattern.png')] opacity-10" />
        <div className="z-10 relative flex flex-col justify-center items-center mx-auto px-6 py-12 max-w-6xl h-full text-center">
          <h1 className="drop-shadow-md mb-4 font-serif font-bold text-white text-5xl tracking-tight">
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
        <div className="right-0 bottom-0 left-0 absolute bg-gradient-to-r from-[#FFD700] via-[#FF4E50] to-[#4CA1AF] h-1" />
      </header>

      {/* Premium Tabs Navigation */}
      <Tabs
        defaultValue="bus-tours"
        className="z-20 relative mx-auto -mt-8 px-4 w-full max-w-7xl"
      >
        <TabsList className="bg-white shadow-xl p-1 border border-gray-200 rounded-lg h-auto">
          <TabsTrigger
            value="bus-tours"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#134B42] data-[state=active]:to-[#1a6b5f] px-8 py-3 rounded-md data-[state=active]:text-white text-lg transition-all"
          >
            <Bus className="mr-2 w-5 h-5" />
            Bus Tours
          </TabsTrigger>
          <TabsTrigger
            value="combination-tickets"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#134B42] data-[state=active]:to-[#1a6b5f] px-8 py-3 rounded-md data-[state=active]:text-white text-lg transition-all"
          >
            <Ticket className="mr-2 w-5 h-5" />
            Combination Tickets
          </TabsTrigger>
        </TabsList>

        {/* Premium Cards Grid */}
        <TabsContent value="bus-tours" className="pt-10">
          <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {busTours?.map((ticket) => (
              <Card
                key={ticket.id}
                className="group relative flex flex-col shadow-xl hover:shadow-2xl border-0 h-full overflow-hidden transition-all duration-300"
              >
                {/* Premium Discount Ribbon */}
                {ticket.discountBadge && (
                  <div className="top-6 -right-8 z-10 absolute bg-[#FF4E50] shadow-md px-10 py-1 w-[200px] font-bold text-white text-sm text-center rotate-45 transform">
                    {ticket.discountBadge} OFF
                  </div>
                )}

                {/* Card Header */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={ticket?.image}
                    alt={ticket?.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="right-4 bottom-4 left-4 absolute">
                    <Badge className="bg-white/90 hover:bg-white backdrop-blur px-4 py-2 font-bold text-[#134B42]">
                      {ticket.durationBadge}
                    </Badge>
                  </div>
                </div>

                {/* Card Body */}
                <CardContent className="flex flex-col flex-grow p-0">
                  {/* Title Section */}
                  <div className="px-6 pt-6 pb-4">
                    <h3 className="mb-2 font-serif font-bold text-[#134B42] text-2xl">
                      {ticket.title}
                    </h3>
                    <div className="flex items-end gap-2">
                      {ticket.adultPrice && (
                        <>
                          <span className="text-gray-600 text-sm">
                            Adult from
                          </span>
                          <span className="font-bold text-[#134B42] text-3xl">
                            {ticket.adultPrice}
                          </span>
                        </>
                      )}
                    </div>
                    {
                      <div className="mt-1 text-gray-500 text-sm">
                        Full Price From{" "}
                        <span className="mr-1 text-red-500 line-through">
                          {ticket.fullPrice}
                        </span>
                      </div>
                    }
                  </div>

                  {/* Divider */}
                  <div className="px-6">
                    <div className="border-gray-200 border-t w-full" />
                  </div>

                  {/* Features Section */}
                  <div className="flex-grow px-6 py-4">
                    <h4 className="flex items-center mb-3 font-bold text-[#134B42] text-lg">
                      <ListChecks className="mr-2 w-5 h-5" />
                      What&apos;s Included
                    </h4>
                    <ul className="space-y-3">
                      {ticket.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="flex-shrink-0 mt-0.5 mr-2 w-5 h-5 text-[#4CA1AF]" />
                          <span className="text-gray-700">
                            {feature.split("\n").map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                {i < feature.split("\n").length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Routes Section */}
                  {ticket.routes.length > 0 && (
                    <div className="px-6 pb-4">
                      <h4 className="flex items-center mb-3 font-bold text-[#134B42] text-lg">
                        <Route className="mr-2 w-5 h-5" />
                        Featured Routes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {ticket.routes.map((route, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-white hover:bg-[#134B42]/10 border-[#134B42]/20 text-[#134B42]"
                          >
                            <Circle className="fill-[#FF4E50] mr-2 w-2 h-2" />
                            {route}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Section */}
                  <div className="mt-auto px-6 pt-4 pb-6">
                    <Button
                      onClick={() => handleBuyNow(ticket)}
                      className="bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] shadow-md hover:shadow-lg py-6 rounded-lg w-full font-bold text-white text-lg transition-all"
                    >
                      BUY NOW
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>

                  {/* Special Offer */}
                  {ticket.specialOffer && (
                    <div className="bg-[#FFF8E6] px-6 py-3 border-[#FFD700]/30 border-t">
                      <div className="flex items-center">
                        <AlertCircle className="mr-2 w-5 h-5 text-[#FF4E50]" />
                        <p className="font-medium text-[#8E6C0A] text-sm">
                          {ticket.specialOffer.split("\n").map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              {i <
                                ticket.specialOffer.split("\n").length - 1 && (
                                <br />
                              )}
                            </React.Fragment>
                          ))}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="combination-tickets" className="pt-10">
          <div className="bg-white shadow-md p-12 rounded-xl text-center">
            <div className="mx-auto max-w-md">
              <CalendarClock className="mx-auto mb-4 w-16 h-16 text-[#134B42]" />
              <h3 className="mb-2 font-bold text-[#134B42] text-2xl">
                Coming Soon
              </h3>
              <p className="mb-6 text-gray-600">
                We&apos;re preparing exciting combination ticket options for
                your Paris adventure.
              </p>
              <Button
                variant="outline"
                className="hover:bg-[#134B42]/10 border-[#134B42] text-[#134B42]"
              >
                Notify Me When Available
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Ticket Purchase Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-0 rounded-lg sm:max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="top-0 z-10 sticky bg-white p-6 border-b">
            <DialogTitle className="flex justify-between items-center text-left">
              <span className="font-bold text-[#134B42] text-2xl">
                {selectedTicket?.title}
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
              <h3 className="mb-6 font-bold text-[#134B42] text-xl">
                Select Tickets
              </h3>

              {/* Adult Ticket */}
              <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold text-lg">Adult Ticket</h4>
                  </div>
                  <span className="font-bold text-[#134B42]">
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
                      className="flex justify-center items-center hover:bg-[#134B42]/10 disabled:opacity-50 border border-[#134B42] rounded-full w-10 h-10 text-[#134B42] disabled:cursor-not-allowed"
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
                      className="flex justify-center items-center hover:bg-[#134B42]/10 border border-[#134B42] rounded-full w-10 h-10 text-[#134B42]"
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
                  <span className="font-bold text-[#134B42]">
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
                      className="flex justify-center items-center hover:bg-[#134B42]/10 disabled:opacity-50 border border-[#134B42] rounded-full w-10 h-10 text-[#134B42] disabled:cursor-not-allowed"
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
                      className="flex justify-center items-center hover:bg-[#134B42]/10 border border-[#134B42] rounded-full w-10 h-10 text-[#134B42]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="flex flex-col items-center mb-6 h-full">
                <h3 className="mb-6 font-bold text-[#134B42] text-2xl">
                  Select Date
                </h3>
                <div className="bg-white shadow-xl p-6 border border-gray-200 rounded-3xl w-full max-w-md">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(day) => day < new Date()}
                    className="[&_.rdp-button]:hover:bg-[#E6F4F1] [&_.rdp-day_selected:hover]:bg-[#0F3B32] [&_.rdp-day_selected]:bg-[#134B42] [&_.rdp-day:hover]:bg-[#DFF5F1] [&_.rdp-day]:rounded-full w-full font-semibold [&_.rdp-day_selected]:text-white [&_.rdp-caption]:text-lg [&_.rdp-day]:transition-colors /* darken slightly on hover */"
                  />

                  {date && (
                    <p className="mt-4 font-medium text-gray-700 text-center">
                      Selected:{" "}
                      <span className="text-[#134B42]">
                        {date.toDateString()}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Your ticket */}
            <div className="bg-[#F8F9FA] p-6 rounded-lg">
              <h3 className="mb-6 font-bold text-[#134B42] text-xl">
                Your ticket
              </h3>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Tour</span>
                  <span className="font-bold">{selectedTicket?.title}</span>
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
                <h4 className="mb-3 font-bold text-[#134B42] text-lg">
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
                  <span className="font-bold text-[#134B42] text-xl">
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
                disabled={!date || ticketSelection.adult < 1} // ⬅️ disable if no date or no adult ticket
                className={`bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] shadow-md hover:shadow-lg py-6 rounded-lg w-full font-bold text-white text-lg transition-all ${
                  !date || ticketSelection.adult < 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <div className="flex items-start bg-[#E6F7F5] mt-4 p-3 rounded-md">
                <CheckCircle className="flex-shrink-0 mt-0.5 mr-2 w-5 h-5 text-[#4CA1AF]" />
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
