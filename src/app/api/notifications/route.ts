import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const unreadOnly = searchParams.get("unread") === "true";

  const where: Record<string, unknown> = {};

  if (category && category !== "all") {
    if (category === "unread") {
      where.read = false;
    } else if (category === "reminders") {
      where.type = "reminder";
    } else if (category === "system") {
      where.category = "system";
    }
  }

  if (unreadOnly) {
    where.read = false;
  }

  const notifications = await db.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = await db.notification.count({
    where: { read: false },
  });

  return NextResponse.json({ notifications, unreadCount });
}

export async function POST(req: Request) {
  const body = await req.json();

  const notification = await db.notification.create({
    data: {
      userId: body.userId || null,
      title: body.title,
      message: body.message,
      type: body.type || "info",
      category: body.category || "general",
      entity: body.entity || null,
      entityId: body.entityId || null,
      actionUrl: body.actionUrl || null,
    },
  });

  return NextResponse.json(notification, { status: 201 });
}

export async function PUT(req: Request) {
  const body = await req.json();

  if (body.markAllRead) {
    await db.notification.updateMany({
      where: { read: false },
      data: { read: true },
    });
    return NextResponse.json({ ok: true });
  }

  if (body.id) {
    const notification = await db.notification.update({
      where: { id: body.id },
      data: { read: body.read ?? true },
    });
    return NextResponse.json(notification);
  }

  return NextResponse.json({ error: "Missing notification id" }, { status: 400 });
}
