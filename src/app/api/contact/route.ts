import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = [body.firstName, body.lastName].filter(Boolean).join(" ");

    if (!body.email && !body.message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }

    const message = await db.contactMessage.create({
      data: {
        name: name || "Anonymous",
        email: body.email || "",
        phone: body.phone || null,
        subject: body.eventType ? `${body.eventType} Inquiry` : body.subject || "Contact Form",
        message: body.message || "",
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
