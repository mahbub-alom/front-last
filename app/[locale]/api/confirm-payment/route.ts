import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Ticket from "@/models/Ticket";
import {

  generateBookingSummaryPDF,
  generateFreePhotoPDF,
  sendConfirmationEmail,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { bookingId, paymentId } = await request.json();

    // Update booking with payment info
    const booking = await Booking.findOneAndUpdate(
      { bookingId },
      {
        paymentStatus: "completed",
        paymentId,
      },
      { new: true }
    ).populate("ticketId");

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update ticket availability
    await Ticket.findByIdAndUpdate(booking.ticketId._id, {
      $inc: { availability: -booking.numberOfPassengers },
    });

    // Generate PDF and send email
    try {
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

      // const pdfBuffer = await generateTicketPDF(booking, booking.ticketId);
      await sendConfirmationEmail(booking, booking.ticketId, pdfBuffers);
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Don't fail the payment confirmation if email fails
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
