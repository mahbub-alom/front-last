import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Ticket from "@/models/Ticket";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { bookingId, ticketId, adults, children, title } = await request.json();

    let finalAmount = 0;

    if (bookingId) {
      // Find existing booking
      const booking = await Booking.findOne({ bookingId });
      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }
      finalAmount = booking.totalAmount;
    } else if (ticketId) {
      // Calculate directly from ticket (for wallet checkout created before booking)
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
      }

      const numAdults = Number(adults || 0);
      const numChildren = Number(children || 0);

      let finalAdultPrice = 0;
      let finalChildPrice = 0;

      if (ticket.variations && ticket.variations.length > 0) {
        const targetTitleEn = title?.en || (typeof title === "string" ? title : "");
        const variation = ticket.variations.find((v: any) => {
          return (
            v.title?.en === targetTitleEn ||
            (v.title?.fr && title?.fr && v.title?.fr === title?.fr) ||
            (v.title?.es && title?.es && v.title?.es === title?.es) ||
            (v.title?.it && title?.it && v.title?.it === title?.it) ||
            (v.title?.pt && title?.pt && v.title?.pt === title?.pt)
          );
        });

        if (!variation) {
          return NextResponse.json(
            { error: "Invalid variation selected" },
            { status: 400 }
          );
        }
        finalAdultPrice = variation.adultPrice;
        finalChildPrice = variation.childPrice;
      } else {
        finalAdultPrice = ticket.adultPrice;
        finalChildPrice = ticket.childPrice || 0;
      }

      const calculatedTotal = (numAdults * finalAdultPrice) + (numChildren * finalChildPrice);
      finalAmount = Math.round(calculatedTotal * 100) / 100;
    } else {
      return NextResponse.json(
        { error: "Missing bookingId or ticketId" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100), // Convert to cents
      currency: "eur",
      metadata: {
        bookingId: bookingId || "",
      },
      automatic_payment_methods: {
        enabled: true,
      },
      payment_method_options: {
        card: {
          request_three_d_secure: "any",
        },
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}

