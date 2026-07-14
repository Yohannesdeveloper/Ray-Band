import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const proposals = await db.proposal.findMany({
    include: {
      author: { select: { firstName: true, lastName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ proposals });
}

export async function POST(req: Request) {
  const body = await req.json();

  const proposal = await db.proposal.create({
    data: {
      title: body.title,
      type: body.type,
      status: body.status || "draft",
      recipientName: body.recipientName || null,
      recipientEmail: body.recipientEmail || null,
      recipientOrg: body.recipientOrg || null,
      subject: body.subject || null,
      executiveSummary: body.executiveSummary || null,
      content: body.content || null,
      amount: body.amount ? Number(body.amount) : null,
      currency: body.currency || "ETB",
      eventId: body.eventId || null,
      sponsorId: body.sponsorId || null,
      partnershipId: body.partnershipId || null,
      validUntil: body.validUntil ? new Date(body.validUntil) : null,
      authorId: body.authorId || null,
    },
  });

  return NextResponse.json(proposal, { status: 201 });
}
