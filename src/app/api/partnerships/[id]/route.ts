import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const partnership = await db.partnership.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: { isPrimary: "desc" } },
      agreements: { orderBy: { createdAt: "desc" } },
      communications: { orderBy: { createdAt: "desc" } },
      fundingOpps: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!partnership) {
    return NextResponse.json({ error: "Partnership not found" }, { status: 404 });
  }

  return NextResponse.json({ partnership });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const partnership = await db.partnership.update({
    where: { id },
    data: {
      organizationName: body.organizationName,
      slug: body.organizationName ? slugify(body.organizationName) : undefined,
      category: body.category,
      status: body.status,
      website: body.website,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      country: body.country,
      primaryContactName: body.primaryContactName,
      primaryContactEmail: body.primaryContactEmail,
      primaryContactPhone: body.primaryContactPhone,
      primaryContactPosition: body.primaryContactPosition,
      department: body.department,
      partnershipType: body.partnershipType,
      description: body.description,
      totalValue: body.totalValue !== undefined ? Number(body.totalValue) : undefined,
      currency: body.currency,
      notes: body.notes,
      tags: body.tags ? JSON.stringify(body.tags) : undefined,
    },
  });

  return NextResponse.json({ partnership });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.partnership.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
