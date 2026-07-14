"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      }
    >
      <PaymentSuccess />
    </Suspense>
  );
}

function PaymentSuccess() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref");
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [paymentData, setPaymentData] = useState<{
    amount?: number;
    txId?: string;
  }>({});

  useEffect(() => {
    if (!txRef) {
      setStatus("failed");
      return;
    }

    // Verify the payment with our server
    const verify = async () => {
      try {
        const res = await fetch(`/api/payment/verify?tx_ref=${txRef}`);
        const data = await res.json();

        if (data.success && data.status === "success") {
          setStatus("success");
          setPaymentData({ amount: data.data.amount, txId: data.data.txId });
        } else {
          setStatus("failed");
        }
      } catch {
        // Payment might still be processing
        setStatus("loading");
        // Retry after 3 seconds
        setTimeout(() => {
          verify();
        }, 3000);
      }
    };

    // Wait a moment before verifying to give Chapa time to process
    const timer = setTimeout(verify, 2000);
    return () => clearTimeout(timer);
  }, [txRef]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background flex items-center">
        <Container>
          <div className="max-w-lg mx-auto py-20">
            {status === "loading" && (
              <Card variant="glass" padding="lg" className="text-center">
                <Loader2 className="w-16 h-16 text-gold mx-auto animate-spin mb-6" />
                <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] mb-3">
                  Verifying Payment...
                </h1>
                <p className="text-warm-white/50">
                  Please wait while we confirm your payment. This may take a moment.
                </p>
                {txRef && (
                  <p className="mt-4 text-xs text-warm-white/30">
                    Transaction Reference: {txRef}
                  </p>
                )}
              </Card>
            )}

            {status === "success" && (
              <Card variant="glass" padding="lg" className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <Badge variant="gold" className="mb-4">Payment Successful</Badge>
                <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] mb-3">
                  Thank You!
                </h1>
                <p className="text-warm-white/50 mb-2">
                  Your payment has been processed successfully.
                </p>
                {paymentData.amount && (
                  <p className="text-3xl font-bold gradient-text mb-4">
                    ETB {paymentData.amount.toLocaleString()}
                  </p>
                )}
                <p className="text-sm text-warm-white/40 mb-8">
                  A confirmation email has been sent to your email address.
                  Your booking request is now being processed.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="primary" asChild>
                    <Link href="/">
                      Back to Home <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/book">Book Another Event</Link>
                  </Button>
                </div>
                {txRef && (
                  <p className="mt-6 text-xs text-warm-white/20">
                    Transaction Reference: {txRef}
                  </p>
                )}
              </Card>
            )}

            {status === "failed" && (
              <Card variant="glass" padding="lg" className="text-center">
                <div className="w-20 h-20 rounded-full bg-deep-red/10 border border-deep-red/20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✕</span>
                </div>
                <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] mb-3">
                  Payment Failed
                </h1>
                <p className="text-warm-white/50 mb-8">
                  Unfortunately, your payment could not be processed.
                  Please try again or contact our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="primary" asChild>
                    <Link href="/book">Try Again</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
