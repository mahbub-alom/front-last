import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  await dbConnect();

  const form = await req.formData();
  const bookingId = form.get("bookingId") as string;
  const email = form.get("email") as string;
  const file = form.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  // Read file buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // ---- FIX: Create absolute path & folder ----
  const ticketsDir = path.join(process.cwd(), "public", "tickets");
  await mkdir(ticketsDir, { recursive: true });

  // File name + path
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(ticketsDir, fileName);

  // Save file
  await writeFile(filePath, buffer);

  // ---- Nodemailer ----
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Paris Bus & Boat" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Ticket",
    text: "Your ticket is attached.",
    attachments: [
      {
        filename: fileName,
        path: filePath,
      },
    ],
  });

  // ---- Update booking status ----
  await Booking.findOneAndUpdate(
    { bookingId },
    { ticketStatus: "complete" }
  );

  return NextResponse.json({ success: true });
}
