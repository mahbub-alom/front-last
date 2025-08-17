

import { CheckIcon } from "lucide-react";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

const ticketData = [
  {
    id: 1,
    discountBadge: "15% OFF!",
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
    discountBadge: "15% OFF!",
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
    discountBadge: "15% OFF!",
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
    discountBadge: "15% OFF!",
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
    price: "€84.00",
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
    discountBadge: "15% OFF!",
    durationBadge: "48 HOURS",
    durationColor: "bg-[#930b31]",
    borderColor: "border-[#930b31]",
    bgColor: "bg-white",
    headerColor: "bg-[#930b31]",
    image: "/me.jpeg",
    title: "48-Hour Ticket",
    price: "€49.30",
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
    <section className="w-full">
      {/* Header stays the same */}
      <header className="w-full">
        <div className="flex justify-center items-center bg-[#740e27] px-6 py-0 w-full h-[200px]">
          <div className="inline-flex flex-col items-start px-0 pt-0 pb-2.5">
            <div className="inline-flex flex-col items-start gap-2.5">
              <div className="z-[1] flex flex-col items-center w-full">
                <h1 className="mt-[-1.00px] w-fit font-bold text-[37.4px] text-white text-center leading-[44.2px] tracking-[0] whitespace-nowrap [font-family:'Inter',Helvetica]">
                  Paris Tickets &amp; Passes
                </h1>
              </div>

              <div className="z-0 flex flex-col items-center w-full">
                <p className="mt-[-1.00px] w-fit font-normal text-[13px] text-white text-center leading-[15px] tracking-[0] whitespace-nowrap [font-family:'Inter',Helvetica]">
                  <span className="font-normal text-[13px] text-white leading-[15px] tracking-[0] [font-family:'Inter',Helvetica]">
                    Explore Paris the Big Bus way. Get the{" "}
                  </span>
                  <span className="font-bold">Essential Ticket</span>
                  <span className="font-normal text-[13px] text-white leading-[15px] tracking-[0] [font-family:'Inter',Helvetica]">
                    {" "}
                    for our best value Paris sightseeing experience!
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs navigation */}
        <Tabs defaultValue="bus-tours" className="w-full">
          <TabsList className="flex border-gray-200 border-b w-full">
            <TabsTrigger
              value="bus-tours"
              className="flex flex-1 justify-center items-center data-[state=active]:bg-[#740e27] min-h-[44px] font-bold text-[14.9px] text-black data-[state=active]:text-white text-center leading-4 tracking-[0] [font-family:'Inter',Helvetica]"
            >
              Bus Tours
            </TabsTrigger>
            <TabsTrigger
              value="combination-tickets"
              className="flex flex-1 justify-center items-center data-[state=active]:bg-[#550a1d] min-h-[44px] font-bold text-[14.5px] text-white data-[state=active]:text-white text-center leading-4 tracking-[0] [font-family:'Inter',Helvetica]"
            >
              Combination Tickets
            </TabsTrigger>
          </TabsList>

          {/* Tabs Content */}
          <TabsContent value="bus-tours">
            <div className="flex flex-col items-start mx-auto px-4 w-full max-w-[972px]">
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
                {busTours.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className={`${ticket.bgColor} ${ticket.borderColor} border-b-[10px] border-b-solid shadow-[0px_2px_10px_#00000033,0px_0px_1px_#00000033] overflow-hidden`}
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col">
                        <div className="flex flex-col">
                          <Badge className="bg-[#fad502] px-0 py-2.5 border-none rounded-none font-bold text-[#930b31] text-[11.4px] text-center">
                            {ticket.discountBadge}
                          </Badge>
                          <Badge
                            className={`${ticket.durationColor} text-white text-[14.6px] font-bold text-center py-2.5 px-0 rounded-none border-none`}
                          >
                            {ticket.durationBadge}
                          </Badge>
                        </div>

                        <div className="flex justify-center items-center bg-[#e4e4e4] h-[100px]">
                          <div
                            className="flex-1 bg-cover bg-center max-w-full h-[100px]"
                            style={{ backgroundImage: `url(${ticket?.image})` }}
                          />
                        </div>

                        <div className="flex flex-col">
                          <div
                            className={`flex flex-col items-start p-5 ${ticket.headerColor}`}
                          >
                            <div className="flex flex-col items-center w-full">
                              <h3 className="mt-[-1.00px] w-full font-bold text-[20px] text-white text-center leading-[22px] tracking-[0] [font-family:'Inter',Helvetica]">
                                {ticket.title}
                              </h3>
                            </div>
                          </div>

                          <div className="flex flex-col items-start gap-[5px] p-5">
                            <div className="flex justify-center w-full h-[21px]">
                              <div className="flex items-center gap-2">
                                {ticket.adultPrice && (
                                  <>
                                    <span className="font-normal text-[#444444] text-sm text-center leading-[19px] tracking-[0] [font-family:'Inter',Helvetica]">
                                      Adult from
                                    </span>
                                    <span className="font-bold text-[#444444] text-lg text-center leading-[19px] tracking-[0] [font-family:'Inter',Helvetica]">
                                      {ticket.adultPrice}
                                    </span>
                                  </>
                                )}
                                {ticket.price && !ticket.adultPrice && (
                                  <>
                                    <span className="font-normal text-[#444444] text-sm text-center leading-[19px] tracking-[0] [font-family:'Inter',Helvetica]">
                                      from
                                    </span>
                                    <span className="font-bold text-[#444444] text-lg text-center leading-[19px] tracking-[0] [font-family:'Inter',Helvetica]">
                                      {ticket.price}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {ticket.fullPrice && (
                              <div className="flex flex-col items-center w-full">
                                <p className="mt-[-1.00px] w-full font-normal text-[#666666] text-[11.2px] text-center leading-3 tracking-[0] [font-family:'Inter',Helvetica]">
                                  <span className="font-normal text-[#666666] text-[11.2px] leading-3 tracking-[0] [font-family:'Inter',Helvetica]">
                                    Full price from{" "}
                                  </span>
                                  <span className="line-through">
                                    {ticket.fullPrice}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col justify-end items-start px-5 py-0">
                            <div className="flex flex-col justify-end items-start px-0 pt-0 pb-2.5 w-full h-[55px]">
                              <Button className="bg-[#fad502] hover:bg-[#fad502]/90 border-2 border-solid rounded-lg w-full h-[45px] h-auto font-bold text-[#930b31] text-[13.1px]">
                                BUY NOW
                              </Button>
                            </div>

                            <div className="flex flex-col justify-end items-start px-0 pt-0 pb-2.5 w-full h-[53px]">
                              <Button
                                variant="outline"
                                className="bg-white hover:bg-gray-50 border border-[#337ab7] border-solid rounded-lg w-full h-[43px] h-auto font-bold text-[#337ab7] text-[13.8px]"
                              >
                                More info
                              </Button>
                            </div>
                          </div>

                          {ticket.specialOffer && (
                            <div className="flex flex-col items-center px-5 pt-0 pb-[0.58px]">
                              <p className="mt-[-1.00px] w-fit font-bold text-[#337ab7] text-[11px] text-center leading-[14.4px] tracking-[0.50px] [font-family:'Inter',Helvetica]">
                                {ticket.specialOffer
                                  .split("\n")
                                  .map((line, index) => (
                                    <React.Fragment key={index}>
                                      {line}
                                      {index <
                                        ticket.specialOffer.split("\n").length -
                                          1 && <br />}
                                    </React.Fragment>
                                  ))}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-col items-start gap-[3px] px-5 py-2.5">
                            <h4 className="mt-[-1.00px] w-fit font-bold text-[#444444] text-[14.3px] leading-[normal] tracking-[0] whitespace-nowrap [font-family:'Inter',Helvetica]">
                              What&#39;s included:
                            </h4>

                            <div className="flex flex-col items-start gap-[3px] w-full">
                              {ticket.features.map((feature, index) => (
                                <div
                                  key={index}
                                  className="flex items-start w-full"
                                >
                                  <div className="flex flex-col items-start pt-[5px] pr-2 pb-0 pl-0 w-5 h-[17px]">
                                    <div className="flex justify-center items-center bg-[#02a64f] rounded-md w-3 h-3">
                                      <CheckIcon className="w-[7px] h-[7px] text-white" />
                                    </div>
                                  </div>

                                  <div className="flex flex-col flex-1 items-start">
                                    <p className="mt-[-1.00px] w-full font-normal text-[#444444] text-[12.6px] leading-5 tracking-[0] [font-family:'Inter',Helvetica]">
                                      {feature
                                        .split("\n")
                                        .map((line, lineIndex) => (
                                          <React.Fragment key={lineIndex}>
                                            {line}
                                            {lineIndex <
                                              feature.split("\n").length -
                                                1 && <br />}
                                          </React.Fragment>
                                        ))}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {ticket.routes.length > 0 && (
                            <div className="flex flex-col items-start gap-[5px] px-5 py-0">
                              <div className="flex flex-col items-start w-full">
                                <h4 className="mt-[-1.00px] w-full font-bold text-[#444444] text-[14.5px] leading-[normal] tracking-[0] [font-family:'Inter',Helvetica]">
                                  Ride these routes:
                                </h4>
                              </div>

                              <div className="flex items-start w-full">
                                <div className="inline-flex flex-col items-start">
                                  {ticket.routes.map((route, index) => (
                                    <div
                                      key={index}
                                      className="inline-flex items-center bg-white px-2 py-1.5 border border-[#e4e4e4] border-solid min-w-14"
                                    >
                                      <div className="flex flex-col items-start py-0 pr-[5px] pl-0 w-[23px] h-[18px]">
                                        <div className="bg-[#ff0000] w-[18px] h-[18px]" />
                                      </div>
                                      <div className="inline-flex flex-col items-start">
                                        <span className="mt-[-1.00px] w-fit font-bold text-[#5b5b5b] text-[11.1px] leading-3 tracking-[0] whitespace-nowrap [font-family:'Inter',Helvetica]">
                                          {route}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="combination-tickets">
            <div className="flex justify-center items-center h-[200px] font-bold text-gray-500">
              Coming Soon...
            </div>
          </TabsContent>
        </Tabs>
      </header>

      {/* main section for tickets stays inside the tabs above */}
    </section>
  );
};
