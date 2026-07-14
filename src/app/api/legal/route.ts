import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const subcategory = searchParams.get("subcategory");

  const where: Record<string, string> = {};
  if (category) where.category = category;
  if (status) where.status = status;
  if (subcategory) where.subcategory = subcategory;

  const documents = await db.legalDocument.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ documents });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.title || !body.category || !body.subcategory) {
    return NextResponse.json(
      { error: "Title, category, and subcategory are required" },
      { status: 400 }
    );
  }

  const document = await db.legalDocument.create({
    data: {
      title: body.title,
      category: body.category,
      subcategory: body.subcategory,
      description: body.description || null,
      fileUrl: body.fileUrl || null,
      fileName: body.fileName || null,
      fileSize: body.fileSize ? Number(body.fileSize) : null,
      issueDate: body.issueDate ? new Date(body.issueDate) : null,
      expirationDate: body.expirationDate ? new Date(body.expirationDate) : null,
      issuingAuthority: body.issuingAuthority || null,
      documentNumber: body.documentNumber || null,
      status: body.status || "active",
      tags: body.tags ? JSON.stringify(body.tags) : null,
      notes: body.notes || null,
      version: body.version ? Number(body.version) : 1,
      approvalStatus: body.approvalStatus || "approved",
      approvedBy: body.approvedBy || null,
    },
  });

  return NextResponse.json(document, { status: 201 });
}
