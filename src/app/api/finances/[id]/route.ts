import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const transaction = await db.financialTransaction.findUnique({ where: { id } });
  if (!transaction) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  return NextResponse.json(transaction);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const existing = await db.financialTransaction.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  const transaction = await db.financialTransaction.update({
    where: { id },
    data: {
      ...(body.type !== undefined && { type: body.type }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.amount !== undefined && { amount: Number(body.amount) }),
      ...(body.currency !== undefined && { currency: body.currency }),
      ...(body.reference !== undefined && { reference: body.reference }),
      ...(body.paymentMethod !== undefined && { paymentMethod: body.paymentMethod }),
      ...(body.eventId !== undefined && { eventId: body.eventId }),
      ...(body.sponsorId !== undefined && { sponsorId: body.sponsorId }),
      ...(body.receiptUrl !== undefined && { receiptUrl: body.receiptUrl }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.transactionDate !== undefined && {
        transactionDate: new Date(body.transactionDate),
      }),
    },
  });

  return NextResponse.json(transaction);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await db.financialTransaction.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  await db.financialTransaction.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
