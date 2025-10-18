import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  travelDate: {
    type: Date,
    required: true,
  },
  numberOfPassengers: {
    type: Number,
    required: true,
    default: 1,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentId: {
    type: String,
  },
  locale: {
    type: String,
    required: true,
  },
  durationBadge: {
    en: { type: String },
    es: { type: String },
    fr: { type: String },
    it: { type: String },
    pt: { type: String },
  },
  image: {
    type: String,
  },
  title: {
    en: { type: String },
    es: { type: String },
    fr: { type: String },
    it: { type: String },
    pt: { type: String },
  },

  bookingId: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
