import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const sponsor = await db.sponsor.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: { isPrimary: "desc" } },
      sponsorships: { orderBy: { createdAt: "desc" } },
      communications: { orderBy: { createdAt: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!sponsor) {
    return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
  }

  return NextResponse.json(sponsor);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const existing = await db.sponsor.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
  }

  const socialMedia = body.facebook !== undefined
    ? JSON.stringify({
        facebook: body.facebook || "",
        instagram: body.instagram || "",
        twitter: body.twitter || "",
        linkedin: body.linkedin || "",
      })
    : existing.socialMedia;

  const tags = body.tags !== undefined
    ? (body.tags
        ? JSON.stringify(body.tags.split(",").map((t: string) => t.trim()).filter(Boolean))
        : null)
    : existing.tags;

  const sponsor = await db.sponsor.update({
    where: { id },
    data: {
      companyName: body.companyName ?? existing.companyName,
      industry: body.industry !== undefined ? body.industry || null : existing.industry,
      website: body.website !== undefined ? body.website || null : existing.website,
      logoUrl: body.logoUrl !== undefined ? body.logoUrl || null : existing.logoUrl,
      email: body.email !== undefined ? body.email || null : existing.email,
      phone: body.phone !== undefined ? body.phone || null : existing.phone,
      address: body.address !== undefined ? body.address || null : existing.address,
      city: body.city !== undefined ? body.city || null : existing.city,
      country: body.country ?? existing.country,
      taxId: body.taxId !== undefined ? body.taxId || null : existing.taxId,
      socialMedia,

      contactPersonName: body.contactPersonName !== undefined ? body.contactPersonName || null : existing.contactPersonName,
      contactPersonEmail: body.contactPersonEmail !== undefined ? body.contactPersonEmail || null : existing.contactPersonEmail,
      contactPersonPhone: body.contactPersonPhone !== undefined ? body.contactPersonPhone || null : existing.contactPersonPhone,
      contactPersonPosition: body.contactPersonPosition !== undefined ? body.contactPersonPosition || null : existing.contactPersonPosition,

      ceoName: body.ceoName !== undefined ? body.ceoName || null : existing.ceoName,
      marketingDirector: body.marketingDirector !== undefined ? body.marketingDirector || null : existing.marketingDirector,
      brandManager: body.brandManager !== undefined ? body.brandManager || null : existing.brandManager,
      prManager: body.prManager !== undefined ? body.prManager || null : existing.prManager,
      sponsorshipManager: body.sponsorshipManager !== undefined ? body.sponsorshipManager || null : existing.sponsorshipManager,
      financeOfficer: body.financeOfficer !== undefined ? body.financeOfficer || null : existing.financeOfficer,

      status: body.status ?? existing.status,
      pipelineStage: body.status ?? existing.pipelineStage,
      totalValue: body.totalValue !== undefined ? Number(body.totalValue) : existing.totalValue,
      currency: body.currency ?? existing.currency,
      notes: body.notes !== undefined ? body.notes || null : existing.notes,
      tags,
    },
  });

  return NextResponse.json(sponsor);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.sponsor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
