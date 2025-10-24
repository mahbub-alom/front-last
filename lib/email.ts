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
        color: { dark: "#FFD700", light: "#FFFFFF" }, // gold QR for premium feel
      });

      const doc = new PDFDocument({ size: "A4", margin: 40, font: fontPath });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // === BACKGROUND ===
      const gradient = doc.linearGradient(
        0,
        0,
        doc.page.width,
        doc.page.height
      );
      gradient.stop(0, "#0D1B2A").stop(1, "#1B263B"); // dark blue gradient
      doc.rect(0, 0, doc.page.width, doc.page.height).fill(gradient);

      // === HEADER ===
      doc.roundedRect(40, 40, doc.page.width - 80, 100, 12).fill("#1B263B"); // darker card
      doc.fillColor("#FFD700").fontSize(26).text("BUS & BOAT PARIS", 60, 60);
      doc.fontSize(14).fillColor("#FFFFFF").text("ADULT TICKET", 60, 90);

      // Ticket badge
      doc.roundedRect(doc.page.width - 180, 50, 140, 50, 10).fill("#FF8C00"); // gold/orange badge
      doc
        .fillColor("#FFFFFF")
        .fontSize(12)
        .text("ADULT TICKET", doc.page.width - 170, 60);
      doc.fontSize(16).text(`#${index + 1}`, doc.page.width - 170, 78);

      // === QR CODE ===
      const qrY = 160;
      doc.roundedRect(doc.page.width - 180, qrY, 140, 140, 10).fill("#FFFFFF");
      doc
        .strokeColor("#FFD700")
        .lineWidth(2)
        .roundedRect(doc.page.width - 180, qrY, 140, 140, 10)
        .stroke();
      doc.image(qrCodeBuffer, doc.page.width - 170, qrY + 10, {
        width: 120,
        height: 120,
      });
      doc
        .fillColor("#FFD700")
        .fontSize(8)
        .text("SCAN TO VERIFY", doc.page.width - 180, qrY + 150, {
          width: 140,
          align: "center",
        });

      // === PASSENGER DETAILS ===
      doc.fillColor("#FFD700").fontSize(16).text("PASSENGER DETAILS", 60, 160);
      const passengerInfo = [
        ["Name", booking.customerName],
        ["Email", booking.customerEmail],
        ["Phone", booking.customerPhone],
      ];

      passengerInfo.forEach((info, i) => {
        doc.roundedRect(60, 190 + i * 40, 300, 35, 8).fill("#1B263B");
        doc
          .strokeColor("#FFD700")
          .lineWidth(1)
          .roundedRect(60, 190 + i * 40, 300, 35, 8)
          .stroke();
        doc
          .fillColor("#FFD700")
          .fontSize(10)
          .text(info[0], 65, 195 + i * 40);
        doc
          .fillColor("#FFFFFF")
          .fontSize(12)
          .text(info[1], 150, 195 + i * 40);
      });

      // === TRIP DETAILS ===
      doc.fillColor("#FFD700").fontSize(16).text("TRIP DETAILS", 60, 320);
      const tripInfo = [
        ["Package", localizedTitle],
        [
          "Travel Date",
          new Date(booking.travelDate).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        ],
        [
          "Passengers",
          `${booking.adults} Adults, ${booking.children} Children`,
        ],
        ["Total", `€${booking.totalAmount}`],
      ];

      tripInfo.forEach((info, i) => {
        doc.roundedRect(60, 350 + i * 40, 300, 35, 8).fill("#1B263B");
        doc
          .strokeColor("#FFD700")
          .lineWidth(1)
          .roundedRect(60, 350 + i * 40, 300, 35, 8)
          .stroke();
        doc
          .fillColor("#FFD700")
          .fontSize(10)
          .text(info[0], 65, 355 + i * 40);
        doc
          .fillColor("#FFFFFF")
          .fontSize(12)
          .text(info[1], 150, 355 + i * 40);
      });

      // === FOOTER ===
      doc
        .roundedRect(40, doc.page.height - 80, doc.page.width - 80, 60, 10)
        .fill("#1B263B");
      doc
        .fillColor("#FFD700")
        .fontSize(10)
        .text(
          `SECURE DIGITAL TICKET • GENERATED: ${new Date().toLocaleString()} • VALID FOR TRAVEL ON ${new Date(
            booking.travelDate
          ).toLocaleDateString()}`,
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
      const fontPath = path.join(
        process.cwd(),
        "public",
        "fonts",
        "Roboto-Regular.ttf"
      );
      if (!fs.existsSync(fontPath)) {
        return reject(new Error("Font file missing: " + fontPath));
      }

      // QR code with only booking ID
      const qrCodeBuffer = await QRCode.toBuffer(booking.bookingId, {
        width: 180,
        margin: 1,
        color: { dark: "#0077B6", light: "#FFFFFF" },
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
      doc
        .fillColor("white")
        .fontSize(12)
        .text("CHILD TICKET", doc.page.width - 190, 70);
      doc.fontSize(16).text(`#${index + 1}`, doc.page.width - 190, 90);

      // === QR code ===
      doc.roundedRect(doc.page.width - 180, 140, 140, 140, 8).fill("#FFFFFF");
      doc
        .strokeColor("#B0BEC5")
        .lineWidth(1)
        .roundedRect(doc.page.width - 180, 140, 140, 140, 8)
        .stroke();
      doc.image(qrCodeBuffer, doc.page.width - 170, 150, {
        width: 120,
        height: 120,
      });
      doc
        .fillColor("#0077B6")
        .fontSize(8)
        .text("SCAN FOR VERIFICATION", doc.page.width - 180, 295, {
          width: 140,
          align: "center",
        });

      // === Passenger Info ===
      let y = 140;
      const passengerInfo = [
        { label: "Child Name", value: booking.customerName },
        { label: "Email", value: booking.customerEmail },
        { label: "Phone", value: booking.customerPhone },
      ];

      passengerInfo.forEach((info, i) => {
        doc.roundedRect(50, y, 350, 40, 6).fill("#FFFFFF");
        doc
          .strokeColor("#B0BEC5")
          .lineWidth(1)
          .roundedRect(50, y, 350, 40, 6)
          .stroke();
        doc
          .fillColor("#0077B6")
          .fontSize(10)
          .text(info.label, 60, y + 6);
        doc
          .fillColor("#1E1E1E")
          .fontSize(12)
          .text(info.value, 60, y + 20);
        y += 50;
      });

      // === Trip Details ===
      y += 10;
      const tripInfo = [
        { label: "Package", value: localizedTitle },
        {
          label: "Travel Date",
          value: new Date(booking.travelDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
        {
          label: "Passengers",
          value: `${booking.numberOfPassengers} (${booking.children} Child)`,
        },
        { label: "Total Amount", value: `€${booking.totalAmount}` },
      ];

      tripInfo.forEach((info) => {
        doc.roundedRect(50, y, 350, 35, 6).fill("#FFFFFF");
        doc
          .strokeColor("#B0BEC5")
          .lineWidth(1)
          .roundedRect(50, y, 350, 35, 6)
          .stroke();
        doc
          .fillColor("#0077B6")
          .fontSize(10)
          .text(info.label, 60, y + 5);
        doc
          .fillColor("#1E1E1E")
          .fontSize(12)
          .text(info.value, 60, y + 18);
        y += 45;
      });

      // === Footer ===
      doc
        .roundedRect(40, doc.page.height - 100, doc.page.width - 80, 60, 8)
        .fill("#0077B6");
      doc
        .fillColor("white")
        .fontSize(10)
        .text(
          "Please show this e-ticket during travel. Ensure child is accompanied by an adult.",
          50,
          doc.page.height - 85,
          { width: doc.page.width - 100 }
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
  // pdfBuffer: Buffer
) {
  const localizedTitle = ticket.title[booking.locale] || ticket.title["en"];
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: booking.customerEmail,
    subject: "🎉 Your Paris Adventure is Confirmed!",
    html: `
<div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
    max-width: 600px; 
    margin: 0 auto; 
    background: #f7f9fc; 
    padding: 30px 20px;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
">

    <!-- Header -->
    <div style="
        background: linear-gradient(135deg, #0077B6 0%, #00C6FF 100%);
        padding: 30px 20px;
        text-align: center;
        color: white;
        border-radius: 12px;
    ">
        <div style="
            font-size: 40px;
            margin-bottom: 10px;
        ">✅</div>
        <h1 style="
            margin: 0;
            font-size: 26px;
            font-weight: 700;
        ">Booking Confirmed!</h1>
        <p style="
            margin: 5px 0 0;
            font-size: 16px;
            opacity: 0.9;
        ">Bonjour ${booking.customerName}, your Paris adventure is ready!</p>
    </div>

    <!-- Trip Details -->
    <div style="
        background: #ffffff;
        margin-top: 20px;
        padding: 20px;
        border-radius: 12px;
        border-left: 5px solid #0077B6;
    ">
        <h2 style="
            font-size: 18px;
            margin: 0 0 15px;
            color: #2D3748;
        ">Trip Details</h2>

        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="
                width: 35px;
                height: 35px;
                background: #E6FFFA;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
                font-size: 16px;
            ">🚤</div>
            <div>
                <div style="font-size: 13px; color: #718096;">Package</div>
                <div style="font-size: 15px; font-weight: 600; color: #2D3748;">${localizedTitle}</div>
            </div>
        </div>

        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="
                width: 35px;
                height: 35px;
                background: #FEF5E7;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
                font-size: 16px;
            ">📅</div>
            <div>
                <div style="font-size: 13px; color: #718096;">Travel Date</div>
                <div style="font-size: 15px; font-weight: 600; color: #2D3748;">
                    ${new Date(booking.travelDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </div>
            </div>
        </div>

        <div style="display: flex; align-items: center;">
            <div style="
                width: 35px;
                height: 35px;
                background: #F0FFF4;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
                font-size: 16px;
            ">🎫</div>
            <div>
                <div style="font-size: 13px; color: #718096;">Booking ID</div>
                <div style="font-size: 15px; font-weight: 600; color: #2D3748;">${
                  booking.bookingId
                }</div>
            </div>
        </div>
    </div>

    <!-- E-Ticket Notice -->
    <div style="
        background: #FFF9E6;
        margin-top: 20px;
        padding: 20px;
        border-radius: 12px;
        border: 2px dashed #D69E2E;
        text-align: center;
    ">
        <div style="font-size: 28px; margin-bottom: 10px;">📎</div>
        <p style="
            font-size: 15px;
            color: #744210;
            margin: 0;
        ">
            Your electronic ticket is attached in PDF format. Please have it ready to show during boarding.
        </p>
    </div>

    <!-- Footer -->
    <div style="
        text-align: center;
        margin-top: 30px;
        font-size: 14px;
        color: #718096;
    ">
        <p style="margin:0;">Contact us: ✉️ busandboatparis11@gmail.com | 📞 +33 7 58 21 98 26</p>
        <p style="margin:5px 0 0;">Creating unforgettable memories on the Seine!</p>
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
