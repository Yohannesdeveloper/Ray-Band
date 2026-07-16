import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES: Record<string, string[]> = {
  media: [
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "video/mp4", "video/webm", "video/quicktime",
    "application/pdf",
  ],
  legal: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg", "image/png",
  ],
  general: [
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "video/mp4", "video/webm",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "temp";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
    }

    const allowed = ALLOWED_TYPES[folder] || ALLOWED_TYPES.general;
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not allowed for ${folder}` },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "bin";
    const uniqueName = `${randomUUID()}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads", folder);

    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(join(uploadDir, uniqueName), buffer);

    const url = `/uploads/${folder}/${uniqueName}`;

    return NextResponse.json({
      url,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      storedName: uniqueName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
