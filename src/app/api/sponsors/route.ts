import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const industry = searchParams.get("industry");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (industry) where.industry = industry;
  if (search) {
    where.OR = [
      { companyName: { contains: search } },
      { industry: { contains: search } },
      { city: { contains: search } },
      { country: { contains: search } },
    ];
  }

  const sponsors = await db.sponsor.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      communications: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      contacts: true,
      sponsorships: true,
    },
  });

  return NextResponse.json(sponsors);
}

export async function POST(req: Request) {
  const body = await req.json();

  const baseSlug = slugify(body.companyName);
  let slug = baseSlug;
  let counter = 1;
  while (await db.sponsor.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const socialMedia = JSON.stringify({
    facebook: body.facebook || "",
    instagram: body.instagram || "",
    twitter: body.twitter || "",
    linkedin: body.linkedin || "",
  });

  const tags = body.tags
    ? JSON.stringify(body.tags.split(",").map((t: string) => t.trim()).filter(Boolean))
    : null;

  const sponsor = await db.sponsor.create({
    data: {
      companyName: body.companyName,
      slug,
      industry: body.industry || null,
      website: body.website || null,
      logoUrl: body.logoUrl || null,
      email: body.email || null,
      phone: body.phone || null,
      address: body.address || null,
      city: body.city || null,
      country: body.country || "Ethiopia",
      taxId: body.taxId || null,
      socialMedia,

      contactPersonName: body.contactPersonName || null,
      contactPersonEmail: body.contactPersonEmail || null,
      contactPersonPhone: body.contactPersonPhone || null,
      contactPersonPosition: body.contactPersonPosition || null,

      ceoName: body.ceoName || null,
      marketingDirector: body.marketingDirector || null,
      brandManager: body.brandManager || null,
      prManager: body.prManager || null,
      sponsorshipManager: body.sponsorshipManager || null,
      financeOfficer: body.financeOfficer || null,

      status: body.status || "prospect",
      pipelineStage: body.status || "prospect",
      totalValue: Number(body.totalValue) || 0,
      currency: body.currency || "ETB",
      notes: body.notes || null,
      tags,
    },
  });

  if (body.contactPersonName) {
    await db.sponsorContact.create({
      data: {
        sponsorId: sponsor.id,
        name: body.contactPersonName,
        email: body.contactPersonEmail || null,
        phone: body.contactPersonPhone || null,
        position: body.contactPersonPosition || null,
        linkedin: body.contactLinkedIn || null,
        isPrimary: true,
      },
    });
  }

  return NextResponse.json(sponsor, { status: 201 });
}
