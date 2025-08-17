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
  // {
  //   title: "Himalayan Trek Adventure",
  //   description:
  //     "A breathtaking journey through the Himalayas with experienced guides and unforgettable views.",
  //   price: 1599,
  //   duration: "10 days",
  //   location: "Nepal",
  //   category: "Adventure",
  //   rating: 4.8,
  //   reviews: 287,
  //   imageUrl: "https://images.pexels.com/photos/8243131/pexels-photo-8243131.jpeg",
  //   gallery: ["https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg", "https://images.pexels.com/photos/776469/pexels-photo-776469.jpeg", "https://images.pexels.com/photos/31552871/pexels-photo-31552871.jpeg"],
  //   features: [
  //     "Mountain Trekking",
  //     "Tent Accommodation",
  //     "Local Cuisine",
  //     "Campfires",
  //     "Glacier Walk",
  //   ],
  //   availableSlots: 8,
  //   itinerary: [
  //     {
  //       day: 1,
  //       title: "Arrival in Kathmandu",
  //       description: "Meet and greet at the airport",
  //     },
  //     {
  //       day: 2,
  //       title: "Drive to Pokhara",
  //       description: "Scenic ride to the base town",
  //     },
  //     {
  //       day: 3,
  //       title: "Begin Trek to Tikhedhunga",
  //       description: "",
  //     },
  //     {
  //       day: 4,
  //       title: "Trek to Ghorepani",
  //       description: "",
  //     },
  //     {
  //       day: 5,
  //       title: "Sunrise at Poon Hill",
  //       description: "",
  //     },
  //     {
  //       day: 6,
  //       title: "Trek to Tadapani",
  //       description: "",
  //     },
  //     {
  //       day: 7,
  //       title: "Trek to Ghandruk",
  //       description: "",
  //     },
  //     {
  //       day: 8,
  //       title: "Back to Pokhara",
  //       description: "",
  //     },
  //     {
  //       day: 9,
  //       title: "Drive to Kathmandu",
  //       description: "",
  //     },
  //     {
  //       day: 10,
  //       title: "Departure",
  //       description: "Fly back home",
  //     },
  //   ],
  //   included: [
  //     "Local transport",
  //     "Guide and porter services",
  //     "Accommodation during trek",
  //     "All meals",
  //     "Permit and entrance fees",
  //   ],
  //   notIncluded: [
  //     "International flights",
  //     "Travel insurance",
  //     "Personal equipment",
  //     "Tips",
  //   ],
  //   dates: ["2024-09-05", "2024-10-03", "2024-11-07", "2025-03-13"],
  // },
   {
      "title": "Himalayan Trek Adventure",
      "description": "A breathtaking journey through the Himalayas with experienced guides and unforgettable views.",
      "price": 1599,
      "duration": "10 days",
      "location": "Nepal",
      "category": "Adventure",
      "rating": 4.8,
      "reviews": 287,
      "imageUrl": "https://images.pexels.com/photos/8243131/pexels-photo-8243131.jpeg",
      "gallery": [
        "https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg",
        "https://images.pexels.com/photos/776469/pexels-photo-776469.jpeg",
        "https://images.pexels.com/photos/31552871/pexels-photo-31552871.jpeg"
      ],
      "features": [
        "Mountain Trekking",
        "Tent Accommodation",
        "Local Cuisine",
        "Campfires",
        "Glacier Walk"
      ],
      "availableSlots": 8,
      "itinerary": [
        { "day": 1, "title": "Arrival in Kathmandu", "description": "Meet and greet at the airport" },
        { "day": 2, "title": "Drive to Pokhara", "description": "Scenic ride to the base town" },
        { "day": 3, "title": "Begin Trek to Tikhedhunga", "description": "" },
        { "day": 4, "title": "Trek to Ghorepani", "description": "" },
        { "day": 5, "title": "Sunrise at Poon Hill", "description": "" },
        { "day": 6, "title": "Trek to Tadapani", "description": "" },
        { "day": 7, "title": "Trek to Ghandruk", "description": "" },
        { "day": 8, "title": "Back to Pokhara", "description": "" },
        { "day": 9, "title": "Drive to Kathmandu", "description": "" },
        { "day": 10, "title": "Departure", "description": "Fly back home" }
      ],
      "included": [
        "Local transport",
        "Guide and porter services",
        "Accommodation during trek",
        "All meals",
        "Permit and entrance fees"
      ],
      "notIncluded": [
        "International flights",
        "Travel insurance",
        "Personal equipment",
        "Tips"
      ],
      "dates": ["2024-09-05", "2024-10-03", "2024-11-07", "2025-03-13"],
      "variations": [
        {
          "discount": "10%",
          "hours": "48",
          "title": "Himalayan Express Trek",
          "adultFromPrice": 899,
          "fullPriceFrom": 1099,
          "note": "Perfect for those short on time, covering the best highlights.",
          "whatsIncluded": ["Transport", "Guide", "Meals", "1 Night Camp"],
          "images": [
            "https://images.pexels.com/photos/2253828/pexels-photo-2253828.jpeg",
            "https://images.pexels.com/photos/672358/pexels-photo-672358.jpeg"
          ]
        },
        {
          "discount": "15%",
          "hours": "24",
          "title": "Himalayan Day Hike",
          "adultFromPrice": 499,
          "fullPriceFrom": 599,
          "note": "A short but scenic hike for beginners.",
          "whatsIncluded": ["Guide", "Lunch", "Permit"],
          "images": [
            "https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg",
            "https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg"
          ]
        },
        {
          "discount": "20%",
          "hours": "Night Tour",
          "title": "Full Moon Himalayan Trek",
          "adultFromPrice": 1299,
          "fullPriceFrom": 1499,
          "note": "A magical trekking experience under the moonlight.",
          "whatsIncluded": ["Tent Stay", "Dinner", "Guide", "Transport"],
          "images": [
            "https://images.pexels.com/photos/912110/pexels-photo-912110.jpeg",
            "https://images.pexels.com/photos/238622/pexels-photo-238622.jpeg"
          ]
        },
        {
          "discount": "12%",
          "hours": "48",
          "title": "Himalayan Adventure Plus",
          "adultFromPrice": 1399,
          "fullPriceFrom": 1599,
          "note": "Includes glacier walk and extended trekking route.",
          "whatsIncluded": ["Meals", "Guide", "Camping Gear", "Porter"],
          "images": [
            "https://images.pexels.com/photos/2662086/pexels-photo-2662086.jpeg",
            "https://images.pexels.com/photos/672358/pexels-photo-672358.jpeg"
          ]
        },
        {
          "discount": "18%",
          "hours": "24",
          "title": "Himalayan Sunrise Tour",
          "adultFromPrice": 699,
          "fullPriceFrom": 849,
          "note": "Catch the most beautiful sunrise from Poon Hill.",
          "whatsIncluded": ["Guide", "Breakfast", "Transport"],
          "images": [
            "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg",
            "https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg"
          ]
        },
        {
          "discount": "25%",
          "hours": "Night Tour",
          "title": "Campfire Himalayan Trek",
          "adultFromPrice": 1199,
          "fullPriceFrom": 1399,
          "note": "Includes a cultural night with local music and dance.",
          "whatsIncluded": ["Meals", "Campfire Night", "Guide", "Transport"],
          "images": [
            "https://images.pexels.com/photos/169915/pexels-photo-169915.jpeg",
            "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg"
          ]
        }
      ]
    }
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
