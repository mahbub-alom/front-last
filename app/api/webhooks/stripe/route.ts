import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    if (webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      } catch (err: any) {
        console.error(`Stripe Webhook signature verification failed: ${err.message}`);
        return NextResponse.json(
          { error: `Webhook signature verification failed: ${err.message}` },
          { status: 400 }
        );
      }
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata?.bookingId;

      if (bookingId) {
        await dbConnect();
        const booking = await Booking.findOne({ bookingId }).populate("ticketId");

        if (booking) {
          // Update booking with payment info
          booking.paymentStatus = "completed";
          booking.paymentId = paymentIntent.id;
          await booking.save();

          // Update ticket availability if ticket exists
          if (booking.ticketId?._id) {
            const updatedTicket = await Ticket.findByIdAndUpdate(
              booking.ticketId._id,
              { $inc: { availableSlots: -booking.numberOfPassengers } },
              { new: true }
            );

            if (updatedTicket && updatedTicket.availableSlots < 10) {
              await sendLowSlotAlertEmail(updatedTicket, booking);
            }
          }

          // Send confirmation email if not already sent by client
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

              // Send customer email first
              try {
                await sendConfirmationEmail(booking, booking.ticketId, pdfBuffers);
                await Booking.findByIdAndUpdate(booking._id, { emailSent: true });
                booking.emailSent = true;
                console.log(`[Stripe Webhook] Confirmation email sent immediately for booking ${bookingId}`);
              } catch (custEmailErr) {
                console.error("[Stripe Webhook] Error sending customer email:", custEmailErr);
              }

              // Send admin notification
              try {
                await sendAdminNotificationEmail(booking, booking.ticketId);
              } catch (adminEmailErr) {
                console.error("[Stripe Webhook] Error sending admin email:", adminEmailErr);
              }
            } catch (pdfErr) {
              console.error("[Stripe Webhook] Error generating PDFs:", pdfErr);
            }
          } else {
            console.log(`[Stripe Webhook] Email already sent for booking ${bookingId}`);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
