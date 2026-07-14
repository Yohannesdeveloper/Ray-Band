import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const contacts = await db.sponsorContact.findMany({
    where: { sponsorId: id },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(contacts);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const sponsor = await db.sponsor.findUnique({ where: { id } });
  if (!sponsor) {
    return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
  }

  if (body.isPrimary) {
    await db.sponsorContact.updateMany({
      where: { sponsorId: id, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  const contact = await db.sponsorContact.create({
    data: {
      sponsorId: id,
      name: body.name,
      position: body.position || null,
      email: body.email || null,
      phone: body.phone || null,
      linkedin: body.linkedin || null,
      isPrimary: body.isPrimary || false,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(contact, { status: 201 });
}
