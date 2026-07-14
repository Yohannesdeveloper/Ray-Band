import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const member = await db.staffMember.findUnique({ where: { id } });
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json(member);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const existing = await db.staffMember.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const member = await db.staffMember.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.role !== undefined && { role: body.role }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl }),
      ...(body.department !== undefined && { department: body.department }),
      ...(body.hourlyRate !== undefined && { hourlyRate: Number(body.hourlyRate) }),
      ...(body.isFreelancer !== undefined && { isFreelancer: body.isFreelancer }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      ...(body.skills !== undefined && {
        skills: body.skills ? JSON.stringify(body.skills) : null,
      }),
      ...(body.bio !== undefined && { bio: body.bio }),
      ...(body.contractType !== undefined && { contractType: body.contractType }),
      ...(body.hireDate !== undefined && {
        hireDate: body.hireDate ? new Date(body.hireDate) : null,
      }),
      ...(body.notes !== undefined && { notes: body.notes }),
    },
  });

  return NextResponse.json(member);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await db.staffMember.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  await db.staffMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
