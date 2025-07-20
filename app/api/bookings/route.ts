import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Ticket from '@/models/Ticket';
import { generateTicketPDF, sendConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { ticketId, customerName, customerEmail, customerPhone, travelDate, numberOfPassengers } = body;
    
    // Get ticket details
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }
    
    // Check availability
    if (ticket.availability < numberOfPassengers) {
      return NextResponse.json(
        { error: 'Not enough availability' },
        { status: 400 }
      );
    }
    
    // Generate booking ID
    const bookingId = `ORB${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Calculate total amount
    const totalAmount = ticket.price * numberOfPassengers;
    
    // Create booking
    const booking = new Booking({
      ticketId,
      customerName,
      customerEmail,
      customerPhone,
      travelDate,
      numberOfPassengers,
      totalAmount,
      bookingId,
      paymentStatus: 'pending',
    });
    
    await booking.save();
    
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const bookings = await Booking.find()
      .populate('ticketId')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}