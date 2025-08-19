import mongoose from "mongoose";

const VariationSchema = new mongoose.Schema({
  discountBadge: {
    type: String,
  },
  durationBadge: {
    type: String, // "24", "48", "Night Tour"
  },
  title: {
    type: String,
    required: true,
  },
  adultPrice: {
    type: String,
    required: true,
  },
  fullPrice: {
    type: String,
    required: true,
  },
  childPrice: {
    type: String,
    required: true,
  },
  specialOffer: {
    type: String,
  },
  features: [
    {
      type: String,
    },
  ],
  image: {
    type: String,
  },
  routes: [
    {
      type: String,
    },
  ],
});

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  reviews: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  gallery: [
    {
      type: String,
    },
  ],
  features: [
    {
      type: String,
    },
  ],
  availableSlots: {
    type: Number,
    required: true,
  },
  itinerary: [
    {
      day: mongoose.Schema.Types.Mixed, // number or empty string
      title: String,
      description: String,
    },
  ],
  included: [
    {
      type: String,
    },
  ],
  notIncluded: [
    {
      type: String,
    },
  ],
  dates: [
    {
      type: Date,
    },
  ],

  // ✅ new field for variations
  variations: [VariationSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

delete mongoose.models.Ticket;
export default mongoose.model("Ticket", TicketSchema);
