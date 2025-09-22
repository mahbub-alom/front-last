import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

const sampleTickets = [
  {
    title: "1 hour audio commented cruise",
    description: "The summer enjoy Guided tour with family or friends in paris",
    price: 1299,
    duration: "7 days",
    location: "Maldives",
    category: "Beach",
    rating: 4.9,
    reviews: 342,
    imageUrl:
      "https://iili.io/KHVlpPp.jpg",
    gallery: [
      "https://iili.io/KHVM3rl.jpg",
      "https://images.pexels.com/photos/16470214/pexels-photo-16470214.jpeg?_gl=1*1gcv573*_ga*OTgwNjI3ODcwLjE3NDYyMDQ4NDI.*_ga_8JE65Q40S6*czE3NTQwNDcxMzgkbzkkZzEkdDE3NTQwNDg5OTMkajgkbDAkaDA.",
      "https://images.pexels.com/photos/62645/pexels-photo-62645.jpeg?_gl=1*1w8ahwv*_ga*OTgwNjI3ODcwLjE3NDYyMDQ4NDI.*_ga_8JE65Q40S6*czE3NTQwNDcxMzgkbzkkZzEkdDE3NTQwNDkwMjUkajUyJGwwJGgw",
    ],
    features: [
      "All-inclusive",
      "Overwater Villa",
      "Spa Treatment",
      "Water Sports",
      "Private Beach",
    ],
    availableSlots: 12,
    itinerary: [
      {
        day: 1,
        title: "Starting Location:",
        description: "7 Portde la Bourdonnais",
      },
      {
        day: 2,
        title: "Les Invalides",
        description: "",
      },
      {
        day: 3,
        title: "Musée d'Orsay",
        description: "",
      },
      {
        day: 4,
        title: "IIe de la Cité",
        description: "",
      },
      {
        day: 5,
        title: "Notre-Dame Cathedral",
        description: "",
      },
      {
        day: 6,
        title: "Hôtel de Ville",
        description: "",
      },
      {
        day: 7,
        title: "Louvre Museum",
        description: "",
      },
      {
        day: 8,
        title: "Place de la Concorde",
        description: "",
      },
      {
        day: 9,
        title: "Grand Palais",
        description: "",
      },
      {
        day: "",
        title: "Arrive Back at:",
        description: "7 Port de la Bourdonnais",
      },
    ],
    included: [
      "Free one photo (if want more, then need to pay for additional photos)",
      "Airport transfers",
      "Accommodation",
      "All meals",
      "Activities",
      "Professional guide",
    ],
    notIncluded: [
      "Travel insurance",
      "Personal expenses",
      "Optional tours",
      "Alcoholic beverages",
    ],
  },
  {
    title: "Himalayan Trek Adventure",
    description:
      "A breathtaking journey through the Himalayas with experienced guides and unforgettable views.",
    price: 1599,
    duration: "10 days",
    location: "Nepal",
    category: "Adventure",
    rating: 4.8,
    reviews: 287,
    imageUrl:
      "https://i.ibb.co.com/Kc6bqrZj/bus.jpeg",
    gallery: [
      "https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg",
      "https://images.pexels.com/photos/776469/pexels-photo-776469.jpeg",
      "https://images.pexels.com/photos/31552871/pexels-photo-31552871.jpeg",
    ],
    features: [
      "Mountain Trekking",
      "Tent Accommodation",
      "Local Cuisine",
      "Campfires",
      "Glacier Walk",
    ],
    availableSlots: 8,
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kathmandu",
        description: "Meet and greet at the airport",
      },
      {
        day: 2,
        title: "Drive to Pokhara",
        description: "Scenic ride to the base town",
      },
      { day: 3, title: "Begin Trek to Tikhedhunga", description: "" },
      { day: 4, title: "Trek to Ghorepani", description: "" },
      { day: 5, title: "Sunrise at Poon Hill", description: "" },
      { day: 6, title: "Trek to Tadapani", description: "" },
      { day: 7, title: "Trek to Ghandruk", description: "" },
      { day: 8, title: "Back to Pokhara", description: "" },
      { day: 9, title: "Drive to Kathmandu", description: "" },
      { day: 10, title: "Departure", description: "Fly back home" },
    ],
    included: [
      "Local transport",
      "Guide and porter services",
      "Accommodation during trek",
      "All meals",
      "Permit and entrance fees",
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Personal equipment",
      "Tips",
    ],
    dates: ["2024-09-05", "2024-10-03", "2024-11-07", "2025-03-13"],
    variations: [
      {
        discountBadge: "15%",
        durationBadge: "24 HOURS",
        title: "Essential Ticket",
        adultPrice: "€55.25",
        fullPrice: "€65.00",
        childPrice: "€33.30",
        image: "https://i.ibb.co.com/vJByx51/slider4.jpg",
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
        discountBadge: "15%",
        durationBadge: "24 HOURS",
        image: "https://i.ibb.co.com/vJByx51/slider4.jpg",
        title: "Discover Ticket",
        adultPrice: "€41.65",
        fullPrice: "€49.00",
        childPrice: "€23.80",
        features: [
          "24h Hop-on, Hop-off",
          "Fully Flexible Bus Ticket (free date change)",
        ],
        routes: ["Red"],
      },
      {
        discountBadge: "15%",
        durationBadge: "48 HOURS",
        image: "https://i.ibb.co.com/vJByx51/slider4.jpg",
        title: "Explore Ticket",
        adultPrice: "€67.15",
        fullPrice: "€79.00",
        childPrice: "€38.25",
        features: [
          "48h Hop-on, Hop-off",
          "River Cruise",
          "Fully Flexible Bus Ticket (free date change)",
          "Free Vox Self-Guided Walking Tour app download",
        ],
        routes: ["Red"],
      },
      {
        discountBadge: "15%",
        durationBadge: "NIGHT TOUR",
        image: "https://i.ibb.co.com/vJByx51/slider4.jpg",
        title: "Night Tour",
        adultPrice: "€29.75",
        fullPrice: "€35.00",
        childPrice: "€23.80",
        specialOffer: "UNFORGETTABLE VIEWS OF THE CITY OF LIGHTS BY NIGHT",
        features: ["2hr Panoramic Night Tour"],
        routes: [],
      },
      {
        discountBadge: "15%",
        durationBadge: "48 HOURS",
        image: "https://i.ibb.co.com/vJByx51/slider4.jpg",
        title: "48-Hour Ticket + River Cruise",
        adultPrice: "€75.70",
        fullPrice: "€84.00",
        childPrice: "€42.75",
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
        discountBadge: "15%",
        durationBadge: "48 HOURS",
        image: "https://i.ibb.co.com/vJByx51/slider4.jpg",
        title: "48-Hour Ticket",
        adultPrice: "€52.70",
        fullPrice: "€62.00",
        childPrice: "€29.75",
        features: [
          "48h Hop-on, Hop-off",
          "Fully Flexible Bus Ticket (free date change)",
        ],
        routes: ["Red"],
      },
    ],
  },
];

export async function POST() {
  try {
    await dbConnect();

    // Clear existing tickets
    await Ticket.deleteMany({});

    // Insert sample tickets
    await Ticket.insertMany(sampleTickets);

    return NextResponse.json({
      message: "Sample tickets created successfully",
      count: sampleTickets.length,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
