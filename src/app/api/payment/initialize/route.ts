import { NextRequest, NextResponse } from "next/server";
import { initializePayment, generateTxRef } from "@/lib/payment/chapa";
import { db } from "@/lib/db";
import type { ChapaInitializePayload } from "@/lib/payment/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      email,
      firstName,
      lastName,
      phoneNumber,
      eventType,
      eventDate,
      bookingId,
    } = body;

    if (!amount || !email || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields: amount, email, firstName, lastName" },
        { status: 400 }
      );
    }

    if (Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    const txRef = generateTxRef();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Save pending payment record
    const payment = await db.payment.create({
      data: {
        txRef,
        amount: Number(amount),
        currency: "ETB",
        status: "pending",
      },
    });

    // If a bookingId was passed, link the payment to the booking
    if (bookingId) {
      await db.booking.update({
        where: { id: bookingId },
        data: { paymentId: payment.id },
      }).catch(() => {});
    }

    const payload: ChapaInitializePayload = {
      amount: String(amount),
      currency: "ETB",
      email,
      first_name: firstName,
      last_name: lastName,
      tx_ref: txRef,
      callback_url: `${baseUrl}/api/payment/webhook`,
      return_url: `${baseUrl}/payment/success?tx_ref=${txRef}`,
      customization: {
        title: "Ray Band",
        description: `Payment for ${eventType || "event booking"}`,
      },
    };

    if (phoneNumber) {
      payload.phone_number = phoneNumber;
    }

    const result = await initializePayment(payload);

    return NextResponse.json({
      success: true,
      checkoutUrl: result.data.checkout_url,
      txRef: result.data.tx_ref,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
