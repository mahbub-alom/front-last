import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { generateTicketPDF, sendConfirmationEmail } from '@/lib/email';
import  Ticket  from '@/models/Ticket';



export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { bookingId } = await request.json();
    
    // Find booking with ticket details
    const booking = await Booking.findOne({ bookingId }).populate('ticketId');
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Generate PDF and send email
    const pdfBuffer = await generateTicketPDF(booking, booking.ticketId);
    await sendConfirmationEmail(booking, booking.ticketId, pdfBuffer);
    
    return NextResponse.json({
      message: 'Email resent successfully'
    });
  } catch (error) {
    console.error('Error resending email:', error);
    return NextResponse.json(
      { error: 'Failed to resend email' },
      { status: 500 }
    );
  }
}