import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (category) where.category = category;
  if (featured === "true") where.featured = true;

  const assets = await db.mediaAsset.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ assets });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.title || !body.type || !body.category || !body.fileUrl) {
    return NextResponse.json(
      { error: "Title, type, category, and fileUrl are required" },
      { status: 400 }
    );
  }

  const asset = await db.mediaAsset.create({
    data: {
      title: body.title,
      type: body.type,
      category: body.category,
      description: body.description || null,
      fileUrl: body.fileUrl,
      fileName: body.fileName || null,
      fileSize: body.fileSize ? Number(body.fileSize) : null,
      mimeType: body.mimeType || null,
      thumbnailUrl: body.thumbnailUrl || null,
      tags: body.tags ? JSON.stringify(body.tags) : null,
      featured: body.featured || false,
    },
  });

  return NextResponse.json(asset, { status: 201 });
}
