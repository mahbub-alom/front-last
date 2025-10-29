import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Ticket from "@/models/Ticket";
import {
  generateChildTicketPDF,
  generateAdultTicketPDF,
  sendConfirmationEmail,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { bookingId, paymentId } = await request.json();

    // Update booking payment status
    let booking = await Booking.findOneAndUpdate(
      { bookingId },
      { paymentStatus: "completed", paymentId },
      { new: true }
    ).populate("ticketId");

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Convert Mongoose document to plain object
    booking = booking.toObject();

    // Normalize numbers
    const adults = Number(booking.adults?.$numberInt || booking.adults || 0);
    const children = Number(
      booking.children?.$numberInt || booking.children || 0
    );

    // Update ticket availability
    await Ticket.findByIdAndUpdate(booking.ticketId._id, {
      $inc: { availability: -(adults + children) },
    });

    // Generate PDF buffers
    const pdfBuffers: { filename: string; content: Buffer }[] = [];

    for (let i = 0; i < adults; i++) {
      const buffer = await generateAdultTicketPDF(
        booking,
        booking.ticketId,
        i + 1
      );
      pdfBuffers.push({
        filename: `adult-ticket-${i + 1}.pdf`,
        content: buffer,
      });
    }

    for (let i = 0; i < children; i++) {
      const buffer = await generateChildTicketPDF(
        booking,
        booking.ticketId,
        i + 1
      );
      pdfBuffers.push({
        filename: `child-ticket-${i + 1}.pdf`,
        content: buffer,
      });
    }

    // Send email
    // try {
    //   await sendConfirmationEmail(booking, booking.ticketId, pdfBuffers);
    // } catch (emailError) {
    //   console.error("Email send failed:", emailError);
    // }

    return NextResponse.json({
      success: true,
      booking,
      pdfFiles: pdfBuffers.map((b) => ({
        filename: b.filename,
        content: b.content.toString("base64"),
      })),
    });
  } catch (error) {
    console.error("Booking confirmation failed:", error);
    return NextResponse.json(
      { error: "Failed to confirm booking" },
      { status: 500 }
    );
  }
}
