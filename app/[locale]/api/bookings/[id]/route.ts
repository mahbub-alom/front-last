import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const booking = await Booking.findOne({ bookingId: params.id }).populate(
      "ticketId"
    );

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// ----------------- PATCH method -----------------
export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const booking = await Booking.findOne({ bookingId: params.id });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.travelStatus === "done") {
      return NextResponse.json({ message: "Travel already marked as done" });
    }
    booking.paymentStatus = "completed";
    booking.travelStatus = "completed";
    await booking.save();

    return NextResponse.json({ message: "Travel status updated", booking });
  } catch (error) {
    console.error("Error updating travel status:", error);
    return NextResponse.json(
      { error: "Failed to update travel status" },
      { status: 500 }
    );
  }
}
