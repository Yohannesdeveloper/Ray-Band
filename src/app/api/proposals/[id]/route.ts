import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const proposal = await db.proposal.findUnique({
    where: { id },
    include: {
      author: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  return NextResponse.json({ proposal });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.type !== undefined) data.type = body.type;
  if (body.status !== undefined) data.status = body.status;
  if (body.recipientName !== undefined) data.recipientName = body.recipientName;
  if (body.recipientEmail !== undefined) data.recipientEmail = body.recipientEmail;
  if (body.recipientOrg !== undefined) data.recipientOrg = body.recipientOrg;
  if (body.subject !== undefined) data.subject = body.subject;
  if (body.executiveSummary !== undefined) data.executiveSummary = body.executiveSummary;
  if (body.content !== undefined) data.content = body.content;
  if (body.amount !== undefined) data.amount = body.amount ? Number(body.amount) : null;
  if (body.currency !== undefined) data.currency = body.currency;
  if (body.eventId !== undefined) data.eventId = body.eventId || null;
  if (body.sponsorId !== undefined) data.sponsorId = body.sponsorId || null;
  if (body.partnershipId !== undefined) data.partnershipId = body.partnershipId || null;
  if (body.validUntil !== undefined) data.validUntil = body.validUntil ? new Date(body.validUntil) : null;
  if (body.sentAt !== undefined) data.sentAt = body.sentAt ? new Date(body.sentAt) : null;
  if (body.responseAt !== undefined) data.responseAt = body.responseAt ? new Date(body.responseAt) : null;

  if (body.status === "sent" && !body.sentAt) {
    data.sentAt = new Date();
  }
  if ((body.status === "accepted" || body.status === "rejected") && !body.responseAt) {
    data.responseAt = new Date();
  }

  const proposal = await db.proposal.update({
    where: { id },
    data,
  });

  return NextResponse.json({ proposal });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.proposal.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
