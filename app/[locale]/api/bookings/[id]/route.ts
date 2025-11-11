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
  const { id } = await context.params;

  try {
    await dbConnect();

    const booking = await Booking.findOne({ bookingId: id });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // If already completed
    if (booking.photoStatus === "completed") {
      return NextResponse.json({ message: "Travel already marked as done" });
    }

    // Mark as completed immediately
    booking.photoStatus = "completed";
    booking.paymentStatus = "completed";

    // Optional: you can still track how many passengers scanned
    booking.passengersCompleted = booking.numberOfPassengers;

    await booking.save();

    return NextResponse.json({
      message: "Booking marked as completed",
      passengersCompleted: booking.passengersCompleted,
      photoStatus: booking.photoStatus,
    });
  } catch (error) {
    console.error("Error updating travel status:", error);
    return NextResponse.json(
      { error: "Failed to update travel status" },
      { status: 500 }
    );
  }
}


