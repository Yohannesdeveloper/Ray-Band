import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const isActive = searchParams.get("isActive");
  const isFreelancer = searchParams.get("isFreelancer");

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (isActive === "true") where.isActive = true;
  if (isActive === "false") where.isActive = false;
  if (isFreelancer === "true") where.isFreelancer = true;
  if (isFreelancer === "false") where.isFreelancer = false;

  const members = await db.staffMember.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ members });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name || !body.role) {
    return NextResponse.json(
      { error: "Name and role are required" },
      { status: 400 }
    );
  }

  const member = await db.staffMember.create({
    data: {
      name: body.name,
      role: body.role,
      email: body.email || null,
      phone: body.phone || null,
      avatarUrl: body.avatarUrl || null,
      department: body.department || null,
      hourlyRate: body.hourlyRate ? Number(body.hourlyRate) : null,
      isFreelancer: body.isFreelancer || false,
      isActive: body.isActive !== false,
      skills: body.skills ? JSON.stringify(body.skills) : null,
      bio: body.bio || null,
      contractType: body.contractType || null,
      hireDate: body.hireDate ? new Date(body.hireDate) : null,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(member, { status: 201 });
}
