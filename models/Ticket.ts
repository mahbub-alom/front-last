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
  image: {
    type: String,
    required: true,
  },
  availability: {
    type: Number,
    required: true,
    default: 50,
  },
  features: [{
    type: String,
  }],
  availableDates: [{
    type: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);