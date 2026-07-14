import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { venue: { contains: search } },
        { description: { contains: search } },
        { organizer: { contains: search } },
      ];
    }
    if (category) where.category = category;
    if (status) where.status = status;

    const events = await db.event.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Event name is required" },
        { status: 400 }
      );
    }

    if (!body.category || typeof body.category !== "string") {
      return NextResponse.json(
        { error: "Event category is required" },
        { status: 400 }
      );
    }

    const baseSlug = slugify(body.name);
    let slug = baseSlug;
    let counter = 1;
    while (await db.event.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const event = await db.event.create({
      data: {
        name: body.name.trim(),
        slug,
        category: body.category,
        status: body.status || "draft",
        priority: body.priority || "normal",
        description: body.description || null,
        venue: body.venue || null,
        venueAddress: body.venueAddress || null,
        venueGpsLat: body.venueGpsLat ?? null,
        venueGpsLng: body.venueGpsLng ?? null,
        capacity: body.capacity ?? null,
        budget: Number(body.budget) || 0,
        estimatedCost: Number(body.estimatedCost) || 0,
        revenueProjection: Number(body.revenueProjection) || 0,
        ticketPrice: body.ticketPrice ?? null,
        ticketType: body.ticketType || null,
        eventDate: body.eventDate ? new Date(body.eventDate) : null,
        eventEndDate: body.eventEndDate ? new Date(body.eventEndDate) : null,
        startTime: body.startTime || null,
        endTime: body.endTime || null,
        rehearsalDate: body.rehearsalDate ? new Date(body.rehearsalDate) : null,
        rehearsalTime: body.rehearsalTime || null,
        transportation: body.transportation || null,
        accommodation: body.accommodation || null,
        equipmentChecklist: body.equipmentChecklist || null,
        technicalRider: body.technicalRider || null,
        hospitalityRider: body.hospitalityRider || null,
        stageLayout: body.stageLayout || null,
        riskAssessment: body.riskAssessment || null,
        emergencyContacts: body.emergencyContacts || null,
        contactName: body.contactName || null,
        contactEmail: body.contactEmail || null,
        contactPhone: body.contactPhone || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
