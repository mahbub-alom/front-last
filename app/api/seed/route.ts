import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

const sampleTickets = [
  {
    title: "Bali Paradise Adventure",
    description:
      "Experience the magical beauty of Bali with our comprehensive 7-day package. Visit ancient temples, pristine beaches, lush rice terraces, and vibrant cultural sites. Includes accommodation, meals, and guided tours.",
    price: 899,
    duration: "7 Days / 6 Nights",
    location: "Bali, Indonesia",
    image:
      "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800",
    availability: 25,
    features: [
      "Luxury beachfront accommodation",
      "Daily breakfast and dinner",
      "Temple tours with expert guides",
      "Traditional Balinese spa treatment",
      "Airport transfers included",
      "Cultural dance performances",
    ],
    availableDates: [
      new Date("2025-03-15"),
      new Date("2025-03-22"),
      new Date("2025-04-05"),
      new Date("2025-04-12"),
    ],
  },
  {
    title: "Paris Romance Getaway",
    description:
      "Fall in love with the City of Light on this romantic 5-day escape. Explore iconic landmarks, enjoy Seine river cruises, visit world-class museums, and indulge in exquisite French cuisine.",
    price: 1299,
    duration: "5 Days / 4 Nights",
    location: "Paris, France",
    image:
      "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800",
    availability: 20,
    features: [
      "Boutique hotel in central Paris",
      "Seine river dinner cruise",
      "Skip-the-line Louvre Museum tickets",
      "Eiffel Tower priority access",
      "Wine tasting experience",
      "Professional photography session",
    ],
    availableDates: [
      new Date("2025-03-20"),
      new Date("2025-04-10"),
      new Date("2025-04-24"),
      new Date("2025-05-08"),
    ],
  },
  {
    title: "Tokyo Cultural Discovery",
    description:
      "Immerse yourself in the fascinating blend of traditional and modern Japan. Experience ancient temples, cutting-edge technology, incredible cuisine, and the unique culture of Tokyo.",
    price: 1599,
    duration: "8 Days / 7 Nights",
    location: "Tokyo, Japan",
    image:
      "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800",
    availability: 15,
    features: [
      "Traditional ryokan accommodation",
      "Sushi making workshop",
      "Mount Fuji day trip",
      "Tokyo city guided tours",
      "Bullet train experience",
      "Traditional tea ceremony",
    ],
    availableDates: [
      new Date("2025-03-25"),
      new Date("2025-04-15"),
      new Date("2025-05-01"),
      new Date("2025-05-15"),
    ],
  },
  {
    title: "New York City Explorer",
    description:
      "Discover the energy and excitement of the Big Apple. From Broadway shows to world-famous museums, iconic skylines to diverse neighborhoods, experience all that NYC has to offer.",
    price: 1199,
    duration: "6 Days / 5 Nights",
    location: "New York, USA",
    image:
      "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800",
    availability: 30,
    features: [
      "Times Square hotel accommodation",
      "Broadway show tickets",
      "Statue of Liberty ferry tour",
      "Central Park guided walk",
      "Empire State Building access",
      "9/11 Memorial visit",
    ],
    availableDates: [
      new Date("2025-03-18"),
      new Date("2025-04-02"),
      new Date("2025-04-16"),
      new Date("2025-05-07"),
    ],
  },
  {
    title: "London Heritage Tour",
    description:
      "Explore the rich history and royal heritage of London. Visit magnificent palaces, historic landmarks, world-class museums, and experience traditional British culture.",
    price: 1099,
    duration: "6 Days / 5 Nights",
    location: "London, UK",
    image:
      "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800",
    availability: 22,
    features: [
      "Historic hotel near Westminster",
      "Buckingham Palace tour",
      "Thames river cruise",
      "Tower of London visit",
      "British Museum guided tour",
      "Traditional afternoon tea",
    ],
    availableDates: [
      new Date("2025-03-12"),
      new Date("2025-03-26"),
      new Date("2025-04-09"),
      new Date("2025-04-23"),
    ],
  },
  {
    title: "Swiss Alps Adventure",
    description:
      "Experience the breathtaking beauty of the Swiss Alps with scenic train rides, mountain hiking, charming villages, and pristine lakes in this unforgettable alpine adventure.",
    price: 1799,
    duration: "9 Days / 8 Nights",
    location: "Swiss Alps, Switzerland",
    image:
      "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800",
    availability: 18,
    features: [
      "Mountain chalet accommodation",
      "Scenic train journeys",
      "Cable car to Jungfraujoch",
      "Lake Geneva boat cruise",
      "Swiss chocolate factory tour",
      "Alpine hiking with guides",
    ],
    availableDates: [
      new Date("2025-04-01"),
      new Date("2025-04-20"),
      new Date("2025-05-10"),
      new Date("2025-05-25"),
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
