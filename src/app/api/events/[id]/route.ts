import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await db.event.findUnique({
      where: { id },
      include: {
        tasks: { orderBy: { createdAt: "desc" } },
        expenses: { orderBy: { createdAt: "desc" } },
        eventMedia: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await db.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const data: Record<string, unknown> = {};

    const textFields = [
      "name", "category", "status", "priority", "description",
      "venue", "venueAddress", "transportation", "accommodation",
      "startTime", "endTime", "rehearsalTime", "ticketType",
      "equipmentChecklist", "technicalRider", "hospitalityRider",
      "stageLayout", "riskAssessment", "emergencyContacts",
      "contactName", "contactEmail", "contactPhone", "notes",
      "organizer",
    ];
    for (const field of textFields) {
      if (body[field] !== undefined) {
        data[field] = body[field] || null;
      }
    }

    const floatFields = [
      "venueGpsLat", "venueGpsLng", "budget", "estimatedCost",
      "revenueProjection", "actualRevenue", "ticketPrice",
    ];
    for (const field of floatFields) {
      if (body[field] !== undefined) {
        data[field] = body[field] !== null ? Number(body[field]) : null;
      }
    }

    const intFields = ["capacity"];
    for (const field of intFields) {
      if (body[field] !== undefined) {
        data[field] = body[field] !== null ? parseInt(body[field]) : null;
      }
    }

    const dateFields = [
      "eventDate", "eventEndDate", "rehearsalDate",
    ];
    for (const field of dateFields) {
      if (body[field] !== undefined) {
        data[field] = body[field] ? new Date(body[field]) : null;
      }
    }

    if (body.name && body.name !== existing.name) {
      let slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      let counter = 1;
      let candidate = slug;
      while (true) {
        const duplicate = await db.event.findFirst({
          where: { slug: candidate, id: { not: id } },
        });
        if (!duplicate) {
          slug = candidate;
          break;
        }
        candidate = `${slug}-${counter}`;
        counter++;
      }
      data.slug = slug;
    }

    const event = await db.event.update({
      where: { id },
      data,
    });

    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    await db.event.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
