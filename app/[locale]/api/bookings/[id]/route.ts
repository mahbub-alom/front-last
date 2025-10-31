import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await here

  try {
    await dbConnect();

    const booking = await Booking.findOne({ bookingId: id }).populate("ticketId");

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
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await here

  try {
    await dbConnect();

    const booking = await Booking.findOne({ bookingId: id });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.travelStatus === "completed") {
      return NextResponse.json({ message: "Travel already marked as done" });
    }

    if (booking.passengersCompleted >= booking.numberOfPassengers) {
      return NextResponse.json({ message: "All passengers already scanned" });
    }

    booking.passengersCompleted = (booking.passengersCompleted || 0) + 1;

    if (booking.passengersCompleted >= booking.numberOfPassengers) {
      booking.travelStatus = "completed";
      booking.paymentStatus = "completed";
    }

    await booking.save();

    return NextResponse.json({
      message: "Passenger scanned successfully",
      passengersCompleted: booking.passengersCompleted,
      totalPassengers: booking.numberOfPassengers,
      travelStatus: booking.travelStatus,
    });
  } catch (error) {
    console.error("Error updating travel status:", error);
    return NextResponse.json(
      { error: "Failed to update travel status" },
      { status: 500 }
    );
  }
}

