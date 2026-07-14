import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const communications = await db.communication.findMany({
    where: { sponsorId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(communications);
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

  const communication = await db.communication.create({
    data: {
      sponsorId: id,
      type: body.type || "note",
      direction: body.direction || "outbound",
      subject: body.subject || null,
      content: body.content,
      contactName: body.contactName || null,
      contactEmail: body.contactEmail || null,
      followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
      completed: body.completed || false,
    },
  });

  return NextResponse.json(communication, { status: 201 });
}
