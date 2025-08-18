import {
  AlertCircle,
  ArrowRight,
  Bus,
  CalendarClock,
  CheckCircle,
  CheckIcon,
  Circle,
  Facebook,
  Instagram,
  ListChecks,
  Mail,
  MapPin,
  Phone,
  Route,
  Send,
  Ticket,
  Twitter,
} from "lucide-react";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import Image from "next/image";

const ticketData = [
  {
    id: 1,
    discountBadge: "15%",
    durationBadge: "24 HOURS",
    durationColor: "bg-[#a0aabf]",
    borderColor: "border-[#a0aabf]",
    bgColor: "bg-[#fff6e3]",
    headerColor: "bg-[#a0aabf]",
    image: "/me.jpeg",
    title: "Essential Ticket",
    adultPrice: "€50.15",
    fullPrice: "€65.00",
    specialOffer: "INCLUDES 1-HR STUNNING RIVER CRUISE ON THE SEINE!",
    features: [
      "24h Hop-on, Hop-off",
      "River Cruise",
      "Fully Flexible Bus Ticket (free date change)",
      "Free Vox Self-Guided Walking Tour app download",
    ],
    routes: ["Red"],
  },
  {
    id: 2,
    discountBadge: "15%",
    durationBadge: "24 HOURS",
    durationColor: "bg-[#8c7853]",
    borderColor: "border-[#8c7853]",
    bgColor: "bg-white",
    headerColor: "bg-[#8c7853]",
    image: "/me.jpeg",
    title: "Discover Ticket",
    adultPrice: "€38.25",
    fullPrice: "€49.00",
    features: [
      "24h Hop-on, Hop-off",
      "Fully Flexible Bus Ticket (free date change)",
    ],
    routes: ["Red"],
  },
  {
    id: 3,
    discountBadge: "15%",
    durationBadge: "48 HOURS",
    durationColor: "bg-[#cfb53c]",
    borderColor: "border-[#cfb53c]",
    bgColor: "bg-white",
    headerColor: "bg-[#cfb53c]",
    image: "/me.jpeg",
    title: "Explore Ticket",
    adultPrice: "€62.05",
    fullPrice: "€79.00",
    features: [
      "48h Hop-on, Hop-off",
      "River Cruise",
      "Fully Flexible Bus Ticket (free date change)",
      "Free Vox Self-Guided Walking Tour app download",
    ],
    routes: ["Red"],
  },
  {
    id: 4,
    discountBadge: "15%",
    durationBadge: "NIGHT TOUR",
    durationColor: "bg-[#5b399a]",
    borderColor: "border-[#5b399a]",
    bgColor: "bg-white",
    headerColor: "bg-[#5b399a]",
    image: "/me.jpeg",
    title: "Night Tour",
    adultPrice: "€27.20",
    fullPrice: "€35.00",
    specialOffer: "UNFORGETTABLE VIEWS OF THE CITY OF LIGHTS BY NIGHT",
    features: ["2hr Panoramic Night Tour"],
    routes: [],
  },
  {
    id: 5,
    discountBadge: "Exclusive: Pass Duo Liberty!",
    durationBadge: "48 HOURS",
    durationColor: "bg-[#5b399a]",
    borderColor: "border-[#5b399a]",
    bgColor: "bg-white",
    headerColor: "bg-[#5b399a]",
    image: "/me.jpeg",
    title: "48-Hour Ticket + River Cruise",
    adultPrice: "€79.05",
    fullPrice: "€84.00",
    specialOffer: "INCLUDES HOP-ON HOP-OFF SEINE RIVER CRUISE!",
    features: [
      "48h bus Hop-on, Hop-off (10 stops)",
      "48h River Cruise Hop-on, Hop-off (9 stops) with Batobus",
      "5 Common Stops to Interchange",
      "Fully Flexible Bus Ticket (free date change)",
    ],
    routes: ["Red"],
  },
  {
    id: 6,
    discountBadge: "15%",
    durationBadge: "48 HOURS",
    durationColor: "bg-[#930b31]",
    borderColor: "border-[#930b31]",
    bgColor: "bg-white",
    headerColor: "bg-[#930b31]",
    image: "/me.jpeg",
    title: "48-Hour Ticket",
    adultPrice: "€49.30",
    fullPrice: "€62.00",
    features: [
      "48h Hop-on, Hop-off",
      "Fully Flexible Bus Ticket (free date change)",
    ],
    routes: ["Red"],
  },
];

const combinationTickets = [
  // Empty for now or placeholder
  { id: 1, title: "Coming Soon...", features: [] },
];

export const TicketSelectionSection = (): JSX.Element => {
  const busTours = ticketData; // all your 6 tickets
  const combinationTickets: typeof ticketData = []; // empty placeholder
  return (
    // <section className="w-full">
    //   {/* Header stays the same */}
    //   <header className="w-full">
    //     <div className="flex justify-center items-center bg-[#134B42] px-6 py-0 w-full h-[200px]">
    //       <div className="inline-flex flex-col items-start px-0 pt-0 pb-2.5">
    //         <div className="inline-flex flex-col items-start gap-2.5">
    //           <div className="z-[1] flex flex-col items-center w-full">
    //             <h1 className="mt-[-1.00px] w-fit font-bold text-[37.4px] text-white text-center leading-[44.2px] tracking-[0] whitespace-nowrap [font-family:'Inter',Helvetica]">
    //               Paris Tickets &amp; Passes
    //             </h1>
    //           </div>

    //           <div className="z-0 flex flex-col items-center w-full">
    //             <p className="mt-[-1.00px] w-fit font-normal text-[13px] text-white text-center leading-[15px] tracking-[0] whitespace-nowrap [font-family:'Inter',Helvetica]">
    //               <span className="font-normal text-[13px] text-white leading-[15px] tracking-[0] [font-family:'Inter',Helvetica]">
    //                 Explore Paris the Big Bus way. Get the{" "}
    //               </span>
    //               <span className="font-bold">Essential Ticket</span>
    //               <span className="font-normal text-[13px] text-white leading-[15px] tracking-[0] [font-family:'Inter',Helvetica]">
    //                 {" "}
    //                 for our best value Paris sightseeing experience!
    //               </span>
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Tabs navigation */}
    //     <Tabs defaultValue="bus-tours" className="w-full">
    //       <TabsList className="flex border-gray-200 border-b w-full">
    //         <TabsTrigger
    //           value="bus-tours"
    //           className="flex flex-1 justify-center items-center data-[state=active]:bg-[#042d26] min-h-[44px] font-bold text-[14.9px] text-black data-[state=active]:text-white text-center leading-4 tracking-[0] [font-family:'Inter',Helvetica]"
    //         >
    //           Bus Tours
    //         </TabsTrigger>
    //         <TabsTrigger
    //           value="combination-tickets"
    //           className="flex flex-1 justify-center items-center data-[state=active]:bg-[#042d26] min-h-[44px] font-bold text-[14.5px] text-black data-[state=active]:text-white text-center leading-4 tracking-[0] [font-family:'Inter',Helvetica]"
    //         >
    //           Combination Tickets
    //         </TabsTrigger>
    //       </TabsList>

    //       {/* Tabs Content */}
    //       <TabsContent value="bus-tours">
    //         <div className="flex flex-col items-start mx-auto px-4 w-full max-w-[972px]">
    //           <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
    //             {busTours.map((ticket) => (
    //               <Card
    //                 key={ticket.id}
    //                 className="group relative shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] rounded-xl overflow-hidden transition-all duration-300"
    //               >
    //                 {/* Gradient accent bar */}
    //                 <div className="top-0 left-0 absolute bg-gradient-to-r from-[#FF4E50] via-[#F9D423] to-[#E2E2E2] w-full h-1.5" />

    //                 <CardContent className="p-0">
    //                   <div className="flex flex-col">
    //                     {/* Header with gradient */}
    //                     <div className="relative bg-gradient-to-br from-[#2C3E50] to-[#4CA1AF] p-5">
    //                       {/* Floating discount badge */}
    //                       {ticket.discountBadge && (
    //                         <div className="-top-3 -right-3 z-10 absolute bg-[#FF4E50] shadow-lg px-3 py-1 rounded-full font-bold text-white text-xs rotate-12">
    //                           {ticket.discountBadge}
    //                         </div>
    //                       )}

    //                       <div className="flex flex-col items-center space-y-2">
    //                         <h3 className="font-sans font-bold text-white text-2xl text-center tracking-tight">
    //                           {ticket.title}
    //                         </h3>
    //                         <Badge className="bg-[rgba(255,255,255,0.2)] backdrop-blur-sm px-3 py-1 border border-white border-opacity-20 rounded-full font-medium text-white text-sm">
    //                           {ticket.durationBadge}
    //                         </Badge>
    //                       </div>
    //                     </div>

    //                     {/* Image with hover effect */}
    //                     <div className="relative h-48 overflow-hidden">
    //                       <div
    //                         className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
    //                         style={{ backgroundImage: `url(${ticket?.image})` }}
    //                       />
    //                       <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    //                     </div>

    //                     {/* Pricing section */}
    //                     <div className="bg-[#F5F7FA] px-6 pt-5 pb-3">
    //                       <div className="flex justify-between items-center">
    //                         <div className="flex items-end gap-2">
    //                           {ticket.adultPrice ? (
    //                             <>
    //                               <span className="text-[#5B5B5B] text-sm">
    //                                 Adult from
    //                               </span>
    //                               <span className="font-bold text-[#2C3E50] text-2xl">
    //                                 {ticket.adultPrice}
    //                               </span>
    //                             </>
    //                           ) : (
    //                             <>
    //                               <span className="text-[#5B5B5B] text-sm">
    //                                 From
    //                               </span>
    //                               <span className="font-bold text-[#2C3E50] text-2xl">
    //                                 {ticket.price}
    //                               </span>
    //                             </>
    //                           )}
    //                         </div>

    //                         {ticket.fullPrice && (
    //                           <div className="text-[#666] text-sm line-through">
    //                             {ticket.fullPrice}
    //                           </div>
    //                         )}
    //                       </div>
    //                     </div>

    //                     {/* CTA Buttons */}
    //                     <div className="bg-white px-6 py-4 border-[#EAEAEA] border-t">
    //                       <Button className="bg-gradient-to-r from-[#FF4E50] hover:from-[#FF4E50]/90 to-[#F9D423] hover:to-[#F9D423]/90 shadow-md hover:shadow-lg py-3 rounded-lg w-full font-bold text-white transition-all">
    //                         BUY NOW
    //                       </Button>
    //                     </div>

    //                     {/* Special offer */}
    //                     {ticket.specialOffer && (
    //                       <div className="bg-[#E8F4F8] px-6 py-3">
    //                         <p className="font-medium text-[#2C3E50] text-sm text-center leading-tight">
    //                           {ticket.specialOffer
    //                             .split("\n")
    //                             .map((line, index) => (
    //                               <React.Fragment key={index}>
    //                                 {line}
    //                                 {index <
    //                                   ticket.specialOffer.split("\n").length -
    //                                     1 && <br />}
    //                               </React.Fragment>
    //                             ))}
    //                         </p>
    //                       </div>
    //                     )}

    //                     {/* Features */}
    //                     <div className="bg-white px-6 py-4">
    //                       <h4 className="mb-3 font-bold text-[#2C3E50] text-lg">
    //                         What's included:
    //                       </h4>
    //                       <ul className="space-y-2">
    //                         {ticket.features.map((feature, index) => (
    //                           <li key={index} className="flex items-start">
    //                             <div className="flex-shrink-0 mt-1 mr-3">
    //                               <div className="bg-[#4CA1AF] p-1 rounded-full">
    //                                 <CheckIcon className="w-3 h-3 text-white" />
    //                               </div>
    //                             </div>
    //                             <span className="text-[#5B5B5B] text-sm">
    //                               {feature
    //                                 .split("\n")
    //                                 .map((line, lineIndex) => (
    //                                   <React.Fragment key={lineIndex}>
    //                                     {line}
    //                                     {lineIndex <
    //                                       feature.split("\n").length - 1 && (
    //                                       <br />
    //                                     )}
    //                                   </React.Fragment>
    //                                 ))}
    //                             </span>
    //                           </li>
    //                         ))}
    //                       </ul>
    //                     </div>

    //                     {/* Routes */}
    //                     {ticket.routes.length > 0 && (
    //                       <div className="bg-[#F5F7FA] px-6 py-4 border-[#EAEAEA] border-t">
    //                         <h4 className="mb-3 font-bold text-[#2C3E50] text-lg">
    //                           Ride these routes:
    //                         </h4>
    //                         <div className="flex flex-wrap gap-2">
    //                           {ticket.routes.map((route, index) => (
    //                             <div
    //                               key={index}
    //                               className="flex items-center bg-white shadow-sm px-3 py-1.5 border border-[#EAEAEA] rounded-full"
    //                             >
    //                               <div className="bg-[#FF4E50] mr-2 rounded-full w-3 h-3" />
    //                               <span className="font-medium text-[#5B5B5B] text-sm">
    //                                 {route}
    //                               </span>
    //                             </div>
    //                           ))}
    //                         </div>
    //                       </div>
    //                     )}
    //                   </div>
    //                 </CardContent>
    //               </Card>
    //             ))}
    //           </div>
    //         </div>
    //       </TabsContent>

    //       <TabsContent value="combination-tickets">
    //         <div className="flex justify-center items-center h-[200px] font-bold text-gray-500">
    //           Coming Soon...
    //         </div>
    //       </TabsContent>
    //     </Tabs>
    //   </header>

    //   {/* main section for tickets stays inside the tabs above */}
    // </section>
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
            {busTours.map((ticket) => (
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
                    src={ticket.image}
                    alt={ticket.title}
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
                    <Button className="bg-gradient-to-r from-[#134B42] hover:from-[#0e3a33] to-[#1a6b5f] hover:to-[#134B42] shadow-md hover:shadow-lg py-6 rounded-lg w-full font-bold text-white text-lg transition-all">
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


    </section>
  );
};
