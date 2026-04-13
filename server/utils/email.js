import nodemailer from 'nodemailer';

export const sendApprovalEmail = async (booking, plot_number, layout_name, location) => {
  try {
    let transporter;
    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_HOST) {
        // Use real SMTP server if variables are defined
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_PORT == 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    } else {
        // Generate Ethereal test account automatically
        console.log("No SMTP credentials found. Creating Ethereal Test Account...");
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    }

    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-w: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #e11d48; margin-top: 0;">Site Visit Confirmed!</h2>
        <p>Hi <b>${booking.customer_name}</b>,</p>
        <p>Your site visit request for <strong>Plot ${plot_number}</strong> at <strong>${layout_name}</strong> (${location}) has been officially <strong>approved</strong> by our team.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Scheduled Date:</strong> ${booking.visit_date}</p>
        </div>
        
        <p>Please bring a valid ID and any reference documents. We look forward to meeting you and helping you secure your future investment.</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
        <p style="font-size: 12px; color: #64748b;">Best regards,<br/><strong>PND Developers Team</strong><br/>+91 98765 43210</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"PND Developers" <no-reply@pnddevelopers.com>',
      to: booking.customer_email || 'test-customer@example.com',
      subject: `[CONFIRMED] Site Visit for Plot ${plot_number}`,
      html: emailHtml
    });

    console.log("-----------------------------------------");
    console.log("[Nodemailer] Email dispatched! ✉️");
    console.log("[Nodemailer] Message ID: %s", info.messageId);
    if (!process.env.SMTP_USER) {
        console.log("[Nodemailer] PREVIEW URL: %s", nodemailer.getTestMessageUrl(info));
        console.log("-----------------------------------------");
    }
    
    return true;
  } catch (err) {
    console.error("Email Transport Error:", err);
    return false;
  }
};
