import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function POST(req: Request) {
  await dbConnect();

  const form = await req.formData();
  const bookingId = form.get("bookingId") as string;
  const email = form.get("email") as string;
  const files = form.getAll("files") as File[]; 

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "At least one ticket file is required" }, { status: 400 });
  }


  // Send email with all files attached
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });


     const attachments = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return {
          filename: file.name,
          content: buffer,
        };
      })
    );

  await transporter.sendMail({
    from: `"Paris Bus & Boat" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Tickets for Bus & Boat Paris",
    text: "Your tickets are attached. Thank you for booking with us!", 
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
      <h2 style="color: #740e27;">Paris Bus & Boat</h2>
      <p>Dear Passenger,</p>
      <p>Thank you for booking with <strong>Bus & Boat Paris</strong>! Please find your ticket(s) attached to this email.</p>
      <ul>
        ${attachments.map((att) => `<li>${att.filename}</li>`).join("")}
      </ul>
      <p style="margin-top: 20px;">We look forward to seeing you soon in Paris!</p>
      <p>Best regards,<br/>The Bus & Boat Paris Team</p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>
      <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply directly.</p>
    </div>
  `,
    attachments, 
  });

  // Update booking ticketStatus
  const updatedBooking = await Booking.findOneAndUpdate(
    { bookingId },
    { ticketStatus: "complete" },
    { new: true }
  );

  if (!updatedBooking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
