import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Pending",
  description: "Your payment is being processed.",
};

export default function PaymentPending() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background flex items-center">
        <Container>
          <div className="max-w-lg mx-auto py-20">
            <Card variant="glass" padding="lg" className="text-center">
              <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⏳</span>
              </div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] mb-3">
                Payment Pending
              </h1>
              <p className="text-warm-white/50 mb-8">
                Your payment is being processed. You&apos;ll receive a
                confirmation once it&apos;s complete. Check your email for updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
