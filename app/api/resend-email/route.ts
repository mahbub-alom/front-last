import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import {
  generateBookingSummaryPDF,
  generateFreePhotoPDF,
  sendConfirmationEmail,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { bookingId } = await request.json();

    // Find booking and populate ticketId
    const booking = await Booking.findOne({ bookingId }).populate("ticketId");

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const pdfBuffers: { filename: string; content: Buffer }[] = [];

    const bookingSummaryPDF = await generateBookingSummaryPDF(booking);
    pdfBuffers.push({
      filename: "booking-summary.pdf",
      content: bookingSummaryPDF,
    });

    const freePhotoPDF = await generateFreePhotoPDF(booking);
    pdfBuffers.push({
      filename: "free-photo.pdf",
      content: freePhotoPDF,
    });

    await sendConfirmationEmail(booking, booking.ticketId, pdfBuffers);
    await Booking.findByIdAndUpdate(booking._id, { emailSent: true });

    return NextResponse.json({ success: true, message: "Email resent successfully" });
  } catch (error) {
    console.error("Error resending email:", error);
    return NextResponse.json(
      { error: "Failed to resend email" },
      { status: 500 }
    );
  }
}
