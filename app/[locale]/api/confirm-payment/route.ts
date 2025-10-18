import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Ticket from '@/models/Ticket';
import { generateChildTicketPDF,generateAdultTicketPDF, sendConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { bookingId, paymentId } = await request.json();
    
    // Update booking with payment info
    const booking = await Booking.findOneAndUpdate(
      { bookingId },
      { 
        paymentStatus: 'completed',
        paymentId 
      },
      { new: true }
    ).populate('ticketId');
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Update ticket availability
    await Ticket.findByIdAndUpdate(
      booking.ticketId._id,
      { $inc: { availability: -booking.numberOfPassengers } }
    );
    
    // Generate PDF and send email
    try {
            const pdfBuffers: { filename: string; content: Buffer }[] = [];

      // Generate adult tickets
      for (let i = 0; i < booking.adults; i++) {
        const pdfBuffer = await generateAdultTicketPDF(booking, booking.ticketId, i + 1);
        pdfBuffers.push({
          filename: `adult-ticket-${i + 1}.pdf`,
          content: pdfBuffer,
        });
      }

      // Generate child tickets
      for (let i = 0; i < booking.children; i++) {
        const pdfBuffer = await generateChildTicketPDF(booking, booking.ticketId, i + 1);
        pdfBuffers.push({
          filename: `child-ticket-${i + 1}.pdf`,
          content: pdfBuffer,
        });
      }
      // const pdfBuffer = await generateTicketPDF(booking, booking.ticketId);
      await sendConfirmationEmail(booking, booking.ticketId, pdfBuffers);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the payment confirmation if email fails
    }
    
    return NextResponse.json({ 
      success: true,
      booking 
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}