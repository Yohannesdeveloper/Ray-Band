"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/animations";

export function CtaBanner() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-deep-red/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]" />
      </div>

      <Container className="relative z-10">
        <FadeUp>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-deep-red/10 border border-deep-red/20 px-5 py-2 mb-8">
              <Calendar className="w-4 h-4 text-deep-red-light" />
              <span className="text-sm font-medium text-deep-red-light">
                Limited Availability — Book Now for 2026
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
              Ready to Create Something{" "}
              <span className="gradient-text">Extraordinary?</span>
            </h2>

            <p className="text-lg text-warm-white/50 max-w-2xl mx-auto mb-10">
              Let us transform your next event into an unforgettable musical
              experience. Limited dates available for the season.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" size="lg" asChild>
                <Link href="/book">
                  Book Your Event Today <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-warm-white/30">
              <span>✓ Free Consultation</span>
              <span>✓ Satisfaction Guaranteed</span>
              <span>✓ Transparent Pricing</span>
              <span>✓ Flexible Payment Plans</span>
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
