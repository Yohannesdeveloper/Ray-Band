import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const bookings = await db.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: { payment: true },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const booking = await db.booking.create({
      data: {
        eventType: body.eventType || "other",
        eventDate: body.eventDate ? new Date(body.eventDate) : new Date(),
        startTime: body.startTime || null,
        endTime: null,
        location: body.location || "Not specified",
        venueName: body.venueName || null,
        guestCount: body.guestCount ? parseInt(body.guestCount) || null : null,
        musicStyles: JSON.stringify(body.musicStyles || []),
        addOns: JSON.stringify(body.addOns || []),
        budget: body.budget || null,
        additionalRequests: body.additionalRequests || null,
        contactName: body.contactName || "Unknown",
        contactEmail: body.contactEmail || "",
        contactPhone: body.contactPhone || "",
        status: "pending",
        estimatedAmount: body.estimatedAmount || null,
        paymentId: body.paymentId || null,
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
