import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function generateAdultTicketPDF(
  booking: any,
  ticket: any,
  index: any
): Promise<Buffer> {
  const localizedTitle = ticket.title[booking.locale] || ticket.title["en"];

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

      const qrCodeBuffer = await QRCode.toBuffer(booking.bookingId, {
        width: 180,
        margin: 1,
        color: { dark: "#FFD700", light: "#FFFFFF" } // gold QR for premium feel
      });

      const doc = new PDFDocument({ size: "A4", margin: 40, font: fontPath });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // === BACKGROUND ===
      const gradient = doc.linearGradient(0, 0, doc.page.width, doc.page.height);
      gradient.stop(0, "#0D1B2A").stop(1, "#1B263B"); // dark blue gradient
      doc.rect(0, 0, doc.page.width, doc.page.height).fill(gradient);

      // === HEADER ===
      doc.roundedRect(40, 40, doc.page.width - 80, 100, 12).fill("#1B263B"); // darker card
      doc.fillColor("#FFD700").fontSize(26).text("BUS & BOAT PARIS", 60, 60);
      doc.fontSize(14).fillColor("#FFFFFF").text("ADULT TICKET", 60, 90);

      // Ticket badge
      doc.roundedRect(doc.page.width - 180, 50, 140, 50, 10).fill("#FF8C00"); // gold/orange badge
      doc.fillColor("#FFFFFF").fontSize(12).text("ADULT TICKET", doc.page.width - 170, 60);
      doc.fontSize(16).text(`#${index + 1}`, doc.page.width - 170, 78);

      // === QR CODE ===
      const qrY = 160;
      doc.roundedRect(doc.page.width - 180, qrY, 140, 140, 10).fill("#FFFFFF");
      doc.strokeColor("#FFD700").lineWidth(2).roundedRect(doc.page.width - 180, qrY, 140, 140, 10).stroke();
      doc.image(qrCodeBuffer, doc.page.width - 170, qrY + 10, { width: 120, height: 120 });
      doc.fillColor("#FFD700").fontSize(8).text("SCAN TO VERIFY", doc.page.width - 180, qrY + 150, { width: 140, align: "center" });

      

      // === PASSENGER DETAILS ===
      doc.fillColor("#FFD700").fontSize(16).text("PASSENGER DETAILS", 60, 160);
      const passengerInfo = [
        ["Name", booking.customerName],
        ["Email", booking.customerEmail],
        ["Phone", booking.customerPhone],
      ];

      passengerInfo.forEach((info, i) => {
        doc.roundedRect(60, 190 + i * 40, 300, 35, 8).fill("#1B263B");
        doc.strokeColor("#FFD700").lineWidth(1).roundedRect(60, 190 + i * 40, 300, 35, 8).stroke();
        doc.fillColor("#FFD700").fontSize(10).text(info[0], 65, 195 + i * 40);
        doc.fillColor("#FFFFFF").fontSize(12).text(info[1], 150, 195 + i * 40);
      });

      // === TRIP DETAILS ===
      doc.fillColor("#FFD700").fontSize(16).text("TRIP DETAILS", 60, 320);
      const tripInfo = [
        ["Package", localizedTitle],
        ["Travel Date", new Date(booking.travelDate).toLocaleDateString("en-US", { weekday:"short", year:"numeric", month:"short", day:"numeric" })],
        ["Passengers", `${booking.adults} Adults, ${booking.children} Children`],
        ["Total", `€${booking.totalAmount}`]
      ];

      tripInfo.forEach((info, i) => {
        doc.roundedRect(60, 350 + i * 40, 300, 35, 8).fill("#1B263B");
        doc.strokeColor("#FFD700").lineWidth(1).roundedRect(60, 350 + i * 40, 300, 35, 8).stroke();
        doc.fillColor("#FFD700").fontSize(10).text(info[0], 65, 355 + i * 40);
        doc.fillColor("#FFFFFF").fontSize(12).text(info[1], 150, 355 + i * 40);
      });

      // === FOOTER ===
      doc.roundedRect(40, doc.page.height - 80, doc.page.width - 80, 60, 10).fill("#1B263B");
      doc.fillColor("#FFD700").fontSize(10).text(
        `SECURE DIGITAL TICKET • GENERATED: ${new Date().toLocaleString()} • VALID FOR TRAVEL ON ${new Date(booking.travelDate).toLocaleDateString()}`,
        60,
        doc.page.height - 60,
        { width: doc.page.width - 120, align: "center" }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}



export async function generateChildTicketPDF(
  booking: any,
  ticket: any,
  index: any
): Promise<Buffer> {
  const localizedTitle = ticket.title[booking.locale] || ticket.title["en"];

  return new Promise(async (resolve, reject) => {
    try {
      const fontPath = path.join(process.cwd(), "public", "fonts", "Roboto-Regular.ttf");
      if (!fs.existsSync(fontPath)) {
        return reject(new Error("Font file missing: " + fontPath));
      }

      // QR code with only booking ID
      const qrCodeBuffer = await QRCode.toBuffer(booking.bookingId, {
        width: 180,
        margin: 1,
        color: { dark: "#0077B6", light: "#FFFFFF" }
      });

      const doc = new PDFDocument({ size: "A4", font: fontPath });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // === Background ===
      doc.rect(0, 0, doc.page.width, doc.page.height).fill("#E3F2FD"); // light blue background

      // === Header ===
      doc.roundedRect(40, 40, doc.page.width - 80, 80, 10).fill("#0077B6");
      doc.fillColor("white").fontSize(22).text("BUS & BOAT PARIS", 60, 55);
      doc.fontSize(14).text("CHILD E-TICKET", 60, 80);

      // === Ticket Badge ===
      doc.roundedRect(doc.page.width - 200, 55, 150, 50, 10).fill("#FFA726");
      doc.fillColor("white").fontSize(12).text("CHILD TICKET", doc.page.width - 190, 70);
      doc.fontSize(16).text(`#${index + 1}`, doc.page.width - 190, 90);

      // === QR code ===
      doc.roundedRect(doc.page.width - 180, 140, 140, 140, 8).fill("#FFFFFF");
      doc.strokeColor("#B0BEC5").lineWidth(1).roundedRect(doc.page.width - 180, 140, 140, 140, 8).stroke();
      doc.image(qrCodeBuffer, doc.page.width - 170, 150, { width: 120, height: 120 });
      doc.fillColor("#0077B6").fontSize(8).text("SCAN FOR VERIFICATION", doc.page.width - 180, 295, { width: 140, align: "center" });

      // === Passenger Info ===
      let y = 140;
      const passengerInfo = [
        { label: "Child Name", value: booking.customerName },
        { label: "Email", value: booking.customerEmail },
        { label: "Phone", value: booking.customerPhone },
        { label: "Booking ID", value: booking.bookingId }
      ];

      passengerInfo.forEach((info, i) => {
        doc.roundedRect(50, y, 350, 40, 6).fill("#FFFFFF");
        doc.strokeColor("#B0BEC5").lineWidth(1).roundedRect(50, y, 350, 40, 6).stroke();
        doc.fillColor("#0077B6").fontSize(10).text(info.label, 60, y + 6);
        doc.fillColor("#1E1E1E").fontSize(12).text(info.value, 60, y + 20);
        y += 50;
      });

      // === Trip Details ===
      y += 10;
      const tripInfo = [
        { label: "Package", value: localizedTitle },
        { label: "Travel Date", value: new Date(booking.travelDate).toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" }) },
        { label: "Passengers", value: `${booking.numberOfPassengers} (${booking.children} Child)` },
        { label: "Total Amount", value: `€${booking.totalAmount}` }
      ];

      tripInfo.forEach((info) => {
        doc.roundedRect(50, y, 350, 35, 6).fill("#FFFFFF");
        doc.strokeColor("#B0BEC5").lineWidth(1).roundedRect(50, y, 350, 35, 6).stroke();
        doc.fillColor("#0077B6").fontSize(10).text(info.label, 60, y + 5);
        doc.fillColor("#1E1E1E").fontSize(12).text(info.value, 60, y + 18);
        y += 45;
      });

      // === Footer ===
      doc.roundedRect(40, doc.page.height - 100, doc.page.width - 80, 60, 8).fill("#0077B6");
      doc.fillColor("white").fontSize(10).text("Please show this e-ticket during travel. Ensure child is accompanied by an adult.", 50, doc.page.height - 85, { width: doc.page.width - 100 });

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
  // pdfBuffer: Buffer
) {
  const localizedTitle = ticket.title[booking.locale] || ticket.title["en"];
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: booking.customerEmail,
    subject: "🎉 Your Paris Adventure Awaits - Booking Confirmed!",
    html: `
<div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
    max-width: 650px; 
    margin: 0 auto; 
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
    padding: 30px 20px;
    position: relative;
    overflow: hidden;
">
    <!-- Watermark Background -->
    <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        opacity: 0.03;
        font-size: 140px;
        font-weight: 900;
        color: #ffffff;
        white-space: nowrap;
        pointer-events: none;
        z-index: 1;
        font-family: 'Georgia', serif;
    ">
        BUS & BOAT PARIS
    </div>

    <!-- Main Content Card -->
    <div style="
        background: white; 
        border-radius: 20px; 
        overflow: hidden; 
        box-shadow: 0 25px 50px rgba(0,0,0,0.15); 
        position: relative;
        z-index: 2;
    ">
        
        <!-- Header with Gradient -->
        <div style="
            background: linear-gradient(135deg, #0077B6 0%, #00A8E8 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            position: relative;
        ">
            <div style="
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                width: 80px;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                font-size: 36px;
            ">
                ✅
            </div>
            <h1 style="
                margin: 0; 
                font-size: 32px; 
                font-weight: 700;
                letter-spacing: -0.5px;
            ">
                Booking Confirmed!
            </h1>
            <p style="
                margin: 10px 0 0; 
                font-size: 18px; 
                opacity: 0.9;
                font-weight: 300;
            ">
                Your Parisian adventure is officially booked!
            </p>
        </div>

        <!-- Greeting Section -->
        <div style="padding: 30px 30px 20px;">
            <h2 style="
                color: #2D3748; 
                margin: 0 0 10px; 
                font-size: 24px;
                font-weight: 600;
            ">
                Bonjour ${booking.customerName}!
            </h2>
            <p style="
                color: #718096; 
                margin: 0; 
                font-size: 16px; 
                line-height: 1.6;
            ">
                Thank you for choosing Bus & Boat Paris. We're thrilled to be part of your journey through the City of Light! ✨
            </p>
        </div>

        <!-- Trip Details Card -->
        <div style="
            background: linear-gradient(135deg, #F8FAFC 0%, #EDF2F7 100%);
            margin: 0 30px 30px;
            padding: 30px;
            border-radius: 16px;
            border-left: 5px solid #0077B6;
            box-shadow: 0 8px 25px rgba(0,119,182,0.1);
        ">
            <div style="
                display: flex;
                align-items: center;
                margin-bottom: 20px;
            ">
                <div style="
                    background: #0077B6;
                    border-radius: 12px;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 15px;
                    color: white;
                    font-size: 20px;
                ">
                    🎟
                </div>
                <h3 style="
                    color: #2D3748; 
                    margin: 0; 
                    font-size: 22px;
                    font-weight: 600;
                ">
                    Trip Details
                </h3>
            </div>

            <div style="display: grid; gap: 15px;">
                <div style="display: flex; align-items: center;">
                    <div style="
                        background: #E6FFFA;
                        border-radius: 8px;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 15px;
                        color: #234E52;
                    ">
                        🚤
                    </div>
                    <div>
                        <div style="color: #4A5568; font-size: 14px; font-weight: 500;">Package</div>
                        <div style="color: #2D3748; font-size: 16px; font-weight: 600;">${localizedTitle}</div>
                    </div>
                </div>

                <div style="display: flex; align-items: center;">
                    <div style="
                        background: #FEF5E7;
                        border-radius: 8px;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 15px;
                        color: #744210;
                    ">
                        📅
                    </div>
                    <div>
                        <div style="color: #4A5568; font-size: 14px; font-weight: 500;">Travel Date</div>
                        <div style="color: #2D3748; font-size: 16px; font-weight: 600;">
                            ${new Date(booking.travelDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                        </div>
                    </div>
                </div>

                <div style="display: flex; align-items: center;">
                    <div style="
                        background: #E6F3FF;
                        border-radius: 8px;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 15px;
                        color: #1A365D;
                    ">
                        💳
                    </div>
                    <div>
                        <div style="color: #4A5568; font-size: 14px; font-weight: 500;">Payment Reference</div>
                        <div style="color: #2D3748; font-size: 16px; font-weight: 600;">${
                          booking.paymentId
                        }</div>
                    </div>
                </div>

                <div style="display: flex; align-items: center;">
                    <div style="
                        background: #F0FFF4;
                        border-radius: 8px;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 15px;
                        color: #22543D;
                    ">
                        🎫
                    </div>
                    <div>
                        <div style="color: #4A5568; font-size: 14px; font-weight: 500;">Booking ID</div>
                        <div style="color: #2D3748; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace;">
                            ${booking.bookingId}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- E-Ticket Info -->
        <div style="
            background: #FFF9E6;
            margin: 0 30px 30px;
            padding: 25px;
            border-radius: 16px;
            border: 2px dashed #D69E2E;
            text-align: center;
        ">
            <div style="font-size: 32px; margin-bottom: 10px;">📎</div>
            <h4 style="
                color: #744210; 
                margin: 0 0 10px; 
                font-size: 18px;
                font-weight: 600;
            ">
                Your E-Ticket is Ready!
            </h4>
            <p style="
                color: #744210; 
                margin: 0; 
                font-size: 15px; 
                line-height: 1.5;
                opacity: 0.8;
            ">
                Your electronic ticket is attached in PDF format. Please have it ready to show during boarding - either printed or on your mobile device.
            </p>
        </div>

        <!-- Important Notes -->
        <div style="
            background: #FFF5F5;
            margin: 0 30px 30px;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #E53E3E;
        ">
            <h4 style="
                color: #742A2A; 
                margin: 0 0 10px; 
                font-size: 16px;
                font-weight: 600;
                display: flex;
                align-items: center;
            ">
                ⚠️ Important Reminders
            </h4>
            <ul style="
                color: #742A2A; 
                margin: 0; 
                padding-left: 20px; 
                font-size: 14px;
                line-height: 1.6;
                opacity: 0.8;
            ">
                <li>Arrive at least 15 minutes before departure</li>
                <li>Have your e-ticket ready for scanning</li>
            </ul>
        </div>

        <!-- Footer -->
        <div style="
            background: #2D3748;
            padding: 40px 30px;
            text-align: center;
            color: white;
        ">
            <div style="
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 15px;
                background: linear-gradient(135deg, #0077B6, #00C6FF);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            ">
                BUS & BOAT PARIS
            </div>
            <p style="
                margin: 0 0 20px; 
                font-size: 16px; 
                opacity: 0.8;
                line-height: 1.6;
            ">
                Creating unforgettable memories on the Seine
            </p>
            <div style="
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
            ">
                <span style="
                    background: rgba(255,255,255,0.1);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                ">📞 +33 7 58 21 98 26</span>
                <span style="
                    background: rgba(255,255,255,0.1);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                ">✉️ busandboatparis11@gmail.com</span>
            </div>
            <p style="
                margin: 25px 0 0; 
                font-size: 14px; 
                opacity: 0.6;
                border-top: 1px solid rgba(255,255,255,0.2);
                padding-top: 20px;
            ">
                Thank you for trusting us with your Paris adventure. We can't wait to welcome you aboard! 🗼
            </p>
        </div>
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
