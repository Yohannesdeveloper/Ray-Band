import { NextRequest, NextResponse } from "next/server";
import { sendLicenseEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const to = formData.get("to") as string;
    const organizationName = formData.get("organizationName") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const files = formData.getAll("files") as File[];

    if (!to || !organizationName || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Please attach at least one license document" },
        { status: 400 }
      );
    }

    const attachments = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        return {
          filename: file.name,
          fileBuffer: Buffer.from(bytes),
          fileType: file.type,
        };
      })
    );

    const result = await sendLicenseEmail({
      to,
      organizationName,
      subject,
      message,
      attachments,
    });

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      fileCount: files.length,
    });
  } catch (error) {
    console.error("Failed to send license email:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 }
    );
  }
}
