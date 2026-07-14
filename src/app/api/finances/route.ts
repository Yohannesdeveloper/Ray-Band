import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (category) where.category = category;
  if (from || to) {
    where.transactionDate = {
      ...(from && { gte: new Date(from) }),
      ...(to && { lte: new Date(to) }),
    };
  }

  const transactions = await db.financialTransaction.findMany({
    where,
    orderBy: { transactionDate: "desc" },
  });

  return NextResponse.json({ transactions });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.type || !body.category || !body.description || body.amount === undefined) {
    return NextResponse.json(
      { error: "Type, category, description, and amount are required" },
      { status: 400 }
    );
  }

  const transaction = await db.financialTransaction.create({
    data: {
      type: body.type,
      category: body.category,
      description: body.description,
      amount: Number(body.amount),
      currency: body.currency || "ETB",
      reference: body.reference || null,
      paymentMethod: body.paymentMethod || null,
      eventId: body.eventId || null,
      sponsorId: body.sponsorId || null,
      receiptUrl: body.receiptUrl || null,
      notes: body.notes || null,
      transactionDate: body.transactionDate
        ? new Date(body.transactionDate)
        : new Date(),
    },
  });

  return NextResponse.json(transaction, { status: 201 });
}
