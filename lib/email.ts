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

      const pageWidth = doc.page.width;

      // ---------------- HEADER ----------------
      const cruiseIcon = path.join(process.cwd(), "public/icons/cruise.png"); // adjust path

      // Header background
      doc.rect(0, 0, pageWidth, 100).fill("#0D3B66");

      // Add cruise image if exists
      if (fs.existsSync(cruiseIcon)) {
        doc.image(cruiseIcon, 50, 30, { width: 40, height: 40 }); // x=50, y=30, size 40x40
      }

      // Add title text next to image
      doc.fillColor("#FFD700").fontSize(26).text("Booking Summary", 100, 35); // adjust x to move text right of image

      // Subtitle
      doc
        .fillColor("#FFFFFF")
        .fontSize(12)
        .text("Seine River Cruise — Paris", 100, 70);

      doc.moveDown(2);

      // ---------------- SECTION HELPER ----------------
      const drawSection = (
        title: string,
        content: string[],
        iconPath?: string
      ) => {
        // Section card background
        const yStart = doc.y;
        doc
          .roundedRect(
            50,
            yStart,
            pageWidth - 100,
            content.length * 18 + 50,
            10
          )
          .fill("#F7F7F7");

        // Section title with icon
        if (iconPath && fs.existsSync(iconPath)) {
          doc.image(iconPath, 60, yStart + 10, { width: 16 });
          doc
            .fillColor("#0D3B66")
            .fontSize(14)
            .text(`  ${title}`, 80, yStart + 10);
        } else {
          doc
            .fillColor("#0D3B66")
            .fontSize(14)
            .text(title, 60, yStart + 10);
        }

        // Divider line
        doc
          .moveTo(60, yStart + 30)
          .lineTo(pageWidth - 60, yStart + 30)
          .stroke("#FFD700");

        // Content
        doc.fillColor("#333").fontSize(12);
        content.forEach((line, i) => {
          doc.text(line, 60, yStart + 40 + i * 18);
        });

        doc.moveDown(2);
      };

      const icons = {
        calendar: path.join(process.cwd(), "public/icons/calendar.png"),
        location: path.join(process.cwd(), "public/icons/location.png"),
        email: path.join(process.cwd(), "public/icons/email.png"),
        alert: path.join(process.cwd(), "public/icons/alert.png"),
      };

      // ---------------- SECTIONS ----------------
      drawSection(
        "Booking Details",
        [
          `Booking Reference: ${booking.bookingId}`,
          `Cruise Type: Sightseeing Cruise`,
          `Date: ${new Date(booking.travelDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`,
          `Departure Time: 10:00 - 11:00 (Duration: 1 hour)`,
          `Guests: ${booking.numberOfPassengers} (Adults: ${booking.adults}, Children: ${booking.children})`,
          `Total Paid: €${booking.totalAmount}`,
        ],
        icons.calendar
      );

      drawSection(
        "Departure & Boarding Information",
        [
          `Departure Point: Port de la Bourdonnais, near Eiffel Tower, 75007 Paris`,
          `Check-in: Arrive at least 20 minutes before departure`,
          `Boarding Gate: 03`,
        ],
        icons.location
      );

      drawSection(
        "Your e-Ticket",
        [
          `Your e-ticket will arrive shortly (may take 10–20 minutes).`,
          `Show on your mobile device or bring a printed copy.`,
          `All passengers must arrive together at the boarding gate.`,
        ],
        icons.email
      );

      drawSection(
        "Important Notes",
        [
          "• Tickets are non-refundable and non-transferable unless stated otherwise.",
          "• In case of bad weather or river restrictions, schedule adjustments may occur for safety.",
        ],
        icons.alert
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
      const cameraIcon = path.join(
        process.cwd(),
        "public",
        "icons",
        "camera.png"
      );
      const locationIcon = path.join(
        process.cwd(),
        "public",
        "icons",
        "location.png"
      );
      const phoneIcon = path.join(
        process.cwd(),
        "public",
        "icons",
        "phone.png"
      );

      const doc = new PDFDocument({ size: "A4", margin: 40, font: fontPath });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill("#FAF7F2");

      // Title
      doc
        .fillColor("#C89B3C")
        .font(fontPath)
        .fontSize(26)
        .text("Free Digital Printed Photo Voucher", { align: "center" });
      doc.moveDown(0.5);
      doc
        .fillColor("#6A6A6A")
        .fontSize(12)
        .text("Seine River Cruise — Paris", { align: "center" });

      doc.moveDown(2);

      // Photo Description Block
      doc
        .roundedRect(50, 140, doc.page.width - 100, 120, 12)
        .fill("#FFFFFF")
        .strokeColor("#E5D8B6")
        .lineWidth(1)
        .stroke();

      let textY = 160;
      if (fs.existsSync(cameraIcon))
        doc.image(cameraIcon, 70, textY, { width: 45 });
      doc
        .fillColor("#C89B3C")
        .fontSize(16)
        .text("Free Digital Printed Photo", 130, textY + 5);

      doc
        .fillColor("#333")
        .fontSize(12)
        .text(
          "Enjoy one professionally captured photo with a stunning Eiffel Tower backdrop during your Seine River Cruise.",
          130,
          textY + 30,
          { width: doc.page.width - 180 }
        );

      // Divider
      doc
        .moveTo(50, 290)
        .lineTo(doc.page.width - 50, 290)
        .strokeColor("#D7C9A3")
        .lineWidth(1)
        .stroke();
      doc.moveDown(1.5);

      // Meeting Point Section
      let y = 310;
      if (fs.existsSync(locationIcon))
        doc.image(locationIcon, 60, y, { width: 28 });
      doc
        .fillColor("#C89B3C")
        .fontSize(16)
        .text("Meeting Point", 100, y + 2);

      y += 35;
      doc
        .fillColor("#333")
        .fontSize(12)
        .text("Pont d’Iéna, Paris (in front of the Eiffel Tower)", 60, y, {
          width: doc.page.width - 120,
        });

      // Contact Section
      y += 70;
      if (fs.existsSync(phoneIcon)) doc.image(phoneIcon, 60, y, { width: 26 });
      doc
        .fillColor("#C89B3C")
        .fontSize(16)
        .text("Need Assistance?", 100, y + 2);

      y += 35;
      doc
        .fillColor("#333")
        .fontSize(12)
        .text("WhatsApp Support: +33 7 58 21 98 26", 60, y, {
          width: doc.page.width - 120,
        });

      // Footer
      doc
        .fillColor("#A58C5F")
        .fontSize(10)
        .text(
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

export async function sendLowSlotAlertEmail(ticket: any, booking: any) {
  const localizedTitle = ticket.title[booking.locale] || ticket.title["en"];
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "pagliidur@gmail.com",
    subject: `⚠ Low Availability Alert – ${localizedTitle}`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff4f4; border-radius: 10px; color: #333; border: 1px solid #ffb3b3;">
  <h2 style="color: #d9534f;">⚠ Low Availability Warning</h2>

  <p style="font-size: 16px; line-height: 1.5;">
    This is an automatic alert from <strong>Bus & Boat Paris</strong>.
  </p>

  <p style="font-size: 16px; line-height: 1.5;">
    The following ticket is running low on available slots:
  </p>

  <div style="padding: 15px; background: #ffecec; border-radius: 8px; margin-top: 10px;">
    <p><strong>Ticket Name:</strong> ${localizedTitle}</p>
    <p><strong>Remaining Slots:</strong> ${ticket.availableSlots}</p>
  </div>

  <p style="font-size: 15px; margin-top: 20px;">
    Please take action if needed (add more Availability, adjust pricing, etc.).
  </p>

  <p style="font-size: 14px; color: #777; margin-top: 30px;">
    – Bus & Boat Paris Admin Panel
  </p>
</div>
`,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendConfirmationEmail(
  booking: any,
  ticket: any,
  pdfBuffers: { filename: string; content: Buffer }[]
) {
  const locale = booking.locale || "en";
  const localizedTitle =
    booking.title?.[locale] || booking.title?.["en"] || ticket?.title?.[locale] || ticket?.title?.["en"] || "Seine River Cruise";
  const localizedDuration =
    booking.durationBadge?.[locale] || booking.durationBadge?.["en"] || "";
  const travelDateFormatted = new Date(booking.travelDate).toLocaleDateString(
    "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );
  const bookingDateFormatted = new Date(
    booking.createdAt || Date.now()
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const mailOptions = {
    from: `"Bus & Boat Paris" <${process.env.EMAIL_USER}>`,
    to: booking.customerEmail,
    subject: `🎟️ Booking Confirmed – ${localizedTitle} | ${booking.bookingId}`,
    html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #0D3B66 0%, #1a5276 100%); padding: 32px 24px; text-align: center;">
    <h1 style="color: #FFD700; margin: 0; font-size: 24px; font-weight: 700;">✅ Booking Confirmed!</h1>
    <p style="color: #ffffff; margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Your Seine River Cruise experience is booked</p>
  </div>

  <!-- Body -->
  <div style="padding: 24px;">
    <p style="font-size: 16px; color: #333; margin: 0 0 20px;">Dear <strong>${booking.customerName}</strong>,</p>
    <p style="font-size: 15px; color: #555; line-height: 1.6; margin: 0 0 24px;">
      Thank you for booking with <strong>Bus & Boat Paris</strong>. We're delighted to confirm your reservation. Please find your booking details below:
    </p>

    <!-- Booking Details Card -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
      <h2 style="color: #0D3B66; font-size: 16px; margin: 0 0 16px; border-bottom: 2px solid #FFD700; padding-bottom: 8px;">📋 Booking Details</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 160px;">Booking ID</td>
          <td style="padding: 8px 0; color: #333; font-weight: 600;">${booking.bookingId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Event / Cruise</td>
          <td style="padding: 8px 0; color: #333; font-weight: 600;">${localizedTitle}</td>
        </tr>
        ${localizedDuration ? `<tr>
          <td style="padding: 8px 0; color: #666;">Duration</td>
          <td style="padding: 8px 0; color: #333; font-weight: 600;">${localizedDuration}</td>
        </tr>` : ""}
        <tr>
          <td style="padding: 8px 0; color: #666;">Travel Date</td>
          <td style="padding: 8px 0; color: #333; font-weight: 600;">${travelDateFormatted}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Booking Date</td>
          <td style="padding: 8px 0; color: #333;">${bookingDateFormatted}</td>
        </tr>
      </table>
    </div>

    <!-- Passenger & Payment Card -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
      <h2 style="color: #0D3B66; font-size: 16px; margin: 0 0 16px; border-bottom: 2px solid #FFD700; padding-bottom: 8px;">👥 Passenger & Payment</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 160px;">Passengers</td>
          <td style="padding: 8px 0; color: #333; font-weight: 600;">${booking.numberOfPassengers} (Adults: ${booking.adults}, Children: ${booking.children})</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Total Amount</td>
          <td style="padding: 8px 0; color: #0D3B66; font-weight: 700; font-size: 16px;">€${booking.totalAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Payment Status</td>
          <td style="padding: 8px 0;">
            <span style="background-color: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
              ✓ ${booking.paymentStatus === "completed" ? "Paid" : booking.paymentStatus}
            </span>
          </td>
        </tr>
        ${booking.paymentId ? `<tr>
          <td style="padding: 8px 0; color: #666;">Payment ID</td>
          <td style="padding: 8px 0; color: #888; font-size: 12px;">${booking.paymentId}</td>
        </tr>` : ""}
      </table>
    </div>

    <!-- Venue Info -->
    <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 16px 20px; margin-bottom: 20px;">
      <h3 style="color: #92400e; font-size: 14px; margin: 0 0 8px;">📍 Departure Point</h3>
      <p style="color: #78350f; margin: 0; font-size: 14px; line-height: 1.5;">
        Port de la Bourdonnais, near Eiffel Tower, 75007 Paris<br>
        <span style="font-size: 13px; color: #a16207;">Please arrive at least 20 minutes before departure.</span>
      </p>
    </div>

    <!-- Closing -->
    <p style="font-size: 15px; color: #555; line-height: 1.6; margin: 24px 0 8px;">
      Your booking summary and e-ticket PDFs are attached to this email. We look forward to welcoming you on board!
    </p>

    <p style="font-size: 14px; color: #666; margin-top: 24px;">
      Best regards,<br>
      <strong>Bus & Boat Paris</strong>
    </p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
    <p style="font-size: 12px; color: #94a3b8; margin: 0;">
      This is an automated email. Please do not reply directly.<br>
      © ${new Date().getFullYear()} Bus & Boat Paris. All rights reserved.
    </p>
  </div>
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

// 4️⃣ Admin Notification Email — sent after successful booking + payment
export async function sendAdminNotificationEmail(booking: any, ticket: any) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not configured — skipping admin notification.");
    return;
  }

  const locale = booking.locale || "en";
  const localizedTitle =
    booking.title?.[locale] || booking.title?.["en"] || ticket?.title?.[locale] || ticket?.title?.["en"] || "Seine River Cruise";
  const localizedDuration =
    booking.durationBadge?.[locale] || booking.durationBadge?.["en"] || "N/A";
  const travelDateFormatted = new Date(booking.travelDate).toLocaleDateString(
    "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );
  const bookingDateFormatted = new Date(
    booking.createdAt || Date.now()
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const mailOptions = {
    from: `"Bus & Boat Paris" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `🔔 New Booking – ${booking.bookingId} | ${booking.customerName}`,
    html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2c5f8a 100%); padding: 28px 24px; text-align: center;">
    <h1 style="color: #FFD700; margin: 0; font-size: 22px; font-weight: 700;">🔔 New Booking Received</h1>
    <p style="color: #ffffff; margin: 8px 0 0; font-size: 14px; opacity: 0.9;">A new ticket has been booked and paid for</p>
  </div>

  <!-- Body -->
  <div style="padding: 24px;">

    <!-- Client Info -->
    <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
      <h2 style="color: #0c4a6e; font-size: 16px; margin: 0 0 16px; border-bottom: 2px solid #38bdf8; padding-bottom: 8px;">👤 Client Information</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 160px;">Client Name</td>
          <td style="padding: 8px 0; color: #333; font-weight: 600;">${booking.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Email</td>
          <td style="padding: 8px 0; color: #333;"><a href="mailto:${booking.customerEmail}" style="color: #2563eb;">${booking.customerEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Phone</td>
          <td style="padding: 8px 0; color: #333; font-weight: 600;">${booking.customerPhone || "N/A"}</td>
        </tr>
      </table>
    </div>

    <!-- Booking Details -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
      <h2 style="color: #0D3B66; font-size: 16px; margin: 0 0 16px; border-bottom: 2px solid #FFD700; padding-bottom: 8px;">📋 Booking Details</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 160px;">Booking ID</td>
          <td style="padding: 8px 0; color: #333; font-weight: 700;">${booking.bookingId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Event / Cruise</td>
          <td style="padding: 8px 0; color: #333; font-weight: 600;">${localizedTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Duration</td>
          <td style="padding: 8px 0; color: #333;">${localizedDuration}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Travel Date</td>
          <td style="padding: 8px 0; color: #333; font-weight: 600;">${travelDateFormatted}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Booking Date</td>
          <td style="padding: 8px 0; color: #333;">${bookingDateFormatted}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Venue</td>
          <td style="padding: 8px 0; color: #333;">Port de la Bourdonnais, near Eiffel Tower, 75007 Paris</td>
        </tr>
      </table>
    </div>

    <!-- Passengers & Payment -->
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
      <h2 style="color: #166534; font-size: 16px; margin: 0 0 16px; border-bottom: 2px solid #4ade80; padding-bottom: 8px;">💰 Payment & Passengers</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 160px;">Total Passengers</td>
          <td style="padding: 8px 0; color: #333; font-weight: 600;">${booking.numberOfPassengers}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Adults</td>
          <td style="padding: 8px 0; color: #333;">${booking.adults}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Children</td>
          <td style="padding: 8px 0; color: #333;">${booking.children}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Total Amount</td>
          <td style="padding: 8px 0; color: #166534; font-weight: 700; font-size: 18px;">€${booking.totalAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Payment Status</td>
          <td style="padding: 8px 0;">
            <span style="background-color: ${booking.paymentStatus === "completed" ? "#dcfce7" : "#fef3c7"}; color: ${booking.paymentStatus === "completed" ? "#166534" : "#92400e"}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
              ${booking.paymentStatus === "completed" ? "✓ Paid" : booking.paymentStatus}
            </span>
          </td>
        </tr>
        ${booking.paymentId ? `<tr>
          <td style="padding: 8px 0; color: #666;">Payment ID</td>
          <td style="padding: 8px 0; color: #888; font-size: 12px; word-break: break-all;">${booking.paymentId}</td>
        </tr>` : ""}
      </table>
    </div>

    <!-- Additional Info -->
    <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 20px;">
      <h2 style="color: #6b21a8; font-size: 16px; margin: 0 0 16px; border-bottom: 2px solid #c084fc; padding-bottom: 8px;">ℹ️ Additional Info</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 160px;">Locale</td>
          <td style="padding: 8px 0; color: #333;">${booking.locale || "en"}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Photo Status</td>
          <td style="padding: 8px 0; color: #333;">${booking.photoStatus || "pending"}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Ticket Status</td>
          <td style="padding: 8px 0; color: #333;">${booking.ticketStatus || "pending"}</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- Footer -->
  <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
    <p style="font-size: 12px; color: #94a3b8; margin: 0;">
      This is an automated admin notification from Bus & Boat Paris.<br>
      © ${new Date().getFullYear()} Bus & Boat Paris. All rights reserved.
    </p>
  </div>
</div>
`,
  };

  return transporter.sendMail(mailOptions);
}

