import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ticket from '@/models/Ticket';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const location = searchParams.get('location');
    
    let query = {};
    
    if (location) {
      query = { location: { $regex: location, $options: 'i' } };
    }
    
    let ticketsQuery = Ticket.find(query);
    
    if (limit) {
      ticketsQuery = ticketsQuery.limit(parseInt(limit));
    }
    
    const tickets = await ticketsQuery.sort({ createdAt: -1 });
    
    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const ticket = new Ticket(body);
    await ticket.save();
    
    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}