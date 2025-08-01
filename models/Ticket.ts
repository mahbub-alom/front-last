import mongoose from 'mongoose';

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
      day: mongoose.Schema.Types.Mixed, // Can be number or empty string
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
