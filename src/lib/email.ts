import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface Attachment {
  filename: string;
  fileBuffer: Buffer;
  fileType: string;
}

interface SendLicenseEmailParams {
  to: string;
  organizationName: string;
  subject: string;
  message: string;
  attachments: Attachment[];
}

export async function sendLicenseEmail({
  to,
  organizationName,
  subject,
  message,
  attachments,
}: SendLicenseEmailParams) {
  const fileListHtml = attachments
    .map(
      (a) =>
        `<li style="margin-bottom: 8px;"><strong>${a.filename}</strong> (${(a.fileBuffer.length / 1024).toFixed(1)} KB)</li>`
    )
    .join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #d4a853; margin: 0; font-size: 24px;">Ray Band Entertainment</h1>
        <p style="color: #a0a0a0; margin: 5px 0 0; font-size: 12px;">Professional Live Band & Music Academy</p>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0;">
        <h2 style="color: #333; margin-top: 0;">License Document${attachments.length !== 1 ? "s" : ""}</h2>
        <p style="color: #555; line-height: 1.6;">Dear <strong>${organizationName}</strong>,</p>
        <p style="color: #555; line-height: 1.6;">${message.replace(/\n/g, "<br/>")}</p>
        <p style="color: #555; line-height: 1.6;">Please find the attached license document${attachments.length !== 1 ? "s" : ""} for your records.</p>
        <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0 0 8px; color: #888; font-size: 12px;">ATTACHED DOCUMENT${attachments.length !== 1 ? "S" : ""}</p>
          <ul style="margin: 0; padding-left: 20px; list-style: none;">${fileListHtml}</ul>
        </div>
        <p style="color: #555; line-height: 1.6;">If you have any questions or need further assistance, please don't hesitate to contact us.</p>
        <p style="color: #555; line-height: 1.6;">Best regards,<br/><strong>Ray Band Entertainment Team</strong></p>
      </div>
      <div style="background: #1a1a2e; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="color: #666; margin: 0; font-size: 11px;">&copy; ${new Date().getFullYear()} Ray Band Entertainment. All rights reserved.</p>
        <p style="color: #666; margin: 5px 0 0; font-size: 11px;">Addis Ababa, Ethiopia | info@rayband.com</p>
      </div>
    </div>
  `;

  const emailAttachments = attachments.map((a) => ({
    filename: a.filename,
    content: a.fileBuffer,
    contentType: a.fileType,
  }));

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html: htmlContent,
    attachments: emailAttachments,
  });

  return info;
}
