import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const courses = await db.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const body = await req.json();

  const course = await db.course.create({
    data: {
      title: body.title,
      slug: slugify(body.title),
      description: body.description || "",
      shortDescription: body.shortDescription || "",
      instructor: body.instructor,
      category: body.category,
      level: body.level || "beginner",
      price: Number(body.price) || 0,
      trailerUrl: body.trailerUrl || "",
      thumbnailUrl: body.thumbnailUrl || "",
      durationHours: body.durationHours ? Number(body.durationHours) : null,
      lessonCount: body.lessonCount ? Number(body.lessonCount) : null,
      featured: body.featured || false,
      published: body.published !== false,
    },
  });

  return NextResponse.json(course, { status: 201 });
}
