import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const webhookSecret = process.env.CHAPA_WEBHOOK_SECRET;

    // Verify webhook authenticity if secret is set
    if (webhookSecret) {
      const hash = request.headers.get("x-chapa-signature");
      if (hash) {
        const expectedHash = crypto
          .createHmac("sha256", webhookSecret)
          .update(JSON.stringify(body))
          .digest("hex");

        if (hash !== expectedHash) {
          console.error("Invalid webhook signature");
          return NextResponse.json(
            { error: "Invalid signature" },
            { status: 401 }
          );
        }
      }
    }

    const { event, data } = body;
    const txRef = data?.tx_ref;

    console.log("Chapa webhook received:", { event, txRef });

    if (txRef) {
      switch (event) {
        case "transaction.success": {
          // Update payment record
          const payment = await db.payment.update({
            where: { txRef },
            data: {
              status: "success",
              chapaResponse: JSON.stringify(body),
              verifiedAt: new Date(),
            },
          }).catch(() => null);

          // Update any bookings linked to this payment
          if (payment) {
            await db.booking.updateMany({
              where: { paymentId: payment.id },
              data: { status: "confirmed" },
            }).catch(() => {});
          }

          console.log("Payment successful:", txRef);
          break;
        }

        case "transaction.failure": {
          const payment = await db.payment.update({
            where: { txRef },
            data: {
              status: "failed",
              chapaResponse: JSON.stringify(body),
            },
          }).catch(() => null);

          if (payment) {
            await db.booking.updateMany({
              where: { paymentId: payment.id },
              data: { status: "cancelled" },
            }).catch(() => {});
          }

          console.log("Payment failed:", txRef);
          break;
        }

        case "transaction.pending": {
          console.log("Payment pending:", txRef);
          break;
        }

        default:
          console.log("Unknown webhook event:", event);
      }
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
