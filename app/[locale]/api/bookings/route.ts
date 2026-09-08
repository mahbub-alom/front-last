import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Ticket from "@/models/Ticket";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      ticketId,
      customerName,
      customerEmail,
      customerPhone,
      travelDate,
      numberOfPassengers,
      totalAmount,
      locale,
      title,
      durationBadge,
      image,
      adults,
      children,
    } = body;

    // console.log(
    //   "title:",
    //   title,
    //   "durationBadge:",
    //   durationBadge,
    //   "image:",
    //   image,
    //   "ticketId:",
    //   ticketId,
    //   "customerName:",
    //   customerName,
    //   "customerEmail:",
    //   customerEmail,
    //   "customerPhone:",
    //   customerPhone,
    //   "travelDate:",
    //   travelDate,
    //   "numberOfPassengers:",
    //   numberOfPassengers,
    //   "totalAmount:",
    //   totalAmount,
    //   "locale:",
    //   locale
    // );

    // Get ticket details
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Recalculate price on the backend (from DB)
    let finalAdultPrice = 0;
    let finalChildPrice = 0;

    const numAdults = Number(adults || 0);
    const numChildren = Number(children || 0);

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
    const roundedCalculatedTotal = Math.round(calculatedTotal * 100) / 100;

    // Check availability
    const totalPassengers = numAdults + numChildren;
    if (ticket.availableSlots < totalPassengers) {
      return NextResponse.json(
        { error: "Not enough availability" },
        { status: 400 }
      );
    }

    // Generate booking ID
    const bookingId = `ORB${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    const [day, month, year] = travelDate.split("-");
    const formattedDate = new Date(`${year}-${month}-${day}`);

    // Create booking
    const booking = new Booking({
      ticketId,
      customerName,
      customerEmail,
      customerPhone,
      travelDate: formattedDate,
      numberOfPassengers: totalPassengers,
      totalAmount: roundedCalculatedTotal,
      bookingId,
      locale,
      title,
      durationBadge,
      image,
      children,
      adults,
      paymentStatus: "pending",
      photoStatus: "pending",
      ticketStatus: "pending",
    });

    await booking.save();

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const bookings = await Booking.find()
      .populate("ticketId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
