import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/payment/chapa";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const txRef = searchParams.get("tx_ref");

    if (!txRef) {
      return NextResponse.json(
        { error: "Missing tx_ref parameter" },
        { status: 400 }
      );
    }

    const result = await verifyPayment(txRef);

    if (result.status === "success" && result.data.status === "success") {
      // Update payment record in DB
      const payment = await db.payment.update({
        where: { txRef },
        data: {
          status: "success",
          chapaResponse: JSON.stringify(result),
          verifiedAt: new Date(),
        },
      }).catch(() => null);

      // Update linked bookings
      if (payment) {
        await db.booking.updateMany({
          where: { paymentId: payment.id },
          data: { status: "confirmed" },
        }).catch(() => {});
      }

      return NextResponse.json({
        success: true,
        status: "success",
        data: {
          txRef: result.data.tx_ref,
          txId: result.data.tx_id,
          amount: result.data.amount,
          currency: result.data.currency,
          reference: result.data.reference,
          createdAt: result.data.created_at,
        },
      });
    }

    // Payment not successful — update DB if needed
    await db.payment.update({
      where: { txRef },
      data: {
        status: result.data.status === "pending" ? "pending" : "failed",
        chapaResponse: JSON.stringify(result),
      },
    }).catch(() => {});

    return NextResponse.json({
      success: false,
      status: result.data.status || "failed",
      data: {
        txRef: result.data.tx_ref,
        amount: result.data.amount,
        status: result.data.status,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to verify payment",
      },
      { status: 500 }
    );
  }
}
