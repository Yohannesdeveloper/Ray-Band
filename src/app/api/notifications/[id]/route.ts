import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const existing = await db.notification.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  const notification = await db.notification.update({
    where: { id },
    data: { read: body.read ?? true },
  });

  return NextResponse.json(notification);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await db.notification.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  await db.notification.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
