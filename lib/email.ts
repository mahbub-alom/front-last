import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";
import PDFDocument from "pdfkit";


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



export async function generateTicketPDF(booking: any, ticket: any): Promise<Buffer> {
   const localizedTitle = ticket.title[booking.locale] || ticket.title["en"];
  return new Promise((resolve, reject) => {
    try {
      //  Load your custom font first
      const fontPath = path.join(process.cwd(), "public", "fonts", "Roboto-Regular.ttf");
      if (!fs.existsSync(fontPath)) {
        return reject(new Error("Font file missing: " + fontPath));
      }

      //  Pass the font file to PDFDocument constructor
      const doc = new PDFDocument({
        font: fontPath, // prevents Helvetica.afm loading
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header
      doc.fontSize(24).fillColor("#0077B6").text("BUS & BOAT PARIS", 50, 50);
      doc.fontSize(18).fillColor("#1E1E1E").text("E-Ticket Confirmation", 50, 80);

      // Booking details
      doc.fontSize(14).fillColor("#1E1E1E");
      doc.text(`Booking ID: ${booking.bookingId}`, 50, 120);
      doc.text(`Customer Name: ${booking.customerName}`, 50, 140);
      doc.text(`Email: ${booking.customerEmail}`, 50, 160);
      doc.text(`Phone: ${booking.customerPhone}`, 50, 180);

      // Ticket details
      doc.fontSize(16).fillColor("#0077B6").text("Trip Details", 50, 220);
      doc.fontSize(14).fillColor("#1E1E1E");
      doc.text(`Package: ${localizedTitle}`, 50, 250);
      // doc.text(`Location: ${ticket.location}`, 50, 270);
      // doc.text(`Duration: ${ticket.duration}`, 50, 290);
      doc.text(`Travel Date: ${new Date(booking.travelDate).toLocaleDateString()}`, 50, 310);
      doc.text(`Passengers: ${booking.numberOfPassengers}`, 50, 330);
      doc.text(`Total Amount: $${booking.totalAmount}`, 50, 350);

      // Footer
      doc.fontSize(12).fillColor("#6C757D");
      doc.text("Please show this e-ticket during your travel.", 50, 400);
      doc.text("Thank you for choosing BUS & BOAT PARIS!", 50, 420);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}






export async function sendConfirmationEmail(
  booking: any,
  ticket: any,
  pdfBuffer: Buffer
) {
   const localizedTitle = ticket.title[booking.locale] || ticket.title["en"];
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: booking.customerEmail,
    subject: "✅ Your Travel Ticket Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0077B6;">Dear ${booking.customerName},</h2>
        <p>Thank you for your booking!</p>
        
        <div style="background: #F1F1F1; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1E1E1E; margin-top: 0;">🎟 Trip Details:</h3>
          <p><strong>Package:</strong> ${localizedTitle}</p>
          <p><strong>📅 Travel Date:</strong> ${new Date(
            booking.travelDate
          ).toLocaleDateString()}</p>
          <p><strong>💳 Payment ID:</strong> ${booking.paymentId}</p>
          <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        </div>
        
        <p>Your e-Ticket is attached in PDF format. Please show it during your travel.</p>
        
        <p style="margin-top: 30px;">
          Regards,<br>
          <strong style="color: #0077B6;">BUS & BOAT PARIS</strong>
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `ticket-${booking.bookingId}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  return transporter.sendMail(mailOptions);
}
