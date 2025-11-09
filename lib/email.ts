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

// 1️⃣ Booking Summary PDF
export async function generateBookingSummaryPDF(booking: any): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const fontPath = path.join(
        process.cwd(),
        "public",
        "fonts",
        "Roboto-Regular.ttf"
      );
      if (!fs.existsSync(fontPath))
        return reject(new Error("Font file missing: " + fontPath));

      const doc = new PDFDocument({ size: "A4", margin: 40, font: fontPath });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header
      doc.fillColor("#0077B6").fontSize(24).text("🛳️ Booking Summary", {
        align: "center",
      });
      doc.moveDown();

      // Booking Info
      doc.fillColor("#000").fontSize(12);
      doc.text(`Booking Reference: ${booking.bookingId}`);
      doc.text(`Cruise Type: Sightseeing Cruise`);
      doc.text(`Date: ${new Date(booking.travelDate).toLocaleDateString()}`);
      doc.text(`Departure Time: 10:00-10:00`);
      doc.text(`Duration: 1 hour`);
      doc.text(`Number of Guests: ${booking.numberOfPassengers}`);
      doc.text(`Adult: ${booking.adults}`);
      doc.text(`Children: ${booking.children}`);
      doc.text(`Total Amount Paid: €${booking.totalAmount}`);
      doc.moveDown();

      // Departure & Boarding Info
      doc
        .fillColor("#0077B6")
        .fontSize(16)
        .text("📍 Departure & Boarding Information");
      doc.fillColor("#000").fontSize(12);
      doc.text(
        `Departure Point: Port de la Bourdonnais, near Eiffel Tower, 75007 Paris`
      );
      doc.text(`Check-in: Please arrive at least 20 minutes before departure.`);
      doc.text(`Boarding Gate: GateNumber 03`);
      doc.moveDown();

      // E-ticket info
      doc.fillColor("#0077B6").fontSize(16).text("📧 Your e-Ticket");
      doc.fillColor("#000").fontSize(12);
      doc.text(
        "Your e-ticket will be attached very soon. Sometimes it may take 10-20 minutes. " +
          "Please present it on your mobile device or as a printed copy upon boarding.\n\n" +
          "If you purchased multiple tickets, all passengers should arrive together at the boarding point."
      );
      doc.moveDown();

      // Important Notes
      doc.fillColor("#0077B6").fontSize(16).text("⚠️ Important Notes");
      doc.fillColor("#000").fontSize(12);
      doc.text(
        "Tickets are non-refundable and non-transferable (unless otherwise stated).\n" +
          "In case of bad weather or river conditions, the schedule may be adjusted for safety reasons."
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// 2️⃣ Free Photo PDF
export async function generateFreePhotoPDF(booking: any): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const fontPath = path.join(
        process.cwd(),
        "public",
        "fonts",
        "Roboto-Regular.ttf"
      );
      if (!fs.existsSync(fontPath))
        return reject(new Error("Font file missing: " + fontPath));

          // icons
      const cameraIcon = path.join(process.cwd(), "public", "icons", "camera.png");
      const locationIcon = path.join(process.cwd(), "public", "icons", "location.png");
      const phoneIcon = path.join(process.cwd(), "public", "icons", "phone.png");

      const doc = new PDFDocument({ size: "A4", margin: 40, font: fontPath });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill("#FAF7F2");

      // Title
      doc.fillColor("#C89B3C").font(fontPath).fontSize(26).text("Free Digital Photo Voucher", { align: "center" });
      doc.moveDown(0.5);
      doc.fillColor("#6A6A6A").fontSize(12).text("Seine River Cruise — Paris", { align: "center" });

      doc.moveDown(2);

      // Photo Description Block
      doc.roundedRect(50, 140, doc.page.width - 100, 120, 12)
        .fill("#FFFFFF")
        .strokeColor("#E5D8B6")
        .lineWidth(1)
        .stroke();

      let textY = 160;
      if (fs.existsSync(cameraIcon)) doc.image(cameraIcon, 70, textY, { width: 45 });
      doc.fillColor("#C89B3C").fontSize(16).text("Free Digital Printed Photo", 130, textY + 5);

      doc.fillColor("#333").fontSize(12).text(
        "Enjoy one professionally captured photo with a stunning Eiffel Tower backdrop during your Seine River Cruise.",
        130,
        textY + 30,
        { width: doc.page.width - 180 }
      );

      // Divider
      doc.moveTo(50, 290).lineTo(doc.page.width - 50, 290).strokeColor("#D7C9A3").lineWidth(1).stroke();
      doc.moveDown(1.5);

      // Meeting Point Section
      let y = 310;
      if (fs.existsSync(locationIcon)) doc.image(locationIcon, 60, y, { width: 28 });
      doc.fillColor("#C89B3C").fontSize(16).text("Meeting Point", 100, y + 2);

      y += 35;
      doc.fillColor("#333").fontSize(12).text(
        "Pont d’Iéna, Paris (in front of the Eiffel Tower)",
        60,
        y,
        { width: doc.page.width - 120 }
      );

      // Contact Section
      y += 70;
      if (fs.existsSync(phoneIcon)) doc.image(phoneIcon, 60, y, { width: 26 });
      doc.fillColor("#C89B3C").fontSize(16).text("Need Assistance?", 100, y + 2);

      y += 35;
      doc.fillColor("#333").fontSize(12).text(
        "WhatsApp Support: +33 7 58 21 98 26",
        60,
        y,
        { width: doc.page.width - 120 }
      );

      // Footer
      doc.fillColor("#A58C5F").fontSize(10).text(
        `Valid for the date of your cruise • Booking ID: ${booking.bookingId}`,
        0,
        doc.page.height - 60,
        { align: "center" }
      );


      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

export async function sendConfirmationEmail(
  booking: any,
  ticket: any,
  pdfBuffers: { filename: string; content: Buffer }[]
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: booking.customerEmail,
    subject: `🎟️ Your Seine River Cruise Ticket – Booking Confirmation ${booking.bookingId}`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f9fc; border-radius: 10px; color: #333;">
  <p style="font-size: 16px;">Dear <strong>${booking.customerName}</strong>,</p>

  <p style="font-size: 16px; line-height: 1.5;">
    Thank you for booking with <strong>Bus & Boat Paris</strong>.<br>
    We’re delighted to confirm your <strong>Seine River Cruise</strong> experience on the beautiful River Seine in Paris. Please find your booking details below:
  </p>

 

  <p style="font-size: 16px; line-height: 1.5;">
    We look forward to welcoming you on board!
  </p>

  <p style="font-size: 14px; color: #666; margin-top: 20px;">
    Best regards,<br>
    <strong>Bus & Boat Paris</strong>
  </p>
</div>
`,
    attachments: pdfBuffers.map((file) => ({
      filename: file.filename,
      content: file.content,
      contentType: "application/pdf",
    })),
  };

  return transporter.sendMail(mailOptions);
}
