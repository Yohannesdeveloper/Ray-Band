import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = "yohannesfk123@gmail.com";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || ADMIN_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const services = formData.get("services") as string;
    const projectTitle = formData.get("projectTitle") as string;
    const projectDescription = formData.get("projectDescription") as string;
    const preferredDate = formData.get("preferredDate") as string;
    const budget = formData.get("budget") as string;
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const whatsapp = formData.get("whatsapp") as string;

    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && value.size > 0) {
        files.push(value);
      }
    }

    const fileListHtml = files.length > 0
      ? files.map((f) => `<li style="margin-bottom: 4px;"><strong>${f.name}</strong> (${(f.size / 1024).toFixed(1)} KB)</li>`).join("")
      : "<li>No files attached</li>";

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #d4a853; margin: 0; font-size: 24px;">New Studio Request</h1>
          <p style="color: #a0a0a0; margin: 5px 0 0; font-size: 12px;">Ray Entertainment and Promotion Music Studio</p>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0;">
          <h2 style="color: #333; margin-top: 0;">Project Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; font-size: 12px; width: 140px;">SERVICE(S)</td><td style="padding: 8px 0; color: #333;">${services}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 12px;">PROJECT TITLE</td><td style="padding: 8px 0; color: #333;">${projectTitle}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 12px;">DESCRIPTION</td><td style="padding: 8px 0; color: #333;">${projectDescription}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 12px;">PREFERRED DATE</td><td style="padding: 8px 0; color: #333;">${preferredDate || "Not specified"}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 12px;">BUDGET</td><td style="padding: 8px 0; color: #333;">${budget || "Not specified"}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <h2 style="color: #333; margin-top: 0;">Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; font-size: 12px; width: 140px;">NAME</td><td style="padding: 8px 0; color: #333;">${fullName}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 12px;">EMAIL</td><td style="padding: 8px 0; color: #333;">${email}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 12px;">PHONE</td><td style="padding: 8px 0; color: #333;">${phone}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 12px;">WHATSAPP</td><td style="padding: 8px 0; color: #333;">${whatsapp || "Not provided"}</td></tr>
          </table>
          ${files.length > 0 ? `
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <h2 style="color: #333; margin-top: 0;">Attached Files (${files.length})</h2>
          <ul style="padding-left: 20px;">${fileListHtml}</ul>
          ` : ""}
        </div>
        <div style="background: #1a1a2e; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="color: #666; margin: 0; font-size: 11px;">&copy; ${new Date().getFullYear()} Ray Entertainment and Promotion</p>
        </div>
      </div>
    `;

    const clientHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #d4a853; margin: 0; font-size: 24px;">Studio Request Received</h1>
          <p style="color: #a0a0a0; margin: 5px 0 0; font-size: 12px;">Ray Entertainment and Promotion Music Studio</p>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0;">
          <p style="color: #555; line-height: 1.6;">Dear <strong>${fullName}</strong>,</p>
          <p style="color: #555; line-height: 1.6;">Thank you for your studio request! We have received your submission and our team will review it shortly.</p>
          <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0 0 8px; color: #888; font-size: 12px;">REQUEST SUMMARY</p>
            <p style="margin: 0; color: #333;"><strong>Service(s):</strong> ${services}</p>
            <p style="margin: 4px 0 0; color: #333;"><strong>Project:</strong> ${projectTitle}</p>
          </div>
          <p style="color: #555; line-height: 1.6;">We will get back to you within 24 hours with a detailed proposal.</p>
          <p style="color: #555; line-height: 1.6;">Best regards,<br/><strong>Ray Entertainment and Promotion Music Studio Team</strong></p>
        </div>
        <div style="background: #1a1a2e; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="color: #666; margin: 0; font-size: 11px;">&copy; ${new Date().getFullYear()} Ray Entertainment and Promotion</p>
          <p style="color: #666; margin: 5px 0 0; font-size: 11px;">Addis Ababa, Ethiopia | info@rayband.com</p>
        </div>
      </div>
    `;

    const emailAttachments = await Promise.all(files.map(async (f) => ({
      filename: f.name,
      content: Buffer.from(await f.arrayBuffer()),
      contentType: f.type,
    })));

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `Ray Entertainment and Promotion <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `[Studio Request] ${projectTitle} - ${fullName}`,
      html: adminHtml,
      attachments: emailAttachments,
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `Ray Entertainment and Promotion <${ADMIN_EMAIL}>`,
      to: email,
      subject: `Studio Request Confirmation - ${projectTitle}`,
      html: clientHtml,
    });

    return NextResponse.json({ success: true, message: "Studio request submitted successfully" });
  } catch (error) {
    console.error("Studio request error:", error);
    return NextResponse.json({ success: false, message: "Failed to submit request" }, { status: 500 });
  }
}
