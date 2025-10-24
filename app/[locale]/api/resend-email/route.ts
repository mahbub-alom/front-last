import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Ticket from "@/models/Ticket"; // ✅ make sure this is imported
import {
  generateAdultTicketPDF,
  generateChildTicketPDF,
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

    // Generate PDF depending on children count
    const pdfBuffers: { filename: string; content: Buffer }[] = [];

    if (booking.adults > 0) {
      const adultPdf = await generateAdultTicketPDF(
        booking,
        booking.ticketId,
        0
      );
      pdfBuffers.push({
        filename: `adult-ticket-${booking.bookingId}.pdf`,
        content: adultPdf,
      });
    }

    if (booking.children > 0) {
      const childPdf = await generateChildTicketPDF(
        booking,
        booking.ticketId,
        0
      );
      pdfBuffers.push({
        filename: `child-ticket-${booking.bookingId}.pdf`,
        content: childPdf,
      });
    }

    // Send email
    await sendConfirmationEmail(booking, booking.ticketId, pdfBuffers);

    // await sendConfirmationEmail(booking, booking.ticketId, pdfBuffer);

    return NextResponse.json({ message: "Email resent successfully" });
  } catch (error) {
    console.error("Error resending email:", error);
    return NextResponse.json(
      { error: "Failed to resend email" },
      { status: 500 }
    );
  }
}
