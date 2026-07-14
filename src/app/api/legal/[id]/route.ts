import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const document = await db.legalDocument.findUnique({ where: { id } });
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json(document);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const existing = await db.legalDocument.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const document = await db.legalDocument.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.subcategory !== undefined && { subcategory: body.subcategory }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.fileUrl !== undefined && { fileUrl: body.fileUrl }),
      ...(body.fileName !== undefined && { fileName: body.fileName }),
      ...(body.fileSize !== undefined && { fileSize: Number(body.fileSize) }),
      ...(body.issueDate !== undefined && {
        issueDate: body.issueDate ? new Date(body.issueDate) : null,
      }),
      ...(body.expirationDate !== undefined && {
        expirationDate: body.expirationDate
          ? new Date(body.expirationDate)
          : null,
      }),
      ...(body.issuingAuthority !== undefined && {
        issuingAuthority: body.issuingAuthority,
      }),
      ...(body.documentNumber !== undefined && {
        documentNumber: body.documentNumber,
      }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.tags !== undefined && {
        tags: body.tags ? JSON.stringify(body.tags) : null,
      }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.version !== undefined && { version: Number(body.version) }),
      ...(body.approvalStatus !== undefined && {
        approvalStatus: body.approvalStatus,
      }),
      ...(body.approvedBy !== undefined && { approvedBy: body.approvedBy }),
    },
  });

  return NextResponse.json(document);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await db.legalDocument.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  await db.legalDocument.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
