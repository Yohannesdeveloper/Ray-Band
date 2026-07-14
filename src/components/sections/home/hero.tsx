"use client";

import Link from "next/link";
import { Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background Placeholder */}
      <div className="absolute inset-0 bg-charcoal">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-surface to-charcoal" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-deep-red/10 rounded-full blur-[120px]" />
        </div>
      </div>

      {/* Cinematic Overlay */}
      <div className="absolute inset-0 cinematic-overlay" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(212, 168, 83, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(212, 168, 83, 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <Container className="relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/20 px-5 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm font-medium text-gold">
              Professional Live Band & Music Academy
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-playfair)] leading-[1.1] mb-6">
            Where Music Becomes an{" "}
            <span className="gradient-text">Unforgettable</span>{" "}
            Experience
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-warm-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Premium live performances, world-class music education, and
            seamless event booking — all crafted to create moments that
            last a lifetime.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="primary" size="lg" asChild>
              <Link href="/book">Book The Band</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/courses">
                <Play className="w-4 h-4" />
                Explore Courses
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="#featured-video">
                <Play className="w-4 h-4" />
                Watch Live
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-warm-white/40">
            <span className="flex items-center gap-2">
              <span className="text-gold">★</span> 4.9/5 Client Rating
            </span>
            <span className="w-1 h-1 rounded-full bg-warm-white/20" />
            <span>500+ Live Shows</span>
            <span className="w-1 h-1 rounded-full bg-warm-white/20" />
            <span>10+ Years Experience</span>
            <span className="w-1 h-1 rounded-full bg-warm-white/20" />
            <span>Available Worldwide</span>
          </div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-warm-white/30">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
}
