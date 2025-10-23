import mongoose from "mongoose";

const MultiLang = {
  en: { type: String, default: "" },
  es: { type: String, default: "" },
  fr: { type: String, default: "" },
  it: { type: String, default: "" },
  pt: { type: String, default: "" },
};

const MultiLangArray = {
  en: [{ type: String, default: [] }],
  es: [{ type: String, default: [] }],
  fr: [{ type: String, default: [] }],
  it: [{ type: String, default: [] }],
  pt: [{ type: String, default: [] }],
};

const VariationSchema = new mongoose.Schema({
  discountBadge: { type: String, default: "" },
  durationBadge: MultiLang,
  title: MultiLang,
  adultPrice: { type: Number, required: true },
  fullPrice: { type: Number, required: true },
  childPrice: { type: Number, required: true },
  specialOffer: MultiLang,
  features: MultiLangArray,
  image: { type: String, default: "" },
  routes: [{ type: String, default: [] }],
});

const ItinerarySchema = new mongoose.Schema({
  day: mongoose.Schema.Types.Mixed,
  title: MultiLang,
  description: MultiLang,
});

const TicketSchema = new mongoose.Schema({
  title: MultiLang,
  subTitle: MultiLang,
  adultPrice: { type: Number, required: true },
  fullPrice: { type: Number, required: true },
  secondPageTitle: MultiLang,
  secondPageDescription: MultiLang,
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  gallery: [{ type: String, default: [] }],
  features: MultiLangArray,
  availableSlots: { type: Number, required: true },
  itinerary: [ItinerarySchema],
  included: MultiLangArray,
  variations: [VariationSchema],
  createdAt: { type: Date, default: Date.now },
});

delete mongoose.models.Ticket;
export default mongoose.model("Ticket", TicketSchema);
