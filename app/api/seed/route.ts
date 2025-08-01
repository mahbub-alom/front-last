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
    imageUrl: "https://images.pexels.com/photos/7478428/pexels-photo-7478428.jpeg?_gl=1*1f3fmim*_ga*OTgwNjI3ODcwLjE3NDYyMDQ4NDI.*_ga_8JE65Q40S6*czE3NTQwNDcxMzgkbzkkZzEkdDE3NTQwNDg4OTYkajQ1JGwwJGgw",
    gallery: ["https://images.pexels.com/photos/9504997/pexels-photo-9504997.jpeg?_gl=1*ek4hxl*_ga*OTgwNjI3ODcwLjE3NDYyMDQ4NDI.*_ga_8JE65Q40S6*czE3NTQwNDcxMzgkbzkkZzEkdDE3NTQwNDg5NTUkajQ2JGwwJGgw", "https://images.pexels.com/photos/16470214/pexels-photo-16470214.jpeg?_gl=1*1gcv573*_ga*OTgwNjI3ODcwLjE3NDYyMDQ4NDI.*_ga_8JE65Q40S6*czE3NTQwNDcxMzgkbzkkZzEkdDE3NTQwNDg5OTMkajgkbDAkaDA.", "https://images.pexels.com/photos/62645/pexels-photo-62645.jpeg?_gl=1*1w8ahwv*_ga*OTgwNjI3ODcwLjE3NDYyMDQ4NDI.*_ga_8JE65Q40S6*czE3NTQwNDcxMzgkbzkkZzEkdDE3NTQwNDkwMjUkajUyJGwwJGgw"],
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
      "Round-trip flights",
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
    dates: [
      "2024-03-15",
      "2024-04-12",
      "2024-05-10",
      "2024-06-14",
      "2024-07-19",
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
    imageUrl: "https://images.pexels.com/photos/8243131/pexels-photo-8243131.jpeg",
    gallery: ["https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg", "https://images.pexels.com/photos/776469/pexels-photo-776469.jpeg", "https://images.pexels.com/photos/31552871/pexels-photo-31552871.jpeg"],
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
      {
        day: 3,
        title: "Begin Trek to Tikhedhunga",
        description: "",
      },
      {
        day: 4,
        title: "Trek to Ghorepani",
        description: "",
      },
      {
        day: 5,
        title: "Sunrise at Poon Hill",
        description: "",
      },
      {
        day: 6,
        title: "Trek to Tadapani",
        description: "",
      },
      {
        day: 7,
        title: "Trek to Ghandruk",
        description: "",
      },
      {
        day: 8,
        title: "Back to Pokhara",
        description: "",
      },
      {
        day: 9,
        title: "Drive to Kathmandu",
        description: "",
      },
      {
        day: 10,
        title: "Departure",
        description: "Fly back home",
      },
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
  },
  {
    title: "Historical Wonders of Rome",
    description:
      "Explore the rich history of Rome through iconic landmarks and guided city tours.",
    price: 999,
    duration: "5 days",
    location: "Italy",
    category: "City",
    rating: 4.7,
    reviews: 413,
    imageUrl: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg",
    gallery: [
      "https://images.pexels.com/photos/326709/pexels-photo-326709.jpeg",
      "https://images.pexels.com/photos/227517/pexels-photo-227517.jpeg",
      "https://images.pexels.com/photos/56886/vittorio-emanuele-monument-rome-rome-palace-altare-della-patria-56886.jpeg",
    ],
    features: [
      "City Pass Included",
      "Skip-the-Line Tickets",
      "Museum Access",
      "Walking Tours",
      "Luxury Stay",
    ],
    availableSlots: 20,
    itinerary: [
      {
        day: 1,
        title: "Arrival in Rome",
        description: "Check-in and welcome dinner",
      },
      {
        day: 2,
        title: "Colosseum & Roman Forum",
        description: "",
      },
      {
        day: 3,
        title: "Vatican Museums & Sistine Chapel",
        description: "",
      },
      {
        day: 4,
        title: "Pantheon & Piazza Navona",
        description: "",
      },
      {
        day: 5,
        title: "Free Time & Departure",
        description: "Shopping or relax before flight",
      },
    ],
    included: [
      "Hotel accommodation",
      "Daily breakfast",
      "Airport pickup",
      "Professional city guide",
      "Entrance fees",
    ],
    notIncluded: [
      "Lunch and dinner",
      "Flight tickets",
      "Travel insurance",
      "Personal expenses",
    ],
    dates: ["2024-08-10", "2024-09-14", "2024-10-19", "2025-01-11"],
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
