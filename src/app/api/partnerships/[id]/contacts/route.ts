import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contacts = await db.partnershipContact.findMany({
    where: { partnershipId: id },
    orderBy: { isPrimary: "desc" },
  });
  return NextResponse.json({ contacts });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  if (body.isPrimary) {
    await db.partnershipContact.updateMany({
      where: { partnershipId: id },
      data: { isPrimary: false },
    });
  }

  const contact = await db.partnershipContact.create({
    data: {
      partnershipId: id,
      name: body.name,
      department: body.department || null,
      position: body.position || null,
      email: body.email || null,
      phone: body.phone || null,
      isPrimary: body.isPrimary || false,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(contact, { status: 201 });
}
