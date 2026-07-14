import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PaymentFailed() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background flex items-center">
        <Container>
          <div className="max-w-lg mx-auto py-20">
            <Card variant="glass" padding="lg" className="text-center">
              <div className="w-20 h-20 rounded-full bg-deep-red/10 border border-deep-red/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✕</span>
              </div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] mb-3">
                Payment Failed
              </h1>
              <p className="text-warm-white/50 mb-8">
                Your payment could not be processed. This may be due to
                insufficient funds, network issues, or cancellation.
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
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
