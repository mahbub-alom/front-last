import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Ticket from "@/models/Ticket";
import {
  generateBookingSummaryPDF,
  generateFreePhotoPDF,
  sendConfirmationEmail,
  sendAdminNotificationEmail,
  sendLowSlotAlertEmail,
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

    // Update ticket availability and get updated document
    const updatedTicket = await Ticket.findByIdAndUpdate(
      booking.ticketId._id,
      { $inc: { availableSlots: -booking.numberOfPassengers } },
      { new: true }
    );

    if (!updatedTicket) {
      console.error("Ticket not found while updating availability");
    } else {
      // Send alert email if low slots
      if (updatedTicket.availableSlots < 10) {
        await sendLowSlotAlertEmail(updatedTicket, booking);
      }
    }

    // Generate PDFs and send emails (only if not already sent — prevents duplicates)
    if (!booking.emailSent) {
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

        // Send customer confirmation email first
        try {
          await sendConfirmationEmail(booking, booking.ticketId, pdfBuffers);
          // Mark email as sent immediately to avoid duplicates
          await Booking.findByIdAndUpdate(booking._id, { emailSent: true });
          booking.emailSent = true;
        } catch (customerEmailError) {
          console.error("Error sending customer confirmation email:", customerEmailError);
        }

        // Send admin notification email separately (admin error will not affect customer confirmation)
        try {
          await sendAdminNotificationEmail(booking, booking.ticketId);
        } catch (adminEmailError) {
          console.error("Error sending admin notification email:", adminEmailError);
        }
      } catch (pdfError) {
        console.error("Error generating PDFs for confirmation email:", pdfError);
      }
    } else {
      console.log(`Emails already sent for booking ${bookingId} — skipping.`);
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
