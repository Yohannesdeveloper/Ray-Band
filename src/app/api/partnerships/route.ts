import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const partnerships = await db.partnership.findMany({
    include: {
      contacts: true,
      agreements: true,
      communications: { orderBy: { createdAt: "desc" }, take: 1 },
      fundingOpps: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ partnerships });
}

export async function POST(req: Request) {
  const body = await req.json();

  const partnership = await db.partnership.create({
    data: {
      organizationName: body.organizationName,
      slug: slugify(body.organizationName),
      category: body.category,
      status: body.status || "prospect",
      website: body.website || null,
      email: body.email || null,
      phone: body.phone || null,
      address: body.address || null,
      city: body.city || null,
      country: body.country || "Ethiopia",
      primaryContactName: body.primaryContactName || null,
      primaryContactEmail: body.primaryContactEmail || null,
      primaryContactPhone: body.primaryContactPhone || null,
      primaryContactPosition: body.primaryContactPosition || null,
      department: body.department || null,
      partnershipType: body.partnershipType || null,
      description: body.description || null,
      totalValue: Number(body.totalValue) || 0,
      currency: body.currency || "ETB",
      notes: body.notes || null,
      tags: body.tags ? JSON.stringify(body.tags) : null,
    },
  });

  if (body.primaryContactName) {
    await db.partnershipContact.create({
      data: {
        partnershipId: partnership.id,
        name: body.primaryContactName,
        email: body.primaryContactEmail || null,
        phone: body.primaryContactPhone || null,
        position: body.primaryContactPosition || null,
        department: body.department || null,
        isPrimary: true,
      },
    });
  }

  return NextResponse.json(partnership, { status: 201 });
}
